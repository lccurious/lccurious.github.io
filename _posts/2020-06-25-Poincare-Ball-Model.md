---
layout: post
title: 庞加莱球模型
categories:
  - 机器学习
tags:
  - 庞加莱球
date: 2020-06-25 11:21:33
typora-root-url: Poincare-Ball-Model
giscus_comments: true
---

庞加莱（1854 - 1912）活跃在 19 世纪和 20 世纪之交的人，人类历史上最伟大的数学家之一、当时理论物理与数学物理所有分支的一流专家、爱因斯坦相对论的先驱、最伟大的天体力学家之一、著名的科学哲学家、散文家。他给出了相对论的基础之一的“光速不变原理”，是相对论的先驱。以他名字命名的庞加莱圆盘模型（Poincaré disk model）也称共形圆盘模型，是一个双曲几何模型，欧式空间中的直线概念（在这里更准确的说法是测地线）在这里就是对应到垂直于圆盘边界的圆弧或者圆盘的直径。如下图所示，图中每两个点之间的线代表的长度都是相同的，也就是说在庞加莱圆盘模型中每离中心越远，单位欧几里得空间的线段所代表的长度就越长。所以当点越靠近圆盘的边界，它们之间的实际距离就会变得无限大。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/Poincare_line.png" title="庞加莱球模型" class="img-fluid rounded z-depth-1" caption="庞加莱球模型" %}
    </div>
</div>

<!-- more -->

1. 几何学公理既非综合判断，也非实验经验，他们是约定。约定是心智的产物，约定的选择是自由的，但又不是随意的。
2. 假使自然界没有固体，便不会有几何学。欧几里德几何学的性质与天然固体非常符合。
3. 欧几里德几何学不比非欧几何学更真，它只是更为方便而已。经验在任何时候都不会与欧几里德共设相矛盾，同样任何经验永远也不会和罗巴切夫斯基共设相矛盾。
4. 可以建立一本词典，把非欧几何的术语和欧几里德几何的术语之间建立一一对应的关系，这样非欧几何将永远不会和欧几里德几何相矛盾。
5. 实验告诉我们的是物体之间的相互关系；至于物体与空间的关系，或者空间个部分的互相关系，没有一个实验影响或者能够影响。实验与空间无关，而与物体有关。

# 双曲空间

在几何学中，双曲面模型也称为闵可夫斯基模型，或者洛伦兹模型。是n-维双曲几何的一个模型，其中点由(n+1)-维闵可夫斯基空间中双曲面的向前叶$$S^{+}$$中的点表示，

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/image-20201008103300174.png" title="从三维到二维的投影面" class="img-fluid rounded z-depth-1" caption="从三维到二维的投影面" %}
    </div>
</div>

如上图所示，这是一个在三维空间中的二维双曲曲面的例子，光线从最下面的$$(0,0,-1)$$点射出，经过灰色的庞加莱圆盘到达绿色的双曲面，红色圆弧为灰色庞加莱圆盘模型上的测地线[^1]，投影到绿色双曲面模型上的即为庞加莱圆盘空间中的棕色测地线。

对于一条双曲线方程：$$x^2-y^2=1$$ 而言，双曲线会无限接近两条线，但是并不会靠近，且这两条直线是经过原点的，如果把坐标轴往右边平移一个单位，那么原点变成$$(-1, 0)$$也就容易解释为什么文章会强调是从第一维坐标是$$-1$$的位置投影了。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/image-20201008103730839.png" title="庞加莱圆盘" class="img-fluid rounded z-depth-1" caption="庞加莱圆盘" %}
    </div>
</div>

如上图所示的$$\mathbb{B},\mathbb{K},\mathbb{L}$$分别对应于庞加莱圆盘模型、克莱因圆盘模型、双曲面模型。这里每一个模型中的每一条测地线都是上半叶双曲面和过原点平面的交线，也就是两点之间的测地距离（最短距离）。

## 庞加莱半平面模型

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/2880px-Poincare_halfplane_heptagonal_hb.svg.png" title="星形规则的七边形瓷砖模型" class="img-fluid rounded z-depth-1" caption="星形规则的七边形瓷砖模型" %}
    </div>
</div>

在非欧几何中，庞加莱半平面模型是一个上半平面，且有自己的度量（即庞加莱度量）$$\mathbb{H}=\{(x,y)\vert y>0;x,y\in\mathbb{R}\}$$，组成一个二维双曲几何的模型。这个模型是保角的，即这个模型上任意一点的角度和在原双曲面上的该点的角度是相同的。通过把实数$$x$$替换成一个欧式空间中的$$n$$-维向量，这个模型可以被泛化为一个建模$$n+1$$维的双曲空间的模型。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/700px-Parallel_rays_in_Poincare_model_of_hyperbolic_geometry.svg.png" title="Parallel rays in Poincare half-plane model of hyperbolic geometr" class="img-fluid rounded z-depth-1" caption="Parallel rays in Poincare half-plane model of hyperbolic geometr" %}
    </div>
</div>

作为双曲几何中的庞加莱半平面模型，上图中所有的直线都是相互平行的。半平面中的距离度量方式$$\{\langle x, y\rangle\vert y>0\}$$为：
\begin{equation}
(ds)^{2}=\frac{(dx)^{2}+(dy)^{2}}{y^{2}}
\end{equation}
从原点出发到另外一个点的线段是垂直于下面的坐标轴的，它看起来可能是一个半圆弧形的或者直线形的。

而其中任意两点$$(x_{1}, y_{1}),(x_{2},y_{2})$$之间的距离度量为：

$$
\begin{aligned}{\rm dist}(\langle x_{1}, y_{1}\rangle, \langle x_{2}, y_{2}\rangle)&={\rm arccosh}(1+\frac{(x_{2}-x_{1})^{2}+(y_{2}-y_{1})^{2}}{2y_{1}y_{2}})\\\\
&=2{\rm arsinh}\frac{1}{2}\sqrt{\frac{(x_{2}-x_{1})^{2}+(y_{2}-y_{1})^{2}}{y_{1}y_{2}}}\\\\
&=2\ln \frac{\sqrt{(x_{2}-x_{1})^{2}+(y_{2}-y_{1})^{2}}+\sqrt{(x_{2}-x_{1})^{2}+(y_{2}+y_{1})^{2}}}{2\sqrt{y_{1}y_{2}}}\\\\
\end{aligned}
$$

## 超圆形

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/image-20201008105139511.png" title="超圆形" class="img-fluid rounded z-depth-1" caption="超圆形" %}
    </div>
</div>

在双曲几何中，超圆形或等距曲线定义为与给定直线具有相同的正交距离的曲线。给定直线L和不在L上的点P时，可以通过将L的同一侧的所有点Q取为P且与L的垂直距离等于P的距离来构造超圆形。 直线L称为超圆形的轴，中心或基线。垂直于轴（也垂直于超圆形）的线称为超圆形的法线。轴与超圆形之间的法线段称为半径。所以在这里，以上的红线表示的就是与中间L蓝线等距的点组合成的超圆形，红线上的每一点到这个L“距离”都是相等的。

## 二维下的一般形式

庞加莱圆盘 $$\mathbb{H}_{2}$$ 就是一个双曲几何的二维的模型，所有的点都落在这个单位圆盘内部，一个常见的推广就是庞加莱球 $$\mathcal{H}_{r}$$，所有的点都在这个单位球的内部。它有很多有用的性质，其中一条就是和我们常见的欧几里得空间有很多相似性，在欧式空间和双曲空间具备保角性，在某种程度上距离也是相似的：
\begin{equation}
d\_{H}(x,y) = \text{arcosh}(1+2\frac{\|x-y\|^{2}}{(1-\|x\|^{2})(1-\|y\|^{2})})
\end{equation}

因为庞加莱圆盘的几何性质，可以用来对实体进行层次性的建模，学习知识图谱间的层次性信息。我们还是以 $$\| x\| =\| y\| =t$$ 为例，对于任意的 $$t>0$$，当 $$t\rightarrow 1$$ 时（点移动向圆盘的边界），它们所在的空间中，实际距离将会变得越来越大，极限情况下，它们之间的距离无限大，它们各自到原点的距离也无限大，就像树的结构一样，两个兄弟子节点间的距离和它们到父节点的距离相同。这种和树形结构天然相似的空间扭曲结构也就是探索这些知识图谱嵌入结构层次性的重要关键性质。另外因为保角性，这种性质还能在 $$x$$ 和 $$y$$ 有任意小的夹角下保证。

庞加莱模型的评分函数为：

\begin{equation}
f\_{r}(o\_{s},o\_{t}) = \sum\_{(o\_{s},o\_{t})\in \mathcal{D}}\log \frac{\exp(-d(o\_{s},o\_{t}))}{\sum\_{o\_{t'}}\exp(-d(o\_{s},o\_{t'}))}
\end{equation}

其中 $$(o_{s},o_{t'})$$ 为负样本，也就是要让相关联的三元组在庞加莱圆盘中有更小的距离。但是庞加莱圆盘模型没有考虑相关性质，双曲模型不能再庞加莱圆盘中进行复杂的操作。另外，双曲空间需要黎曼优化方法，包括黎曼曲率张量、黎曼流形和黎曼优化等概念。

## 度量形式

庞加莱圆盘的度量形式为：

\begin{equation}
ds^{2}=4\frac{\sum\_{i}dx^{2}\_{i}}{(1-\sum\_{i}x^{2}\_{i})^{2}}
\end{equation}

其中，$$i$$表示对应的维度编号，欧式空间的加和在庞加莱球空间中就是莫比乌斯加和（Möbius addition）：

\begin{equation}
\mathbf{z}\oplus\_{c}\mathbf{y}=\frac{(1+2c\langle \mathbf{z},\mathbf{y}\rangle + c\|\mathbf{y}\|^{2})\mathbf{z}+(1-c\|\mathbf{z}\|^{2})\mathbf{y}}{1+2c\langle \mathbf{z}, \mathbf{y}\rangle + c^{2}\|\mathbf{z}\|^{2}\|\mathbf{y}\|^{2}}
\end{equation}

而恢复到在 $$\mathbb{R}^{d}$$ 的欧几里得加和则为，令 $$c\rightarrow 0$$，解析形式的运算为指数映射：

\begin{equation}
\exp^{c}\_{\mathbf{z}}(\mathbf{v})=\mathbf{z}\oplus\_{c}(\tanh (\sqrt{c}\frac{\lambda^{c}\_{\mathbf{z}}\|\mathbf{v}\|}{2})\frac{\mathbf{v}}{\sqrt{c}\|\mathbf{v}\|})
\end{equation}

其中 $$\lambda^{c}_{\mathbf{z}}=\frac{2}{1-c\| \mathbf{z}\| ^2}$$，相反的操作就是对数映射：

\begin{equation}
\log^{c}\_{\mathbf{z}}(\mathbf{y})=\frac{2}{\sqrt{c}\lambda^{c}\_{\mathbf{z}}}\tanh^{-1}(\sqrt{c}\|-\mathbf{z}\oplus\_{c}\mathbf{y}\|)\frac{-\mathbf{z}\oplus\_{c}\mathbf{y}}{\|-\mathbf{z}\oplus\_{c}\mathbf{y}\|}
\end{equation}

# 发展脉络

在自然界中，双曲空间作为一种曲率为负的几何形式广泛存在，最著名的例子就属在广义相对论中，引力也被解释为一种弯曲的几何体。另一个鲜明的例子就是在计算机科学中，很多复杂的问题，如果能找到一种良好的集合表示就可以简化成比较简洁的形式。此外，还有一个例子就是一个关于量子力学的假设，宇宙的背后可能存在一个分型几何。[^2]

2010年Krioukov等人提出用双曲几何研究复杂网络的结构和功能他们假设复杂网络中存在双曲几何特性，因为复杂网络中就存在层次结构且这种树状结构可以用双曲几何用连续的形式表示。像在无尺度网络中，大部分的节点只和很少的节点连接，而极少的节点和非常多的节点连接，这其中天然存在的节点度的幂律分布和双曲几何也呈现出惊人的一致性。如果网络的度数是不均匀的，那么网络的确有一个近似的双曲几何性质在其中。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/image-20201007222703252.png" title="双曲模型" class="img-fluid rounded z-depth-1" caption="双曲模型" %}
    </div>
</div>

圆盘最外环的圆形并不是双曲平面的一部分，它是一个在度量上无限远，无法达到的一个边界。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/image-20201007234250820.png" title="不同曲率几何的直观解释" class="img-fluid rounded z-depth-1" caption="不同曲率几何的直观解释" %}
    </div>
</div>

上表展示了几种不同几何曲率下的对应的度量性质。

## 双曲几何的优化

测地线的凸性质把凸的（向量空间）标记推广到了非线形度量空间[^3]。

### 固定负曲率的黎曼流形

在固定曲率的的黎曼流形中，每一步优化计算得到的更新量需要用黎曼梯度，相当于原来我们常见的欧式空间中计算方式得到的值再进行一次尺度变换。
\begin{equation}
u\leftarrow \exp\_{u}(-\eta \nabla^{R}\_{u}\mathcal{L}),\quad u\in\mathbb{D}
\end{equation}
其中$$u$$是更新量，$$\eta$$对应于训练过程中的学习率，$$R$$是当前在双曲流形中所处位置对应的半径距离。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2020-06-25-Poincare-Ball-Model/image_20201010115749966.png" title="双曲梯度和欧式空间梯度的直观对比" class="img-fluid rounded z-depth-1" caption="双曲梯度和欧式空间梯度的直观对比" %}
    </div>
</div>

因为这里的准确梯度计算需要基于点$$u$$的位置信息，需要使用黎曼梯度来表示，而且每一步计算都是取决于当前所处的位置，这一点和常规基于欧式空间的优化方法是挺不一样的，因为每个位置的度量是不同的。

### 黎曼自适应优化方法

像随机梯度下降算法有对应的加速梯度下降或者方差缩减方法已经有对于的黎曼流形的优化的版本。但是像Adam、Adagrad和Amsgrad等，暂时还没有对应的解决方案。

对于一个$$n$$维的流形$$\mathcal{M}$$，它的在一个很小的局部和欧式空间的几何性质非常接近。对于一个球面流形嵌入$$\mathbb{S}:=\{x\in\mathbb{R}^{n}\mid \| x\| _2=1\}$$而言，以它作为流形的空间的维度就是$$n-1$$。此外，它的切空间是一个$$n$$维的向量空间$$T_{x}\mathcal{M}$$，看成是流形在$$x$$附近的一阶近似。黎曼空间和和欧式空间的度量方式不同，所以在黎曼几何中，需要一组用于衡量该流形中距离，面积及角度的二阶张量也称为黎曼张量。黎曼张量就像是一把尺子，黎曼流形上的每个点$$x$$的切空间都定义了欧式内积 $$\rho_{x}:T_{x}\mathcal{M}\times T_{x}\mathcal{M}\rightarrow\mathbb{R}$$，而且其数值都随$$x$$平滑地改变，它允许我们定义弧线长度、角度、面积、体积、曲率、函数梯度及向量域的散度。一个黎曼流形通常的表示形式是一对$$(\mathcal{M},\rho)$$。

对于基本形式的梯度下降算法：
\begin{equation}
x\_{t+1}\leftarrow x\_{t}-\alpha g\_{t},
\end{equation}
后一步的变量$$x_{t+1}$$为当前时刻的变量$$x_{t}$$作用上一个梯度更新量$$g_{t}$$，对应的在黎曼流形上的梯度下降算法就是：
\begin{equation}
x\_{t+1}\leftarrow \exp\_{x\_{t}}(-\alpha g\_{t}),
\end{equation}
其中$$g_{t}\in T_{x_{t}}\mathcal{M}$$作为函数$$f_{t}$$在$$x_{t}$$处的梯度，而在切空间（近似欧式空间）走过的距离应该被换算到流形上测地线走过的长度，所以就有了这个指数函数的映射。当这里的$$(\mathcal{M},\rho)$$为欧几里得空间$$(\mathbb{R}^{n},\mathbf{I}_{n})$$时，在公式上两种更新方式就显得一致了，也就有$$\exp_{x}(v)=x+v$$。但是如果还需要考虑历史的梯度信息作为当前这步梯度更新的改进时，这种简单的推广形式就不能直接成立了。

在欧式空间中，平行移动两点$$x$$和$$y$$并不取决于移动的路径。但是在黎曼流形中，不仅取决于移动的路径，同时曲率也会给平移带来旋转分量。此外，由于用于表示梯度的坐标系取决于优化路径，因此这样也就完全失去将自适应性解释为在不同速度下优化不同特征（即梯度坐标，针对每一个维度都给出它对应的学习率）。

**解决方案**：因为梯度更新是在切空间中定义的，可以把它看成是在切空间$$T_{x_{0}}\mathcal{M}\simeq \mathbb{R}^{d}$$有一个固定的经典坐标系 $$e:=(e^{(1)}, \dots, e^{(n)})$$基于$$x_{0}\in \mathcal{M}$$。沿着优化路径对$$e$$进行平移就得到了下面的调节形式：
\begin{equation}
x\_{t+1}\leftarrow \exp\_{x\_{t}}(\Delta\_{t}), \quad e\_{t+1}\leftarrow P\_{x\_{t}}(e\_{t};\Delta\_{t}), \quad {\rm with}~\Delta\_{t}:=-\alpha g\_{t}\oslash \sqrt{\sum^{t}\_{t=1}(g\_{k})^{2}}
\end{equation}
其中$$\oslash$$和$$(\cdot)^{2}$$表示基于坐标元素除法和平方的操作，这些操作都是相对于坐标系统$$e_{t}$$的，是局部成立的坐标表示和操作。

因为欧式空间的曲率为0，所以在空间可以用一个固有的坐标系来表示，但是在黎曼流形中不能找到可以像这样统一表示所有向量的坐标系。因此，在黎曼流形中用$$x$$的分量$$x^{i}\in\mathcal{M}^{i}$$作为“坐标”。

#### Adagrad

常规形式：
\begin{equation}
x^{i}\_{t+1}\leftarrow x^{i}\_{t}-\alpha g^{i}\_{t}/\sqrt{\sum^{t}\_{k=1}(g^{i}\_{k})^{2}}.
\end{equation}
黎曼流形上的形式：
\begin{equation}
x^{i}\_{t+1}\leftarrow \exp^{i}\_{x^{i}\_{t}}\left(-\alpha g^{i}\_{x^{i}\_{t}}/\sqrt{\sum^{t}\_{k=1}\|g^{i}\_{k}\|^{2}\_{x^{i}\_{k}}}\right).
\end{equation}
其中的自适应项$$\| g^{i}_{k}\| ^{2}_{x^{i}_{k}}=\rho^{i}_{x^{i}_{t}}(g^{i}_{t}, g^{i}_{t})$$缩放了梯度。在欧式空间的设定中，这个量就是梯度的平方，是SGD在第$$i$$个坐标上的更新量，它是通过学习率缩放过的：$$\vert g^{i}_{t}\vert =\vert x^{i}_{t+1}-x^{i}_{t}\vert /\alpha$$。类推到黎曼流形$$\mathcal{M}_{i}$$中就有，$$d^{i}(x^{i}_{t+1},x^{i}_{t})=d^{i}(\exp^{i}_{x^{i}_{t}}(-\alpha g^{i}_{t}), x^{i}_{t})=\| -\alpha g^{i}_{t}\| ^{2}_{x^{i}_{t}}$$，这种类推之后得到的结论形式代入RSGD就得到以上的形式。

#### Adam

\begin{equation}
x^{i}\_{t+1}\leftarrow x^{i}\_{t}-\alpha m^{i}\_{t}/\sqrt{v^{i}\_{t}}.
\end{equation}

其中$$m_{t}=\beta_{1}m_{t-1}+(1-\beta_{1})g_{t}$$可以看成是一个动量项，$$v^{i}_{t}=\beta_{2}v^{i}_{t-1}+(1-\beta_{2})(g^{i}_{t})^{2}$$是一个可调节的项。

因为这里的$$m_{t}$$的计算特点，需要将在各个位置计算得到的梯度向量都移到当前的位置来，在欧式空间中可以很自然通过加权的方式直接更新，但是在黎曼流形中，每个向量的度量取决与它所在位置。

分别用$$P^{i},\exp^{i},\log^{i}$$表示在$$(\mathcal{M}_{i},\rho^{i})$$中的平移、指数和对数映射。

#### Amsgrad

\begin{equation}
x^{i}\_{t+1}\leftarrow x^{i}\_{t}-\alpha m^{i}\_{t}/\sqrt{\hat{v}^{i}\_{t}},\quad {\rm where}~\hat{v}^{i}\_{t}=\max\{\hat{v}^{t}\_{t-1},v^{i}\_{t}\}
\end{equation}

在欧式空间下，同样的向量在各个位置的表示都不会变化，但是在黎曼流形中就需要取决于它在流形上所处的位置。所以要更新下一时刻的参数值$$x^{i}_{t+1}$$时，需要再将对应的$$m_t$$从$$T_{x_{t}}\mathcal{M}$$平移到对应的$$T_{x_{t+1}}\mathcal{M}$$以便下一次计算所需的$$m_{t}$$就只需要经过一次黎曼流形上的平移映射。

## 双曲几何的应用

### 建模树形关系

双曲几何的性质决定了它比常规的欧几里得几何能更好地建模树形的结构，所以可以天然地应用到树形关系的表示中去。在双曲几何中两点之间的距离为他们之间的测地线的长度。越远离中心的位置，两点之间的测地距离会越大，可以很好地容纳下指数增长的子节点。

---

[^1]: <https://zh.wikipedia.org/wiki/%E6%B5%8B%E5%9C%B0%E7%BA%BF>
[^2]: Hyperbolic geometry of complex networks
[^3]: First-order methods for geodesically convex optimization
