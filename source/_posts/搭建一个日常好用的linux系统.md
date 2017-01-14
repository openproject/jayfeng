title: "搭建一个日常好用的linux系统"
date: 2015-11-26 23:57:51
categories: linux
tags: linux
---

***Linux***桌面一直是开发者心中的痛，大家都爱linux下的命令行和配置，但是苦于没有一个友好的交互界面满足日常需求，常疲于一些最基础的配置。
***Mac***是一个很好的选择，我使用的是Macbook pro, 但就公司或者工作而言，还是以台式机为主。Mac的硬件配置相对偏低，价格相对偏高，对于很多学生党或者有经济压力的朋友来说，这注定是一个坎，其实这也是为什么mac注定不普及的原因（相对于一些大牛推荐买个mac的投资是绝对划算的，我更推荐在现有的基础上安装linux是绝对超值的，谁能有哥这么懂你~）。
***Windows***，是一个非常nice的系统（一直是我心中最好用的系统，但不适合开发者），请走出你的舒适区，外面有世界！
![最终效果界面](/images/linux_desktop.png)

# 1. 目标
搭建一个日常好用的linux系统。
1. 这不是一篇linux折腾记；
2. 搜狗输入法，QQ，深度音乐，Office；
3. 常见工具的安装和配置。

# 2. 安装linux mint 17.2
相对于ubuntu，我推荐尝试一下linux mint:
1. 下载linux mint: http://www.linuxmint.com/
2. 使用unetbootin制作启动U盘
接下来即使重启安装了，本文重点不是讲安装系统的，请自行百度。

# 3. 安装vim
要装qq？不要急，vim大法好，不先装不舒服。
```bash
sudo apt-get install vim
```
vim吸引我的地方有两个，一个是其特别的编辑模式，二是其大量的插件。
基于此，我一般从下面两个地方再定制一下vim：
1. vim的插件很多，作为一个vim的多年使用者，我也积累一些用的顺手的插件。
地址：https://github.com/openproject/openvims
按照上面的配置即可。
2. 特别的，有一个powerline插件（airline也可以），可大大美化你的vim的状态栏。
我刚开始的时候并不配置的出效果，发现网上也有人这样。后面发现其实很简单，第一，安装支持特殊字符的powerline字体；第二，终端字体设置字体为相应的powerline字体。基本上效果就马上出来了~

![vim运行界面](/images/linux_vim.png)

<!--more-->
# 4. 安装搜狗输入法
如果是比较新ubuntu版本，直接下载搜狗的deb包，安装重启即可。linux mint比ubuntu多一步安装安装Fcitx，详细步骤如下：
1. 安装Fcitx
搜狗输入法是基于Fcitx的，所以安装搜狗输入法必须先安装Fcitx，而刚好linux mint对输入法的安装提供了很方便的支持，非常简单。
点击Menu，搜索Languages，弹出语言设置界面，选择输入法Tab，里面列出可直接安装的输入法，有：IBus，Fctix，SCIM，UIM，gcin，但是默认都没有安装。
我们点击Fcitx项的“Add support for Fcitx”，吧唧吧唧吧唧，安装完了，把第一项里的输入法设置为Fcitx。效果图如下：
![Fcitx配置](/images/linux_fcitx.png)
这里切记不要安装Fcitx的可选组件哦，不然一大堆输入法出来，还要手动删除。
2. 安装搜狗输入法
在 http://pinyin.sogou.com/linux/ 下载对应的deb包，双击安装。
然后，
重启，重启，重启，重要的事情打三遍。
默认ctrl + 空格，可以切换输入法。
这里我截不了桌面右下角展开的设置界面，本来可以看一下的，也无所谓了，大家都这么厉害。
![搜狗输入法运行界面](/images/linux_sougou.png)

PS: 如果输入法跳动，试一下这个配置：
```bash
sudo apt-get install im-switch
im-switch -s fcitx -z default
```

# 5. 安装QQ
详情请参考: http://phpcj.org/wineqq/ ，下面列出简要的几步：
1. 安装wine1.7
系统默认的wine1.6是不行的，必须得添加ppa源安装wine1.7:
```bash
sudo add-apt-repository ppa:ubuntu-wine/ppa
sudo apt-get update
sudo apt-get install wine1.7
```
2. 解压网盘下载的WineQQ压缩包
网盘地址：http://pan.baidu.com/s/1qWyPHA8 密码：e2k8
```bash
tar xvf wineQQ8.0B16812.tar.xz -C ~/
```
竟然如此简单！
几乎全功能正常运行，可以截图，上周末还远程控制对方的计算机了一把。
![QQ运行](/images/linux_qq.png)

# 6. 安装深度音乐
如果没有音乐，辣么，人和咸鱼又有什么区别？
目前linux上本土化的支持歌词的最好播放器，当属深度音乐了（光支持歌词一条，就把其他全秒）。
详细参考：http://wiki.deepin.org/?title=深度音乐
我安装了百度插件和网易云插件，其中百度插件需要安装javascriptcore，如果安装javascriptcore出现如下错误：
```bash
...
javascriptcore.c:4:20: fatal error: Python.h: No such file or directory
#include "Python.h"
^
compilation terminated.
error: command 'x86_64-linux-gnu-gcc' failed with exit status 1
...
```
请安装一下python的dev包即可：
```bash
sudo apt-get install python-dev
```
![Deepin Music](/images/linux_music.png)

# 7. 安装homebrew
这里的homebrew是指linux版homebrew，又称linuxbrew。虽然是第一次在linux上尝试homebrew，发现还挺不错的。
homebrew是类似于apt-get的一个包管理器，在安装一些软件会特别方便。
官网：https://github.com/Homebrew/linuxbrew

先安装依赖：
```bash
sudo apt-get install build-essential curl git m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev
```
再正式安装：
```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
```
接下来就可以用brew install来安装各路软件了，哦也。

# 8. 安装jdk
系统自带的是openjdk，一般会安装oracle版本的jdk（更好的性能），使用homebrew安装jdk是最简单的：
```bash
// 默认安装时jdk8
brew install jdk
```
如果想安装jdk7:
```bash
brew install jdk7
```

# 9. 安装zsh
有了bash，为什么要另外装zsh？一句话，比bash好用，牛x。想了解更多请移步：http://zhuanlan.zhihu.com/mactalk/19556676
```bash
sudo apt-get install zsh
```
安装完，配置zsh本来是件非常繁琐的事情，为了简化配置，可以使用oh-my-zsh(https://github.com/robbyrussell/oh-my-zsh):
```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```
一起飞！

# 10. 安装autojump
是不是受够了cd ../..，想不想在任何地方都能够一键直达某个目录？autojump是也。

> autojump - a faster way to navigate your filesystem

官网：https://github.com/wting/autojump
建议用homebrew安装autojump，它会给出更多的配置提示:
```bash
[[ -s $(brew --prefix)/etc/profile.d/autojump.sh ]] && . $(brew --prefix)/etc/profile.d/autojump.sh
```

# 11. 安装其他一些软件
```bash
# 安装gradle，默认2.7版本
homebrew install gradle
# 安装nodejs
brew install nodejs
# 安装hexo
npm install hexo-cli -g
# 安装jenkins
```

# 12. 配置VPN
不会翻墙的程序员当不了好CEO！
这里主要是介绍一个linux mint的坑，它的新建VPN连接不是在网络设置，而是在网络连接里，很容易误导。
![Vpn](/images/linux_vpn.png)
介绍一个一直在用的一个VPN的推广链接，老品牌，值得信任：[51VPN](http://go.to51.net/34750)
同时里面也介绍了linux上如何新建VPN（各个系统都大同小异）：
https://www.woyaovpn.net/setting/ubuntu.shtml

# 13. 配置自启动
主要是网上有很多配置自启动的方法，特列此一项说明，其实linux mint自带了自启动程序管理：
![start in menu](/images/linux_start_1.png)
打开即可配置：
![start config](/images/linux_start_2.png)
So easy!

# 14. 其他软件
相对于几年前，得益于deepin，ubuntukylin国产厂商，这几年linux桌面日常软件得到了极大的丰富，特别是还得到了一些良心企业的支持：
1. WPS Office：http://linux.wps.cn/
2. 有道词典：http://cidian.youdao.com/index-linux.html
3. 为知笔记：http://www.wiz.cn/download.html

欢迎留言补充。

# 15. 小结
当你的日常需求都满足了，是时候从windows切换到linux了！
还有什么比帮助别人学习linux更有linux精神！
如有困难，加我qq：673592063。

