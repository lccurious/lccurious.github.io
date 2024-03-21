---
layout: post
title: 离线服务器通过PC中转连接公网
date: 2020-07-27 15:25:48
categories:
  - 工程
tags:
  - CCProxy
giscus_comments: true
---

不愧是学校的网络，让人在科研以外还学到了各种各样的知识。**前情提要：1. 学校的网络账号是一个IP一个账号 2. 即使登录了账号，连从阿里云下载内容都无法顺利实现（不知道是到公网的哪条路受到了阻碍）**。所以只有通过与服务器直接相连的控制端提供公网的访问中转。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-07-27-Local-Server-Proxy/proxy-flow.png" title="proxy-flow" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<!-- more -->

# CCProxy

主要用于局域网内共享宽带上网，ADSL共享上网、专线代理共享、ISDN代理共享、卫星代理共享、蓝牙代理共享、二级代理和SOCKS5代理等共享代理上网。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-07-27-Local-Server-Proxy/微信图片_20200727153500.png" title="微信图片_20200727153500" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

安装好这个软件之后启动就相当于开启了当前这台安装CCProxy的电脑作为中转服务器，然后挑选一个离线内网服务器可以访问的到的IP地址作为流量中转服务器的代理地址。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-07-27-Local-Server-Proxy/ccproxy_setting.png" title="ccproxy_setting" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

# Proxychains4

一个可以在终端进行socks流量转发的工具[Proxychains4](https://github.com/rofl0r/proxychains-ng)

proxychains-ng是proxychains的加强版，主要有以下功能和不足：

- 支持http/https/socks4/socks5
- 支持认证
- 远端dns查询
- 多种代理模式
- 不支持udp/icmp转发
- 少部分程序和在后台运行的可能无法代理

简单的说就是这个程序 Hook 了 sockets 相关的操作，让普通程序的 sockets 数据走 SOCKS/HTTP 代理。其核心就是利用了 LD_PRELOAD 这个环境变量（Mac 上是 DYLD_INSERT_LIBRARIES）。

在 Unix 系统中，如果设置了 LD_PRELOAD 环境变量，那么在程序运行时，动态链接器会先加载该环境变量所指定的动态库。也就是说，这个动态库的加载优先于任何其它的库，包括 libc。

ProxyChains 创建了一个叫 libproxychains4.so（Mac 上是 libproxychains4.dylib）的动态库。里面重写了 connect、close 以及 sendto 等与 socket 相关的函数，通过这些函数发出的数据将会走代理，详细代码可以参考 libproxychains.c。

在主程序里，它会读取配置文件，查找 libproxychains4 所在位置，把这些信息存入环境变量后执行子程序。这样子程序里对 socket 相关的函数调用就会被 Hook 了，对子程序来说，跟代理相关的东西都是透明的。

## 配置

通过源代码安装的配置文件默认在 `/etc/proxychains.conf`，我们通过改写这个配置文件中的最后几行如下：

```shell
[ProxyList]
# 一些注释
# 填入你的代理服务器IP x.x.x.x 和端口
socks5 x.x.x.x 3030
```

## 使用

任意使用某个指令，例如下载某个东西：

```shell
proxychains4 wget 下载地址
```

同理，它还可以用于梯子的使用。

# Docker的代理

似乎好像，这样还不足以解决docker的拉取等问题，所以只有为docker单独配置代理方式：

创建docker服务插件目录：

```shell
sudo mkdir -p /etc/systemd/system/docker.service.d
```

创建一个名为http-proxy.conf的文件

```shell
sudo touch /etc/systemd/system/docker.service.d/http-proxy.conf
```

编辑http-proxy.conf的文件

```shell
sudo vim /etc/systemd/system/docker.service.d/http-proxy.conf
```

写入内容(将代理ip和代理端口修改成你自己的)

```
[Service]
Environment="HTTP_PROXY=socks5://代理ip:代理端口/"
```

重新加载服务程序的配置文件

```shell
sudo systemctl daemon-reload
```

重启docker

```shell
sudo systemctl restart docker
```

验证是否配置成功

```shell
systemctl show --property=Environment docker
```

另外，Docker 在国内是有镜像加速器的，可以直接从国内的dockerhub拉取公有镜像省去很多无尽的等待时间。
