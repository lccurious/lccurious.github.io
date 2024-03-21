---
layout: post
title: 通过命令行从 Google Drive下载数据
tags:
  - Linux
  - Download
typora-root-url: 通过命令行从 Google Drive下载数据
categories:
  - 工程
mathjax: false
date: 2021-05-15 16:00:32
giscus_comments: true
---

本文介绍了通过`wget`和`curl`从Google Drive上下载文件的脚本。因为大量的数据集都存放在Google Drive上，而计算任务通常都是在计算服务器上，直接从Google Drive这类云盘下载到服务器上显然是最合适的方式。

<!-- more -->

## 分享链接

Google Drive的分享链接格式通常为：

```http
https://drive.google.com/file/d/<fileid>/view
```

其中这个`<fileid>`就是对应文件在服务器上的唯一标识符。

例如OfficeHome数据集在Google Drive上的链接即为：

```http
https://drive.google.com/file/d/0B81rNlvomiwed0V1YUxQdC1uOTg/view
```

其中的`<fileid>`为`0B81rNlvomiwed0V1YUxQdC1uOTg`，文件名可以自己取。

所以提取到的关键变量为：

```bash
filename='OfficeHomeDataset_10072016.zip'
fileid='0B81rNlvomiwed0V1YUxQdC1uOTg'
```

## wget 下载指令

针对小文件：

```bash
wget --no-check-certificate "https://drive.google.com/uc?export=download&id=$${fileid}" -O $${filename}
```

如果文件大的话，需要对cookie进行处理：

```bash
wget --load-cookies /tmp/cookies.txt "https://drive.google.com/uc?export=download&confirm=$$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://drive.google.com/uc?export=download&id=$${fileid}' -O- | sed -rn 's/.confirm=([0-9A-Za-z_]+)./\1\n/p')&id=$${fileid}" -O $${filename} && rm -rf /tmp/cookies.txt
```

整理成更方便的脚本示例为：

```sh
#!/bin/bash

# cd scratch place
cd data/

# Download zip dataset from Google Drive
filename='OfficeHomeDataset_10072016.zip'
fileid='0B81rNlvomiwed0V1YUxQdC1uOTg'
wget --load-cookies /tmp/cookies.txt "https://drive.google.com/uc?export=download&confirm=$$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://drive.google.com/uc?export=download&id=$${fileid}' -O- | sed -rn 's/.confirm=([0-9A-Za-z_]+)./\1\n/p')&id=$${fileid}" -O $${filename} && rm -rf /tmp/cookies.txt

# Unzip
unzip -q ${filename}
rm ${filename}
cd
```

## curl 下载指令

小文件 < 40MB：

```bash
curl -L -o $${filename} "https://drive.google.com/uc?export=download&id=$${fileid}"
```

大文件 > 40MB：

```bash
curl -c ./cookie -s -L "https://drive.google.com/uc?export=download&id=${fileid}" > /dev/null
curl -Lb ./cookie "https://drive.google.com/uc?export=download&confirm=`awk '/download/ {print $$NF}' ./cookie`&id=$${fileid}" -o ${filename}
rm ./cookie
```

整理成脚本：

```sh
#!/bin/bash

# cd scratch place
cd scratch/

# Download zip dataset from Google Drive
filename='OfficeHomeDataset_10072016.zip'
fileid='0B81rNlvomiwed0V1YUxQdC1uOTg'
curl -c ./cookie -s -L "https://drive.google.com/uc?export=download&id=${fileid}" > /dev/null
curl -Lb ./cookie "https://drive.google.com/uc?export=download&confirm=`awk '/download/ {print $$NF}' ./cookie`&id=$${fileid}" -o ${filename}
rm ./cookie

# Unzip
unzip -q ${filename}
rm ${filename}

# cd out
cd
```

但是如果连不上外网，那就需要一个梯子的选项，即`proxychains4`这个命令行代理工具，或者需要通过其他机器进行联网的中转可以参考[离线服务器通过PC中转连接公网](https://lccurious.github.io/2020/07/27/Local-Server-Proxy/)。

对于不能直接联网的机器运行脚本方式为：

```bash
proxychains4 sh download_google_drive.sh
```

## 参考资源

- <https://github.com/JinhangZhu/yolov3/blob/custom/data/get_coco2014.sh>
- <https://www.jinhang.work/tech/download-shared-files-using-wget-or-curl/>
