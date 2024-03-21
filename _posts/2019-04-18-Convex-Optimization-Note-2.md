---
layout: post
title: Convex Optimization Note 2 | Gradient Method
categories:
  - 机器学习
tags:
  - 凸优化
  - 非线性优化
date: 2019-04-18 15:22:14
giscus_comments: true
---

在基础背景介绍过之后可以开始非约束的最小化问题的收敛速度（收敛率）（the rate of convergence）学习了，在 post_link "Convex-Optimization-Note-1" 第一章 中也已经证明反梯度方向是最快的下降方向。在这篇文章中，我们将基于基本的直觉感受展开描述。在很多的推导中我们不能以非常直接或者解析的方式去描述某一类问题最为精确的形式，所以我们将尽自己所能找到一些能够有充足证明确定它成立的证明来论证，也就是宁愿给一个不那么精确的描述也不要给出一个错误的估计。下面的笔记依然是基于Lectures on convex optimization[^1]。

<!-- more -->

## 梯度方法

\begin{equation}
\begin{array}{l}{\text { Choose } x\_{0} \in \mathbb{R}^{n}} \\\\ {\text { Iterate } x\_{k+1}=x\_{k}-h\_{k} \nabla f\left(x\_{k}\right), k=0,1, \ldots}\end{array}
\end{equation}

### 步长选择

固定步长，也就是每次都按照一个固定的比例把当前时刻的求解得到的梯度作用在搜索的路径上，步长（显然值都为正）的序列 $$\left\{h_{k}\right\}_{k=0}^{\infty}$$ 生成规则可以是下面这几种方式：

- **固定规则**：这种选择是最简单的，通常在凸优化的情况下选择
  \begin{equation}
  \begin{aligned} h\_{k} &=h>0, \text { (constant step } ) \\\\ h\_{k} &=\frac{h}{\sqrt{k+1}} \end{aligned}
  \end{equation}
- **完全松弛**：这种看起来就很复杂，每迭代一步就要找这么久，在现实中几乎难以实现这种理想的方式（不过最近几年似乎有了新的进展）
  \begin{equation}
  h\_{k}=\arg \min \_{h \geq 0} f\left(x\_{k}-h \nabla f\left(x\_{k}\right)\right)
  \end{equation}
- **Goldstein-Armijo规则**：找到下一个点 $$x_{k+1}=x_{k}-h \nabla f\left(x_{k}\right)$$ 使得：
  \begin{equation}
  \begin{array}{l}{\alpha\left\langle\nabla f\left(x\_{k}\right), x\_{k}-x\_{k+1}\right\rangle \leq f\left(x\_{k}\right)-f\left(x\_{k+1}\right)} \\\\ {\beta\left\langle\nabla f\left(x\_{k}\right), x\_{k}-x\_{k+1}\right\rangle \geq f\left(x\_{k}\right)-f\left(x\_{k+1}\right)}\end{array}
  \end{equation}
  其中，$$0<\alpha<\beta<1$$ 是事先选择固定的参数。这个规则在大多数实际算法中有所应用而且有几何解释，首先我们写一个以 $$h$$ 为自变量，以下一个迭代坐标的函数值作为因变量的函数：
  \begin{equation}
  \phi(h)=f(x-h \nabla f(x)), \quad h \geq 0
  \end{equation}
  而且这个函数还被两个另外的函数夹住：
  \begin{equation}
  \phi\_{1}(h)=f(x)-\alpha h\|\nabla f(x)\|^{2}, \quad \phi\_{2}(h)=f(x)-\beta h\|\nabla f(x)\|^{2}
  \end{equation}

## 梯度下降的性能

通过下面这个例子来衡量梯度下降的性能

\begin{equation}
\min \_{x \in \mathbb{R}^{n}} f(x)
\end{equation}

其中 $$f \in C_{L}^{1,1}\left(\mathbb{R}^{n}\right)$$，并且我们假设这个函数在 $$\mathbb{R}^{n}$$ 中是有下界的，也就是存在一个最小值。

### 下降步长和性能

如果我们考虑将 $$y=x-\nabla f(x)$$ 作为梯度下降往前走的一个新的点，那么把 $$y=x-\nabla f(x)$$ 带回到原始方程中就有：

\begin{equation}
\begin{aligned} f(y) & \leq f(x)+\langle\nabla f(x), y-x\rangle+\frac{L}{2}\|y-x\|^{2} \\\\ &=f(x)-h\|\nabla f(x)\|^{2}+\frac{h^{2}}{2} L\|\nabla f(x)\|^{2} \\\\ &=f(x)-h\left(1-\frac{h}{2} L\right)\|\nabla f(x)\|^{2} \end{aligned}
\end{equation}

其中 $$h \in\left(0, \frac{2}{L}\right)$$。对于这个不等式，在Note 1 中的一阶逼近已经说明: $$f(y)=f(\overline{x})+\langle\nabla f(x), y-\overline{x}\rangle+ o(\\vert y-\overline{x}\\vert )$$ 所以不等式中 $$\frac{L}{2}\\vert y-x\\vert ^{2}$$ 显然大于高阶无穷小。

所以我们就得到一个依赖于 $$h$$ 的函数，要使在这一步迭代搜索的结果下降的最多（基于一种贪婪的原则），我们要让这个值趋向于最小，这样可以让这一步走到特别低的位置去。
\begin{equation}
\Delta(h)=-h\left(1-\frac{h}{2} L\right) \rightarrow \min \_{h}
\end{equation}
所以计算它的导数，我们可以找到它的极值，也就是如果这个 $$h$$ 是最优的，那它至少会先满足导数为零这个条件 $$\Delta^{\prime}(h)=h L-1=0$$，也就得到 $$h^{*}=\frac{1}{L}$$ 当它的二阶导数满足 $$\Delta^{\prime \prime}(h)=L>0$$ 时可以确定这个值是一个让下降程度最大的极值点。而且这个 $$h$$ 的最优取值和前面不等式 $$\frac{L}{2}\\vert y-x\\vert ^{2}$$ 中的 $$L$$ 的比例没有关系，只要使得不等式成立就行，最后它至少可以使原来要优化的函数下降以下这么多
\begin{equation}
f(y) \leq f(x)-\frac{1}{2 L}\|\nabla f(x)\|^{2}
\end{equation}
$$L$$ 是Lipschitz 常数，是这类要优化的函数预先满足的条件。

下面分析前面讲过的三种梯度下降比例的性能：

- **固定步长策略**：令 $$x_{k+1}=x_{k}-h_{k} \nabla f\left(x_{k}\right)$$ 有
  \begin{equation}
  f\left(x\_{k}\right)-f\left(x\_{k+1}\right) \geq h\left(1-\frac{1}{2} L h\right)\left\|\nabla f\left(x\_{k}\right)\right\|^{2}
  \end{equation}
  可以推出 $$h_{k}=\frac{1}{L}$$
- **完全松弛策略**：完全松弛就是选择的最优值，所以也肯定不会比 $$h_{k}=\frac{1}{L}$$ 差
- **Goldsteim-Armijo规则**：

      对于 $$\beta$$

  \begin{equation}
  f\left(x\_{k}\right)-f\left(x\_{k+1}\right) \leq \beta\left\langle\nabla f\left(x\_{k}\right), x\_{k}-x\_{k+1}\right\rangle=\beta h\_{k}\left\|\nabla f\left(x\_{k}\right)\right\|^{2}
  \end{equation}
  对于 $$\alpha$$
  \begin{equation}
  f\left(x\_{k}\right)-f\left(x\_{k+1}\right) \geq \alpha\left\langle\nabla f\left(x\_{k}\right), x\_{k}-x\_{k+1}\right\rangle=\alpha h\_{k}\left\|\nabla f\left(x\_{k}\right)\right\|^{2}
  \end{equation}
  而基于前面下降量和 $$h$$ 函数分析，我们有
  \begin{equation}
  f\left(x\_{k}\right)-f\left(x\_{k+1}\right) \geq h\_{k}\left(1-\frac{h\_{k}}{2} L\right)\left\|\nabla f\left(x\_{k}\right)\right\|^{2}
  \end{equation}
  把这些得到的内容联立起来我们可以有
  \begin{equation}
  f\left(x\_{k}\right)-f\left(x\_{k+1}\right) \geq \frac{2}{L} \alpha(1-\beta)\left\|\nabla f\left(x\_{k}\right)\right\|^{2}
  \end{equation}

综上，这些步长的选取都是基于 $$L$$ 的比例，而且在迭代过程中这种步长还都是固定的。我们定义这个比例为 $$\omega$$ 把这些梯度下降法的相邻步骤的分析全部累计在一起可以得到
\begin{equation}
\frac{\omega}{L} \sum\_{k=0}^{N}\left\|\nabla f\left(x\_{k}\right)\right\|^{2} \leq f\left(x\_{0}\right)-f\left(x\_{N+1}\right) \leq f\left(x\_{0}\right)-f^{\*}
\end{equation}

这个下降步骤过程中产生的全部中间值的和是有下界的，也就是这些所有值的和是不会比当前出发点和真正最优值的绝对差值更大的，所以这些迭代过程中计算的梯度数值（中间值）构成的序列是收敛的。
\begin{equation}
\left\|\nabla f\left(x\_{k}\right)\right\| \rightarrow 0 \quad \text { as } \quad k \rightarrow \infty
\end{equation}

### 收敛速度

既然收敛，我们就可以对它的收敛速度（收敛率）进行评估，定义收敛速度（收敛率）为
\begin{equation}
g\_{N}^{_}=\min \_{0 \leq k \leq N}\left\|\nabla f\left(x\_{k}\right)\right\|
\end{equation}
因为收敛序列的性质，它的最小值肯定是要小于等于序列的平均值，有下面的不等式
\begin{equation}
g\_{N}^{_} \leq \frac{1}{\sqrt{N+1}}\left[\frac{1}{\omega} L\left(f\left(x\_{0}\right)-f^{*}\right)\right]^{1 / 2}
\end{equation}

考虑符合下面这一类的问题：

模型

1. 无约束的最小值
1. $$f \in C_{L}^{1,1}\left(\mathbb{R}^{n}\right)$$
1. $$f(x)$$ 有下界

Oracle为一阶黑盒，而它的 $$\epsilon$$ 解为 $$f(\overline{x}) \leq f\left(x_{0}\right),\left\\vert f^{\prime}(\overline{x})\right\\vert  \leq \epsilon$$

根据前面得到的梯度下降的收敛速度（收敛率）公式，可以知道如果要满足这个解的条件需要
\begin{equation}
g\_{N}^{_} \leq \frac{1}{\sqrt{N+1}}\left[\frac{1}{\omega} L\left(f\left(x\_{0}\right)-f^{_}\right)\right]^{1 / 2} \leq \epsilon
\end{equation}
也就是至多经过 $$N+1 \geq \frac{L}{\omega \epsilon^{2}}\left(f\left(x_{0}\right)-f^{*}\right)$$ 能达到这种计算精度。这个作为复杂度上界已经很不错了，它不会随着 $$n$$ 的变化而变化，不过现在这种方法的下界还不清楚。

### 局部收敛

以下的什么方式可以说这个梯度方法是局部收敛的，还是求最小值问题，首先使这类问题满足下面的假设

1. $$f \in C_{M}^{2,2}\left(\mathbb{R}^{n}\right)$$
1. 函数 $$f$$ 的局部最小化存在，它的 Hessian是正定的
1. 我们知道一些在 $$x^{*}$$ 上关于 Hessian 的界 $$\mu I_{n} \leq \nabla^{2} f\left(x^{*}\right) \leq L I_{n}$$
1. 我们的初始点 $$x_0$$ 和 $$x^{*}$$ 足够近

因为在最优点 $$x^{*}$$ 函数的导数为0，所以
\begin{equation}
\begin{aligned} \nabla f\left(x\_{k}\right) &=\nabla f\left(x\_{k}\right)-\nabla f\left(x^{_}\right) \\\\ &=\int\_{0}^{1} \nabla^{2} f\left(x^{_}+\tau\left(x\_{k}-x^{_}\right)\right)\left(x\_{k}-x^{_}\right) d \tau \\\\ &=G\_{k}\left(x\_{k}-x^{_}\right) \end{aligned}
\end{equation}
其中 $$G*{k}=\int*{0}^{1} \nabla^{2} f\left(x^{_}+\tau\left(x*{k}-x^{*}\right)\right) d \tau$$ 二阶导数经过这个步骤积分完之后也就得到 $$\nabla f(x_k)/(x_k-x^{*})$$
因为根据梯度下降，从 $$x_k$$ 到 $$x*{k+1}$$ 走过的位移为 $$-h_k \nabla f(x_k)$$ 也就得到
\begin{equation}
x\_{k+1}-x^{_}=x\_{k}-x^{_}-h\_{k} G\_{k}\left(x\_{k}-x^{_}\right)=\left(I\_{n}-h\_{k} G\_{k}\right)\left(x\_{k}-x^{_}\right)
\end{equation}
有一种叫做收缩映射（contracting mappings）[^2]的标准技术可以分析这个过程，令序列 $$\left\{a_{k}\right\}$$ 的定义如下：
\begin{equation}
a\_{0} \in \mathbb{R}^{n}, a\_{k+1}=A\_{k} a\_{k}
\end{equation}
这里的 $$A_k$$ 是一个 $$(n\times n)$$ 的矩阵，且满足 $$\left\\vert A_{k}\right\\vert  \leq 1-q$$ 其中 $$q\in (0,1)$$，这个序列的收敛速度（收敛率）是趋于0的。

\begin{equation}
\left\|a\_{k+1}\right\| \leq(1-q)\left\|a\_{k}\right\| \leq(1-q)^{k+1}\left\|a\_{0}\right\| \rightarrow 0
\end{equation}
因为在上面的例子中，我们需要估计 $$\left\\vert I_{n}-h_{k} G_{k}\right\\vert $$ 所以沿用第一节中几何解释的方法，选择一个距离，记 $$r_{k}=\left\\vert x_{k}-x^{*}\right\\vert $$，根据几何解释的推论 $$\left\\vert \nabla^{2} f(x)-\nabla^{2} f(y)\right\\vert  \leq M\\vert x-y\\vert , \quad \forall x, y \in \mathbb{R}^{n}$$ 根据 $$\nabla^2 f(x^{*})$$ 上下界得到
\begin{equation}
\nabla^{2} f\left(x^{_}\right)-\tau M r\_{k} I\_{n} \preceq \nabla^{2} f\left(x^{_}+\tau\left(x\_{k}-x^{_}\right)\right) \preceq \nabla^{2} f\left(x^{_}\right)+\tau M r\_{k} I\_{n}
\end{equation}
对 $$\tau$$ 从 $$0\sim 1$$ 积分也就可以再写成下面的形式，因为 $$\mu$$ 和 $$L$$ 是我们已知的 $$f(x^{*})$$ 的信息
\begin{equation}
\left(\mu-\frac{r\_{k}}{2} M\right) I\_{n} \preceq G\_{k} \preceq\left(L+\frac{r\_{k}}{2} M\right) I\_{n}
\end{equation}
将上面的这个不等式再配出 $$\left\\vert I_{n}-h_{k} G_{k}\right\\vert $$ 的形式则有以下形式
\begin{equation}
\left(1-h\_{k}\left(L+\frac{r\_{k}}{2} M\right)\right) I\_{n} \leq I\_{n}-h\_{k} G\_{k} \preceq\left(1-h\_{k}\left(\mu-\frac{r\_{k}}{2} M\right)\right) I\_{n}
\end{equation}
为了表述方便将不等式两边分别表示为 $$a_{k}(h)=1-h\left(\mu-\frac{r_{k}}{2} M\right)$$ 和 $$b_{k}(h)=h\left(L+\frac{r_{k}}{2} M\right)-1$$，重写成下面的形式
\begin{equation}
\left\|I\_{n}-h\_{k} G\_{k}\right\| \leq \max \left\{a\_{k}\left(h\_{k}\right), b\_{k}\left(h\_{k}\right)\right\}
\end{equation}
如果 $$0 < r_{k} <\overline{r} \equiv \frac{2 \mu}{M}$$ 那么 $$a_k(\cdot)$$ 就是严格下降的函数，并且可以保证 $$\left\\vert I_{n}-h_{k} G_{k}\right\\vert <1$$ 只要 $$h_k$$ 足够小，就能够保证 $$r_{k+1} < r_k$$。有多个梯度选择的方法可以使用，例如可以选择已经证明的 $$h_k=\frac{1}{L}$$ 优化这个最小化最大值的思路就是让
\begin{equation}
\max \left\{a\_{k}(h), b\_{k}(h)\right\} \rightarrow \min \_{h}
\end{equation}
假设 $$r_0 < \bar{r}$$ 那么按照最优的方式构造的序列就可以保证 $$r_{k+1} < r_{k}<\overline{r}$$，从而找到最好的步长 $$h^{*}_{k}$$
\begin{equation}
a\_{k}(h)=b\_{k}(h) \quad \Leftrightarrow \quad 1-h\left(\mu-\frac{r\_{k}}{2} M\right)=h\left(L+\frac{r\_{k}}{2} M\right)-1
\end{equation}
最终得到这个最佳的步长是不依赖于 $$M$$ 的值
\begin{equation}
h\_{k}^{_}=\frac{2}{L+\mu}
\end{equation}
把这个最优值带回到原来的不等式中得到 $$r_{k+1}$$ 和 $$r_k$$ 之间的关系
\begin{equation}
r\_{k+1} \leq \frac{(L-\mu) r\_{k}}{L+\mu}+\frac{M r\_{k}^{2}}{L+\mu}
\end{equation}
然后根据这个序列的关系来估计整个过程中的收敛速度，令 $$q=\frac{2 \mu}{L+\mu}$$ 根据 $$h^{_}$$ 带入解的形式的公式得到 $$a_k=\frac{M}{L+\mu} r_{k}( < q)$$ 所以带回到原来的不等式关系中去再配成数列通项形式
\begin{equation}
a\_{k+1} \leq(1-q) a\_{k}+a\_{k}^{2}=a\_{k}\left(1+\left(a\_{k}-q\right)\right)=\frac{a\_{k}\left(1-\left(a\_{k}-q\right)^{2}\right)}{1-\left(a\_{k}-q\right)} \leq \frac{a\_{k}}{1+q-a\_{k}}
\end{equation}
所以取不等式最左边和最右边，取倒数可以得到
\begin{equation}
\frac{q}{a\_{k+1}}-1 \geq \frac{q(1+q)}{a\_{k}}-q-1=(1+q)\left(\frac{q}{a\_{k}}-1\right)
\end{equation}
我们得到等比数列的通项形式之后可以再进一步知道它和第一项之间关系
\begin{equation}
\begin{aligned} \frac{q}{a\_{k}}-1 & \geq(1+q)^{k}\left(\frac{q}{a\_{0}}-1\right)=(1+q)^{k}\left(\frac{2 \mu}{L+\mu} \cdot \frac{L+\mu}{r\_{0} M}-1\right) \\\\ &=(1+q)^{k}\left(\frac{\overline{r}}{r\_{0}}-1\right) \end{aligned}
\end{equation}
因此
\begin{equation}
a\_{k} \leq \frac{q r\_{0}}{r\_{0}+(1+q)^{k}\left(\overline{r}-r\_{0}\right)} \leq \frac{q r\_{0}}{\overline{r}-r\_{0}}\left(\frac{1}{1+q}\right)^{k}
\end{equation}
证明了整个过程中的收敛率。

> 如果有满足我们以上假设的函数 $$f(\cdot)$$ 并且让它的起始点 $$x_0$$ 和最优的局部最低点 $$x^{*}$$ 已经非常靠近了，那么有：
>
> $$
> r_{0}=\left\|x_{0}-x^{*}\right\|<\overline{r}=\frac{2 \mu}{M}
> $$
>
> 带入前面计算得到的最优的步长 $$h_{k}^{*}=\frac{2}{L+\mu}$$ 可以计算得到收敛到如下：
> \begin{equation}
> \left\|x\_{k}-x^{\*}\right\| \leq \frac{\overline{r} r\_{0}}{\overline{r}-r\_{0}}\left(1-\frac{2 \mu}{L+3 \mu}\right)^{k}
> \end{equation}
> 这种就称为线性收敛率。

---

[^1]: NESTEROV J E. Lectures on convex optimization[M]. 2018.
[^2]: [Contraction mapping Wiki](https://en.wikipedia.org/wiki/Contraction_mapping)
