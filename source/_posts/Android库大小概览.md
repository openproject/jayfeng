---
title: Android库大小概览
date: 2016-07-25 01:18:54
tags:
---

虽然大家每天都在用不同的第三方库，也在担心这些库的大小和方法数，但确缺少一个直观的了解。

有一些工具能帮助我们看一些大概的情况，比如：Dxcount Gradle Plugin。
![Dex Count Result](/images/androidlib_size_dex_count_result.png)

你也可以通过如下命令分析这些库的依赖：
```bash
./gradlew app:dependencies
```
得到这样的结果：
![Library Dependencies](/images/androidlib_size_dependencies.png)

好吧，上面强行介绍了两个技巧：一个插件和一个命令。
但是依然没有找到直观查看这些第三方库大小的方法，于是我自行建立了一个网页方便查询：

http://jayfeng.com/androidlib-size/

为了更全面的统计，欢迎大家参与，参与方式如下；

> 1. 在你的Linux系统的.gradle目录下，进入caches/modules-2/files-2.1/目录。
> 2. 执行<pre>find -name "*.aar" | xargs ls -l -h</pre>
> 3. 把输出结果发到673592063@qq.com即可。
> 4. 我会尽快把这些结果更新到上面的网址里。
