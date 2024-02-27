---
layout: post
title: 午间休息
date: 2017-12-20 12:40:09
categories:
 - 工程
tags:
 - 数学建模
 - Jupyter
 - Python
 - 数据预处理
giscus_comments: true
---

可以在午间休息的时间换换脑子，似乎写的文章都是想要对身边的好朋友们絮叨的话。这篇文章中将针对基于Python的数据预览和简单预处理问题进行简单介绍，包括环境的配置和具体操作，同时也将不全面地叙述一些数据预处理的技巧。
<!-- more -->

## Anaconda ##

Python（蟒蛇）---> Anaconda（巨蟒），可想而知Anaconda是在纯Python的基础上进行扩展的，Anaconda中集成了很多科学计算程序包（modules），可以通过conda指令很方便地组织和管理这些包。

你可以到Anaconda的[官方下载网站](https://www.anaconda.com/download/)上去下载和安装，都是可视化的安装界面（如果只用Anaconda建议安装过程中勾选加入PATH），想装哪个版本的就仁者见仁智者见智了。考虑到很多工具正在放弃2.7的维护，个人偏向于3.+的版本，但是还是有些代码是完全由2.7写成的，所以自行决定，语法是相差不大的。

Anaconda安装完成之后，考虑到中国特色网络环境，建议去清华的镜像站更换Anaconda的更新源。更换源的操作在[TUNA](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)上有很详尽的说明了，在此对这些镜像站致以敬意。

## Jupyter ##

这是一个颜值高交互方便的工具，在Ubuntu的Terminal或者Windows的命令行提示符中输入下面的命令：

```shell
# Ubuntu：请把文件夹替换成自己的目录路径
jupyter notebook /home/username/Documents/myscifolder
# Windows：请把文件夹替换成自己的目录路径
jupyter notebook E:/templateuse/myscifolder
```

然后启动之后可以直接在新打开的网页上编写代码了，下面是一个Jupyter Notebook的预览界面，只是简单展示一下这项工具的功能。
