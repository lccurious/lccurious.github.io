---
layout: post
title: Word 排版技巧
typora-root-url: Word-Tricks
date: 2022-01-03 15:51:46
tags:
 - Word
 - 排版
giscus_comments: true
---



Word作为很多人每天都需要接触的工具，在2011年左右就已经引入了很多自动化的工具辅助我们完成日常的工作。除了大家熟悉的模板、引用、大纲、格式刷、图表、目录等内容，还包括自动图文集等更为便捷的工具。受到一位博主[^1]的启发，决定在他的基础上罗列自己常用的一些操作内容。本文中所使用的软件版本为Office 2019中的Word，同时类似的一些功能的在Mac版的Office 2019中也都是支持的，如果不能直接找到对应的按钮只要打开偏好设置搜索打开即可。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/give_me_an_equation.gif" title="来个公式" class="img-fluid rounded z-depth-1" caption="来个公式" %}
    </div>
</div>

<!-- more -->

## 开始设置

在进行开始设置前需要先从 **“文件”-“选项”** 把Word的 **“显示所有格式标记”** 打开：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

## 设置样式

从一份空的文档开始，一般的文章编排主要涉及的都是，“标题”，“多级列表”，例如要不要让每一集标题自动编号，要不要继承上一集标题的编号等。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-1.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

在一些文档格式要求中，标题的字体都和正文字体有明显不同，我的建议是让标题的设置和正文的格式相互独立。在修改标题样式时，设置标题的样式基准为”（无样式）”实现标题和正文的格式相互独立。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-2.png" title="例如这里就将样式基准设为（无样式），并且设定格式为4号黑体" class="img-fluid rounded z-depth-1" caption="例如这里就将样式基准设为（无样式），并且设定格式为4号黑体" %}
    </div>
</div>

例如这里就将样式基准设为（无样式），并且设定格式为4号黑体

如果还有一些额外要求的可以再打开格式选项对段落等内容进行修改。例如设置段落中它的段前为18磅，段后为0磅都可以使标题的分块效果更加鲜明。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-3.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

其他的标题格式可以根据各个不同的场景进行分别设置，按照内容编排需要分别设置号1~4级或者更多级标题样式即可。此外，还可以通过格式设置样式选择的快捷键：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-4.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

## 多级列表

在标题设置完成之后，如果需要增加标题上类似于“1.1”、“1.2.1”这类的序号等，可以通过多级列表进行设置。从开始菜单下选择多级列表，然后定义新的多级列表。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-5.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

然后在打开的设置窗口选择左下角的“更多”按钮，显示全部的设置内容：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-6.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

选择列表1，把文本的缩进位置改为0，把列表1链接到标题1的样式，可以看到预览框中一级标题之后就出现了标题1的字样作为占位符。对于编号的位置，在左下的文本缩进栏进行设置，点击“设置所有级别”还可以一次性设置所有子标题。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-7.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

此外编号之后还可以选择用什么符号作为编号的间隔，如果有特殊的要求，例如间隔一个汉字间距的场景中，可以选择不特别标注，并在左上一些的”输入编号的格式“栏中进行设置。

> “输入编号的格式”这个栏中，灰色的编号表示这是word自动计算得到的，可以在其左右自己添加一些文本进行自定义，这样每次自动生成的标题编号就都会包括此类自定义符号。
> 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-8.png" title="例如按照这类格式还可以为附录设置，更进一步还可以在字体栏中设置标题的字间距" class="img-fluid rounded z-depth-1" caption="例如按照这类格式还可以为附录设置，更进一步还可以在字体栏中设置标题的字间距" %}
    </div>
</div>

例如按照这类格式还可以为附录设置，更进一步还可以在字体栏中设置标题的字间距

按照相同的设置还可以设置二级、三级标题的编号等。

## 正文

所有其他题注、目录、页码、页眉页脚包括前面的标题等，默认都是继承自正文的样式的，所以这里先对正文进行设置。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-9.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

我们可以按照目标文档的格式需求去调整正文的字体、段落行间距等，但是首行缩进不要在这里设置，因为正文的样式会影响所有的其他默认以它为基础的样式。所以我们宁可在每段段首手动用tab键进行换行也不要在这里修改修改它的缩进从而影响所有可能没有考虑到的内容。

## 封面设置

尽量用无框线的表格实现所有说明文字在特定位置的排版规则。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-10.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

设置好格式把整个表格的框线全部设为不可见即可。

## 目录

在需要插入目录的地方，通过自定义目录实现目录的各类格式控制。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-11.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

然后在弹出界面对目录的具体格式进行修改，要进一步控制目录的生成格式，需要点击”修改“，在有些场景下目录的子级并不需要缩进等默认的配置也需要额外控制。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-12.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-13.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

除了缩进，段前段后的距离也需要根据目标文档的样式要求进行额外设置。生成之后的目录样式即为自定义的样式了。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-14.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

## 页码

选择“插入”-“页码”，一般常用的是居中的页码：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-15.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

不过因为设置了封面，所以页码也不会从封面开始计算。所以到“设计“视图下，对页脚进行一些格式设置。首先到封面页，选择页脚，页眉和页脚工具的设计中选择“首页不同”。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-16.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

然后到目录页结束的后一页选择，这一页的页码设置，然后在“设计”视图上，把“链接到前一条页眉”关掉。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-17.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

然后右键选中页码数字，点击“设置页码格式”让其实页码从1开始。最后回到目录，右键更新目录的页码。

## 图、表

插入图和表时，需要用“引用”-“题注”的插入方式进行内容的引入。如果对题注的字体、段落格式有额外要求的需要单独进行样式的配置。

当我们任意插入一张图片之后，通过插入题注的方式进行图片的说明，如果没有需要的标签就通过新建标签生成一个：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-18.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

如果需要包含章节编号形成“1-1”这类格式的话，点击右边“编号”按钮：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-19.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

用连字符实现章节编号的纳入，如果题注和图片有特别的格式要求的，我们可以设置好全部的样式以后用“自动图文集”这个工具实现。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-20.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

选中图和题注的内容以后，通过“插入”-“文档部件”把当前的内容加入到自动图文集中去：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-21.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

在弹出的选项框中给这段内容起一个自己习惯的名字即可：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-22.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

自动图文集就像一种宏，把用户生成这个这个块的操作步骤都记录下来，然后用户在文档的空白处输入一小段名字就可以自动实现这类模块内容的插入：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-23.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

敲下回车键以后，我们的图片就按照指定格式生成了：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-24.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

可以看到，这里的编号也因为前一张图片的存在，自动递增了。然后用户就可以通过word的图片替换对图片进行替换，再进行图注的修改等。

表格的插入也可以用同样的形式进行。

## 公式的编码

公式的插入也可以实现和图片、表格题注一样的编码体系，但是还需要无框线表格的辅助。插入一个三列的表格，调整间距，使得中间的表格居中，右边的表格选择靠右居中。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-25.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

进行公式插入的时候，既可以选择自己手动输入，也可以借助[Mathpix Snipping Tool](https://mathpix.com/)直接插入符合Word格式的公式。尽管Word的公式使用MathML语言进行编码，但是又在标准的格式上有一些调整，因此Mathpix工具也据此进行调整，所以到写这篇文章为止，它还是最好的解决方案。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-26.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

然后把复制的内容拷贝到中间的框中，然后插入题注，再把题注剪切到右边的框中：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-27.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

此外，这个编号也是可以设置字体格式的。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-28.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>

最后一步去掉框线，然后以和图片插入部分同样的方式选中它加入到自动图文集中，之后每次只需要用关键词导入内容再对中间的公式进行替换即可。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2022-01-03-Word-Tricks/Untitled-29.png" title="Untitled" class="img-fluid rounded z-depth-1" caption="Untitled" %}
    </div>
</div>


---

[^1]: https://zhuanlan.zhihu.com/p/22737822
