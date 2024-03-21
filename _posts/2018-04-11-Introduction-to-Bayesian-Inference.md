---
layout: post
title: Introduction to Bayesian Inference
categories:
  - 机器学习
tags:
  - 贝叶斯推断
  - 贝叶斯
  - Bayesian Inference
date: 2018-04-11 21:00:20
giscus_comments: true
---

贝叶斯推断是机器学习中常用的一种算法，在很多种情况下可以和其他数据处理技术搭配在一起。它可以处理很多种随机变量，像是参数回归、人口统计、商业KPI或者是演讲中的文字片段等。通常而言，贝叶斯推断是根据已有的数据频率分布对未知的目标进行推断，但是人们通常会用另一种方式来表述概率，像是先验和后验概率。

<!-- more -->

## 概念

最基本的贝叶斯公式：

$$
P(A\mid B) = \frac{P(A)P(B\mid A)}{P(B)}
$$

其中A是一个事件发生的概率，而B就像是一些什么数据或者证据可以支撑A的发生。把$$P(A\mid B)$$说成是在B发生的情况下A发生的概率。

所以推广到一般情况，假设$$\{A_i\}$$是事件集合里的一部分，对于任意的$$A_i$$，贝叶斯定理可以写成：

$$
P(A_{i}\mid B) = \frac{P(B\mid A_{i})P(A_{i})}{\sum_{i}P(B\mid A_{i})P(A_{i})}
$$

贝叶斯是描述某件事会不会出现的不确定性，这种不确定性则是通过已有的数据作为证据，这种事件我们则称为随机事件。随机事件的先验分布反映了我们在看到任何数据之前的信心[^1]，后验概率则是考虑得到的相关证据和给定数据之后所得到的条件概率，后验概率分布也是一个随机变量，是基于试验和调查之后得到的概率分布[^2]，也就是后验概率是受到数据分布和获得证据的影响的。

## 例子

**例子描述：** 假如我们要评估一个广告是不是有效的，我们可以根据点击这个广告的人数占看过这个广告的人数的比例来进行推测下一个看的人点击这个广告的概率。这个概率就是我们的一个参数，设为$$\theta$$值域为$$[0, 1]$$，最传统的做法就是枚举这个参数值，然后看看哪个值和我们得到的数据最接近。

$$\mathop{\arg\max}_{\theta}P(X\mid \theta)$$，其中的$$X$$就是我们观测到的数据。

这样我们可以得到似然函数[^3]$$P(X\mid \theta)$$，并且很容易推断出这个值就是我们得到的历史数据中的点击比例，但是这是根据历史经验的，也许真实的值和这个差了很多呢，在你拿到的这部分数据之后人们就都不点开广告看了呢，这也是有可能的，所以为了估计得更准确一些我们再参考一些别的广告被点击的频率，这样能让我们得到的结论也更具有一般性。

### 先验概率分布

在我们正式开始计算之前，我们认为这个$$\theta$$值更有可能会偏向某一个值或范围，而这种估计通常是来自下面几种：

- Informative; empirical: We have some data from related experiments and choose to leverage that data to inform our prior beliefs. Our prior beliefs will impact our final assessment.
- Informative; non-empirical: We have some inherent reason to prefer certain values over others. For instance, if we want to regularize a regression to prevent overfitting, we might set the prior distribution of our coefficients to have decreasing probability as we move away from 0. Our prior beliefs will impact our final assessment.
- Informative; domain-knowledge: Though we do not have supporting data, we know as domain experts that certain facts are more true than others. Our prior beliefs will impact our final assessment.
- Non-informative: Our prior beliefs will have little to no effect on our final assessment. We want the data to speak for itself.

为了对$$\theta$$进行估计，我们假定这个值是符合beta分布的（这种假设就是一种先验信息，以点击率作为估计目标，还是和beta分布比较吻合的），通常我们知道正态分布、二项分布、均匀分布等但是这个beta分布讲的比较少了。简单的说就是当你不知道一个东西的具体概率是多少时，它可以给出所有概率出现的可能性大小。beta分布由两个参数决定$$(\alpha, \beta)$$：

$$
f(x;\alpha ,\beta) = \frac{x^{\alpha -1} (1-x)^{\beta-1}}{\int_{0}^1 \mu^{\alpha-1} (1-\mu)^{\beta-1} d \mu}
$$

我们通过历史的点击数据来对这个分布进行拟合从而得到对应的$$\alpha$$、$$\beta$$的估计值。

所以再回到我们的贝叶斯公式来推算所需的$$\theta$$：

$$
P(\theta\mid X)=\frac{P(\theta)P(X\mid \theta)}{P(X)}
$$

其中$$P(X)$$是一个固定值，这个值不是由$$\theta$$决定的，我们可以把后验概率表示成：

$$
Posterior=\frac{Prior \cdot Evidence}{Constant}
$$

### 后验概率推断

根据定义，后验概率的计算形式为：

$$
P(\theta\mid X)=\frac{P(\theta)P(X\mid \theta)}{P(X)}
$$

其中的分母$$P(X)$$是在所有合法的$$\theta$$下观察到数据的概率，为了找到全部合法的概率总值，写成数学形式就是：

$$
\int P(\theta)P(X\mid \theta)d\theta
$$

但是，实际问题上并不能真的通过这种公式来求得概率和，也就是说，这个公式是没有解析解的[^4]。所以为了求得这个值我们要换一种方式，用马尔科夫链蒙特卡罗过程（Markov Chain Monte Carlo，MCMC）对这个值进行逼近，这种方法是通过模仿那种未知分布的数据生成大量样例。先从一个具体的值开始，然后“提出”另一个值，同时也会拒绝一些不太靠谱的生成值，然后采用新生成的值，再估计得出下一步的模拟生成样例。

## 贝氏陷阱

在很多时候，我们在已有的经验上通过观测进一步地修正和使答案更加精确，终于是我们更加了解这个事物。如果说，你以为你通过先验证据做出了大致正确的估计，可是也许这种估计就是错的，然后随着观测一步一步走向更深的谬误中去。就像马克吐温说的：“让我们陷入困境的不是无知，而是信以为真的谬误“。

所以，你应该给各种事情都留一些概率，这样可以避免盲目地消去可能性，而正态分布，它即可以把我们的猜测集中在某个范围内，无限远处的概率虽然小，却也不为零，所以是很好的先验模型，对于任何分布，至少不会丢失某些信息。

---

[^1]: <https://en.wikipedia.org/wiki/Prior_probability>
[^2]: <https://en.wikipedia.org/wiki/Posterior_probability>
[^3]: 似然性是用于在已知某些观测所得到的结果时，对有关食物的性质进行估计，就像是条件概率的逆反，从我们根据什么条件得出某些事件发生概率到根据某些事件的频率推断出背后的证据来。参见：<https://en.wikipedia.org/wiki/Likelihood_function>
[^4]: 就是一些严格的公式,给出任意的自变量就可以求出其因变量,也就是问题的解。他人可以利用这些公式计算各自的问题。所谓的解析解是一种包含：分式、三角函数、指数、对数甚至无限级数等基本函数的解的形式。用来求得解析解的方法称为解析法〈analytic techniques、analytic methods〉，解析法即是常见的微积分技巧，例如分离变量法等。解析解为一封闭形式〈closed-form〉的函数，因此对任一独立变量，我们皆可将其带入解析函数求得正确的相依变量。因此，解析解也被称为闭式解（closed-form solution）。
