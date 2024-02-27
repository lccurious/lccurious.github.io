---
layout: post
title: Linux 不完全命令指南
date: 2020-05-03 23:59:22
categories:
 - 工程
tags:
 - Linux
 - 脚本
giscus_comments: true
---


不定期更新的 Linux 的脚本管理片段，用于提高日常使用过程中效率。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-05-03-Linux-Tool-Set/v2-01a6301b2101a984790cb8895ece7d96_1200x500.jpg" title="v2-01a6301b2101a984790cb8895ece7d96_1200x500" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<!-- more -->

## 文件统计

```bash
du -sh  # 显示当前文件夹的大小
du -lh --max-depth=1  # 列出当前文件夹下各个目录的大小
df -lh  # 列出当前文件系统的空间使用情况
```

tree 需要额外安装，是命令行常用的查看文件夹项目结构的工具
```bash
tree dir_name -L 3  # 以树形结构列出当前目录最多三级的子项目
```


## 文件传输

```bash
rsync -avz -P source_path username@target_machine:target_path/  # 传输某个文件夹到另一台机器
```

## 命令行

新建一个tmux会话，可以在里面开多个窗口，把窗口分成多个面板，然后用 `ctrl+b+d` 离开这个会话，之后再通过 `tmux a -t name` 回到当前的这个会话，所有的内容都会保持原样。
```bash
tmux new -s name  # 新建一个tmux会话
tmux ls  # 查看已经打开的会话列表
tmux a -t name  # 进入一个已有的会话
```

## 连接

创建软连接相当于只创建了一个快捷方式指向源目标，程序访问这个软连接就会自动指向它所指向的目标。
```bash
ln -s source_path target_path
```
