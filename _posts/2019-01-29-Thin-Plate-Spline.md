---
layout: post
title: Thin Plate Spline
categories:
  - 工程
tags:
  - 数值计算
date: 2019-01-29 21:17:40
giscus_comments: true
---


给定两张图片中一些相互对应的关键点，如何能够将其中一张图片形变到另外一张图片上使得这些关键点都对应重合？这就是TPS方法所要解决的问题，TPS可以对表面进行柔性的变形。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-01-29-Thin-Plate-Spline/Fig7.jpeg" title="Total TPS spline surfaces for the geometric transformation between Acaste (red) and Calymene (green). (A) Basal (non-deformed) grid for Acaste landmark configuration. (B) Basal (non-deformed) grid for Calymeme landmark configuration. (C) Thin plate spline surface for the Calymeme-Acaste transformation. (D) Thin plate spline surface for the Acaste-Calymeme transformation." class="img-fluid rounded z-depth-1" caption="Total TPS spline surfaces for the geometric transformation between Acaste (red) and Calymene (green). (A) Basal (non-deformed) grid for Acaste landmark configuration. (B) Basal (non-deformed) grid for Calymeme landmark configuration. (C) Thin plate spline surface for the Calymeme-Acaste transformation. (D) Thin plate spline surface for the Acaste-Calymeme transformation." %}
    </div>
</div>

<!-- more -->

Thin Plate Spline（TPS，薄板样条）插值是常用的2D插值方法。它的物理意义是：假设在原形状中有$$N$$个点$$A_n$$，这$$N$$个点在形变之后新坐标之下对应新的$$N$$个点$$B_n$$。用一个薄钢板的形变来模拟2D形变，确保这$$N$$个点能够正确匹配，那么怎样的形变，可以使钢板的弯曲能量最小？TPS插值是这个问题的数值解法。

几乎所有的生物有关的形变都是可以用TPS来近似，Bookstein本人就是生物形态计量的大师。

## 样条曲线插值 ##

线性插值对每个区间$$[x_k,x_{k+1}]$$使用线性函数。 样条插值在每个间隔中使用低阶多项式，并选择多项式以使它们平滑地吻合在一起。 结果函数被称为样条曲线。 例如，三次样条是分片段立方，两次连续可微。此外，它的二阶导数在终点为零。

## 薄板样条 ##

薄板样条插值使薄板的弯曲能量最小，不过把2D图像看成薄板没错，但是弯曲的能量并不是$$N$$个点形变对应位置所产生在薄板内的“弯曲”。实际上，这个样条函数是对每一个维度的坐标分别进行插值，在后面也会看到代码会对坐标进行一个展平的操作。每一维的形变施加于垂直于薄板的方向，简单地说就是针对二维xy平面在它的z方向上进行变换，让在这个维度上的薄板往上凸或者往下凹从而完成这个薄板的形变。

### K个控制点插值 ###

考虑这样一个插值问题：自变量 $$\mathbf{x}$$ 是2维空间中的一点，函数值 $$\mathbf{y}$$ 也是2维空间中的一点，并且都在笛卡尔坐标系下表示。给定 $$N$$ 个自变量 $$\mathbf{x}_k$$ 和对应的函数值 $$\mathbf{y}_k$$ ，求插值函数。[^2]

已知K个控制点 $$\{c_i, i=1, \dots, K\}$$ 用径向基函数[^3]可以将原来的坐标变换到另一个坐标去：

$$
\Phi(x)=\sum^K_{i=1}w_i \sigma(\|x-c_i\|)
$$

其中 $$\sigma( r )=r^2\log r$$ 是径向基函数核。也可以看到每个新的值都是会受到所有其他非一一对应控制点的影响。

$$
\Phi(\mathbf{x})=\begin{bmatrix}\Phi_1(\mathbf{x})\\\Phi_2(\mathbf{x})\end{bmatrix}
$$

这里是2维空间，所以是两个插值函数，如果是D维那就是求D个插值函数，可以写成向量形式：

$$
\mathbf{y}_k = \Phi(\mathbf{x}_k).
$$

其中插值函数$$\Phi_1$$可以写成：

$$
\Phi_1(\mathbf{x})=\mathbf{c}+\mathbf{a}^T \mathbf{x}+\mathbf{w}^T \mathbf{s}(\mathbf{x})
$$

其中$$\mathbf{c}$$是标量，$$\mathbf{a}\in \mathbb{R}^{2\times 1}$$因为例子中维度为2, $$\mathbf{w}\in \mathbb{R}^{N\times1}$$,函数向量

$$
\mathbf{s}(\mathbf{x})=(\sigma(\|\mathbf{x}-\mathbf{x}_1\|),\sigma(\|\mathbf{x}-\mathbf{x}_2\|),\dots,\sigma(\|\mathbf{x}-\mathbf{x}_N\|))^T
$$

### 能量函数 ###

为了能够达到最好的求解方式，我们需要使得控制点尽可能和目标点的位置靠近，但是又要使得变形弯曲的能量最小。所以可以写成两项的共同优化（二维空间点的形式）：

$$
\sum^{K}_{i=1}\|\mathbf{y}_{i} - \Phi(\mathbf{x}_{i}) \|^{2} + \lambda J_{2}(\Phi)
$$

其中，第一项是控制点和目标误差的优化目标，第二项是弯曲能量优化的目标且用 $$\lambda$$ 来控制二者的权重，在文献[^1]已经给出证明，这种形式的插值函数是使弯曲能量最小的

$$
J_{2}(\Phi)= \iint_{\mathbb{R}^2} \left((\frac{\partial^2 \Phi}{\partial x^2}) ^{2} + (\frac{\partial^2 \Phi}{\partial x \partial y}) ^{2} + (\frac{\partial^2 \Phi}{\partial y^2}) ^{2} \right) dxdy
$$

如果是有限离散的数据形式就相当于是数据挖掘中常用的[elastic maps](https://en.wikipedia.org/wiki/Elastic_map)。将径向基函数的形式带入，我们可以得到能量函数的完整形式：

$$
J(\Phi)=\sum^{2}_{j=1}
$$

### 求解过程 ###

在TPS插值函数$$\Phi$$中有$$1+D+N$$个参数，其中$$D$$在这里为2，所以再加上维度的约束：

$$
\sum^N_{k=1} w_k = 0
$$

$$
\sum^N_{k=1} x^x_k w_k = 0
$$

$$
\sum^N_{k=1} x^y_k w_k = 0
$$

$$\mathbf{x}^x_k$$ 和 $$\mathbf{x}^y_k$$ 分别表示点 $$\mathbf{x}$$ 的 $$x$$ 坐标值和 $$y$$ 坐标值，可以将内容简写成：

$$
\begin{bmatrix}1_N & X & S \\ 0 & 0 & 1^T_N \\ 0 & 0 & X^T\end{bmatrix} \begin{bmatrix} c \\ \mathbf{a} \\ \mathbf{w}\end{bmatrix} = \begin{bmatrix}Y^x \\ 0 \\ 0\end{bmatrix}
$$

其中 $$(S)_{ij}=\sigma({\bf x}_i-\bf x_j)$$，$$1_N$$ 表示值全为1的 $$N$$ 维列向量

$$
X = \left[\begin{matrix}
{\bf x}_1^x & {\bf x}_1^y\\
{\bf x}_2^x & {\bf x}_2^y \\
\cdots & \cdots \\
{\bf x}_N^x & {\bf x}_N^y
\end{matrix}\right]
$$

$$
Y^x = \left[\begin{matrix}
{\bf y}_1^x \\
{\bf y}_2^x  \\
\cdots  \\
{\bf y}_N^x 
\end{matrix}\right]
$$

把矩阵简化表示，令

$$
\Gamma =\left[\begin{matrix}1_N & X & S \\ 0 & 0 & 1^T_N \\ 0 & 0 & X^T\end{matrix}\right]
$$

如果 $$S$$ 是非奇异矩阵，则 $$\Gamma$$ 也是非奇异矩阵，可以解得参数为：

$$
\begin{bmatrix} c \\ \mathbf{a} \\ \mathbf{w}\end{bmatrix}= \Gamma^{-1}\left[\begin{matrix}
Y^x \\
0 \\
 0
\end{matrix}\right]
$$

然后把各个维度的 $$\Phi$$ 函数的参数都计算出来则有

$$
\left[\begin{matrix}
{\bf w}^x & {\bf w}^y\\
c^x &c^y\\
{\bf a}^x  & {\bf a}^y
\end{matrix}\right]= \Gamma^{-1}\left[\begin{matrix}
Y^x & Y^y\\
0 & 0\\
 0 &0
\end{matrix}\right]
$$

把 $$\Gamma^{-1}$$ 写成下面的形式有

$$
\Gamma^{-1}=\left[ \begin{matrix} 
\Gamma^{11} & \Gamma^{12}\\
\Gamma^{21} & \Gamma^{22}
\end{matrix}\right]
$$

矩阵 $$\Gamma^{12}$$ 为弯曲能量矩阵，秩为 $$N-3$$，$$\Gamma^{11}$$ 作为仿射矩阵，实现平移和旋转。

将这些形变应用到所有其他点 $$\{\mathbf{x}_i, i=1,\dots, M\}$$ 上需要和用于计算形变参数的控制点 $$\{\mathbf{x}^c_i, i=1, \dots, N\}$$ 一起构造对应的计算矩阵：

$$
\left[ \begin{matrix} 
1_N & X & S
\end{matrix}\right]
$$

其中 $$S_{ij}=\sigma(\mathbf{x}_i - \mathbf{x}_j)$$ 维度为 $$M\times N$$ 得到结果为：

$$
Y =\left[ \begin{matrix} 
1_N & X & S
\end{matrix}\right] \begin{bmatrix} c \\ \mathbf{a} \\ \mathbf{w}\end{bmatrix}
$$

## Numpy 实现

首先构造一个上文中的 $$\Gamma$$ 矩阵：

```python
def makeT(cp):
    # cp: [K x 2] control points
    # T: [(K+3) x (K+3)]
    K = cp.shape[0]
    T = np.zeros((K+3, K+3))
    T[:K, 0] = 1
    T[:K, 1:3] = cp
    T[K, 3:] = 1
    T[K+1:, 3:] = cp.T
    # compute every point pair of points
    R = squareform(pdist(cp, metric='euclidean'))
    R = R * R
    R[R == 0] = 1 # a trick to make R ln(R) 0
    R = R * np.log(R)
    np.fill_diagonal(R, 0)
    T[:K, 3:] = R
    return T
```

然后构造一个和 $$\Gamma$$ 进行计算的矩阵，将待转换的点对构造成矩阵形式

```python
def liftPts(p, cp):
    # p: [N x 2], input points
    # cp: [K x 2], control points
    # pLift: [N x (3+K)], lifted input points
    N, K = p.shape[0], cp.shape[0]
    pLift = np.zeros((N, K+3))
    pLift[:,0] = 1
    pLift[:,1:3] = p
    R = cdist(p, cp, 'euclidean')
    R = R * R
    R[R == 0] = 1
    R = R * np.log(R)
    pLift[:, 3:] = R
    return pLift
```

对TPS矩阵进行求解，分别得到x和y维度的形变矩阵

```python
def tps_transform(gallery, probe):
    """
    Compute the new points coordination with Thin-Plate-Spline algorithm
    """
    src_pt_xs = probe[:, 0]
    src_pt_ys = probe[:, 1]
    cps = np.vstack([src_pt_xs, src_pt_ys]).T
    # construct T
    T = makeT(cps)
    # solve cx, cy (coefficients for x and y)
    tar_pt_xt = gallery[:, 0]
    tar_pt_yt = gallery[:, 1]
    xtAug = np.concatenate([tar_pt_xt, np.zeros(3)])
    ytAug = np.concatenate([tar_pt_yt, np.zeros(3)])
    cx = np.linalg.solve(T, xtAug)  # [K+3]
    cy = np.linalg.solve(T, ytAug)
    return cx, cy
```


---

[^1]: Kent, J. T. and Mardia, K. V. (1994a). The link between kriging and thin-plate splines. In: Probability, Statistics and Optimization: a Tribute to Peter Whittle (ed. F. P. Kelly), pp 325–339. John Wiley & Sons, Ltd, Chichester. page 282, 287, 311

[^2]: <https://blog.csdn.net/VictoriaW/article/details/70161180>

[^3]: <https://en.wikipedia.org/wiki/Radial_basis_function>
