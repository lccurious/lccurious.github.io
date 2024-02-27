---
layout: post
title: PaddlePaddle
categories:
  - 工程
tags:
  - paddlepaddle
date: 2018-05-15 11:05:31
giscus_comments: true
---


paddlepaddle是百度开源的并行分布式全功能深度学习平台，全名为PArallel Distributed Deep LEarning，开发的动机是百度的工程师将其用在百度的各种产品中。支持CPU/GPU的单机和分布式模式，支持模型并行和数据并行。对于NLP和推荐算法、RNN等都有很好的支持。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-05-15-paddlepaddle/下载.png" title="下载" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<!-- more -->

## 安装 ##

这里针对CentOS的操作系统，常用的配置方案是Docker+Ubuntu+PaddlePaddle（这是针对Windows系统的）目前PaddlePaddle似乎还是不支持Windows系统。这里采用一种最为简单的方式进行配置，CentOS+Anaconda3+PaddlPaddle，需要声明的一点是因为很多的第三方库开始宣布不再维护Python2的代码了，所以采用Anaconda3作为主版本。

### 配置Python2.7环境 ###

因为主板本使用的是Anaconda3，默认为Python3，所以通过conda环境管理机制建立一个使用Python2的版本，具体可参考另一篇文章 post_link "condaGuide" conda包组织管理 ，为了使安装更加迅速，将anaconda的源改为清华大学的开源镜像，参照anaconda下的[Anaconda 镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)进行修改。

```shell
# 这条是示例，不要执行这一条
conda create --name paddlepaddle python=2.7
```

因为paddlepaddle的依赖比较多，既要Pillow又要OpenCV，还要NLTK等，所以建议使用管理员（这里是指我）预先准备好的配置文件`paddlepaddle.yml`，然后执行下面的命令来创建conda的环境：

```shell
conda env create --file paddlepaddle.yml
```

通过这种方式就能将paddlepaddle的单机环境配置好了，考虑到这是在服务器上配置的，所以还是建议通过Jupyter Nodebook进行使用。

## 服务器端开启Jupyter服务 ##

将paddlepaddle的环境配置好了以后可以通过下面的指令来查看：

```bash
conda env list
```

正常情况下会出现：

```bash
# conda environments:
#
base                  *  F:\Anaconda3
paddlepaddle             F:\Anaconda3\envs\paddlepaddle
```

通过指令`source activate paddlepaddle`激活paddlepaddle的环境，在命令行的最左边会出现一个（paddlepaddle），此时所有python的操作包括包的安装卸载等都仅仅对paddlepaddle这个环境造成影响。因为paddlepaddle仅提供了pip的安装方式，所以再用pip安装paddlepaddle（要在paddlepaddle环境激活的情况下）

```bash
pip install paddlepaddle
```

然后开启jupyter服务

```bash
jupyter notebook 文件夹路径
```

但是通过这种方式开启的服务，一旦退出ssh界面，所有的服务都会被关闭，并且还会存在一个问题是这样开启的jupyter服务不能让远程客户端使用。

### Jupyter 开启远程服务 ###

默认情况下，配置文件 `~/.jupyter/jupyter_notebook_config.py`并不存在，需要自行创建。使用下列命令生成配置文件：

```bash
jupyter notebook --generate-config
```

如果是 root 用户执行上面的命令，会发生一个问题：

```bash
Running as root it not recommended. Use --allow-root to bypass.
```

提示信息很明显，root 用户执行时需要加上 --allow-root 选项。

```bash
jupyter notebook --generate-config --allow-config
```

执行成功后，会出现下面的信息：

```bash
Writing default config to: /root/.jupyter/jupyter_notebook_config.py
```

生成密码:

从 jupyter notebook 5.0 版本开始，提供了一个命令来设置密码：`jupyter notebook password`，生成的密码存储在 `jupyter_notebook_config.json`。

```bash
$ jupyter notebook password
Enter password:  ****
Verify password: ****
[NotebookPasswordApp] Wrote hashed password to /Users/you/.jupyter/jupyter_notebook_config.json
```

不过手动生成也并不麻烦：

除了使用提供的命令，也可以通过手动安装，建议使用的手动安装，因为`jupyter notebook password`好像更啰嗦。打开 ipython 执行下面内容：

```bash
In [1]: from notebook.auth import passwd
In [2]: passwd()
Enter password:
Verify password:
Out[2]: 'sha1:67c9e60bb8b6:9ffede0825894254b2e042ea597d771089e11aed'
```

`sha1:67c9e60bb8b6:9ffede0825894254b2e042ea597d771089e11aed`
这一串就是要在 `jupyter_notebook_config.py`添加的密码。

修改配置文件

在`jupyter_notebook_config.py`中找到下面的行，取消注释并修改。

```bash
c.NotebookApp.ip='*'
c.NotebookApp.password = u'sha:ce...刚才复制的那个密文'
c.NotebookApp.open_browser = False
c.NotebookApp.port =8888 #可自行指定一个端口, 访问时使用该端口
```

### 服务开启 ###

以上设置完以后就可以在服务器上启动`jupyter notebook，jupyter notebook`, root用户使用`jupyter notebook --allow-root`。打开 IP:指定的端口, 输入密码就可以访问了。

但是对于那种使用ssh操作服务器的用户而言，应该在后面加上`&`符号以便让jupyer在后台一直运行。

开启服务之后就可以通过`服务器ip:8888`这个地址访问jupyter notebook了，打开之后应该就能看到如下场景了。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-05-15-paddlepaddle/Snipaste_2018-05-15_10-53-49.png" title="Snipaste_2018-05-15_10-53-49" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

