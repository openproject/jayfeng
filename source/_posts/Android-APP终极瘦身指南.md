title: Android APP终极瘦身指南
date: 2016-03-01 11:17:13
categories: android
tags: [android, app, apk, 瘦身]
---

## 前言
之前写了一篇[《APK瘦身实践》](http://www.jayfeng.com/2015/12/29/APK%E7%98%A6%E8%BA%AB%E5%AE%9E%E8%B7%B5/)侧重于实践和效果对比，后来受徐川兄点拨，建议改写成一篇更全面的瘦身终极杀招大全，深以为然，思考良久，新开一篇。

## 指南条例
#### 第1条：使用一套资源
这是最基本的一条规则，但非常重要。
对于绝大对数APP来说，只需要取一套设计图就足够了。鉴于现在分辨率的趋势，建议取720p的资源，放到xhdpi目录。
相对于多套资源，只使用720P的一套资源，在视觉上差别不大，很多大公司的产品也是如此，但却能显著的减少资源占用大小，顺便也能减轻设计师的出图工作量了。
注意，这里不是说把不是xhdpi的目录都删除，而是强调保留一套设计资源就够了。

#### 第2条：开启minifyEnabled混淆代码
在gradle使用minifyEnabled进行Proguard混淆的配置，可大大减小APP大小：
```groovy
android {
    buildTypes {
        release {
            minifyEnabled true
        }
    }
}
```
在proguard中，是否保留符号表对APP的大小是有显著的影响的，可酌情不保留，但是建议尽量保留用于调试。
详细proguard的相关的配置和原理可自行查阅。

#### 第3条：开启shrinkResources去除无用资源
在gradle使用shrinkResources去除无用资源，效果非常好。
```groovy
android {
    buildTypes {
        release {
            shrinkResources true
        }
    }
}
```

#### 第4条：删除无用的语言资源
大部分应用其实并不需要支持几十种语言的国际化支持。还好强大的gradle支持语言的配置，比如国内应用只支持中文：
```
android {
    defaultConfig {
        resConfigs "zh"
    }
}
```

<!-- more -->

#### 第5条：使用tinypng有损压缩
android打包本身会对png进行无损压缩，所以使用像tinypng这样的有损压缩是有必要的。
重点是Tinypng使用智能有损压缩技术，以尽量少的失真换来图片大小的锐减，效果非常好，强烈推荐。
Tinypng的官方网站：http://tinypng.com/

#### 第6条：使用jpg格式
如果对于非透明的大图，jpg将会比png的大小有显著的优势，虽然不是绝对的，但是通常会减小到一半都不止。
在启动页，活动页等之类的大图展示区采用jpg将是非常明智的选择。

#### 第7条：使用webp格式
webp支持透明度，压缩比比jpg更高但显示效果却不输于jpg，官方评测quality参数等于75均衡最佳。
相对于jpg、png，webp作为一种新的图片格式，限于android的支持情况暂时还没用在手机端广泛应用起来。从Android 4.0+开始原生支持，但是不支持包含透明度，直到Android 4.2.1+才支持显示含透明度的webp，使用的时候要特别注意。
官方介绍：https://developers.google.com/speed/webp/docs/precompiled

#### 第8条：缩小大图
如果经过上述步骤之后，你的工程里面还有一些大图，考虑是否有必要维持这样的大尺寸，是否能适当的缩小。
事实上，由于设计师出图的原因，我们拿到的很多图片完全可以适当的缩小而对视觉影响是极小的。

#### 第9条：覆盖第三库里的大图
有些第三库里引用了一些大图但是实际上并不会被我们用到，就可以考虑用1x1的透明图片覆盖。
你可能会有点不舒服，因为你的drawable下竟然包含了一些莫名其妙的名称的1x1图片...

#### 第10条：删除armable-v7包下的so
基本上armable的so也是兼容armable-v7的，armable-v7a的库会对图形渲染方面有很大的改进，如果没有这方面的要求，可以精简。
这里不排除有极少数设备会Crash，可能和不同的so有一定的关系，请大家务必测试周全后再发布。

#### 第11条：删除x86包下的so
与第十条不同的是，x86包下的so在x86型号的手机是需要的，如果产品没用这方面的要求也可以精简。
建议实际工作的配置是只保留armable、armable-x86下的so文件，算是一个折中的方案。

#### 第12条：使用微信资源压缩打包工具
微信资源压缩打包工具通过短资源名称，采用７zip对APP进行极致压缩实现减小APP的目标，效果非常的好，强烈推荐。
详情参考：[Android资源混淆工具使用说明](https://github.com/shwenzhang/AndResGuard)
原理介绍：[安装包立减1M--微信Android资源混淆打包工具](http://mp.weixin.qq.com/s?__biz=MzAwNDY1ODY2OQ==&mid=208135658&idx=1&sn=ac9bd6b4927e9e82f9fa14e396183a8f#rd)
建议开启7zip，注意白名单的配置，否则会导致有些资源找不到，官方已经发布AndResGuard到gradle中了，非常方便：
```java
apply plugin: 'AndResGuard'

buildscript {
    dependencies {
        classpath 'com.tencent.mm:AndResGuard-gradle-plugin:1.1.7'
    }
}


andResGuard {
    mappingFile = null
    use7zip = true
    useSign = true
    keepRoot = false
    // add <your_application_id>.R.drawable.icon into whitelist.
    // because the launcher will get thgge icon with his name
    def packageName = <your_application_id>
    whiteList = [
        //for your icon
        packageName + ".R.drawable.icon",
        //for fabric
        packageName + ".R.string.com.crashlytics.*",
        //for umeng update
        packageName + ".R.string.umeng*",
        packageName + ".R.string.UM*",
        packageName + ".R.string.tb_*",
        packageName + ".R.layout.umeng*",
        packageName + ".R.layout.tb_*",
        packageName + ".R.drawable.umeng*",
        packageName + ".R.drawable.tb_*",
        packageName + ".R.anim.umeng*",
        packageName + ".R.color.umeng*",
        packageName + ".R.color.tb_*",
        packageName + ".R.style.*UM*",
        packageName + ".R.style.umeng*",
        packageName + ".R.id.umeng*"
    ]
    compressFilePattern = [
        "*.png",
        "*.jpg",
        "*.jpeg",
        "*.gif",
        "resources.arsc"
    ]
    sevenzip {
        artifact = 'com.tencent.mm:SevenZip:1.1.7'
        //path = "/usr/local/bin/7za"
    }
}
```
会生成一个andresguard/resguard的Task，自动读取release签名进行重新混淆打包。

#### 第13条：使用provided编译
对于一些库是按照需要动态的加载，可能在某些版本并不需要，但是代码又不方便去除否则会编译不过。
使用provided可以保证代码编译通过，但是实际打包中并不引用此第三方库，实现了控制APP大小的目标。
但是也同时就需要开发者自己判断不引用这个第三方库时就不要执行到相关的代码，避免APP崩溃。

#### 第14条：使用shape背景
特别是在扁平化盛行的当下，很多纯色的渐变的圆角的图片都可以用shape实现，代码灵活可控，省去了大量的背景图片。

#### 第15条：使用着色方案
相信你的工程里也有很多selector文件，也有很多相似的图片只是颜色不同，通过着色方案我们能大大减轻这样的工作量，减少这样的文件。
借助于android support库可实现一个全版本兼容的着色方案，参考代码：[DrawableLess.java](https://github.com/openproject/LessCode/blob/master/lesscode-core/src/main/java/com/jayfeng/lesscode/core/DrawableLess.java)

#### 第16条：在线化素材库
如果你的APP支持素材库(比如聊天表情库)的话，考虑在线加载模式，因为往往素材库都有不小的体积。
这一步需要开发者实现在线加载，一方面增加代码的复杂度，一方面提高了APP的流量消耗，建议酌情选择。

#### 第17条：避免重复库
避免重复库看上去是理所当然的，但是秘密总是藏的很深，一定要当心你引用的第三方库又引用了哪个第三方库，这就很容易出现功能重复的库了，比如使用了两个图片加载库：Glide和Picasso。
通过查看exploded-aar目录和External Libraries或者反编译生成的APK，尽量避免重复库的大小，减小APP大小。

#### 第18条：使用更小的库
同样功能的库在大小上是不同的，甚至会悬殊很大。
如果并无对某个库特别需求而又对APP大小有严格要求的话，比较这些相同功能第三方库的大小，选择更小的库会减小APP大小。

#### 第19条：支持插件化
过去的一年，插件化技术雨后春笋一样的都冒了出来，这些技术支持动态的加载代码和动态的加载资源，把APP的一部分分离出来了，对于业务庞大的项目来说非常有用，极大的分解了APP大小。
因为插件化技术需要一定的技术保障和服务端系统支持，有一定的风险，如无必要（比如一些小型项目，也没什么扩展业务）就不需要了，建议酌情选择。
#### 第20条：精简功能业务
这条完全取决于业务需求。
从统计数据分析砍掉一些没用的功能是完全有可能的，甚至干脆去掉一些花哨的功能出个轻聊版、极速版也不是不可以的。

#### 第21条：重复执行第1到20条
多次执行上述步骤，你总能发现一些蛛丝马迹，这是一个好消息，不是吗？

#### 第22条：Facebook的redex优化字节码
redex是facebook发布的一款android字节码的优化工具，需要按照说明文档自行配置一下。
```bash
redex input.apk -o output.apk --sign -s <KEYSTORE> -a <KEYALIAS> -p <KEYPASS>
```
下面我们来看看它的效果，仅redex的话，减小了157k：
![only redex](/images/apk_reduce_redex.png)
如果先进行微信混淆，再redex，减小了565k，redex只贡献了10k：
![only redex](/images/apk_reduce_resguard_redex.png)
如果先进行redex，在进行微信混淆，减小了711k，redex贡献了157k：
![only redex](/images/apk_reduce_redex_resguard.png)
最后一种的效果是最好的，这是很容易解释的，如果最后是redex的重新打包则浪费了前面的7zip压缩，所以为了最优效果要注意顺序。
另外，据反应redex后会有崩溃的现象，这个要留意一下，我这里压缩之后都是可以正常运行的。

详情参考：[ReDex: An Android Bytecode Optimizer](https://github.com/facebook/redex)

## 在线评估
针对很多朋友的反馈，有必要对条例的适用范围、易用性和风险指数做个粗略的评估，汇总如下，方便大家执行。

| 指南条例| 适用范围 | 易用性 | 风险指数 | 备注 |
| -----|----|----|----|----|
|使用一套资源|非极高UI要求的APP| 易 |无||
|开启minifyEnabled|全部| 易 |无||
|开启shrinkResources|全部| 易 |无||
|删除无用的语言资源|非全球国际化应用| 易 |无||
|使用tinypng有损压缩|非极高UI要求的APP| 易 |低||
|使用jpg格式|仅限非透明大图| 易 |中||
|使用webp格式|仅限4.0+,4.2+设备| 中 |中||
|缩小大图|限允许缩小的大图| 易 |中||
|覆盖第三库里的无用大图|全部| 中 |高||
|删除armable-v7包下的so|限允许对极少数设备不兼容| 易 |中||
|删除x86包下的so|限允许对x86设备不兼容| 易 |高||
|使用微信资源压缩打包工具|全部| 中 |中|切记要配置白名单|
|使使用provided编译|全部| 易 |低|容错处理|
|使用shape背景|全部| 易 |无||
|使用着色方案|全部| 易 |低||
|表情在线化|限含表情包的APP| 中 |高||
|避免重复库|全部| 中 |中||
|使用更小的库|全部| 中 |高||
|支持插件化|限扩展性要求高的APP| 难 |高||
|精简功能业务|限允许精简的APP| 难 |高||
|Redex优化字节码|全部| 中 |中|||

## 小结
相信经过上述步骤，一定可以把你的Android APP极大的瘦身下去。
考虑到一定的风险性，建议挑选适合自己的方法就行；同时，我也会跟踪最新的瘦身技巧，及时补充更新。

> 本文为原创文章，未经允许禁止转载
