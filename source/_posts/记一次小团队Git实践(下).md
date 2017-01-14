title: "[团队分享]记一次小团队Git实践(下)"
date: 2015-07-27 23:59:01
tags: git
---
在上篇中，我们已经能基本使用git了，接下来继续更深入的挖掘一下git。
## 更多的配置自定义信息
除了前面讲的用户名和邮箱的配置，还可以自定义其他配置：
```bash
# 自定义你喜欢的编辑器，可选
git config --global core.editor vim
# 自定义差异工具，可选
git config --global merge.tool vimdiff
git config --global mergetool.prompt false
# 为git着色
git config --global color.ui true
```
还有一些配置，比如core.autocrlf，core.whitespace等等就点到为止，不做赘述。

## 忽略文件 -- 使用.gitignore
git支持使用.gitignore文件定义忽略规则，一行一个。
gitignore文件只能忽略非版本库的文件，对于已经添加到版本库的文件，需要先删除掉才能忽略。
所以，一般.gitignore文件建议在创建项目的时候就加进来，这样可以减少不必要的麻烦，不必把一些中间生成文件添加到版本库。
<!--more-->
以Android为例子：
```bash
# built application files
*.apk
*.ap_

# files for the dex VM
*.dex

# Java class files
*.class

# generated files
bin/
gen/

# Local configuration file (sdk path, etc)
local.properties

# Eclipse project files
.classpath
.project

# Android Studio
.idea/
.gradle
/*/local.properties
/*/out
build
/*/*/production
*.iml
*.iws
*.ipr
*~
*.swp
```

## 两个重要概念
git最基础也是最重要的两个概念：对象模型和版本跟踪结构。
1. 对象模型定义了git版本存储的方式。
每一次提交git会根据内容生成一个SHA1值，作为对象名。

2. 版本跟踪结构分为4个部分：工作区，暂存区，本地仓库，远程仓库。
![git reset 的几个参数区别示意图](/images/workspace.png)

## 修改提交
难免在提交之后发现一些错误，希望能亡羊补牢补救一下，这就需要使用如下命令。
```bash
# 修改上次的提交
git commit --amend
# 合并本地所有未提交的提交, 在弹出的交互界面， 保留一行的pick，把其他每行提交的pick改为fixup或者squuash
# 其实从上面的操作上看，如果你想保留几个提交，就保留几个pick即可
git rebase -i origin/master
# 合并最后两个提交, 在弹出的交互界面，操作同上
git rebase -i HEAD~2
```
简单的修改提交可能是合理的，但是合并提交，就需要考虑到提交的目的，不建议把完全独立的提交硬是合并在一起, 从工程上会降低版本管理的意义，同时增大了合并到其他分支出错的可能性。

## cherry-pick -- 分支之间的smart merge
前面讲到了branch，它的使用场景下，有一种常见的操作，就是把某个commit也合并到另外一个分支B，怎么做呢？
```bash
// 切换到分支B
git checkout B
// 把之前的commit使用cherry-pick命令到当前分支
git cherry-pick 5d1c8562cd3d6b902e7d1542940ba39a97179017
```

## reset的艺术
git reset的艺术就在于它的几个参数的使用。
当了解上面定义的版本库，暂存区，工作区概念之后，reset的几个参数的区别就非常好说明了，我画了一张图：
![git reset 的几个参数区别示意图](/images/reset.png)

## 二分法定位问题 -- git bisect的使用
如果一个项目的提交非常对，面对一个不知道什么时候出现的bug，git借用了二分法平均时间最快的思想，提供了git bisect命令。
```bash
// 开始查找, 对应最后面的结束查找
git bisect start
// 标记当前版本为错误
git bisect bad
// 标记5d1c8562cd3d6b902e为正确的版本
git bisect good 5d1c8562cd3d6b902e
// 现在git会自动选取bad和good的中间版本
// ...
// 我们能做的就是不断的测试并标记这些中间版本时good还是bad，直到找到问题
// git bisect good 或者git bisect bad
// ...
// 结束查找，回到开始查找之前的状态
git bisect reset
```

## 这行代码是谁加的 -- git blame助你火眼金睛
git blame命令可以查看每个文件的每一行的版本信息，包括提交SHA，日期，作者：
```bash
git blame ./lesscode-core/src/main/java/com/jayfeng/lesscode/core/AdapterLess.java
```

结果：
```java
406962f0 (Jay      2015-02-05 19:31:17 +0800   1) package com.jayfeng.lesscode.core;
406962f0 (Jay      2015-02-05 19:31:17 +0800   2)
406962f0 (Jay      2015-02-05 19:31:17 +0800   3) import android.content.Context;
8ee8388a (Jay      2015-05-23 18:20:40 +0800   4) import android.support.v4.app.Fragment;
8ee8388a (Jay      2015-05-23 18:20:40 +0800   5) import android.support.v4.app.FragmentManager;
8ee8388a (Jay      2015-05-23 18:20:40 +0800   6) import android.support.v4.app.FragmentPagerAdapter;
a03f8aa3 (Jay      2015-05-23 16:59:05 +0800   7) import android.support.v4.view.PagerAdapter;
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800   8) import android.support.v7.widget.RecyclerView;
406962f0 (Jay      2015-02-05 19:31:17 +0800   9) import android.util.SparseArray;
406962f0 (Jay      2015-02-05 19:31:17 +0800  10) import android.view.LayoutInflater;
406962f0 (Jay      2015-02-05 19:31:17 +0800  11) import android.view.View;
406962f0 (Jay      2015-02-05 19:31:17 +0800  12) import android.view.ViewGroup;
406962f0 (Jay      2015-02-05 19:31:17 +0800  13) import android.widget.BaseAdapter;
406962f0 (Jay      2015-02-05 19:31:17 +0800  14)
406962f0 (Jay      2015-02-05 19:31:17 +0800  15) import java.util.List;
406962f0 (Jay      2015-02-05 19:31:17 +0800  16)
4719215f (think    2015-02-06 22:06:50 +0800  17) public class AdapterLess {
406962f0 (Jay      2015-02-05 19:31:17 +0800  18)
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  19)     public static <T> RecyclerView.Adapter<RecycleViewHolder> $recycle(final Context context,
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  20)                                                                        final List<T> list,
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  21)                                                                        final int layoutId,
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  22)                                                                        final RecycleCallBack recycleCallBack) {
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  23)         RecyclerView.Adapter<RecycleViewHolder> result = new RecyclerView.Adapter<RecycleViewHolder>() {
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  24)             @Override
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  25)             public RecycleViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  26)                 View view = LayoutInflater.from(context)
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  27)                         .inflate(layoutId, viewGroup, false);
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  28)                 RecycleViewHolder recycleViewHolder = new RecycleViewHolder(view);
2cf7bb1c (Jay      2015-07-26 11:59:18 +0800  44)    ... ...
```
## 小结
git作为小而美的工具，开创了一个版本控制的新时代。
学习git是一个循序渐进的过程，通过结合基本使用方法和实践场景的练习，达到熟练使用的程度，可成！
