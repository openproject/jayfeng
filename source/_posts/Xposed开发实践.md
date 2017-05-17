---
title: Xposed开发实践
date: 2017-05-17 18:35:50
tags: Xposed
---

前段时间学习了一下Xposed框架，现稍作整理，略做小记。

## 准备
在手机上安装 XposedInstaller App 并安装 Xposed 框架，安装框架需要 Root.
所以需要准备：一部已 Root 的手机（目前小米和一加的手机相对比较好刷机，我用的是红米4高配版）。

## 官方
作者: https://github.com/rovo89/
Xposed模块仓库：http://repo.xposed.info/
Xposed酷安地址：http://coolapk.com/apk/de.robv.android.xposed.installer
注：Android 5.0以下版本用v2.7，Android5.0用v3.+

## Xposed框架说明
Xposed框架是一款可以在不修改APK的情况下影响程序运行（修改系统）的框架服务，基于它可以制作出许多功能强大的模块，且在功能不冲突的情况下同时运作。
说的直白点，Xposed框架能 hook 运行App的java代码，类似于AOP，可以拦截方法，得到方法信息（参数，返回值），也可以在方法前或方法后动态插入自己的代码来“扩展”你想加入的行为。
基于这种能力，可以实现伪造设备信息，自动化（微信抢红包，防撤回...），注册软件破解，去广告等等各种功能。
事实上，Xposed模块仓库中就有大量这种现成的模块可以直接使用，很多朋友刷机就是为了装Xposed，装自己喜欢的模块。

更多使用参考 Wiki : https://github.com/rovo89/XposedBridge/wiki

## 简单入门
按照以下步骤一步一部集成。
#### 第一，gradle引用。
```java
dependencies {
    provided 'de.robv.android.xposed:api:82'
}
```
#### 第二，注册模块。
在AndroidManifest.xml中添加如下代码：
```xml
<application>
    <meta-data
        android:name="xposedmodule"
        android:value="true" />
    <meta-data
        android:name="xposeddescription"
        android:value="我是Xposed模块" />
    <meta-data
        android:name="xposedminversion"
        android:value="52" />
</ application>
```
#### 第三，定义Hook入口。
```java
package com.test.hooks;

import de.robv.android.xposed.IXposedHookLoadPackage;
import de.robv.android.xposed.XC_MethodHook;
import de.robv.android.xposed.XposedBridge;
import de.robv.android.xposed.XposedHelpers;
import de.robv.android.xposed.callbacks.XC_LoadPackage;

public class HookModule implements IXposedHookLoadPackage {

    public static final String TAG = "MyHook";

    @Override
    public void handleLoadPackage(XC_LoadPackage.LoadPackageParam loadPackageParam) throws Throwable {
        Log.d(TAG, "重启手机后，我执行了，说明这个 Xposed 模块生效了");
    }
}

```
#### 第四，在 xposed_init 中申明 Hook 入口。
为了让这个入口能被 Xposed 找到，需要在 assets 目录下建立 xposed_init 文件，写入入口文件全名称类名：
```
com.test.hooks.HookModule
```

#### 第五，安装APP。
安装 APP 后，在 Xposed Installed 中选中这个模块并重启手机，连上电脑抓log， 看看上面 log 的那句话能不能打印出来。

#### 第六，具体例子，在所有的 Actvity 的 onCreate 方法之后执行一些代码。
如果前面四步都正确的话，我们加强一下需求，在 Activity onCreate 方法执行的时候打印出当前 Activity 的名称和 onCreate 方法的参数。
```
public class HookModule implements IXposedHookLoadPackage {

    public static final String TAG = "MyHook";

    @Override
    public void handleLoadPackage(XC_LoadPackage.LoadPackageParam loadPackageParam) throws Throwable {
        Activity activity = (Activity) param.thisObject;
        String activityName = activity.getClass().getName();

        Log.d(TAG, "activity onCreate called : " + activityName);
        Log.d(TAG, "activity onCreate params : " + Arrays.toString(param.args));
    }
}
```
## 深入剖析
深入分析我就不献丑了，可以参考邓老师的[《深入理解Android之Xposed详解》](http://blog.csdn.net/innost/article/details/50461783)

## 开发经验

#### 第一、根据方法名 Hook 方法。

如果你知道方法的参数和类型，可以用XposedHelpers.findAndHookMethod。
如果你不知道方法的参数，只知道名称，可以用XposedBridge.hookAllMethods，它会拦截所有方法。
构造函数同理。

#### 第二、使用 XC_MethodHook 和 XC_MethodReplacement
在 XC_MethodHook 和 XC_MethodReplacement 的回调中，都有 param 参数：
- 通过这个 param.args 可以拿到方法的各个参数的值，也可以去它们的值
- 通过 param.getResult() 可以拿到返回值
- 通过 setResult 可以修改返回值

另外在 XC_MethodHook 可以在方法执行前和执行后执行你插入的代码，非常简单，但是有一个问题，可以多次 hook 后，你插入的代码重复执行多次，非常麻烦。
可以用 XC_MethodReplacement 来解决这个问题：
```
public class TestReplacementHook extends XC_MethodReplacement {

    @Override
        protected Object replaceHookedMethod(MethodHookParam param) throws Throwable {

            // 如果不想影响结果，记得返回XposedBridge.invokeOriginalMethod的执行结果
            return XposedBridge.invokeOriginalMethod(param.method, param.thisObject, param.args);
        }
}
```

#### 第三、务必关闭Instant Run。
碰到这个问题，一脸蒙逼状，百思不得其解，好好的怎么就不执行呢，简直要疯狂，幸得 StackOverflow 有前人经验，关闭 Instant Run 马上就好。

#### 第四、动态加载。
有些动态加载的类，你用默认的 loadPackageParam.classLoader 怎么都拦截不到，这是正常的，因为它就不在这个 classloader 里。
但是可以曲线救国，先 hook 动态加载的类在系统中的父类，通过这个父类找到真正的 classloader，再用这个真正的 classloader 去 hook动态加载的类。
举个例子：
```java
if (loadPackageParam.packageName.equals("com.test.xxx")) {

    // 拦截onCreate方法，得到 Fragment, 根据当前动态加载的 fragment 去获取它真正的 classloader
    Class fragmentClazz = XposedHelpers.findClass("android.support.v4.app.Fragment", loadPackageParam.classLoader);
    XposedBridge.hookAllMethods(fragmentClazz, "onCreate", new XC_MethodHook() {
            @Override
            protected void afterHookedMethod(MethodHookParam param) throws Throwable {
                super.afterHookedMethod(param);

                Object fragment = param.thisObject;
                String fragmentName = fragment.getClass().getName();
                Log.d(TAG, "fragment: " + fragmentName);

                if (fragmentName.equals("com.xx.yy")) {
                    // 注意这里的 fragment.getClass().getClassLoader() 才是正确的那个动态加载的 dex 的 classloader
                    Class clazz = XposedHelpers.findClass("a.b.c", fragment.getClass().getClassLoader());
                    XposedBridge.hookAllConstructors(clazz, new XC_MethodReplacement() {
                        @Override
                        protected Object replaceHookedMethod(MethodHookParam methodHookParam) throws Throwable {
                            return XposedBridge.invokeOriginalMethod(methodHookParam.method, methodHookParam.thisObject, methodHookParam.args);
                        }
                    });
                }
            }
    });

}
```

#### 第五、使用 Xposed 框架提供的反射方法。
有很多对象我们拿到了，如何去调用它的方法、取他的字段值等。因为有些对象不方便强制转化，所以只能用反射去弄，有些朋友可能就陷入了去写反射工具类的常规思维。
实际上，Xposed的XposedHelper中提供了大量反射工具类，甚至更强大的功能。
```
Class<?> findClass(String className, ClassLoader classLoader)
...

Object getObjectField(Object obj, String fieldName)
float getFloatField(Object obj, String fieldName)
...

void setObjectField(Object obj, String fieldName, Object value)
void setFloatField(Object obj, String fieldName, float value)
...

Object callMethod(Object obj, String methodName, Object... args)
...
```

#### 第六、在Application中注册广播。
这个方法看着很让个人受启发，确实有用但是我没有用，因为实际操作中我碰到需要注册广播的场景是打开没有 exposed 的 Activity，如果用这个方法则必须要先主动打开 APP，我觉得不是很方便，可以直接执行命令 am start xxx，其他需要的场景我还没想到。

#### 第七、自动 Root。
用 am start 命令打开一些 Activity 需要 Root 权限，这也是需要手动的一个操作，我又觉得不是很方便，于是可以 hook 授权对话框的允许按钮，实现 Root 的自动化。

#### 第八、跨进程通信。
因为 hook 的代码是执行在目标程序的进程中，所以往往在做一些复杂一点的操作就会不是很方便（大量的初始化、程序间的交互等），从我的感觉上说，使用Provider是一个相对比较舒服的选择。
- 使用Provider本身可以增删改数据，可以直接数据操作。
```
public class MyAppProvider extends ContentProvider {

    private static final String TAG = "MyAppProvider";

    public static final String AUTHORITY = "com.test.provider";
    public static final Uri CONTENT_URI = Uri.parse("content://" + AUTHORITY);

    @Nullable
        @Override
        public Cursor query(@NonNull Uri uri, @Nullable String[] projection, @Nullable String selection, @Nullable String[] selectionArgs, @Nullable String sortOrder) {
            return null;
        }

    @Nullable
        @Override
        public String getType(@NonNull Uri uri) {
            return null;
        }

    @Nullable
        @Override
        public Uri insert(@NonNull Uri uri, @Nullable ContentValues values) {

            return null;
        }

    @Override
        public int delete(@NonNull Uri uri, @Nullable String selection, @Nullable String[] selectionArgs) {
            return 0;
        }

    @Override
        public int update(@NonNull Uri uri, @Nullable ContentValues values, @Nullable String selection, @Nullable String[] selectionArgs) {

            return 0;
        }

}

```
- Provider中的call方法是一种更简单的行为调用，也可以传递数据，非常不错。
```java
// 可以用method定义行为，用arg, extra传递参数
@Override
public Bundle call(@NonNull String method, @Nullable String arg, @Nullable Bundle extras) {
    return super.call(method, arg, extras);
}
```

#### 第九、打印工具类。
在实际操作中，常常要打印类的方法和字段、View的视图结构、Bundle参数等等，写些简单的工具类很有必要：
```
public static void printBundle(Bundle bundle) {
    for (String key : bundle.keySet()) {
        Log.d(TAG, "bundle.key: " + key + ", value: " + bundle.get(key));
    }
}

public static void printTreeView(Activity activity) {
    View rootView = activity.getWindow().getDecorView();
    printTreeView(rootView);
}

public static void printTreeView(View rootView) {
    if (rootView instanceof ViewGroup) {
        ViewGroup parentView = (ViewGroup) rootView;
        for (int i = 0; i < parentView.getChildCount(); i++) {
            printTreeView(parentView.getChildAt(i));
        }
    } else {
        Log.d(TAG, "view: " + rootView.getId() + ", class: " + rootView.getClass());

        // any view if you want something different
        if (rootView instanceof EditText) {
            Log.d(TAG, "edit:" + rootView.getTag()
                + "， hint: " + ((EditText) rootView).getHint());
        } else if (rootView instanceof TextView) {
            Log.d(TAG, "text:" + ((TextView) rootView).getText().toString());
        }
    }
}

public static void printMethods(Class clazz) {
    for (Method method : clazz.getDeclaredMethods()) {
        Log.d(TAG, "" + method);
    }
}

public static void printFields(Class clazz) {
    for (Field field : clazz.getFields()) {
        Log.d(TAG, "" + field);
    }
}
```
#### 第十、代码组织
Hook代码一多，自然就容易乱，如果你全部都放在HookModule里难免就会又长又臭了，这里提供一个参考模板：
https://github.com/ac-pm/Inspeckage
一个鼎鼎大名的模块，让我学习良多。

## 小结
Xposed 框架就像一把锋利的剑，强大的有点吓人，切记要善用，而且自律！
PS: 文中代码只是凭感觉示意，可能会运行出错，特此说明。
