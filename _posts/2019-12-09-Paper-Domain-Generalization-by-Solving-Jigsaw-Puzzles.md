---
layout: post
title: Paper | Domain Generalization by Solving Jigsaw Puzzles
categories:
  - 文献
tags:
  - 迁移学习
date: 2019-12-09 21:41:27
giscus_comments: true
---

人类对于认知有很好的适应性，是源于人对于有监督和无监督的知识融合，举一反三的能力，也就是人们对于知识空白的填补能力。因为监督学习不可能面面俱到，所以自主学习能对于任务有帮助的不变性和规律性。基于这些文章设计了一个实验让机器学会自动拼这些被打散了的零部件，从而通过这种次级任务实现对于其内部特征的捕捉。

<!-- more -->

## 拼图任务

如下图所显示的那样，把原始的图像分成 $$3\times 3$$ 的 9 块，然后随机打散，拼图任务就是将这些被打散的图像拼回去，在模型学会将碎片拼回原图的以后也就掌握了图像的内部特征和规律。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-12-09-Paper-Domain-Generalization-by-Solving-Jigsaw-Puzzles/main.png" title="main" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

在实际操作中，给每一个分块一个独立的编号比如从 1 编号到 9，然后用最大海明距离来衡量拼图的完成程度。在模型训练阶段，原图和打散的拼图都会输入网络用于训练。分别给出拼图准确性的 Loss 和分类准确性的 Loss。

在域泛化的分类任务中，如果有 $$S$$ 个域，每个域都有对应的样本那么将原始数据集写成 $$\{(x^{i}_{j}, y^{i}_{j})\}^{N_i}_{j=1}$$。则基础的目标就是实现在各个域都能准确地估计图像样本的标签，$$\mathcal{L}_{c}(h(x\vert \theta_{f},\theta_{c}), y)$$ 用于衡量分类的损失，其中 $$\theta_{f}$$ 表示嵌入特征的参数，$$\theta_{c}$$ 表示分类器中的参数，这些参数也就是指的是深度网络中的各种参数，这些组成模型中第一个网络的功能。

第二个任务就是将原图像分解成 $$n\times n$$ 个网格，由第二个网络对这个问题进行求解，而且对于这种 $$n^2$$ 的阶乘等级的求解任务，除了学习图像内部的结构以外第二个网络别无他法。通过设置针对图像块在原图中摆放顺序的第二个分类任务，$$\{(z^{i}_{k},p^{i}_{k})\}^{K_{i}}_{k=1}$$，其中 $$z^{i}_{k}$$ 表示重新组合成的图像（也就是把原图切块后再胡乱拼起来的一副图像），$$p^{i}_{k}$$ 表示胡乱拼凑的图像对应的标签（每种胡乱拼凑都有一个自己的标签[^1]）。那么就可以将这个分类任务写作 $$\mathcal{L}_{p}(h(z\vert \theta_{f}, \theta_{p}), p)$$，其中 $$\theta_{f}$$ 是在两个分类任务中共享的，用于编码图像特征，$$\theta_{p}$$ 在这里用于表示它在图像上的排列组合类别，因为用的并不是 $$n^2$$ 的阶乘种排列组合，而只是其中的一个子集 $$P$$。

模型的全部优化目标就写作：

\begin{equation}
\text{argmin}\_{\theta\_{f}, \theta\_{c}, \theta\_{p}}\sum^{S}\_{i=1}\sum^{N\_{i}}\_{j=1}\mathcal{L}\_{c}(h(x^{i}\_{j}|\theta\_{f}, \theta\_{c}), y^{i}\_{j}) + \sum^{K\_{i}}\_{k=1}\alpha\mathcal{L}\_{p}(h(z^{i}\_{k}|\theta\_{f},\theta\_{p}), p^{i}\_{k})
\end{equation}
这里的分类任务都是用交叉熵实现，而且也很容易用无监督的方式来发现图像的内部特征，在目标域进行训练时就直接最小化排列组合分类问题就可以了。另外这种打乱的图像并不会影响对它的类别预测损失，因为这种打乱图像更难分类。

在目标域上进行无监督训练的时候，一方面要让模型对于自己的分类变得更加确定，
\begin{equation}
\mathcal{L}\_{E}(x^{t})=\sum\_{y\in \mathcal{Y}}h(x^{t}|\theta\_{f},\theta\_{c})\log \{h(x^{t}|\theta\_{f}, \theta\_{c})\}
\end{equation}
一方面也要让模型能够对打乱的图像进行良好的重建，也就有
\begin{equation}
\mathcal{L}\_{p}(h(z^{t}|\theta\_{f}, \theta\_{p}), p^{t}).
\end{equation}

## 具体实现

> **我自己**
>
> 真正的实现过程往往能暴露出一些问题，越是新的想法越要考量它的真正实现方式。

文章把图像分成 $$3\times 3$$ 块，然后相对于使用 $$9$$ 的阶乘种排列组合，只取了其中的 30 种。用 $$\beta = 0.6$$ 来表示有 $$60\%$$ 的图像是没有被打乱的，有 $$40\%$$ 的图像是打乱了的，它们都会被送入相同的两个网络进行训练。

拼图识别网络也是通过替换原始网络的最后几层，然后接上拼图任务的最后一层模块组成拼图识别模块。

在几个稍大的数据集上做了在多源域上训练的实验：

- PACS
- VLCS
- Office-Home

在手写数字和街道号码牌数据集上做了单源域泛化的实验，用的输入图像都是有三个通道的的 $$32\times 32$$。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-12-09-Paper-Domain-Generalization-by-Solving-Jigsaw-Puzzles/result2.png" title="result2" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
在实验结果中说明这种基于拼图的学习还是有点效果的，但是排列也不能搞得太复杂了，那样反而会因为学不好排列而走火入魔。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-12-09-Paper-Domain-Generalization-by-Solving-Jigsaw-Puzzles/result3.png" title="result3" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
在单元域上适配的效果。

## 总结

这篇文章其实从提出无监督知识发现的角度辅助了网络对于一些关键信息的把握，是一种很好的新思路，而且实现起来也相对简单。但是有一点疑问，图像的排列其实可以仅仅通过边缘信息进行拼接，而这种可行方式会不会误导特征捕捉？

---

[^1]: 其实我觉得之所以这么做而不直接预测某个块在原图中的排列位置应该是由于直接把某种排列组合映射成一个类别更容易训练。
