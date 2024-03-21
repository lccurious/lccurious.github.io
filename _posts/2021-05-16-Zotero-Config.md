---
layout: post
title: Zotero 使用配置
tags:
  - 文献管理
  - Zotero
typora-root-url: Zotero-Config
categories:
  - 工具
mathjax: false
date: 2021-05-16 19:40:14
giscus_comments: true
---

文献管理软件多如牛毛，EndNote、Papers、Mendeley、Citavi、NoteExpress等要么是生态封闭，在文献同步导入插件支持方面有所欠缺，要么是收费并且同时存在这些问题。但是Zotero这款开源软件的出现让人可以以合理的方式更加方便地管理我们的文献。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2021-05-16-Zotero-Config/image-20210516160905361.png" title="image-20210516160905361" class="img-fluid rounded z-depth-1" caption="image-20210516160905361" %}
    </div>
</div>

<!-- more -->

## Zotero 特点

Zotero的数据库是基于SLQlite，这里面主要存储了你的文献信息和各种关系信息，文献的源PDF等文件则是存储在单独存储在`storage`这类文件夹内的。其中这些关联信息可以直接通过它配置的免费服务器进行同步，这意味着可以在多台机器上同步文献，而源文件则可以通过`OneDrive`等云盘进行多平台的同步。

## 添加文献

### 文献识别码

通过直接输入文献的识别码，Zotero会自动搜索文献相关的信息。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2021-05-16-Zotero-Config/image-20210516161415958.png" title="image-20210516161415958" class="img-fluid rounded z-depth-1" caption="image-20210516161415958" %}
    </div>
</div>

或者还可以直接导入Bibtex、EndNote等格式的数据库文本进行文献的批量添加。

### Zotero Connector

Zotero 软件本体和浏览器插件 Zotero Connector，其中 Zotero Connector 支持 Chrome、Firefox，Edge等浏览器。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2021-05-16-Zotero-Config/2021-05-16.png" title="2021-05-16" class="img-fluid rounded z-depth-1" caption="2021-05-16" %}
    </div>
</div>

当我们浏览数据库时，Zotero Connector 会自动读取当前页面的信息，图标也会随着内容进行变化。比如，打开中国知网之后，点击 Chrome 浏览器右上角的 Zotero Connector 图标，就会自动将该页面的数据保存到 Zotero 中，如果有下载全文的权限，还会将 PDF 附件一同保存下来。然后打开 Zotero，会发现文献信息连同 PDF 一起保存了下来，并且光标自动定位到了刚刚保存的这条文献条目上。

## 文件同步

Zotero的文件同步与索引同步是分开的，所有索引的内容都存储在Zotero文件夹下的`.sqlite`里，对应的PDF文件存在`storage`文件夹下，其中的每一个子文件夹都对应于其中的一个文件。所以只要每台机器同步这两份数据即可以保证所有的信息在机器之间的共享。这里我采用`OneDrive`作为主要的同步工具，它可以以近乎无感的方式检查文件的变动并进行同步，而且还有文件随选功能。

在正式工作时，通常会一直开着Zotero编辑，这就会不停的修改数据中的信息，所以`.sqlite`文件就会不断变动。随这种变动而来的一个问题就是，如果多台机器同时开机，并且`OneDrive`都在线的情况下会容易导致不同机器间的同步冲突问题。所以这个`.sqlite`文件不能直接放在`OneDrive`内部进行同步，只对`sotrage`文件夹进行同步。

Unix对`storage`采用软链接：

```bash
ln -s "/Users/username/OneDrive - zju.edu.cn/Zotero/storage" storage
```

Windows下用管理员权限的`mklink`。

## 阅读更多

1. <https://sspai.com/post/59035>
