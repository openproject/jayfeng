title: 初探React Native
date: 2015-10-21 15:00:33
tags:
---

# 环境
1. 安装homebrew
2. 安装nodejs
3. 安装watchman、flow
4. 安装react-native

# 新建项目
```sh
react-native init JustNoCode
```
执行之后，一直卡在Installing react-native package from npm...，但是，
我等了两天，终于成功了：
```sh
@feng ➜  github  react-native init JustNoCode
prompt: Directory JustNoCode already exist. Continue?:  (no) y
This will walk you through creating a new React Native project in /Users/fengjian/Code/github/JustNoCode
Installing react-native package from npm...
Setting up new React Native app in /Users/fengjian/Code/github/JustNoCode
create .gitignore
create .watchmanconfig
create index.ios.js
create index.android.js
create ios/main.jsbundle
create ios/JustNoCode/AppDelegate.h
create ios/JustNoCode/AppDelegate.m
create ios/JustNoCode/Base.lproj/LaunchScreen.xib
create ios/JustNoCode/Images.xcassets/AppIcon.appiconset/Contents.json
create ios/JustNoCode/Info.plist
create ios/JustNoCode/main.m
create ios/JustNoCodeTests/JustNoCodeTests.m
create ios/JustNoCodeTests/Info.plist
create ios/JustNoCode.xcodeproj/project.pbxproj
create ios/JustNoCode.xcodeproj/xcshareddata/xcschemes/JustNoCode.xcscheme
create android/app/build.gradle
create android/app/proguard-rules.pro
create android/app/src/main/AndroidManifest.xml
create android/app/src/main/res/values/strings.xml
create android/app/src/main/res/values/styles.xml
create android/build.gradle
create android/gradle.properties
create android/settings.gradle
create android/app/src/main/res/mipmap-hdpi/ic_launcher.png
create android/app/src/main/res/mipmap-mdpi/ic_launcher.png
create android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
create android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
create android/gradle/wrapper/gradle-wrapper.jar
create android/gradle/wrapper/gradle-wrapper.properties
create android/gradlew
create android/gradlew.bat
create android/app/src/main/java/com/justnocode/MainActivity.java
To run your app on iOS:
Open /Users/fengjian/Code/github/JustNoCode/ios/JustNoCode.xcodeproj in Xcode
Hit Run button
To run your app on Android:
Have an Android emulator running, or a device connected
cd /Users/fengjian/Code/github/JustNoCode
react-native run-android
```

# 运行Android
```sh
react-native run-android
```
<!--more-->
结果报错，如下：
```sh
@feng ➜  JustNoCode (master) ✗ react-native run-android
Starting JS server...
Building and installing the app on the device (cd android && ./gradlew installDebug)...
Download https://jcenter.bintray.com/com/android/tools/build/gradle/1.3.1/gradle-1.3.1.pom
Download https://jcenter.bintray.com/com/android/tools/build/gradle-core/1.3.1/gradle-core-1.3.1.pom
... ...
Download https://jcenter.bintray.com/com/android/tools/lint/lint-api/24.3.1/lint-api-24.3.1.jar
Failed to notify ProjectEvaluationListener.afterEvaluate(), but primary configuration failure takes precedence.
java.lang.RuntimeException: SDK location not found. Define location with sdk.dir in the local.properties file or with an ANDROID_HOME environment variable.
    at com.android.build.gradle.internal.SdkHandler.getAndCheckSdkFolder(SdkHandler.java:102)
    ... ...
    at org.gradle.wrapper.GradleWrapperMain.main(GradleWrapperMainin.java:61)

FAILURE: Build failed with an exception.

* Where:
Build file '/Users/fengjian/Code/github/JustNoCode/android/app/build.gradle' line: 20

* What went wrong:
A problem occurred evaluating project ':app'.
> SDK location not found. Define location with sdk.dir in the local.properties file or with an ANDROID_HOME environment variable.

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.

BUILD FAILED

Total time: 52.605 secs
Could not install the app on the device, see the error above.
```
在.zshrc中配置一下ANDROID_HOME:
```sh
export ANDROID_HOME=~/Tools/android-sdk
```
再运行一次，
```sh
@feng ➜  JustNoCode (master) ✗ react-native run-android
JS server already running.
Building and installing the app on the device (cd android && ./gradlew installDebug)...
:app:preBuild UP-TO-DATE
... ...
:app:installDebug
Installing APK 'app-debug.apk' on 'Google Nexus S - 4.1.1 - API 16 - 480x800 - 4.1.1'
Installed on 1 device.

BUILD SUCCESSFUL

Total time: 10.294 secs

This build could be faster, please consider using the Gradle Daemon: http://gradle.org/docs/2.4/userguide/gradle_daemon.html
Starting the app (/Users/fengjian/Tools/android-sdk/platform-tools/adb shell am start -n com.justnocode/.MainActivity)...
Starting: Intent { cmp=com.justnocode/.MainActivity }
```
成功了，显示了MainActivity，一个简单的说明页面,
![react native 第一次主页面](/images/react_native_main_activity.png)

