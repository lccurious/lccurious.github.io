---
layout: post
title: 搜索技巧
date: 2022-01-19 22:09:39
categories:
 - 工具
tags:
 - 搜索引擎
 - 搜索技巧
 - 效率
giscus_comments: true
---


<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-19-Search-Skills/title.png" title="title" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<!-- more -->

# 善用关键词规则

## 通用关键词规则[^1]

1. 通过双引号要求搜索结果必须包含双引号中的内容，例如：`optimal transport lccurious`，要求搜索引擎必须按照双引号中的短语顺序检索结果；
2. 使用减号排除包含减号后的搜索结果，例如：`transformer -csdn`，就可以排除掉搜索结果中所有与csdn相关的条目了；
3. 使用`site`关键词让返回的条目只包括在某个指定站点的内容，例如：`latex site:github.io`，让返回条目中只包含在“github.io”站点下的内容；
4. 使用`link`关键词让返回的条目内容中都包含链接了指定的网站，例如：`link:github.com`，过滤掉那些不包含“github.com”这个链接的条目，需要注意的是只要网页源代码里有指向该链接的条目都会被视为符合规则（即使页面上肉眼不可见）；
5. 通配符检索用`*`充当一个占位符，过滤出仅`*`位置位置不同的组合内容搜索结果，例如`"The most genius * in the world”`，就可以过滤出所有世界上最天才的xxx的搜索结果；
6. 近似含义说明符号`~` ，例如：`happy ~dog`；
7. 使用`related`关键词搜索所有内容相关或者类似的网站，例如：`related:dribbble.com`就可以直接搜索到与这个素材网站相似的其他网站；
8. 计算一些简单的数学内容，例如：`exp(10)+sin(10)`；
9. 快速换算单位，例如：`100日元=?人民币`；
10. 使用`define`关键词搜索定义，例如：`define:normal` 、`define:沁园春`；
11. 使用`AND`、`OR`等进行组合搜索，Google搜索默认情况下都是使用AND逻辑，即所有关键词都命中的结果才会被返回，但是也可以手动改用OR的逻辑，例如：`transfer learning OR domain adaptation`；
12. 搜索包括指定数字范围内的内容，例如：`causal discovery 2020..2022`就会大概返回2020年到2022年之间的文章；
13. 使用`filetype`关键词，例如：`cpi ppi 差 filetype:pdf`基本上返回的都是与CPI、PPI指数相关的研报PDF文件等；
14. 使用`inurl`关键字，例如：`inurl:mp4 “瑞克和莫蒂”`，在所有返回结果中，网页链接中包含第一个关键字`mp3`，第二个关键字`瑞克和莫蒂`出现在链接中或网页文档中；
15. 使用`allinurl`关键字，例如：`allinurl:”cgi-bin” phf +com`，让返回的网页链接中包含所有关键字；
16. 使用`intitle`、`allintitle` 关键字对标题栏（即网页标签页名字）进行搜索，例如：`intitle:😧` 就可以搜索所有标签页带这个表情的页面了；
17. 同理还存在`inanchor`、`allinanchor` 这类关键字；
18. 使用`cache` 关键词可以在Google的缓存页面上进行查询；

## Google学术搜索

1. 使用 `author` 关键词限定作者如`author:"Kun Zhang" AND intitle:"Causal"` ；
2. 使用 `source`关键词指定来源，与`site`类似，有时`site`范围太广，使用`source`更精确。 如`"kernel method" source:"Advances in Neural Information Processing"`，搜索`nips`包含`kernel method`全部论文；
3. 使用 `intext`关键词，例如：`intext:("kernel method" -"semi-supervised learning")`，搜索内容中包含`kernel mehtod`且不包含`semi-supervised learning`的论文；
4. 对于某网址对应多个期刊的情况，使用`source`而不是`site`进行界定。如TPAMI对应网址`ieee.org`有很多期刊，而其对应来源为`IEEE Transactions on Pattern Analysis and Machine Intelligence`；

下面是一些常用的机器学习相关的源[^3]:

机器学习领域顶会网址(site)

| 刊物缩写 | 	网址site |
|:---:|:---:|
| nips | 	nips.cc |
| icml | 	icml.cc |
| jmlr | 	jmlr.org |
| ijcai | 	ijcai.org |
| aaai | 	aaai.org |
| uai | 	uai.org |
| ML汇刊 | 	proceedings.mlr.press |
| Springer下刊物 | 	link.springer.com |
| IEEE下刊物 | 	ieeexplore.ieee.org |

机器学习领域顶会来源(source)

| 刊物缩写 | 	刊物source |
| :---: | :---:|
| AI | 	Artificial Intelligence |
| TPAMI | 	IEEE Transactions on Pattern Analysis and Machine Intelligence |
| JMLR | 	Journal of Machine Learning Research |
| TNNLS | 	IEEE Transactions on Neural Networks and learning systems |
| Cybernetics | 	IEEE Transactions on Cybernetics |
| NIPS | 	Advances in Neural Information Processing Systems |
| ICML | 	International Conference on Machine Learning |
| IJCAI | 	International Joint Conference on Artificial Intelligence |
| AAAI | 	AAAI Conference on Artificial Intelligence |
| COLT | 	Annual Conference on Computational Learning Theory |
| UAI | 	Conference on Uncertainty in Artificial Intelligence |

## 一些语义上的搜索技巧

1. 尽量使用简洁的关键词，因为描述内容越详细满足要求的搜索结果就会越少就越不容易找到对应的内容；
2. 逐步增加关键词，根据搜索结果调整增加的关键词；
3. 使用一些主动语态的词，例如“如何减轻头痛”改为“缓解 头痛”；
4. 同时搜索近义词，比如`高等教育`，`学院`；

还可以在日常的使用过程中，根据自己的经验积累一些有好资源的网站，之后一些专业性较强的问题的可以优先在那些网站上搜索。


# 其他引擎

## 常用数据源[^2]

1. 最简单直接的方法就是利用[搜索技巧](http://saili.science/information-search/#search-tips)进行**谷歌搜索**（[谷歌访问配置](https://sli1989.github.io/windows-use/#google)）。
2. 善用垂直类引擎：第一，它的信息源更专业更权威。第二，它可以更快更方便地找到你想要的东西。
    - [国家数据](http://data.stats.gov.cn/)
    - [中国统计信息网](http://www.tjcn.org/)
3. 自行使用 “网盘搜索器”，推荐资源：
    - [盘多多](http://www.panduoduo.top/)，[盘多多](http://www.panduoduo.online/)
    - [盘搜](http://www.pansou.com/)
    - [fastsoso](https://www.fastsoso.cn/)
    - [如风搜](http://www.rufengso.net/)

## 书籍下载

- [Library Genesis](http://libgen.rs/)
- 英文文献：推荐 [CROSSREF 数据库](https://search.crossref.org/)），最后使用 Sci-Hub 数据库下载。
    - [Sci-Hub 可用网址 1](http://tool.yovisun.com/scihub/)，[可用网址 2](https://www.keyanguanjia.com/thread-511-1-1.html)。或者使用 Sci-Hub 桌面客户端：[SciHub Desktop](https://zhuanlan.zhihu.com/p/31809890)，[Sci-Hub EVA](https://github.com/leovan/SciHubEVA) 。（[四款桌面客户端软件性能评测](https://zhuanlan.zhihu.com/p/37471780)）
- [ScienceHuβ](https://scihub.org/search/)，[The National Academies Press](https://www.nap.edu/)，[Open Access Theses and Dissertations](https://oatd.org/)
- **英文书籍搜索推荐引擎**：[Jiumo E-Book Search 鸠摩搜书](https://www.jiumodiary.com/)，[Library Genesis](http://gen.lib.rus.ec/)，[BookFi](http://bookfi.net/)，[Electronic library](http://b-ok.xyz/)，[booksc.org](http://booksc.org/)，[AvaxHome](https://avxhm.is/)，[ebookhunter](http://ebookhunter.ch/)，[bookrix](https://www.bookrix.de/)，[Free ebooks - Project Gutenberg](http://www.gutenberg.org/)，[FreeBookSpot](http://www.freebookspot.es/) ，[hathitrust](https://www.hathitrust.org/)，[PDF Drive](https://www.pdfdrive.com/)，[PDF search engine](https://pdf-downloads.net/)
- **中文书籍搜索推荐引擎**
    - [Jiumo E-Book Search 鸠摩搜书](https://www.jiumodiary.com/)
    - 全国图书馆参考咨询联盟 ：推荐使用 ISBN 检索，通过脚本[一键获取图书](https://greasyfork.org/zh-CN/scripts/388744)进行购买，
    - 需要图书馆权限：[读秀学术搜索](http://www.duxiu.com/login.jsp)，[超星汇雅电子图书数据库](http://edu.sslibrary.com/)
    - [中文 PDF 搜索引擎](http://www.sopdf.com/zh-hans/)
- [IDEAS](https://ideas.repec.org/) the largest bibliographic database dedicated to Economics and available freely on the Internet. Based on RePEc, it indexes over 2,400,000 items of research, including over 2,200,000 that can be downloaded in full text.
- 电子书：[Free eBook PDF EPUB Download](http://www.nwcbooks.com/)，[电子书免费下载](http://www.lingocn.com/)，[SoBooks（原 "SoKindle"）](https://sobooks.cc/)，[电子书网站汇总](http://oxingtui.com/other/resource.htm)

# 扩展技巧

## 从谷歌搜获更多

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-19-Search-Skills/Untitled.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

## Hacking Google search

[Offensive Security's Exploit Database Archive](https://www.exploit-db.com/google-hacking-database)

[Google Hacking for Penetration Testers](https://ephrain.net/wp-content/uploads/2016/08/BH_EU_05-Long-1.pdf)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-19-Search-Skills/Untitled1.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-19-Search-Skills/Untitled2.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-19-Search-Skills/Untitled3.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-19-Search-Skills/Untitled4.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>


---

[^1]: [18个高效使用Google搜索的技巧](http://blog.nice123.plus/2019/03/23/18%E4%B8%AA%E9%AB%98%E6%95%88%E4%BD%BF%E7%94%A8Google%E6%90%9C%E7%B4%A2%E7%9A%84%E6%8A%80%E5%B7%A7/)

[^2]: [搜索引擎常用技巧](https://jeanleem6.github.io/2018/01/31/search-engine-skills/)

[^3]: [学术搜索技巧](http://zhuqiannan.com/posts/2018/12/scholar-search-tricks/)
