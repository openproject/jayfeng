---
title: Linux上处理数据的基本技巧笔记
date: 2016-07-29 10:22:36
tags:
---

## 一、Vim篇

#### 删除包含特定字符的行：
```bash
g/pattern/d
# 比如删除空白行：
g/^\s*$/d
```

#### 删除不包含指定字符的行
```bash
v/pattern/d
g!/pattern/d
```

## 二、Sed篇

#### 文件夹下全局替换一些字符串
```bash
// 注意特殊字符需要处理
sed -i 's/oldstr/newstr/g' `grep oldstr -rl .`
```

## 三、Awk篇

#### 替换某个字符串为当前行数
```bash
// http://192.168.1.2/blog/
// http://192.168.1.2/blog/
// http://192.168.1.2/blog/
// 替换为
// http://192.168.1.1/blog/
// http://192.168.1.2/blog/
// http://192.168.1.3/blog/
awk '{gsub("\\.2", "\."NR);print $0}' data.txt
```

## 四、其他

#### 删除文件夹下小于1k的文件
```bash
# -size 1表示512，2表示1k，以此类推...
find ./ -size -2 | xargs rm
```

## 附录
[1] [sed帮助手册](http://www.gnu.org/software/sed/manual/sed.html)
[2] [SED单行脚本快速参考](http://sed.sourceforge.net/sed1line_zh-CN.html)
[3] [AWK程序设计语言](http://awk.readthedocs.io/en/latest/index.html)
