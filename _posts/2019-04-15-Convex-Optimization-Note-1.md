---
layout: post
title: Convex Optimization Note 1 | Introduction
categories:
  - 机器学习
tags:
  - 凸优化
date: 2019-04-15 23:39:45
giscus_comments: true
---


凸优化，或叫做凸最优化，凸最小化，是数学最优化的一个子领域，研究定义于凸集中的凸函数最小化的问题。凸优化在某种意义上说较一般情形的数学最优化问题要简单，譬如在凸优化中局部最优值必定是全局最优值。凸函数的凸性使得凸分析中的有力工具在最优化问题中得以应用，如次导数等。凸优化应用于很多学科领域，诸如自动控制系统，信号处理，通讯和网络，电子电路设计，数据分析和建模，统计学（最优化设计），以及金融。在近来运算能力提高和最优化理论发展的背景下，一般的凸优化已经接近简单的线性规划一样直捷易行。许多最优化问题都可以转化成凸优化（凸最小化）问题，例如求凹函数 $$f$$ 最大值的问题就等同于求凸函数 $$-f$$ 最小值的问题。[^1]下面的这些理论证明等主要来自于NESTEROV的书[^2]。

<!-- more -->

## 凸优化和机器学习

假设我们有两个空间，样本空间 $$\mathcal{X}$$，标签空间 $$\mathcal{Y}$$，还有一个参数空间 $$\mathcal{H}$$ 包括了从样本到标签的映射，引入它们之间的Loss Function $$L:\mathcal{Y}\times\mathcal{Y} \rightarrow \mathbb{R}$$，如果已经知道这些样本和标签 $$\mathcal{X}\times\mathcal{Y}$$ 的分布 $$P$$，

### 经验风险最小

$$
\mathcal{L}_{P}=\mathbb{E}_{P} [L(h(x), y)].
$$

学习的目标就是求解一个最优化问题：

$$
\min_{h\in \mathcal{H}}\mathcal{L}_{P}(h).
$$

常规的做法就是使得经验风险最小，也就是把训练样本全部跑一遍，然后使得通过我们的误差函数累计计算出来的值最小。

$$
\min_{h\in \mathcal{H}}\sum^{n}_{i=1}L(h(x_i), y_{i})=\min_{\theta}\sum^{n}_{i=1}L(h_{\theta}(x_{i}),y_{i}).
$$

当标签是离散值的时候看作是**分类任务**，当标签是连续值的时候看作是**回归任务**。

一般情况下，求解这种任务是 NP 难的问题，所以引入另一种替代的办法，用Hinge Loss表示$$[0, 1]$$误差，这样也就使得其有了梯度，而且这种代价函数和原来的代价函数是等价的。引入松弛变量构造一个带约束的最优化函数。

$$
\min_{\omega}\sum^{n}_{i=1}\zeta_{i}
$$

$$
s.t.\quad \begin{array}{l} y_{i}(x_{i}^{T}w+b) + \zeta_{i} \geq 1, \\ \zeta_{i} \geq 0, \\ \|w\|^2_{2} \leq \Lambda \end{array}
$$

最后一项$$\| w\|^2_{2} \leq \Lambda$$ 是用于约束回归参数的复杂度，用于防止过拟合。一般用拉格朗日乘子法可以对原来约束条件下的方程进行改写得到：

$$
\min_{\omega}\sum^{n}_{i=1}\zeta_{i} + \|w\|^2_{2} - \lambda \Lambda
$$

$$
s.t.\quad \begin{array}{l} y_{i}(x_{i}^{T}w+b) + \zeta_{i} \geq 1, \\ \zeta_{i} \geq 0. \end{array}
$$

还有几种常用的损失函数：

1. Square loss: $$\Phi_{s}(y,y')=(1-yy')^2.$$
1. Logistic loss: $$\Phi_{l}(y,y')=\frac{1}{ln2}ln(1-e^{-yy'}).$$
1. Cross entropy loss: $$\Phi_{c}(y,y')=-tln(y')-(1-t)ln(1-y').$$ 其中 $$t=(1+y)/2.$$

### 极大似然视角下

极大似然估计法下，一个似然函数$$P(X,Y\vert \theta)$$的估计可以通过下面的公式得到。

\begin{equation}
\begin{array}{rl} 
\theta\_{MLE} & = \text{argmin}\_{\theta}P(X,Y|\theta) = \text{argmax}\_{\theta}\log P(X, Y|\theta) \\\\\\
& = \text{argmax}\_{\theta}\log \prod\_{i}P(x\_i, y\_i|\theta) \\\\\\
& = \text{argmax}\_{\theta}\sum^{n}\_{i=1}\log P(x\_{i}, y\_{i}|\theta)
\end{array}
\end{equation}

### 极大后验视角下

如果将其中的极大似然估计替换成极大后验估计，可以改写成下面这样的形式。

\begin{equation}
\begin{array}{rl} 
\theta\_{MAP} & = \text{argmax}\_{\theta}P(X, Y|\theta) P(\theta) =\text{argmax}\_{\theta} \log\\{ P(\theta)P(X,Y|\theta) \\} \\\\\\
&=\text{argmax}\_{\theta}\log \\{ P(\theta)\prod\_{i}P(x\_{i}, y\_{i}|\theta) \\} \\\\\\
&=\text{argmax}\_{\theta} \\{ \log P(\theta) + \sum^{n}\_{i=1}P(x\_{i}, y\_{i}|\theta) \\}
\end{array}
\end{equation}

## 问题泛化

令$$x$$ 是一个$$n$$ 维实向量：

$$
x=(x^{(1)},\dots, x^{(n)} )^{T} \in \mathbb{R}^{n},
$$

$$S$$ 是 $$\mathbb{R}^{n}$$ 一个子集，且$$f_{0}(x),\dots,f_{m}(x)$$ 是$$x$$ 的一些实值函数，一般的约束问题都写成下面的形式：

$$\min f_{0}(x)$$

$$
s.t. \begin{array}{l} f_{j}(x) \leq 0, j=1,\dots m,\\
x\in S. \end{array}
$$

以上的 $$f_{0}(x)$$ 是我们的目标（objective）函数，而考虑最小化问题只是一种分析习惯，其他形式的优化也可以改写成这种形式，向量函数

$$
f(x)=(f_{1}(x),\dots, f_{m}(x))^{T}
$$

称为*函数约束*（functional constraints）向量，集合$$S$$ 称为*基本可行集*（basic feasible set），并且集合

$$
Q=\{x\in S|f_{j}(x) \leq 0, j=1\dots m\}
$$

称为问题的可行集（basic set）。如果$$Q\neq \emptyset$$ 则说明这是一个可行的问题，如果存在$$x\in \int Q$$，对于所有不等式约束都满足 $$f_{j}(x)<0$$ 则称为严格可行的（strictly feasible）。

### 问题的自然分类

- 有约束问题（constrained problems）：$$Q\subset\mathbb{R}^{n}$$。
- 无约束问题（unconstrained problems）：$$Q\equiv \mathbb{R}^{n}$$。
- 光滑问题（smooth problems）：所有的$$f_{i}(x)$$ 是可微的。
- 非光滑问题（nonsmooth problems）：存在不可微的分量$$f_{k}(k)$$。

对于线性约束问题（linearly constrained problems）：所有泛函数约束都是线性的。线性约束问题可以继续分为：

- 线性优化问题：如果 $$f_{0}(x)$$ 也是线性的，那么这个最小化问题就是一个线性优化问题。
- 二次优化问题：如果 $$f_{0}(x)$$ 是二次的，那么这就是一个二次优化问题
- 二次约束的二次问题：如果所有的 $$f_{j}$$ 是二次的，那么这就是一个二次约束的二次问题（quadratically constrained quadratic problem）。

### 解的定义

这种最优化问题中一般会存在多种解：

- $$x^{*}$$ 是全局解（global solution），如果对于所有的 $$x\in Q$$， 有
    $$
    f_{0}(x^{*}) \leq f_{0}(x).
    $$
    在这种情况下，$$f_{0}(x^{*})$$ 称为问题的（全局）最优值（optimal value）。
- $$x^{*}$$ 如果只是在一个局部$$x\in NBR(x^{*}, \delta)\cap Q$$，有
    $$
    f_{0}(x^{*}) \leq f_{0}(x).
    $$
    则称之为局部解。

非线性优化式非常重要和有前途的应用理论。它覆盖了几乎所有的运筹学和数值分析的需求（包括现在大量的机器学习内容）虽然总体上看，优化问题是无解的。

## 数值方法的性能

特定的问题因为它本身可能存在个各种特别的性质，某些方法可以有非常独特的求解性能。所以要对一类问题（$$\mathcal{P}\in \mathcal{F}$$）来讨论某些方法的性能，在这类问题中都存在相似的特点，而某种数值方法会对这些方法都有一定的性能。

> 因此，一个方法 $$\mathcal{M}$$ 在整个类 $$\mathcal{F}$$ 上的性能（performance）是它的效率的一个自然特性。

### 符号约定

- 模型：问题 $$\mathcal{P}$$ 的一个已知（known）的“部分”，称为问题的模型 （model）。我们用 $$\Sigma$$ 来表示模型。通常，模型包含了问题形式，泛函分量的类型描述，等等。
- Oracle：为了识别问题 $$\mathcal{P}$$（并且求解它），方法应该能够搜集关于 $$\mathcal{P}$$ 的特定的信息。为了方便，搜集数据的过程被描述为一个 oracle。一个 oracle $$\mathcal{O}$$ 就是一个单位，它回答方法连续的询问。方法 $$\mathcal{M}$$ 试图通过搜集和处理回答，来求解问题 $$\mathcal{P}$$。
- 求解一个问题所需要的努力程度（computational efforts）的总量是一个方法 $$\mathcal{M}$$ 的性能。
- 逼近解：求解一个问题要找到一个准确度为 $$\varepsilon > 0$$ 的逼近解。

### 常规求解流程

给定初始点 $$x_{0}$$ 和准确度 $$\varepsilon>0$$ 和初始化：$$k=0$$，初始的信息$$I_{-1}=\emptyset$$。

1. 在$$x_{k}$$ 调用oracle $$\mathcal{O}$$。
1. 更新信息集：$$I_{k}=I_{k-1}\cap (x_{k},\mathcal{O}(x_{k}))$$。
1. 对 $$I_{k}$$ 运用方法 $$\mathcal{M}$$ 的规则，形成点 $$x_{k+1}$$
1. 检查停止条件 $$\mathcal{T}_{\varepsilon}$$。如果满足条件，则形成输出 $$\bar{x}$$。否则设置 $$k:=k+1$$ 循环步骤。

真正对于求解问题起作用的是步骤1和环步骤3，这两个步骤也是计算代价集中的地方，我们对这些步骤进行更加具体的分析，有

- 解析复杂性（analytical complexity）：求解问题 $$\mathcal{P}$$，达到准确率 $$\varepsilon$$ 所需要调用的orcal的数量。
- 算术复杂性（arithmetical complexity）：求解问题 $$\mathcal{P}$$，达到准确率 $$\varepsilon$$，所需要的算术操作的总数量（包括Oracle方法的工作）。

### Oracle

一般用局部黑盒概念（local black box concept）假设oracle能让我们得到优化问题解析复杂度的大部分结果，而距离测试点 $$x$$（或者叫当前的采样点）很远的小问题变化不会影响在 $$x$$ 的回答。

继续沿用上面最小化问题的问题表述形式，针对这样一种泛化模型（functional model）假定根据函数的光滑性程度，可以使用不同类型的oracle：

- 零阶oracle（zero-order oracle）：
    返回 $$f(x)$$ 的值。
- 一阶oracle（first-order oracle）：
    返回 $$f(x)$$ 和梯度 $$f'(x)$$的值。
- 二阶oracle（second-order oracle）：
    返回 $$f(x)$$，梯度 $$f'(x)$$，和Hessian $$f''(x)$$ 的值。

## 全局优化中复杂度的界

### Lipschitz连续

- Lipschitz continuous： 函数被一次函数上下夹逼
- Lipschitz continuous gradient ：函数被二次函数上下夹逼
- Lipschitz continuous Hessian ：函数被三次函数上下夹逼

$$
|f(x)-f(y)| \leq L\|x-y\|_{\infty}
$$

其中，$$L$$ 是某个Lipschitz常量（Lipschitz constant）

范数 $$l_{\infty}$$ 测量 $$\mathbb{R}^{n}$$ 中的距离：

$$
\|x\|_{\infty}=\max_{1\leq i \leq n}|x^{(i)}|.
$$

### 上界分析

根据Lipschitz连续我们可以构造一种零阶的求解方法（它的另一个名字应该是暴力枚举在一定精度下的全部可行解）。在每个维度上都把坐标平均间隔成 $$p$$ 个点，然后在所有点中找到 $$\bar{x}$$，使得目标函数具有最小的值。如果令 $$f^{*}$$ 是问题的全局最优值。其中点构造为
$$x_{\alpha}=((\frac{2i_{1}-1)}{2p}), (\frac{2i_{2}-1)}{2p}), \dots, (\frac{2i_{n}-1)}{2p}))^{T}$$
那么

$$
f(\bar{x})-f^{*} \leq \frac{L}{2p}.
$$

证明：给定一个多维索引 $$\alpha=(i_1, \dots, i_n)\in \{1, \dots, p\}^{n}.$$，定义这个点步长以内的领域范围

$$
X_{\alpha}=\{ x\in \mathbb{R}^{n}: \|x-x_{\alpha}\|_{\infty} \leq \frac{1}{2p} \}.
$$

很明显这些坐标的全部集合就是函数的可行域：$$\cap_{\alpha\in \{1,\dots, p\}^{n}}X_{\alpha}=B_{n}$$，如果这个函数存在一个全局最优解，则在网格离散的点上一定有一个索引值 $$\alpha^{*}$$ 索引的网格点 的连续邻域内存在最优解（就是这个最优解在它的框框内） $$x^{*}\in X_{x_{a^{*}}}$$ 满足$$\| x^{*}-x_{\alpha^{*}}\|_{\infty} \leq \frac{1}{2p}.$$，因此有，

$$
f(\bar{x}) - f(x^{*}) \leq f(x_{a^{*}})-f(x^{*}) \leq \frac{L}{2p}.
$$

把这个问题推广到一系列的问题就有：

$$
\text{Find}~\bar{x}\in B_{n}:\quad f(\bar{x})-f^{*} \leq \varepsilon. 
$$

> 也就有如果要得到精度在 $$\varepsilon$$ 以内的解，这个方法的复杂度就在
> $$\mathscr{A}(\mathscr{G}=(\lfloor \frac{L}{2\varepsilon}\rfloor+1)^{n}),$$
所以令 $$p=\lfloor \frac{L}{2\varepsilon}\rfloor+1 \geq \frac{L}{2\varepsilon}$$ 也就有 $$f(\bar{x}-f^{*}) \leq \frac{L}{2p} \leq \varepsilon.$$ 也就需要调用 $$p^n$$ 次oracle，这是这个方法的复杂度上界。

实际上这还不够，也许在这种问题形式下还有更好的方法，或者实际上方法 $$\mathscr{G}$$ 的性能更好，所以再进一步分析求解这种问题的下界，下面的分析基于一些特点：

- 它们基于黑盒（black box）的概念。
- 这些界对于所有合理的迭代方案都有效，因此，它们给我们提供的是对于这个问题类的解析复杂度的下估计（lower estimate）。
- 这些界都用了抵抗 oracle（resisting oracle）的思想。
    - 对于每个特定方法（for example，$$\mathscr{G}(\mathscr{p})$$，一个抵抗oracle试图创建一个最坏（worst）问题：
        - 它从一个“空”的函数开始，并且试图用最坏可能的方式回答这个方法的每一个调用。
        - 这个回答必须和前面的回答以及问题类的描述兼容（compatible）


### 下界分析

首先定义下面这样的问题，有模型 $$\min_{x\in \mathbb{B}_{n}}f(x)$$ 且 $$f(x)$$ 在 $$\mathbb{B}_{n}$$ 上是 $$\mathscr{C}_{\infty} Lipschitz$$ 连续的。用于收集信息的 Oracle是一个零阶黑盒。目标是为了寻找一个逼近解 $$\bar{x}\in \mathbb{B}_{n}:f(\bar{x})-f^{*} \leq \varepsilon$$。根据我们的分析要取得 $$\varepsilon$$ 的精度，问题 $$\mathscr{C}$$ 的解析复杂度至少为 $$(\lfloor \frac{L}{2\varepsilon}\rfloor)^n(\geq 1)$$。
我们假设有一种方法可以使得 $$N < p^{n}$$ 以内把问题 $$\mathscr{P}$$ 解决掉，然后再弄一个Oracle，它在任意测试点都返回 $$f(x)=0$$，然而因为有 $$N < p^n$$ 所以还会存在一个多维索引 $$\hat{\alpha}$$ 使得在箱子 $$X_{\hat{\alpha}}$$ 内不存在测试点。写成数学形式如下

$$
\bar{f}(x)=\min\{ 0, L\|x-x_{*}\|_{\infty}-\varepsilon \}.
$$

构造出来的这个函数是满足常数 $$L$$ 的 $$\mathscr{C}_{\infty}$$-Lipschitz 连续。它的全局最有解为 $$-\varepsilon$$ 这样，如果搜索的量小于 $$p^n$$ 那结果肯定不可能超过 $$\varepsilon$$ 这是根据比较一般的形式构造出的满足条件的最好的情况了，如果连这个都不能达到，那在最普遍情况下也就达不到更好的结果了。

> 所以我们可以确定在使用暴力的网格法求解的下界：
> $$\mathscr{G}:(\lfloor \frac{L}{2\varepsilon} \rfloor + 1)^n \Leftrightarrow \text{Lower bound:}\lfloor \frac{L}{2\varepsilon} \rfloor^n.$$

可以看到这种问题几乎是时间上不可解的，而且推导出的下界也未必比上界更好一些。把这结果和那种NP-难问题的上界进行比较，是组合优化中经典的困难问题，真是让人失望。而像这种网格法在数值计算中还是满常见的，比如数值积分[^3]。

## 松弛和逼近

非线性优化中，简单的目标是找到可微函数的局部最小值。但是很多情况下这些函数的全局结构不会比 Lipschitz 连续函数更简单。所以目前大部分的一般非线性优化的方法基于松弛（relaxation）思想：

> - 一个序列 $$\{a_{k}\}^{\infty}_{k=0}$$ 如果 $$a_{k+1}\leq a_{k}, \forall~k\geq 0.$$ 它是一个松弛序列（relaxation sequence）
> - 逼近意味着一个简化的目标函数替换初始的目标函数，在属性上简化函数和原函数的距离非常接近

在非线性优化中常用非线性函数的导数来使用局部（local）逼近。这些就是一阶和二阶逼近（或者也叫线性和平方逼近）。

### 一阶逼近

如果 $$f(x)$$ 在 $$\bar{x}$$ 是可微的，那么对于 $$y\in \mathbb{R}^{n}$$，我们有

$$
f(y)=f(\bar{x})+\langle \nabla f(x), y-\bar{x} \rangle + o(\|y-\bar{x}\|).
$$

线性函数 $$f(\bar{x})+\langle \nabla f(\bar{x}), y-\bar{x} \rangle$$ 称为 $$f$$ 在 $$\bar{x}$$ 的线性逼近（linear approximation），其中 $$\langle \cdot, \cdot \rangle$$ 表示内积。

$$
\nabla f(x)=(\frac{\partial f(x)}{\partial x^{(1)}}, \dots, \frac{\partial f(x)}{\partial x^{(n)}})^{T}
$$

将函数 $$f(x)$$ 的次层集（sublevel set）记作 $$\mathscr{L}_{f}(\alpha)$$ （也可以看作是等高线以下内容）：

$$
\mathscr{L}_{f}(\alpha)=\{x\in \mathbb{R}^{n} | f(x) \leq \alpha \}.
$$

考虑在 $$\bar{x}$$ 上和 $$\mathscr{L}_{f}(f(\bar{x}))$$ 相切方向集合：

$$
S_{f}(\bar{x})=\left \{ s\in \mathbb{R}^{n}|s= \lim_{y_k \rightarrow \bar{x}, f(y_{k})=f(\bar{x})} \frac{y_k - \bar{x}}{\|y_k - \bar{x}\|}, \text{for some}~\{y_k\} \rightarrow \bar{x}~\text{with}~f(y_k)=f(\bar{x}) \forall k \right \}.
$$

如果 $$f(y_k)=f(\bar{x})$$，我们有

$$
f(y_k)=f(\bar{x}) + \langle \nabla f(\bar{x}), y_k - \bar{x} \rangle + o(\|y_k - \bar{x}\|)=f(\bar{x}).
$$

因为 $$\lim_{r \downarrow 0}\frac{1}{r}o(r)=0, o(0)=0$$ 所以等号两边同时除以 $$\| y_k-\bar{x}\| $$ 然后让 $$y_k \rightarrow \bar{x}$$ 我们就得到：

$$
if~s\in S_{f}(\bar{x}), then~\langle \nabla f(\bar{x}), s \rangle=0.
$$

$$s\in S_f(\bar{x})$$ 其实就是表示 $$\mathbb{R}^{n}$$ 中的方向，$$\| s\| =1$$。

$$
\Delta (s)=\lim_{\alpha \downarrow 0}\frac{1}{\alpha}[f(\bar{x} + \alpha s)-f(\bar{x})].
$$

最后得到

$$
\Delta (s)=\langle \nabla f(\bar{x}), s\rangle .
$$

通过 Cauchy-Schwarz 不等式，
$$-\|x\|\cdot \|y\| \leq \langle x, y\rangle \leq \|x\|\cdot \|y\|,$$
推出 $$\Delta (s)=\langle \nabla f(\bar{x}), s\rangle \geq -\| \nabla f(\bar{x})\| .$$ 继续再让 

$$
\bar{s}=-\nabla f(\bar{x})/\|\nabla f(\bar{x})\|.
$$

带入原来的方程中得到

$$
\Delta (\bar{s})=-\langle \nabla f(\bar{x}), \nabla f(\bar{x}) \rangle / \|\nabla f(\bar{x}) \| = -\|\nabla f(\bar{x})\|.
$$

所以，反梯度方向 $$-\nabla f(\bar{x})$$ 是最快的下降方向。

### 一阶优化条件

令 $$x^{*}$$ 是一个可微函数 $$f(x)$$ 的局部最小点。那么 $$\nabla f(x^{*})=0$$，而且它周围点 $$\| y-x^{*}\|  \leq r, ~\text{and}~r>0$$ 上的函数值都应该比最优点上面的函数值大 $$f(y) \geq f(x^{*})$$，而且 $$f$$ 可微
$$f(y) = f(x^{*}) + \langle \nabla f(x^{*}, y-x^{*}\rangle + o(\|y-x^{*}\|) \geq f(x^{*}).$$
因此对于所有的 $$s\in \mathbb{R}^{n}$$，我们有 $$\langle \nabla f(x^{*}), s \rangle \geq 0.$$ 如果取 $$s=-\nabla f(x^{*})$$ 则有 $$-\| \nabla f(x^{*})\|  \geq 0.$$ 当且仅当 $$\nabla f(x^{*})=0.$$

但是这仅仅是一个最小值的必要条件，满足这个条件的可能只是个 $$f$$ 的静点，所以还需要二阶的信息。

### 二阶逼近

令函数 $$f(x)$$ 在 $$\bar{x}$$ 上是二次可微的，那么
$$
f(y)=f(\bar{x})+\langle \nabla f(x), y-\bar{x} \rangle + \frac{1}{2} \langle \nabla^2 f(\bar{x})(y-\bar{x}), y-\bar{x} \rangle + o(\|y-\bar{x}\|^2).
$$

定义函数 $$f$$ 在 $$x$$ 的 Hessian（对称矩阵）

$$
\nabla^2 f(\bar{x})^{(i, j)} = \frac{\partial^2 f(\bar{x})}{\partial x^{(i)} \partial x^{(j)}}
$$

对于对称矩阵 $$A \succeq 0$$ 表示 $$A$$ 是正半定的（positive semidefine）：
$$\langle Ax, x \rangle \geq 0 ~\forall x\in \mathbb{R}^{n}.$$
如果这个点是一个局部最小点，那么它的二阶导应该至少有大于0的分量
$$\nabla f(x^{*}) = 0, \nabla^2 f(x^{*})\succeq 0.$$
对于所有的 $$s$$，$$\| s\| =1$$，有 $$\langle \nabla^2 f(x^{*})s, s\rangle \geq 0$$。
如果满足以上的条件，则必要性得以满足，那么 $$x^{*}$$ 是 $$f(x)$$ 的一个严格的局部最小点，有时候也用隔离（isolated）这个词来代替严格（strict）。

$$x^{*}$$ 为最优值点的充分性证明：在点 $$x^{*}$$ 的一个很小邻域内，函数 $$f(\cdot)$$ 可以表达成

$$
f(y)=f(x^{*})+\frac{1}{2}\langle \nabla^2 f(x^{*})(y-x^{*}), y-x^{*}\rangle + o(\|y-x^{*}\|^2).
$$

因为 $$o(r^2)/r^2 \rightarrow$$ 当 $$r\downarrow 0$$，存在一个值 $$\bar{r} > 0$$ 使得所有的 $$r\in [0, \bar{x}]$$ 有

$$
|o(r^2)| \leq \frac{r^2}{4} \lambda_{\min}(\nabla^2 f(x^{*})).
$$

根据我们的假设，这个特征值是正的，所以，对于任意 $$y\in \mathbb{R}^{n}$$，$$0<\| y-x^{*}\| \leq \bar{r}$$ 我们有

$$
\begin{array}{rcl} f(y) & \geq & f(x^{*}) + \frac{1}{2}\lambda_{\min}(\nabla^2 f(x^{*}))\|y-x^{*}+\|o(\|y-x^{*}\|^2)\\
& \geq & f(x^{*}) + \frac{1}{2}\lambda_{\min}(\nabla^2 f(x^{*})) + \|y-x^{*}\| > f(x^{*}).\end{array}
$$

根据变分不等式，对于对称矩阵 $$A\in \mathbb{R}^{n\times n}$$ 有

$$
\lambda_{\min}(A)\cdot X^TX \leq X^T AX \leq \lambda_{\max}(A)\cdot X^T X.
$$

所以有

$$
\frac{1}{2}\langle \nabla^2(y-x^{*}), y-x^{*}\rangle \geq \lambda_{\min}(\nabla^2 f(x^{*}))\|y-x^{*}\|^2.
$$

## 可微函数的类

### Lipschitz 条件

> 令 $$Q$$ 是一个 $$\mathbb{R}^{n}$$ 的子集，我们记 $$C^{k,p}_{L}(Q)$$ 为具有下面属性的函数类：
>
> - 任意 $$f\in C^{k,p}_{L}(Q)$$ 在 $$Q$$ 上是 k 次连续可微的。
> - 它的第 $$p$$ 次导数在 $$Q$$ 上是 Lipschitz 连续的，有常量 $$L$$ 对于所有的 $$x, y\in Q$$
>
> $$\|\nabla^{p}f(x)-\nabla^{p}f(y)\| \leq L\|x-y\|.$$

显然，我们总是会有

1. $$p\leq k$$ 显然成立
1. 如果 $$q\geq k$$ 那么 $$C^{q,p}_{L}(Q)\subset C^{k, p}_{L}(Q)$$
1. 同时，如果 $$f_1 \in C^{k, p}_{L_1}(Q)$$，$$f_2\in C^{k, p}_{L_2}(Q)$$ 且 $$\alpha, \beta\in \mathbb{R}^{1}$$ 对于
    $$L_3 = |\alpha|L_1+|\beta|L_2$$
    有$$\alpha f_1+\beta f_2 \in C^{k, p}_{L_3}(Q)$$

### Lipschitz Continuous Gradient

> 考虑具有 Lipschitz 连续梯度的函数类，根据定义这个 $$f\in C^{1, 1}_L(\mathbb{R}^n)$$ 有对于所有的 $$x,y \in \mathbb{R}^{n}$$
> $$\|\nabla f(x)-\nabla f(y)\| \leq L\|x-y\|.$$

一个函数 $$f$$ 属于 $$C^{2, 1}_L(\mathbb{R}^{n}) \subset C^{1, 1}_L(\mathbb{R}^n)$$ 当且仅当对于所有的 $$x\in \mathbb{R}^n$$ 下面条件满足

$$
\|\nabla^2 f(x)\| \leq L.
$$

证明：实际上对于任何的 $$x, y\in \mathbb{R}^{n}$$ 有

$$
\begin{array}{rl}\nabla f(y)&=\nabla f(x)+\int^{1}_{0}\nabla^2 f(x + \tau(y-x))(y-x)d\tau\\
&=\nabla f(x)+(\int^1_0 \nabla^2 f(x+\tau(y-x))d\tau)\cdot(y-x).\end{array}
$$

如果条件 $$\| \nabla^2 f(x)\|  \leq L$$ 成立的话有

$$
\begin{array}{rl} \|\nabla f(y)-\nabla f(x)\| & = \|(\int^1_0 \nabla^2 f(x+\tau(y-x))d\tau)\cdot (y-x)\|\\
&\leq \|int^1_0\nabla^2 f(x+\tau(y-x))d\tau\|\cdot \|y-x\|\\
&\leq \int^1_0 \|\nabla^2 f(x+\tau(y-x))\|d\tau \cdot \|y-x\|\\
&\leq L\|y-x\|.
\end{array}
$$

另外，如果 $$f\in C^{2,1}_L(\mathbb{R}^n)$$，那么对于任意的 $$s\in \mathbb{R}^n$$ 和 $$\alpha > 0$$ 有

$$
\left \| \left (\int^{\alpha}_0 \nabla^2 f(x+\tau s)d\tau \right )\cdot s \right\|=\|\nabla f(x+\alpha s)-\nabla f(x)\| \leq \alpha L\|s\|.
$$

证明：我们令 $$\Phi(\alpha) = (\int^{\alpha}_{0} \nabla^2 f(x+\tau s)d\tau)$$，不等式两边同时除以 $$\alpha$$，取 $$\alpha \downarrow 0$$ 有

$$
\left \| \lim_{\alpha \downarrow 0} \frac{\Phi(\alpha)}{\alpha} \cdot s \right \| = \left \| \lim_{\alpha \downarrow 0} \frac{\Phi(\alpha)-\Phi(0)}{\alpha-0} \cdot s \right \| = \|\nabla \Phi(0)\cdot s\| \leq L\|s\|.
$$

因为 $$\nabla \Phi(\alpha) = \nabla^2 f(x+\alpha s)$$，有 $$\nabla \Phi(0)=\nabla^2 f(x)$$，所以得证。

### 几何解释

> 如果 $$f\in C^{1, 1}_L(\mathbb{R}^n)$$ 那么对于任意的 $$x, y\in \mathbb{R}^n$$ 有
> $$|f(y)-f(x)-\langle \nabla f(x), y-x \rangle | \leq \frac{L}{2}\|y-x\|^2.$$

$$f(y)$$ 和其一阶逼近的距离的上界，因为确定了这个上界之后可以将优化复杂的函数 $$f$$ 等价成为优化它的上界[^5]，转化为二次规划问题[^4]。

证明如下

$$
\begin{array}{rl}f(y)&=f(x)+\int^1_0 \langle \nabla f(x+\tau(y-x)), y-x\rangle d\tau\\
&=f(x) + \langle \nabla f(x), y-x\rangle + \int^1_0 \langle \nabla f(x+\tau(y-x))-\nabla f(x), y-x\rangle d\tau. \end{array}
$$

所以

$$
\begin{array}{rl} |f(y)-f(x)-\langle \nabla f(x), y-x \rangle| &= \left | \int^1_0 \langle \nabla f(x+\tau(y-x)) - \nabla f(x), y-x \rangle d\tau \right |\\
& \leq \int^1_0 \left | \langle \nabla f(x+\tau(y-x)) - \nabla f(x), y-x \rangle \right | d\tau \\
& \leq \int^1_0 \|\nabla f(x+\tau(y-x)) - \nabla f(x)\| \cdot \|y-x\| d\tau \\
& \leq \int^1_0 \tau L\|y-x\|^2 d\tau = \frac{L}{2}\|y-x\|^2. \end{array}
$$

> 如果 $$f \in C_{M}^{2,2}\left(\mathbb{R}^{n}\right)$$，是一个二阶可微符合 Lipschitz 连续 Hessian 的函数类型，我们有
> $$\left\|\nabla^{2} f(x)-\nabla^{2} f(y)\right\| \leq M\|x-y\|, \quad \forall x, y \in \mathbb{R}^{n}$$
> 则对于任意 $$x, y \in \mathbb{R}^{n}$$，做一次积分，再做一次积分
> 
> $$
> \begin{array}{c}{\left\|\nabla f(y)-\nabla f(x)-\nabla^{2} f(x)(y-x)\right\| \leq \frac{M}{2}\|y-x\|^{2}} \\ {\left|f(y)-f(x)-\langle\nabla f(x), y-x\rangle-\frac{1}{2}\left\langle\nabla^{2} f(x)(y-x), y-x\right\rangle\right|} \\ { \leq \frac{M}{6}\|y-x\|^{3}}\end{array}
> $$

证明

\begin{equation}
\begin{array}{rl} \nabla f(y)&=\nabla f(x)+\int\_{0}^{1} \nabla^{2} f(x+\tau(y-x))(y-x) d \tau \\\\ &=\nabla f(x)+\nabla^{2} f(x)(y-x)+\int\_{0}^{1}\left(\nabla^{2} f(x+\tau(y-x))-\nabla^{2} f(x)\right)(y-x) d \tau \end{array}
\end{equation}

因此

\begin{equation}
\begin{aligned} \left\|\nabla f(y)-\nabla f(x)-\nabla^{2} f(x)(y-x)\right\| &=\left\|\int\_{0}^{1}\left(\nabla^{2} f(x+\tau(y-x))-\nabla^{2} f(x)\right)(y-x) d \tau\right\| \\\\ & \leq \int\_{0}^{1}\left\|\left(\nabla^{2} f(x+\tau(y-x))-\nabla^{2} f(x)\right)(y-x)\right\| d \tau \\\\ & \leq \int\_{0}^{1}\left\|\nabla^{2} f(x+\tau(y-x))-\nabla^{2} f(x)\right\| \cdot\|y-x\| d \tau \\\\ & \leq \int\_{0}^{1} \tau M \nabla^{2} f(x+\tau(y-x))-\nabla^{2} f(x)\|\cdot\| y-x\|d \tau\\\\ & \leq \int\_{0}^{1} \tau M\|y-x\|^{2} d \tau=\frac{M}{2}\|y-x\|^{2} \end{aligned}
\end{equation}

> 令 $$f \in C_{M}^{2,2}\left(\mathbb{R}^{n}\right)$$ 并且 $$x, y \in \mathbb{R}^{n}$$ with $$\| y-x\ =r$$ 可以有
> $$
> \nabla^{2} f(x)-M r I_{n} \preceq \nabla^{2} f(y) \preceq \nabla^{2} f(x)+M r I_{n}
> $$

证明
我们令 $$G=\nabla^{2} f(y)-\nabla^{2} f(x)$$ 是一个矩阵，因为 $$f \in C_{M}^{2,2}\left(\mathbb{R}^{n}\right)$$，所以它肯定会被限制在这个界限内 $$\| G\|  \leq M r$$ 这意味着矩阵中每个特征值都在这个界限内。
所以我们有

$$
-M r I_{n} \preceq G \equiv \nabla^{2} f(y)-\nabla^{2} f(x) \preceq M r I_{n}
$$


---

[^1]: [凸优化维基百科](https://zh.wikipedia.org/wiki/%E5%87%B8%E5%84%AA%E5%8C%96)
[^2]: NESTEROV J E. Lectures on convex optimization[M]. 2018.
[^3]: [Numerical integration](https://en.wikipedia.org/wiki/Numerical_integration)
[^4]: [Quadratic_programming](https://en.wikipedia.org/wiki/Quadratic_programming)
[^5]: [Lipschitz-gradient by xingyuzhou](https://xingyuzhou.org/blog/notes/Lipschitz-gradient)
