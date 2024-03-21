---
layout: post
title: conda包组织工具
date: 2018-01-08 21:56:58
categories:
  - 工程
tags:
  - 开发
  - conda
giscus_comments: true
---

使用Anaconda的过程中一种常见的使用手段就是使用conda来管理各类的Python第三方库。但是这个包管理工具不仅在Anaconda生态系统中起到非常重要的作用，也可以作为我们自己的软件开发管理工具。本文将对conda的软件开发管理工具做一定的介绍。

<!-- more -->

## conda是什么

conda是一个用于任何语言的开源环境管理系统，它只是在Python的社区中特别的受欢迎而已。Anaconda是conda的一个发行版而已，它集成了很多开源的科学分析工具库。

## conda环境

如果在同一台电脑上有多个版本的Python，可以用Python环境管理将这些环境完全隔离开来互不影响。在一开始这个环境中就只有一个环境，也就是通用的主环境`conda env list`：

```bash
# conda environments:
#
root                  *  /home/username/anaconda3
```

然后在这些环境的基础上我们可以根据我们自己的需要新建一些环境。在这些环境下的内容互不影响，每个环境都可以用于多个工程。下面是新建两个环境的例子：

```shell
conda create --name python35 python=3.5
conda create --name python27 python=2.7
```

也可以使用更加自定义的方式来进行环境配置（environment.yml）：

```shell
name: playenv
channels:
- conda-forge
dependencies:
- python=3.6
- pip
- pip:
    - pyjokes
```

然后通过执行`conda env create --file environment.yml`在这个环境中将会装入Python3.6，python-pip和用pip装的pyjokes。

```shell
Using Anaconda Cloud api site https://api.anaconda.org
Fetching package metadata .........
Solving package specifications: ..........
Linking packages ...
[      COMPLETE      ]|###################################################################################################################################################################| 100%
Collecting pyjokes
  Downloading pyjokes-0.5.0-py2.py3-none-any.whl
Installing collected packages: pyjokes
Successfully installed pyjokes-0.5.0
#
# To activate this environment, use:
# > source activate playenv
#
# To deactivate this environment, use:
# > source deactivate playenv
#
```

或者通过指定各类需要的包来安装也是可以的：

```shell
conda create -c conda-forge -n test_env python=2.7 numpy matplotlib pandas
```

以上的`-c`是用于指定安装来源，`-n`后面紧跟的是环境名字，最后面跟的是要安装的包的名字，以空格隔开。

### 分享环境

```shell
conda env export -f test_env.yml -n test_env
```

这样可以生成详尽的环境文件用于与他人分享，但是这个环境是不能跨平台的。

### 复制环境

可以把当前的环境复制到另一份名字不相同的环境中去。

```shell
conda create --name live_env --clone test_env
```

### 删除环境

```shell
conda env remove -n live_env
```

### 指定环境操作

```shell
conda list -n test_env
conda remove -n test_env rasterio
```

---

layout: post
参考：https://geohackweek.github.io/Introductory/01-conda-tutorial/
