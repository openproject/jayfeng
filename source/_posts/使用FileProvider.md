---
title: 使用FileProvider
date: 2016-11-09 14:25:30
tags:
---

Android7.0之后，为了安全性，应用之间发送文件的Uri“被升级”了一下。
官方参考：
https://developer.android.com/reference/android/support/v4/content/FileProvider.html

#### 变化
像这样的代码：
```java
private void install(File apkFile) {
    Uri uri = Uri.fromFile(apkFile);
    Intent intent = new Intent(Intent.ACTION_VIEW);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.setDataAndType(uri, "application/vnd.android.package-archive");
    startActivity(intent);
}
```
在Android7.0+会报错：
> android.os.FileUriExposedException: file:///storage/emulated/0/xxx/yyy/zzzz.apk exposed beyond app through Intent.getData()

#### 关键点
一开始不好理解FileProvider的场景，所以有必要强调2个关键点：
> 1. File：文件
> 2. Uri：不排除应用内Uri使用，但是这里强调的是应用间的Uri传递。

所以，应用间的文件交互需要使用FileProvider，常见的场景：
> 1. 调用系统相册裁剪照片
> 2. 调用系统安装应用
> 3. 应用之间共享文件
> 4. ... ...

#### 使用步骤
下面以安装APK为例，逐步适配FileProvider。
<!-- more -->

<b>第一步，在AndroidManifest.xml中定义provider。</b>
和ContentProvider的使用很类似:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.jayfeng.lesscode.update">

    <application>
        <provider
            android:authorities="@string/less_provider_file_authorities"
            android:name="android.support.v4.content.FileProvider"
            android:grantUriPermissions="true"
            android:exported="false">
                <meta-data android:name="android.support.FILE_PROVIDER_PATHS"
                    android:resource="@xml/file_paths" />
        </provider>
    </application>

</manifest>
```
注意几个地方：
> 1. authorities必须唯一，避免多个应用冲突而不能安装
> 2. exported必须为false，否则会报错FileProvider exported must not be true

<b>第二步，制定路径file_paths。</b>
这个文件名是随便写的，可以取任意名。
```xml
<?xml version="1.0" encoding="utf-8"?>
<paths>
    <external-path path="." name="external_storage_root" />
</paths>
```
位置在res/xml目录下。

<b>第三步，调用FileProvider生成Uri。</b>
原来的Uri.fromFile(apkFile)要改成FileProvider.getUriForFile(<Context>, <Authorities>, apkFile)，代码如下：
```java
Uri uri = FileProvider.getUriForFile(this, getString(R.string.less_provider_file_authorities), apkFile);
Intent intent = new Intent(Intent.ACTION_VIEW);
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
intent.setDataAndType(uri, "application/vnd.android.package-archive");
startActivity(intent);
```
注意，务必要记得设置这个Flag值：FLAG_GRANT_READ_URI_PERMISSION。

然后就不会在Android7.0+上安装APK崩溃了。

#### 兼容
但是，在Android7.0以下就有问题了，所以有必要区分一下版本号，代码如下：
```java
private void install(File apkFile) {
    Intent intent = new Intent(Intent.ACTION_VIEW);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    Uri uri;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        uri = FileProvider.getUriForFile(this, getString(R.string.less_provider_file_authorities), apkFile);
        intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    } else {
        uri = Uri.fromFile(apkFile);
    }
    intent.setDataAndType(uri, "application/vnd.android.package-archive");
    startActivity(intent);
}
```

#### 小结
为了简化这些配置，我在LessCode-Update中已经实现了上述配置，唯一要做的就是自定义authorities：
可以在string中配置：
```xml
<string name="less_provider_file_authorities"><xxxxxx packageName xxxxxx>.fileprovider</string>
```
或者在build.gradle中动态配置：
```java
android {
    defaultConfig {
        resValue "string", "less_provider_file_authorities", "<xxxxx packageName xxxx>.fileprovider"
    }
}
```
authorities可以是任意唯一值，最好是用包名开始，不容易重复。

代码参考：https://github.com/openproject/LessCode-Update
