title: "[团队分享]记一次小团队Git实践(中)"
date: 2015-07-25 21:45:01
tags: git
---

对于初学者，从使用上先入手，往往学的最快，并从中汲取教训，再回头更深入的学习，效果尤佳。

## 安装git
安装git自不必说，mac已经内置了git，linux下一个命令就能搞定，windows下需要下载一个客户端安装，一切尽在官方网站：
http://git-scm.com/

## 配置自定义信息
```bash
# 配置用户名和密码，标识用户，且可以为后续提交钩子发送邮件, 必填
git config --global user.name "Jayfeng"
git config --global user.email jayfeng@gmail.com
```

## 同步仓库代码
假设服务器IP是192.168.1.18：
```bash
git clone git@192.168.1.18:~/git-repo/ANDROID_CODE.git
```

<!--more-->
## 提交
```bash
# 提交到暂存区（什么是暂存区，下篇会细说）
git add .
# 提交到本地仓库（有本地仓库，难道还有远程仓库，是的，就是服务器咯）
git commit .
# 把本地仓库的提交推送到远程仓库
git push origin master
```

## 更新代码
```bash
# 拉取代码
git pull
# 更建议使用以下方式更新代码
# 拉取代码，但不合并
git fetch origin master
# 合并本地代码和最新拉取的代码
git rebase origin/master
```

## 冲突
在上步中，很有可能会冲突，解决冲突的步骤如下
```bash
# 假设上步在执行git rebase origin/master的时候发生了冲突
# 查看当前冲突的状态
git status

# ... ...
# 打开冲突的文件
# 查找">>>"，定位到冲突的地方，然后解决冲突
# ... ...

# 把解决冲突之后的文件添加到暂存区
git add .
# 继续上步冲突的合并操作，即可rebase成功
git rebase --continue
# 如果想放弃这次合并，--continue换成--abort
git rebase --abort
# 如果冲突了不管，--continue换成--skip
git rebase --skip
```

## 分支（branch）和标签（tag）
标签，也叫里程碑，顾名思义，就是一个重要的标示，以commit的形式存在。
```bash
# 添加tag
git tag -a 1.0.3 -m 'publish a version 1.0.3'
# 显示tag
git show 1.0.3
# 合并标签到远程版本库
# 推送某个标签到远程版本库
git push origin 1.0.3
# 推送所有标签到远程版本库
git push origin --tags
# 检出标签
git checkout -b myTagBranch 1.0.3
```
分支，相当于独立承载另外需求的代码副本，常用于区分管理不同版本的代码。
```bash
# 基于当前分支创建dev分支
git checkout -b dev
# 推送本地dev分支到远程分支
git push origin dev:dev
# 删除dev分支
git branch -D dev
```
git的分支功能是非常强大和灵活的，能够提供多个代码副本共存的方便，大大节省了维护多版本的人力成本。

## 重置(reset)
回退到某个版本。
```bash
// 回到到324214130的tree index，默认参数--mixed, 保留源码，代码状态回退到工作区
git reset 3242a4130142478023231225551a9b7dcb4441e3
// 另外两个参数分别是--soft、--hard, 分别是比--mixed回退的更少一步和更彻底一步。
// 放到下篇文章继续深讲。
```

## 反悔/撤销(revert)
回退某个版本，注意区分和reset的不同。revert是属于commit级别的操作。
```bash
// 回退324214130的commit，相当于把这个commit的改动再反向操作了一次
git revert 3242a4130142478023231225551a9b7dcb4441e3
```
revert只针对这个提交，对它的前面和后面的提交没有直接的影响（相对于reset来说）。同时git会把revert操作当成一个新的commit，可以在git log中看的到。

## 小结
本篇把基本使用git的一些命令一一讲解了一番，以期初学者能上手实用起来。而有些地方则是蜻蜓点水，未作深入，因为我们还有最后一章深入篇，敬请期待！
