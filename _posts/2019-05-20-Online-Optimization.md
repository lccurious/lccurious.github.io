---
layout: post
title: Online Optimization
date: 2019-05-20 17:16:38
categories:
  - 机器学习
tags:
giscus_comments: true
---

目前的机器学习问题通常是从已有的数据中通过各种优化算法找到理想的模型参数。但是出现数据分布是动态变化的情况时原来方法就难以适用了。针对这种动态的数据形式人们提出在线学习来解决这类问题。

<!-- more -->

## 背景

尽管在原来的统计机器学习中，我们已经取得了很多很好的结果。但是在一些应用场景中，数据会不断产生，新到达的数据可能会使得在历史数据上学习到的模型不再完全适用。而且有时候我们需要一个模型能够更加直接地表示新到达数据的趋势。一个非常现实的场景就是搜索广告的点击率(CTR)评估模型，网友的点击行为会随着时间变化。而基于 batch 的算法除了每次重新计算参数的代价巨大以外还无法即使反馈用户的点击行为迁移。而且在现实中可能遇到的数据量是非常巨大的，以 batch 的方式进行训练需要耗费的资源也过于庞大。在线学习的提出就是为了用于克服这些问题，为了叙述更加流畅将直接使用在线优化来表示。

### 在线优化

在线学习其实是统计机器学习的一种自然拓展[^1]，和原来的统计学习的基本不同点在于，而对于统计学习而言则是

- 训练数据是有限的
- 目标值是有一个上限的
  对于在线优化而言
- 在学习阶段，训练数据是一次来一个
- 没有办法直接获取全部的数据
- 甚至训练数据可以是无限的，新的数据可以是在环境中不断生成的

在原来的最优化任务中，我们的目标函数是要最小化一个经验风险函数：
\begin{equation}
\min\_{w} \mathbb{E}\_{\tilde{x} \sim \text { distribution }}[\operatorname{loss}(w ; \tilde{x})].
\end{equation}
在线优化任务中，我们通常没有办法直接获得这个分布，无法直接获得样本的梯度，从理论上也很难去估计这种情况下的收敛率，如果是神经网络模型，还可能会灾难性地遗忘之前的样本。

我们以商贩动态定价作为例子，假设有一个商贩为了能够赚最多的钱，他卖东西不明码标价，而是对每个来购买他东西的顾客都动态定价。他对每个来买东西的客人 $$t$$ 他能知道一些这个客人的信息 $$x_t$$，并基于这些信息他估计这个客人可能会接受的买下某件商品的最高价格 $$a_t(x_t)\in \mathcal{Y}$$。而另一方面，顾客心里也有个最高的预期价格 $$y_t$$，如果高于这个价格他就不买了。这个例子中商贩的损失函数可以写为$$\ell(a,(x, y))=-a(x) \mathbb{1}_{a(x) \leq y}$$，这也称为有限信息博弈，或者不完全信息博弈。

随机梯度下降（SGD）算法在每次更新内部参数的时候不需要全部的样本信息，在目前是应用最广的一种用于在线优化的技术[^2]。在此算法基础上，给在线优化问题带来一些合适的求解方法的启发。

另外，在迭代和选取模型的时候，稀疏解除了能够帮助选取特征以外还降低了预测计算的复杂度。在实际算法设计和优化过程中，也会注重稀疏性。但这里有个严峻的问题，SGD不能带来稀疏解。就算增加L1正则，在 batch 的时候可以得到稀疏解，但在online的时候却不行[^3]。

### 梯度下降

梯度下降算法在经验风险值最小化问题和深度学习中有着广泛的应用[^4]，考虑我们的目标优化问题：
\begin{equation}
x^{_} :=\underset{x}{\arg \min } f(x), \quad \text { with } \quad f(x) :=\frac{1}{n} \sum\_{i=1}^{n} f\_{i}(x)
\end{equation}
其中 $$x^{_}$$ 是函数的全局最优值，$$n$$ 为样本的数量，当我们采用梯度下降法的时候，在每一轮更新函数的参数时，要将所有的样本特征信息都加入到函数参数的更新中去则有：
\begin{equation}
w\_{k+1}=w\_{k}-\eta\_{k} \nabla R\_{n}\left(w\_{k}\right)=w\_{k}-\frac{\eta\_{k}}{n} \sum\_{i=1}^{n} \nabla f\_{i}\left(w\_{k}\right)
\end{equation}
其中，$$w_k$$ 表示函数模型在第 $$k$$ 步时的函数参数，$$\nabla R_{n}$$ 表示函数在 $$k$$ 步时函数在样本总体上的梯度，$$\eta_{k}$$ 表示在第 $$k$$ 步时的学习率。但是当样本规模十分庞大时这种更新方式就需要非常庞大的计算量。在实际的场景中，人们常常采用从总的样本中随机选择一批样本计算梯度用于更新参数，而随机性的加入会增加下降梯度步骤的方差，这使得随机梯度下降算法的收敛率不如梯度下降算法。

如果原来的函数满足强凸假设的话，梯度下降的方法是可以得到近似于线性收敛率 $$O(c(1-q)^k)$$ 的计算复杂度。

## 问题描述

一个在线优化的问题可以形式化地描述如下[^1]，用 $$t=1,2,\dots, n$$ 表示步骤，在每一步：

- 选择一个动作 $$a_{t} \in \mathcal{A}$$
- 同时模拟对手会选择 $$z_{t} \in \mathcal{Z}$$
- 计算得到的损失 $$\ell\left(a_{t}, z_{t}\right)$$
- 观测 $$z_{t}$$

**目标**：使累计后悔量最小：
\begin{equation}
R\_{n}=\sum\_{t=1}^{n} \ell\left(a\_{t}, z\_{t}\right)-\inf \_{a \in \mathcal{A}} \sum\_{t=1}^{n} \ell\left(a, z\_{t}\right).
\end{equation}
其中 $$a$$ 表示完美的策略，这里表示在 $$n$$ 个数据上的后悔量 $$R_{n}$$ 是独立于对手的行为策略的。以上我们可以把在线优化看成是一个在算法和环境之间的重复博弈游戏。在这个过程中算法将不断学习得到最好的策略使得其最适合当前的工作。

如果一个函数 $$f$$ 是一个满足 $$L$$ 光滑的 Lipschitz 连续函数[^5]如下
\begin{equation}
\|\nabla f(x)-\nabla f(y)\| \leq L\|x-y\|, \quad \forall x, y \in \mathbb{R}^{d}.
\end{equation}
对于这一类的函数都有$$\left \| \nabla f_{i}(x)-\nabla f_{i}(y) \right \|  \leq L\| x-y\| $$。其中 Lipschitz 常数 $$L$$ 和函数的数量编号无关。如果还存在一个常数 $$\mu>0$$ 有方程如下，则称函数是符合 $$\mu$$ 强凸的。
\begin{equation}
f(y) \geq f(x)+\langle\nabla f(x), y-x\rangle+\frac{\lambda}{2}\|y-x\|^{2} \quad \forall x, y \in \mathbb{R}^{d}
\end{equation}
有 $$Q_f :=L/\mu$$ 称为函数的条件数。

如果对于 $$x\in\mathbb{R}^d$$ 有
\begin{equation}
f(x)-f\left(x^{\*}\right) \leq \mu\|\nabla f(x)\|^{2}.
\end{equation}
我们称满足这种条件的函数为 $$\mu$$ 梯度主导的。而且函数 $$f$$ 不必为凸的。

在分析以上函数类的收敛率时，用 $$\| \nabla f(x)\| ^{2} \leq \epsilon$$ 来判断迭代是否逼近了一个驻点。和在凸函数 $$f$$ 中的 SGD 用 $$\left[f(x)-f\left(x^{*}\right)\right]$$ 或者 $$\left\| x-x^{*}\right\| ^{2}$$ 作为收敛率指标不同。非凸函数的分析中这种不太行得通。

## 随机梯度下降

假设我们可以得到和随机变量 $$X$$ 高度相关的随机变量 $$Y$$，那么利用方差缩减的方法估计随机变量 $$X$$ 的期望则可以有：
\begin{equation}
\theta\_{\alpha}=\alpha(X-Y)+\mathbb{E}[Y],
\end{equation}
其中，$$\alpha\in [0,1]$$，$$\mathbb{E}$$，这个估计量 $$\theta_{\alpha}$$ 的期望和方差可以写成下面的形式：
\begin{equation}
\begin{array}{c}{\mathbb{E} [\theta\_{\alpha}]=\alpha \mathbb{E}[X]+(1-\alpha) \mathbb{E}[Y]}, \\\\ {\operatorname{Var}\left(\theta\_{\alpha}\right)=\alpha^{2}[\operatorname{Var}(X)+\operatorname{Var}(Y)-2 \operatorname{Cov}(X, Y)].}\end{array}
\end{equation}
如果其中的 $$\alpha$$ 变成1这个估计量就是变量 $$X$$ 的期望，且相关性 $$\operatorname{Cov}(X,Y)$$ 越大，这个估计量的方差也就越小，很多的方差缩减算法都是基于这个思想。

### SAG算法

为了减少随机梯度下降算法带来的梯度方差，所以引入了一种方法尝试用上所有的样本梯度，所以在更新梯度信息的时候采用一种新的更新方法SAG（Stochastic Average Gradient）[^6]。这个方法将每个样本最近计算过的梯度 $$y_i$$ 都保存在内存中用于辅助降低下一轮梯度之间的方差。同时,为了保持较小的计算开销，在每一轮更新中，都随机选择一个样本 $$i$$ 来更新梯度，并且用新计算得到的梯度和内存中已有的梯度一起来更新计算中的参数。
\begin{equation}
w\_{k+1}=w\_{k}-\frac{\eta\_{k}}{n} \sum\_{i=1}^{n} y\_{i}^{k}
\end{equation}
其中 $$k$$ 表示当前是第 $$k$$ 轮计算，$$\eta_{k}$$ 表示第 $$k$$ 轮的学习率，$$n$$ 表示样本总数

\begin{equation}
y\_{i}^{k}=\left\\{\begin{array}{lr}{\nabla f\_{i}\left(w\_{k}\right),} & {\text { if } i\_{k}=i} \\\\ {\nabla f\_{i}\left(w\_{k-1}\right)} & {\text { otherwise }}\end{array}\right.
\end{equation}

根据这样的规则就有，如果当前的这个样本是被选中进行梯度计算的，就用新计算得到的梯度代替原来内存中为它储存的梯度，如果未被选中则继续沿用内存中为它存储的梯度进行计算，然后把所有样本的梯度信息组合在一起用于更新完整的参数，把这些式子重新改写成一整个式子。

\begin{equation}
\tilde{g}\_{k} \leftarrow \frac{\nabla f\_{i\_{k}}\left(w\_{k}\right)-\nabla f\_{i\_{k}}\left(w\_{k-1}\right)}{n}+\nabla R\_{n}\left(w\_{k-1}\right)
\end{equation}

通过这种方法得到的梯度方差会随着 $$n$$ 以 $$\frac{1}{n^2}$$ 的速度进行衰减，计算的开销和 SGD 没有区别但是会额外增加与样本量相当的内存开销，但是收敛速度要远远大于原来的 SGD 算法。

### SVRG算法

SVRG（stochastic variance reduced gradient） 算法在每一轮迭代的内部都要计算一次所有样本的平均梯度，不过在这种计算策略下依然需要比较高的计算开销。在每一轮循环的内部还有一个小的循环，小循环内每次计算两次梯度 $$\nabla f_{i_{j}}\left(\tilde{w}_{j}\right)$$ 和 $$\nabla f_{i_{j}}\left(w_{k}\right)$$。
\begin{equation}
\tilde{g}\_{j} \leftarrow \nabla f\_{i\_{j}}\left(\tilde{w}\_{j}\right)-\left(\nabla f\_{i\_{j}}\left(w\_{k}\right)-\nabla R\_{n}\left(w\_{k}\right)\right)
\end{equation}
其中 $$\nabla R_{n}\left(w_{k}\right)$$ 表示样本的梯度均值。在每个循环的内部重新计算梯度的时候进行迭代的参数内容为$$\tilde{w}$$，由新的符号 $$i_{j}$$ (用于索引从样本总体中随机选取的 $$m$$ 个样本)索引函数参数进行更新：
\begin{equation}
\tilde{w}\_{j+1} \leftarrow \tilde{w}\_{j}-\eta \tilde{g}\_{j}
\end{equation}
这就是前面所描述的方差缩减的体现所在，可以看到 $$\tilde{g}_{j}$$ 是 $$\nabla R(\tilde{w} j)$$ 的一个无偏估计。在 SVRG 的收敛分析中，因为利用中间小循环内的这种独特更新方式可以让方差有一个不断缩减的上界，比 SGD 假设样本的方差有一个常数上界有更好的收敛性质。而且相对于 SAG 算法而言，不需要再在内存种维护每一个样本的梯度，降低了对内存资源的要求。

在实验结果中，SVRG相对于SGD来说在最优值附近几乎没有震荡，而且还没有什么噪音，其表现效果基本接近梯度下降。

### SAGA 算法

SAGA（Stochastic Variance Reduced Gradient) 算法是在 SVRG 工作基础上的改进，通常是介于 SAG 和 SVRG 之间的一种算法，根据文章内容说明，该方法的在强凸的情况下收敛速度要快于 SAG 和 SVRG，并且同时适应于非强凸的情形。

### SCSG 算法

这是基于SVRG的一个改进算法，因为 SVRG 需要全部数据样本的梯度进行更新，从而达到对于梯度的 Variance 进行控制，所以根据 SVRG 的参数更新规则，它的计算成本是 $$O((n+m)T)$$，其中 $$n$$ 是样本的总数，$$m$$ 是每轮随机选择更新的样本数量，$$T$$ 是所用的全部更新轮数。SCSG 和 SVRG 的两个主要区别主要是不像SVRG算法在每轮更新时的内循环中选择全部的样本数据来更新参数，而是选择样本总体的一个子集。

- 每轮中都从全局的一个Batch中估计梯度，子集的大小是 $$B$$
- 每轮的SGD更新数目 $$N$$ 也不是一个定值，而是依赖于子集大小的几何随机数
  其余的每个步骤更新内容和SVRG是一模一样的。

## 增加稀疏性

在面对高维数据集或者大规模数据场景时，解的稀疏性尤为重要。直接从 SGD 求解到难以得到比较稀疏的解，所以要增加一些限制使得这些求解结果能够保持更好的稀疏性。

### TG算法

为了得到比较稀疏的解，一种简单有效的方法是设置一个阈值对求解得到的参数进行阈值化，但是会造成一些数据丢失。截断梯度法（Truncated Gradient）[^7]是在某些特定情况下对于简单阈值化方法的改进。

带 L1 正则约束项的优化往往能够产生稀疏解
\begin{equation}
\psi(W)=\|W\|\_{1}=\sum\_{i=1}^{N}\left|w\_{i}\right|,
\end{equation}
但是这种正则项的存在在0处不可导的问题，又会导致一些原来是平滑凸函数的优化目标变成非光滑的凸函数，所以在计算梯度时候还要使用次梯度进行计算。
\begin{equation}
f\left(w\_{i}\right)=w\_{i}-\eta \nabla\_{1} L\left(w\_{i}, z\_{i}\right)-\eta g \operatorname{sgn}\left(w\_{i}\right)
\end{equation}
其中 $$\eta$$ 表示学习率，$$g$$ 是一个标量是正则化的参数，$$\nabla_{1} L(a, b)$$ 表示函数$$L(a,b)$$对应于 $$a$$ 的次梯度，在某个时刻模型的梯度，$$\operatorname{sgn}$$ 是一个符号函数。

加入 L1 正则项之后可以再增加一些改进达到更好的求解稀疏性。如果简单地用梯度截断可以取一个 $$k$$ 作为滑动窗口大小，每隔 $$k$$ 个更新步就采用下面的更新方式进行更新，其他时间用标准的 SGD 方法更新参数。

\begin{equation}
f\left(w\_{i}\right)=T\_{0}\left(w\_{i}-\eta \nabla\_{1} L\left(w\_{i}, z\_{i}\right), \theta\right)
\label{eq:tg_up}
\end{equation}

其中 $$T_{0}$$ 又表示为下面的形式

\begin{equation}
T*{0}\left(v*{i}, \theta\right)=\left\\{\begin{array}{ll}{0} & {\text { if }\left|v*{i}\right| \leq \theta} \\ {v*{i}} & {\text { otherwise }}\end{array}\right.
\end{equation}

$$v_{i}$$表示其中的一个维度。

在TG[^7]中采用和 \ref{eq:tg_up} 相同的更行形式但是在对梯度进行截断的步骤做了改进

\begin{equation}
f\left(w*{i}\right)=T*{1}\left(w*{i}-\eta \nabla*{1} L\left(w*{i}, z*{i}\right), \eta g\_{i}, \theta\right)
\end{equation}

其中的 $$T_{1}$$ 的具体形式如下

\begin{equation}
T*{1}\left(v*{j}, \alpha, \theta\right)=\left\\{\begin{array}{ll}{\max \left(0, v*{j}-\alpha\right)} & {\text { if } v*{j} \in[0, \theta]} \\\\ {\min \left(0, v*{j}+\alpha\right)} & {\text { if } v*{j} \in[-\theta, 0]} \\\\ {v\_{j}} & {\text { otherwise }}\end{array}\right.
\end{equation}

其中，$$T_{1}(v, \alpha, \theta)=\left[T_{1}\left(v_{1}, \alpha, \theta\right), \ldots, T_{1}\left(v_{d}, \alpha, \theta\right)\right]$$ 当 $$i/k$$ 为整数时，$$g^{(i)}=0$$，如果 $$i/k$$ 为整数时 $$g^{(i)}=kg$$。从这里的更新方式可以看出 $$g$$ 和 $$\theta$$ 决定了解的稀疏程度，这两个值越大，则稀疏性越强。

### FOBOS算法

前向后向切分（Forward-Backward Splitting）[^2]使用次梯度，将权重的更新分成两个步骤。

\begin{equation}
\begin{array}{c}{W^{\left(t+\frac{1}{2}\right)}=W^{(t)}-\eta^{(t)} G^{(t)}}, \\\\ {W^{(t+1)}=\operatorname{argmin}\_{W}\left\\{\frac{1}{2}\left\|W-W^{\left(t+\frac{1}{2}\right)}\right\|^{2}+\eta^{\left(t+\frac{1}{2}\right)} \Psi(W)\right\\}}.\end{array}
\end{equation}

其中，其中前一项和标准梯度下降一致，后一项是在梯度下降的结果基础上进行微调。微调保证结果在梯度下降的附近，另外增加罚项使得产生的解更加稀疏。

将两个更新步骤合成为一个则有

\begin{equation}
W^{(t+1)}=\operatorname{argmin}\left\\{\frac{1}{2}\left\|W-W^{(t)}+\eta^{(t)} G^{(t)}\right\|^{2}+\eta^{\left(t+\frac{1}{2}\right)} \Psi(W)\right\\},
\end{equation}

如果令$$F(W)=\frac{1}{2}\left\|W-W^{(t)}+\eta^{(t)} G^{(t)}\right\|^{2}+\eta^{\left(t+\frac{1}{2}\right)} \Psi(W)$$，在最优解的集合中一定会有 0 向量是 $$F(W)$$ 的次梯度。也就有

\begin{equation}
0=\left.\left\\{W-W^{(t)}-\eta^{(t)} G^{(t)}+\eta^{\left(t+\frac{1}{2}\right)} \partial \Psi(W)\right\\}\right|\_{W=W^{(t+1)}},
\end{equation}

进而得到权重更新公式为
\begin{equation}
W^{(t+1)}=W^{(t)}-\eta^{(t)} G^{(t)}-\eta^{\left(t+\frac{1}{2}\right)} \partial \Psi\left(W^{(t+1)}\right),
\end{equation}
调整得到的权重不仅与迭代前的状态有关还和迭代之后的状态有关，所以称为前向后向切分。

如果罚项函数用的是 L1 正则，$$\Psi(W)=\lambda\|W\|_{1^{\circ}}$$ 带入展开有

\begin{equation}
W^{(t+1)}=\operatorname{argmin}\_{w} \sum\_{i=1}^{N}\left(\frac{1}{2}\left(w\_{i}-w^{(t+\frac{1}{2})}\_{i}\right)^{2}+\eta^{\left(t+\frac{1}{2}\right)}\lambda\left|w\_{i}\right|\right),
\end{equation}

经过推导[^2]得到参数各个维度上的更新方式如下

$$
\begin{aligned} w_{i}^{(t+1)} &=\operatorname{sgn}\left(w^{(t+\frac{1}{2})}_{i}\right) \max \left(0,\left|w^{(t+\frac{1}{2})}_{i}\right|-\tilde{\lambda}\right) \\ &=\operatorname{sgn}\left(w_{i}^{(t)}-\eta^{(t)} g_{i}^{(t)}\right) \max \left\{0,\left|w_{i}^{(t)}-\eta^{(t)} g_{i}^{(t)}\right|-\eta^{\left(t+\frac{1}{2}\right)} \lambda\right\} \end{aligned}.
$$

L1-FOBOS 在每次更新模型参数的时候，会对每个维度都进行判断，然后根据梯度截断方式对对应的梯度方向进行处理。也就是当一个样本产生的梯度不足以对对应维度上的权值产生影响时就将这次在这个维度上的更新判定为不重要，然后舍弃本次这个维度的更新。因此针对针对 L1-FOBOS 各个方向的梯度更新算法可以写成

\begin{equation}
w\_{i}^{(t+1)}=\left\\{
\begin{array}{ll}
0 & \text{if} \left|w\_{i}^{(t)}-\eta^{(t)} g\_{i}^{(t)}\right| \leq \eta^{\left(t+\frac{1}{2}\right)} \lambda \\\\
\left(w\_{i}^{(t)}-\eta^{(t)} g\_{i}^{(t)}\right)-\eta^{\left(t+\frac{1}{2}\right)} \lambda \operatorname{sgn}\left(w\_{i}^{(t)}-\eta^{(t)} g\_{i}^{(t)}\right) & \text{otherwise}
\end{array}\right.
\end{equation}

### RDA算法

正则对偶平均（Regularized Dual Averaging）[^8]，与之前基于随机梯度下降的改进不同，在这个方法是通过对偶平均的方式对梯度进行更新

\begin{equation}
\label{eq:RDA}
W^{(t+1)}=\operatorname{argmin}\left\\{\frac{1}{t} \sum\_{r=1}^{t}\left\langle G^{(r)}, W\right\rangle+\Psi(W)+\frac{\beta^{(t)}}{t} h(W)\right\\},
\end{equation}

其中，$$\left\langle G^{(r)}, W\right\rangle$$ 表示梯度对参数 $$W$$ 的积分平均值，$$\Psi(W)$$ 为积分正则项，还有一个额外的正则项 $$\frac{\beta^{(t)}}{t} h(W)$$ 是严格凸函数，$$\left\{\beta^{(t)} \vert  t \geq 1\right\}$$ 是一个非负非自减序列。

在 L1正则下，为了使方法应用起来较为简单，令 $$\Psi(W)=\lambda\| W\| _{1}$$，构造严格凸函数 $$h(W)$$ 为 $$\frac{1}{2}\| W\| _{2}^{2}$$，将非负非自减序列定义为 $$\beta^{(t)}=\gamma \sqrt{t}$$，带入函数形式\ref{eq:RDA}有

\begin{equation}
W^{(t+1)}=\operatorname{argmin}\left\\{\frac{1}{t} \sum\_{r=1}^{t}\left\langle G^{(r)}, W\right\rangle+\lambda\|W\|\_{1}+\frac{\gamma}{2 \sqrt{t}}\|W\|\_{2}^{2}\right\\},
\end{equation}

将各个维度拆解成独立 $$N$$ 个独立的标量最小化问题，根据推导[^8]有在 L1 正则下的参数更新方式为

\begin{equation}
w\_{i}^{(t+1)}=\left\\{\begin{array}{ll}{0} & {\text { if }\left|\overline{g}\_{i}^{(t)}\right|<\lambda} \\\\ {-\frac{\sqrt{t}}{\gamma}\left(\overline{g}\_{i}^{(t)}-\lambda \operatorname{sgn}\left(\overline{g}\_{i}^{(t)}\right)\right)} & {\text { otherwise }}\end{array}\right..
\end{equation}

由此可见，如果在某个方向上的累计梯度平均绝对值小于某个阈值 $$\lambda$$ 时，这个权重就会维持为0。这更好地保证了求解结果的系数性。和前面描述的 FOBOS 算法不同，RDA更加保守一些，在梯度累计上做条件判断来对权值进行截断，避免了因为样本训练不足带来的截断使结果精度降低等问题。

### FTRL算法

FTRL（Follow the Regularized Leader）[^9]在工程实现的角度上结合了 L1-FOBOS 精度较高的优点和 L1-RDA能够产生更稀疏的解的优点，产生了一个统一的优化求解形式。

首先看到 FOBOS 和 RDA 在求解方式上的相似之处，FOBOS在迭代过程中都可以写成

\begin{equation}
W^{(t+1)}=\operatorname{argmin}\left\\{\frac{1}{2}\left\|W-W^{(t)}+\eta^{(t)} G^{(t)}\right\|\_{2}^{2}+\eta^{(t)} \lambda\|W\|\_{1}\right\\}.
\end{equation}

但是直接从中得到解析解的难度非常大，我们在前文通过分解成 N 个独立的求解步骤，再将 N 个步骤合并可以得到

\begin{equation}
W^{(t+1)}=\operatorname{argmin}\left\\{G^{(t)} \cdot W+\lambda\|W\|\_{1}+\frac{1}{2 \eta^{(t)}}\left\|W-W^{(t)}\right\|\_{2}^{2}\right\\}.
\end{equation}

而对应于有正则化项的 SDA，我们用 $$G^{(1 : t)}=\sum_{s=1}^{t} G^{(s)}$$ 表示累计梯度，另外如果再令 $$\sigma^{(s)}=\frac{1}{\eta^{(s)}}-\frac{1}{\eta^{(s-1)}}$$，$$\sigma^{(1 : t)}=\frac{1}{\eta^{(t)}}$$ 还可以将两个式子的形式进一步统一到下面的两个方程中
\begin{equation}
\label{eq:FOBOS-s}
W^{(t+1)}=\operatorname{argmin}\left\\{G^{(t)} \cdot W+\lambda\|W\|\_{1}+\frac{1}{2} \sigma^{(1 : t)}\left\|W-W^{(t)}\right\|\_{2}^{2}\right\\},
\end{equation}

\begin{equation}
\label{eq:RDA-s}
W^{(t+1)}=\arg \min \_{W}\left\\{G^{(1 : t)} \cdot W+t \lambda\|W\|\_{1}+\frac{1}{2} \sigma^{(1 : t)}\|W-0\|\_{2}^{2}\right\\}.
\end{equation}
可以通过对比两个方程的形式发现，\ref{eq:FOBOS-s}考虑的是当前正则项的贡献，求得的新解不能与之前的解相差太远，而\ref{eq:RDA-s}则采用了累计梯度信息的方式，求得的新解不能与 0 相差太远。

针对这个在正则项上处理方式和对 $$W$$ 限制的不同，FTRL 给出了新的特征权值更新方式
\begin{equation}
W^{(t+1)}=\operatorname{argmin}\left\\{G^{(1 : t)} \cdot W+\lambda\_{1}\|W\|\_{1}+\lambda\_{2} \frac{1}{2}\|W\|\_{2}^{2}+\frac{1}{2} \sum\_{s=1}^{t} \sigma^{(s)}\left\|W-W^{(s)}\right\|\_{2}^{2}\right\\}.
\end{equation}
根据推导[^10]有最终的参数权重更新方式

\begin{equation}
w\_{i}^{(t+1)}=\left\\{\begin{array}{ll}{0} & {\text { if }\left|z\_{i}^{(t)}\right|<\lambda\_{1}} \\\\ {-\left(\lambda\_{2}+\sum\_{s=1}^{t} \sigma^{(s)}\right)^{-1}\left(z\_{i}^{(t)}-\lambda\_{1} \operatorname{sgn}\left(z\_{i}^{(t)}\right)\right)} & {\text { otherwise }}\end{array}\right.
\end{equation}

其中在FTRL中还有四个参数通常需要根据具体的实际问题进行设置和调整。

## 采样技巧

上述的很多文章都集中讨论通过降低梯度下降时的方差抑制来保证求解取得一个比较好的结果，另外一种常规的技巧可以通过优化采样训练集的方式来降低梯度的方差。通过优化训练数据采样的方法是可以和其他降低梯度方差方法并行的一种技巧。

可调权重的随机梯度下降算法AW-SGD在随机梯度下降算法每轮优化目标函数之前，用额外的随机梯度下降步骤优化采样数据分布估计[^2]。

## 总结

在线优化适用于处理在线生成的数据，适合完成在大规模场景下的训练任务，并且有 Regret 累计损失函数的理论分析保障。目前而言在工程上FTRL是最好的实现模式。

具有完全信息在线学习性质的问题可以用于在线分类、回归等强反馈问题中，而基于摇臂机分析的模型可以用于弱反馈问题像是推荐系统、二元反馈等问题中。

---

[^1]: Bubeck, Sébastien. 2011. “Introduction to Online Optimization.” Lecture Notes, 1–86.
[^2]: Bouchard, Guillaume, Théo Trouillon, Julien Perez, and Adrien Gaidon. 2015. “Online Learning to Sample.” ArXiv:1506.09016 [Cs, Math, Stat], June. http://arxiv.org/abs/1506.09016.
[^3]: 吴海波. n.d. “在线学习（Online Learning）导读.” https://zhuanlan.zhihu.com/p/36410780.
[^4]: Reddi, Sashank J., Ahmed Hefny, Suvrit Sra, Barnabás Póczos, and Alexander J. Smola. 2016. “Stochastic Variance Reduction for Nonconvex Optimization.” International Conference on Machine Learning, 314–323.
[^5]: Nesterov, Jurij Evgenʹevič. 2018. Lectures on Convex Optimization.
[^6]: Roux, Nicolas L and Schmidt, Mark and Bach, Francis R 2012 A stochastic gradient method with an exponential convergence rate for finite training sets Advances in neural information processing systems
[^7]: Langford, John, Lihong Li, and Tong Zhang. 2009. “Sparse Online Learning via Truncated Gradient.” Journal of Machine Learning Research 10 (Mar): 777–801.
[^8]: Xiao, Lin. 2010. “Dual Averaging Methods for Regularized Stochastic Learning and Online Optimization.” Journal of Machine Learning Research 11 (Oct): 2543–2596.
[^9]: Johnson, Rie, and Tong Zhang. 2013. “Accelerating Stochastic Gradient Descent Using Predictive Variance Reduction.” In Advances in Neural Information Processing Systems, 315–323.
[^10]: McMahan, H Brendan, Gary Holt, David Sculley, Michael Young, Dietmar Ebner, Julian Grady, Lan Nie, et al. 2013. “Ad Click Prediction: A View from the Trenches.” In Proceedings of the 19th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 1222–1230. ACM.
