# pixels-catcher

[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/rumax/react-native-PixelsCatcher)
[![npm version](https://badge.fury.io/js/pixels-catcher.svg)](https://badge.fury.io/js/pixels-catcher)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![CircleCI](https://circleci.com/gh/rumax/react-native-PixelsCatcher.svg?style=shield)](https://circleci.com/gh/rumax/react-native-PixelsCatcher)
[![codecov](https://codecov.io/gh/rumax/react-native-PixelsCatcher/branch/master/graph/badge.svg)](https://codecov.io/gh/rumax/react-native-PixelsCatcher)

Library for testing React Native UI components and screens

## Getting started

### Install and link

    $ npm install pixels-catcher --save

The library depend on
[react-native-save-view](https://www.npmjs.com/package/react-native-save-view)
which is used to convert `View` to base64 data and has native implementation.
Therefore the linking is required and this can be easily done with the following
step:

    $ react-native link react-native-save-view

If for some reasons it doesn't work, check
[official react native documentation](https://facebook.github.io/react-native/docs/linking-libraries-ios).

### Create test

Create new entry file, for example, `indexSnapshot`, and import
`registerSnapshot`, `runSnapshots` and `Snapshot` from `pixels-catcher`:

```
import {
  registerSnapshot,
  runSnapshots,
  Snapshot,
} from 'pixels-catcher';
```

After that create the snapshot component, which should extend `Snapshot` and
implement `static snapshotName` and `renderContent` method. Be sure that your
component can accept `collapsable` property, otherwise React can make an
optimization and drop the view. The implementation can be:

```
class AppSnapshot extends Snapshot {
  static snapshotName = 'AppSnapshot';

  renderContent() {
    return (<App />);
  }
}
```

after that register `AppSnapshot` component:

```
registerSnapshot(AppSnapshot);
```

and trigger `runSnapshots` which will register the application component and
run all snapshots:

```
runSnapshots(PUT_YOUR_APP_NAME_HERE);
```

Snapshots testing will be started as soon as the application is started.

### Configuration

There are two options to define config:

  - Using `pixels-catcher.json` file in the root of the project
  - Using `package.json` file with new property `PixelsCatcher`

And both of these two options should describe the configuration according to the
following format:

```
PixelsCatcher: {
  PLATFORM: {
    ...SHARED_CONFIGURATION,
    CONFIGURATION: {
      ...CONFIGURATION_SPECIFIC
    }
  }
}
```

where

  - `PLATFORM` can be `android` or `ios`
  - `CONFIGURATION` is a configuration with the following properties:
    - `activityName` - Activity name, example: MainActivity.
    - `appFile` - [Optional] Path to apk file on adroid or app folder on iOS,
      example: ./app/build/outputs/apk/debug/app-debug.apk
    - `deviceName` - Device name, for example emulator: Nexus_5X or iOS:
      iPhone 8 Plus
    - `deviceParams` - [Optional] Array of emulator params like -no-audio,
      -no-snapshot, -no-window, etc.
    - `physicalDevice` - [Optional] Boolean value that indicates if real device should be used (*iOS devices are not supported yet*)
    - `packageName` - Android package name, example:
      com.rumax.pixelscatcher.testapp
    - `snapshotsPath` - Path to snapshots, example: ./snapshotsImages
  - `SHARED_CONFIGURATION`. In case more that one configurations exists, shared
    parameters can be moved here.

Example for `package.json` configuration (or check
[demo](https://github.com/rumax/PixelsCatcher/tree/master/demo) project):

```
"PixelsCatcher": {
  "android": {
    "activityName": "MainActivity",
    "deviceName": "Nexus_5X",
    "packageName": "com.rumax.pixelscatcher.testapp",
    "snapshotsPath": "./snapshotsImages",
    "debug": {
      "deviceParams": ["-no-audio", "-no-snapshot"],
      "appFile": "./android/app/build/outputs/apk/debug/app-debug.apk"
    },
    "release": {
      "deviceParams": ["-no-audio", "-no-snapshot", "-no-window"],
      "appFile": "./android/app/build/outputs/apk/debug/app-debug.apk"
    }
  },
  "ios": {
    "deviceName": "iPhone 8 Plus",
    "packageName": "org.reactjs.native.example.testApp",
    "snapshotsPath": "./snapshotsImagesIOS",
    "dev": {},
    "debug": {
      "appFile": "./ios/build/Build/Products/Debug-iphonesimulator/testApp.app"
    }
  }
}
```

### Run android

*To run android emulator, [emulator command](https://developer.android.com/studio/run/emulator-commandline) is used. It has to be defined in the system PATH or an `ANDROID_EMULATOR` system variable can be used to specify it.*

There are two options to run UI snapshots:

  1) Using the generated `apk` file, provided via the `appFile`. In this case
     pixels-catcher will open android emulator, install `apk` file, execute all
     the tests and will provide a report at the end. This scenario can be used
     to integrate the screenshot testing with CI.

  2) In cases `appFile` is not defined, the development mode will be used. This
     means that only the server will be started and the application should be
     started manually. This scenario can be used to debug snapshots, create
     new reference images, etc.

To run tests execute the following command:

```
$ ./node_modules/.bin/pixels-catcher android debug
```

#### Generating APK file

By default the `index.android.js` file is used which refer to your application.
To fix it, in `android/app/build.gradle` add the following config:

```
project.ext.react = [
    entryFile: System.getProperty("entryFile") ?: "index.js",
    bundleInDebug: System.getProperty("bundleInDebug") ? System.getProperty("bundleInDebug").toBoolean() : false
]
```

And generate the `apk`:

```
cd android && ./gradlew assembleDebug -DentryFile="indexSnapshot.js"
```

### Run iOS

Same as android there are two options to run UI snapshots:

  1) Using the generated app, provided via the `appFile`. In this case
     pixels-catcher will open iOS simulator, install `app`, execute all
     the tests and will provide a report at the end. This scenario can be used
     to integrate the screenshot testing with CI.

  2) In cases `appFile` is not defined, the development mode will be used. This
     means that only the server will be started and the application should be
     started manually. This scenario can be used to debug snapshots, create new
     reference images, etc.

To run tests execute the following command:

```
$ ./node_modules/.bin/pixels-catcher ios debug
```

#### Generating iOS app

To make a valid app you will need to do the following actions:

  - Set the `FORCE_BUNDLING` environment variable, which is required to generate
    a bundle file
  - Set `RCT_NO_LAUNCH_PACKAGER` to ignore the packager
  - Use different entry file which includes only snapshots or some flag that
    will switch your app to "testing" mode

You can also check the `demo` project and check the required changes.

### Run device

While android emulator or iOS simulator is able to work with localhost with default values `http://10.0.2.2:3000` for android and `http://127.0.0.1:3000` for iOS, using the real device will require connecting to the server by real IP. To make it possible, `pixels-catcher` allows to define it using the `baseUrl` property that is passed to the `runSnapshots` method:

```
const baseUrl = 'http://127.0.0.1:3000';

// Snapshots implementation

runSnapshots(appName, { baseUrl });
```

## Demo
Check the [demo](https://github.com/rumax/PixelsCatcher/tree/master/demo) which
includes an example how the snapshots can be done and also has some useful
scripts that can be used to integrate with CI.

## License

[MIT](https://opensource.org/licenses/MIT)

## Author

  - [rumax](https://github.com/rumax)

### Other information

  - If you think that something is missing or would like to propose new feature,
  please, discuss it with the author
  - Please, ⭐️ the project. This gives the confidence that you like it and a
  great job was done by publishing and supporting it 🤩
