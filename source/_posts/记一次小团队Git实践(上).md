title: "[团队分享]记一次小团队Git实践(上)"
date: 2015-07-25 00:33:05
tags: git
---
公司规模不大，成立之初，选择了svn作为版本控制系统。这对于用惯了git的我来说，将就了一段时间后，极为不爽，切换到git-svn勉强能用。随后，因为产品需要发布不同的版本，而git-svn对远程分支的支持又甚为不好，于是提出搭建git环境的想法。鉴于呆过的前公司，没有一家使用svn不出事的（印象最深的是，阿里云OS就出现了一次svn重大事故），我不是svn黑，领导欣然同意。

## 需求
一共php，android，ios三个小团队,所以分别为php，android端，ios端搭建三个git仓库。
当然三十个git仓库都可以，和三个仓库是一样。

## 环境
这里以ubuntu为例（工作上实际使用的是centos）

## 安装软件
```bash
sudo apt-get install git
sudo apt-get install openssh-server
```
ssh配置相关操作：
```bash
# 编辑ssh配置
sudo vim /etc/ssh/sshd_config
# 查看ssh server是否启动
# 如果只有ssh-agent那ssh-server还没有启动，如果看到sshd那说明ssh-server已经启动了
ps -e | grep ssh
# 启动ssh服务
sudo /etc/init.d/ssh start
# 重启ssh服务
sudo /etc/init.d/ssh resart
# 停止ssh服务
sudo /etc/init.d/ssh stop
```
<!--more-->
## 创建git用户
专门创建git用户，便于控制权限和管理
```bash
# 添加git用户
sudo adduser git
# 设置git密码为jayfeng
sudo passwd jayfeng
```

## 初始化仓库
以android为例子，创建一个对应的仓库
```bash
# 以git用户身份登陆后，切换到主目录
cd
# 创建所有git仓库的总目录
mkdir git-repo
cd git-repo
# 为android创建ANDROID_CODE仓库
git init --bare ANDROID_CODE.git
```

## 配置ssh key
如果不做这一步，后面从局域网clone代码的时候每次都要输入git用户的密码，所以这一步的目的是通过配置ssh认证，实现免密码同步代码。
下图展示了如何生成ssh key的私钥和公钥:
![如何生成ssh key的私钥和公钥](https://gitcafe-image.b0.upaiyun.com/212ed973319ea57ec769dec0a29c157d.gif)
私钥id_rsa自己用，把公钥id_rsa.pub配置到服务器端git用户的~/.ssh/authorized_keys(即，把id_rsa.pub的内容添加到authorized_keys新一行)，同时配置权限：
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```
并把生成的私钥id_rsa共享给团队的开发人员。

## 局域网访问
如果服务器的IP是192.168.1.18，那么局域网的机器就可以通过下面的方式访问了：
```bash
# 拷贝私钥id_rsa到.ssh目录
mv id_rsa ~/.ssh
# 如果提示权限不对（bad permission 或者 permission too open），请按如下配置
cd ~/.ssh
chmod 700 id_rsa
# 团队成员访问git仓库
git clone git@192.168.1.18:~/git-repo/ANDROID_CODE.git
```

## 小结
小团队使用git，一方面要利用起git的强大功能，一方面要还要摒弃冗余的配置。本次记录了局域网内的git环境搭建。接下来的难点就是如何在公司中培训推广git的使用，克服初学git的陡峭曲线（相对于svn来说）。



