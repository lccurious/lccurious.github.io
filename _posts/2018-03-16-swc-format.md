---
layout: post
title: NeuTube和SWC使用指南
date: 2018-03-16 22:04:26
categories:
 - 自然科学
tags:
 - SWC
giscus_comments: true
---


## SWC 格式 ##

SWC是一种直接使用文本表示的文件格式，它是一个文本文件，其中包含以＃字符开头的各种字段的标题以及包含索引，半径，类型和连接信息的一系列三维点。
<!-- more -->
表示点的文本文件中的行具有以下布局。

```shell
n T x y z R P
n是一个整数标签，用于标识当前点，并从一行到下一行递增1。
T是代表神经元节段类型的整数，例如体细胞，轴突，顶端树突等。标准接受的整数值在下面给出。
•	0 =未定义
•	1 =索玛
•	2 =轴突
•	3 =枝晶
•	4 =顶端树突
•	5 =叉点
•	6 =结束点
•	7 =自定义
x，y，z给出每个节点的笛卡尔坐标。
R是该节点处的半径。
P表示当前点的父（整数标签）或-1以表示原点（soma）。
```

下面显示了 由NeuronStudio生成的仅包含8个点的示例文件。请注意，标题的某些字段缺少值。在写这篇文章的时候，目前还不清楚这是否允许。在潜在的SWC阅读器使用这些字段的情况下，NeuronStudio使用1.0填充SHRINKAGE_CORRECTION和SCALE。

```shell
# ORIGINAL_SOURCE NeuronStudio 0.8.80
# CREATURE
# REGION
# FIELD/LAYER
# TYPE
# CONTRIBUTOR
# REFERENCE
# RAW
# EXTRAS
# SOMA_AREA
# SHINKAGE_CORRECTION 1.0 1.0 1.0
# VERSION_NUMBER 1.0
# VERSION_DATE 2007-07-24
# SCALE 1.0 1.0 1.0
1 1 14.566132 34.873772 7.857000 0.717830 -1
2 0 16.022520 33.760513 7.047000 0.463378 1
3 5 17.542000 32.604973 6.885001 0.638007 2
4 0 19.163984 32.022469 5.913000 0.602284 3
5 0 20.448090 30.822802 4.860000 0.436025 4
6 6 21.897903 28.881084 3.402000 0.471886 5
7 0 18.461960 30.289471 8.586000 0.447463 3
8 6 19.420759 28.730757 9.558000 0.496217 7
```

## 读取SWC文件 ##

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-03-16-swc-format/NeutubeLogo.png" title="title:NeuTube" class="img-fluid rounded z-depth-1" caption="title:NeuTube" %}
    </div>
</div>

这里以NeuTube为例读取SWC文件，在NeuTube的[下载页面](http://www.neutracing.com/download/)选择对应的下载方式下载完成就可以得到一个压缩包，然后将这个压缩包解压到你要的位置，启动neuTube。你会得到下面的页面

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-03-16-swc-format/Snipaste_2018-03-17_00-12-17.png" title="title:启动界面" class="img-fluid rounded z-depth-1" caption="title:启动界面" %}
    </div>
</div>

然后点File->Open选择你要打开的SWC文件即可得到三维的用一个一个圆形叠加在一起的模型，通常是神经元模型。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-03-16-swc-format/Snipaste_2018-03-17_00-14-55.png" title="title:SWC可视化界面" class="img-fluid rounded z-depth-1" caption="title:SWC可视化界面" %}
    </div>
</div>

TODO：NeuTube其他操作

## 更多阅读 ##

- <http://www.neuronland.org/NLMorphologyConverter/MorphologyFormats/SWC/Spec.html>
- <http://research.mssm.edu/cnic/swc.html>
- <http://www.neutracing.com/tutorial/>
