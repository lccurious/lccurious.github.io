---
layout: post
title: Gradient Boosting
date: 2018-01-18 14:29:07
categories:
  - 机器学习
tags:
  - Boosting
  - Ensemble
  - Gradient
  - Bagging
giscus_comments: true
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-01-18-Gradient-Boosting/bb1-1150x317.png" title="title:difference between Bagging and Boosting" class="img-fluid rounded z-depth-1" caption="title:difference between Bagging and Boosting" %}
    </div>
</div>

集成学习(Ensemble Learning)通过构建并结合多个学习器来完成学习任务，有时候也被称为多分类器系统(multi-classifier system)，基于委员会的学习(committee-based learning)等。渐进梯度集成方法(Gradient Boosting)有很多优点，基于这种方法又有很多变种[^1]。

<!-- more -->

集成学习是通过很多个个体学习器（比如某种神经网络，某种决策树等）组合而成，假设其中一个学习器的错误率为$$\epsilon$$的，并且每个个体学习器都是相互独立的。对于一个以得票超过半数为最终结果的集成规则，它的最终错误率就比较低了。

\begin{equation}
\begin{split}
P\_{error} &= \sum^{\lfloor T/2 \rfloor}\_{k=0}{T \choose k} (1-\epsilon)^{k} \epsilon^{T-k} \\\\ & \leq exp(-\frac{1}{2}T(1-2\epsilon)^{2})
\end{split}
\end{equation}

这是一个指数级降低的错误率，但是其中一个前提是很难被满足的，就是对于学习器都是相互独立的这个要求。

根据学习器的输入输出方式，有些集成学习中的学习器是相互依赖的，一个的输入依赖另一个输出，以Boosting为代表。有些集成学习中的学习器不存在这种强依赖，可以并行运行的，以Bagging和“随机森林”（Random Forest）为代表。

# Ensemble，Bagging and Boosting

我们用机器学习算法来预测目标值时造成预测值和真实值不同的主要原因是噪声，数据变异和偏重。[^3]所以集成方法(Ensemble)就是为了克服这类问题而出现的。

- **Bagging**是简单地将多种相互独立的预测器/模型/学习器用一些模型平均的方法集成。这些方法包括加权平均，取得分最高的学习器的结果等。

因为在进行训练的时候每次都是对数据集进行随机抽样，所以每个模型

---

[^1]: 周志华. 机器学习[M]. Qing hua da xue chu ban she，2016.
[^3]: <https://medium.com/mlreview/gradient-boosting-from-scratch-1e317ae4587d>
