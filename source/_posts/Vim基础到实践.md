---
title: Vim基础到实践
date: 2017-01-14 21:12:19
tags:
---

VIM是编辑神器，尤其是远程编辑无可替代，非常强大。

## 基础入门
### 安装
略
### 三种模式
- 命令模式
用于输入命令，简单更改
- 插入模式
用于插入文本，修改文本
- 末行模式
用于输入命令，可视化操作，查找替换等

### 模式切换
- 命令模式进入到插入模式
文本插入命令: i,I,a,A,o,O
- 插入模式退出到命令模式
ESC键
- 命令模式进入到末行模式
冒号(:)键
```bash
:set nu       表示行号显示
:set nonu   取消行号显示
```
(4).末行模式退出到命令模式
Enter或者ESC。

### 退出和保存
```bash
:q                     退出vim返回到shell，若有修改未被保存，vi在末行给出提示信息并不退出vim到shell
:q!                    退出vim返回到shell，放弃未保存的修改
:wq                    先保存，然后退出vim返回到shell
:x                     和wq命令功能类似，区别是如果是文件没有修改的话，x不会更新文件的修改时间，而wq则会更新文件的修改时间，无论是否有修改。
:w filename            写入当前文件到filename文件
```

## 编辑

### 常用编辑
包括删除、复制、粘贴、撤销、移动等
```bash
dd       删除当前1行
5dd      删除当前行向下5行
x        删除光标后字符
X        删除光标前字符

yy       复制当前1行
5yy      复制当前行向下5行

p        粘贴

u        撤销

hjkl     向左下上右方向移动光标
^        光标移动到本行行首
$        光标移动到本行行尾
gg       跳到文件首行
5gg      跳到第5行
G        跳到文件尾行

Ctrl + f 向后滚一页。
Ctrl + d 向后滚半页。
Ctrl + b 向前滚一页。
Ctrl + u 向前滚半页。
Ctrl + e 屏幕向下滚一行。
Ctrl + y 屏幕项上滚一行。
```

### 查找替换
```bash
/android                 查找android，然后如果按n，表示向下查找，如果按N，表示向上查找
?android                 查找android，然后如果按n，表示向上查找，如果按N，表示向下查找

*                  向后搜索当前光标指向的单词
#                  向前搜索当前光标指向的单词

:%s/old/new/g            将编辑器的缓冲区的"old"替换为new
:19,20s/old/new/g        将文件的19到20行的的"old"替换为new
```

## 进阶使用
包括一些个别命令、批量操作、组合命令等
### 常见命令
    - 单词移动
    b, before,上一个单词(词首)
    w, word,下一个单词(词首)
e,  end,下一个单词(词尾)
    - 首尾行
    gg 首行
    G 尾行,这两个命令用的较多
    - 行首尾
    ^/0  到行首,我有时特别喜欢0，非常清晰简明的命令
    $ 到行尾
    - 非空白行首
    -非空白行首向上移动
    +非空白行首向下移动
    - 行移动
    ```bash
    nj                      //向下移动n行
    nk                      //向上移动n行
    nh                      //向左移动n列
    nl                      //向有移动n列
    n_                      //向下移动n-1行，并光标移动到非空白行首
    n-                      //向上移动n行，并光标移动到非空白行首
    ```
    - 查找字符
    ```bash
    fx/Fx                   //向后/前查找字符x,行内跳转很有用
    tx/Tx                   //向后/前查找字符x
    ```
    注意：fx/Fx和tx/Tx的区别是用f光标停留在x上，用t光标停留在x的前面一个上

### 插入，替换，删除
    - 学会a和i混用
    不要只会用i进入插入模式，有时a进入插入模式后更方便，比如插入键盘右边的字母符号，用a的话，左右手配合起来效率更高。
    - 学会I和A
    快速进入行首和行尾插入模式，特定时刻用起来超爽!
    这个很好理解，小写的i是光标前，大小的I是整行前面，o/O类似，画面很清晰。
    - 学会o和O混用
    进入上行编辑，大写的O更快，而不是ko,双手比单手要快！
第一行前面想插入一行时，O比其他任何操作更直接和快速(不要先回到开头<+插入模式>+回车)
    - r和s
    r 快速替换字符，最大的好处是不需要切换模式，节省了大量时间，非常有用！
    s 删除光标后一个字符并进入插入模式。该命令提供了r命令+进入插入模式的快速实现方法。
    - c命令
    这个命令很强大，归类说明一下
    ```bash
    c<m>                     //m指的是前面的移动命令，类似的有dm,ym,g?m,gum,gUm
    //改变内容(m定义了改变范围)并进入插入模式，这里说的改变就是删除，举例说明:
    cw                     //删除光标后一个单词并进入插入模式
    cl                     //删除光标后一个字母并进入插入模式
    ```
    补充说明：
    cc和S 修改当前行，意思是删除该行所有字符内容，但保留行首空格
    D和C 删除该行光标后所有内容，无论字符还是空格，这个命令我用的很多：代码审核格式化代码时，删除空行的空格和行尾空格。
    - t命令
    t命令和其他命令结合在一起，非常强大。
    ```bash
    t                      //till的意思,这是我最喜欢的命令之一
    dt"                    //行内删除直到","不删除
    ct)                    //行内改变直到),)不删除
    ... ...
    ```
    - 学会x和X混用
    - 分别是向前删除和向后删除字符

### 更多命令
    ```bash
    :rd                删除第r行
#                      //向下一个查找结果
    *                      //向下一个查找结果
    //在#/*之后按n/N可以重复/反向重复它们的命令

    //下面这两个命令在编程时，很有用
    gd                     //跳转到光标变量的定义位置(局部变量)
    gD                     //跳转到光标变量的定义位置(全局变量)
    u                      //撤销
    ctrl + r               //恢复
    ctrl + e/y             //向下/上一行一行的滚动
    ctrl + d/u             //向下/上半页半页的滚动
    ctrl + f/b             //向下/上一页一页的滚动
    ```
### 可视化模式
    可视模式其实非常有用，它的选择很灵活，而且视觉效果上看着和鼠标选择一样，学习成本低，但是功能强大。
    - 选择模式
    v 进入可视模式
    shift + v 也就是大写的V，可视模式的行选择，整行整行的选择，用于刚好整行或者大篇幅内容的处理比较方便。
    ctrl + v 可视模式的列选择，比行选择模式更加细化，可选择连续的列进入操作

    - 选择块
    选择块模式需要和其他命令结合。
    ```bash
    V + G                  //选择当前行一直到文本结尾
    V + G + d              //删除当前行一直到文本结尾
    V + G + y              //复制当前行一直到文本结尾
    V + gg + d             //删除当前行一直到文本开头
    V + gg + y             //复制当前行一直到文本开头
    ctrl+v + <移动>+ d      //删除选择的列
    ctrl+v + <移动>+ y      //复制选择的列
    ```
    - 其他
    选中单词，句子，段落等。
    ```basg
    gv 　　             //选中上次的选中区域
    vaw                   //选中一个单词(word)
    vas                   //选中一个句子(sentence)
    vap                   //选中一个段落(paragraph)
    viw                   //选中一个单词(word)
    vis                   //选中一个句子(sentence)
    vip                   //选中一个段落(paragraph)
    vab                   //选择()里面的内容, 包括小括号
    vaB                   //选择{}里面的内容,包括大括号
    ```
    大小写转换
    ```bash
    ～                    //改变当前字符并自动切换到下一个字符，大写变小写，小写变大写，可以一直按
    gum                   //转化为小写，m指移动命令，如：
    //guw   光标后的一个单词小写化
    //guG   光标所在行到最后行全部小写化
    //gut=  光标后直到=之间的字符小写化
    //罗嗦一句，gu还可以与可视模式结合，小写化所选区域
    gUm
    ```
    数字增减
    ```bash
    Ctrl + a           //自增1
    Ctrl + x           //自减1
    ```

### 宏录制
    很强大的功能，需要的时候就特别有用，单独柃出来说一下。
    ```bash
    //为操作定义宏或者取别名
    //这个命令的强大之处在于使重复复杂指令的简单化了
    q                     //按下q开始录制
    x                     //x是这个录制的寄存器，x可以是其它字符
    dd                    //删除当前行，这个操作可以自定义其他复杂的操作
    q                     //录制结束，现在dd这个操作被定义到了@x这个命令里了
    ```
### 自定义配置
    配置文件
    ```bash
    " basic config
    set nu
    set hlsearch
    set incsearch
    set autoindent
    set tabstop=4
    set shiftwidth=4
    set expandtab
    set mouse=n

    syntax enable
    set background=dark
    colorscheme solarized

    ... ...
    ```

## 插件
### 插件管理器
    pathogen,vundle
###  现成的打包方案
    https://github.com/Geam/config_vim
https://github.com/openproject/openvims
### 常用插件说明
- nerdtree
官网：https://github.com/scrooloose/nerdtree
说明：文件目录树
- nerdcommenter
官网：https://github.com/scrooloose/nerdcommenter
说明：注释
- vim-airline
官网：https://github.com/vim-airline/vim-airline
说明：漂亮的状态栏
- space
官网：https://github.com/spiiph/vim-space
说明：更智能的space支持
- easygrep
官网：https://github.com/vim-scripts/EasyGrep
说明：当前目录查找内容
- file-line
官网：https://github.com/vim-scripts/file-line
说明：打开文件自动跳转到某一行
- fuzzyfinder
官网：https://github.com/vim-scripts/FuzzyFinder
说明：目录文件搜索
- snipmate
官网：https://github.com/vim-scripts/snipmate
说明：代码片段快捷缩写
- solarized
官网：https://github.com/vim-scripts/solarized
说明：最流行的配色方案
- supertab
官网：https://github.com/vim-scripts/supertab
说明：让tab更智能
- tabular
官网：https://github.com/godlygeek/tabular
说明：对齐
- tagbar
官网：https://github.com/majutsushi/tagbar
说明：类的结构图
- visincr
官网：http://www.vim.org/scripts/script.php?script_id=670
说明：垂直递增或者递减改变数字、字母、日期等

## 编译源码
官方仓库：https://github.com/vim/vim
