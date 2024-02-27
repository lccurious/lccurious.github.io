---
layout: post
title: Introduction to LLMs
tags:
  - convex optimization
  - pattern recognition
categories:
  - Machine Learning
date: 2023-12-14 01:01:21
giscus_comments: true
---

准确地说这里是指 GPT，OpenAI 团队也发布了一篇简短的文章用于解释这个生成式预训练 Transformer[^gpt]。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/GPTs-tree.png" title="GPTs Tree" class="img-fluid rounded z-depth-1" caption="GPTs Tree" %}
    </div>
</div>

<!-- more -->

## Brief Introduction to GPT

主要的设计和创作者是OpenAI，但是更进一步的实现和研究其实来自于非常多的其他团队，包括硬件部分，分布式训练，RLHF等。在 2023 年 3 月份发布的 GPT-4 技术报告 [OpenAI, 2023](http://arxiv.org/abs/2303.08774) 也已经比较详尽地介绍了关于模型的能力范围细节。

### 模型架构

在 Attention is All You Need [Vaswani et al., 2017](https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html) 原文中提出的 Transformer 架构包含编码器和解码器用于序列任务的编码。在后来的 Generative Pre-trained Transformer 的开发中，OpenAI 选择了 Decoder-Only 的思路，Google 先选择了 Encoder-Decoder 的架构。OpenAI 的研究人员表示在 Decoder-Only 的架构设计下，模型更难通过模仿数据中的表面规律来产生似是而非的回答。这提高了模型最后的学习难度，只有模型学到更加本质的规律以后才能使得其输出看起来像那么回事。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/Transformers-decoder-only.png" title="Comparsion of Transformers and Decoder-only" class="img-fluid rounded z-depth-1" caption="Comparsion of Transformers and Decoder-only" %}
    </div>
</div>

所以后来除了 OpenAI 团队以外，很多其他团队也发现了随着模型规模的增加，Decoder-Only 的架构确实能够非常好地完成任务[^zhihu]，也有着更高的上限和多样性。 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/GPTs-tree.png" title="GPTs Tree" class="img-fluid rounded z-depth-1" caption="GPTs Tree" %}
    </div>
</div>

目前的主流 GPT 系列是以 Transformer [Vaswani et al., 2017](https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html) 作为基本模块进行组合实现的。尽管它们都遵从类似的架构形式，但是也还是有可能使用其他架构的模块进行组装。例如 RetNet [Sun et al., 2023](http://arxiv.org/abs/2307.08621) 提出针对 Transformer 的三种改进，降低模型的计算开销并提升推理阶段的并行性能。RWKV [Peng et al., 2023](http://arxiv.org/abs/2305.13048) 也是一种针对 Transformer 的改进。

### 关键模块

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/GPTs-modules.png" title="GPTs modules" class="img-fluid rounded z-depth-1" caption="GPTs modules" %}
    </div>
</div>

从 LLaMA 开始的后续开源 GPT 系列中，都用了一些类似的内部架构设计。用 RoPE 旋转位置编码[Su et al., 2023](http://arxiv.org/abs/2104.09864) 来代替基础版本的 Transformer 中的绝对位置编码，好处是可以更加高效地表示不同编码位置之间的相对距离。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/RoPE.png" title="RoPE" class="img-fluid rounded z-depth-1" caption="RoPE" %}
    </div>
</div>

\begin{equation}
f\_{q,k}(\boldsymbol{x}\_{m},m)=\boldsymbol{R}^{d}\_{\Theta,m}\boldsymbol{W}\_{\{q,k\}}\boldsymbol{x}\_{m}
\end{equation}

其中 $$\boldsymbol{R}$$ 的具体形式为：

\begin{equation}
\boldsymbol{R}^d\_{\Theta,m} = 	\begin{pmatrix}		\cos{m\theta\_1}& -\sin{m\theta\_1}&0&0&\cdots&0&0\\\\		\sin{m\theta\_1}&\cos{m\theta\_1}&0&0&\cdots&0&0 \\\\		0&0&\cos{m\theta\_2}& -\sin{m\theta\_2}&\cdots&0&0\\\\		0&0&\sin{m\theta\_2}&\cos{m\theta\_2}&\cdots&0&0 \\\\		\vdots&\vdots&\vdots&\vdots&\ddots&\vdots&\vdots\\\\		0&0&0&0&\cdots&\cos{m\theta\_{d/2}}& -\sin{m\theta\_{d/2}}\\\\		0&0&0&0&\cdots&\sin{m\theta\_{d/2}}&\cos{m\theta\_{d/2}}	\end{pmatrix}
\end{equation}

通过这种形式的位置编码后，计算自注意力机制时就可以推导为如下形式：

\begin{equation}
\boldsymbol{q}^{\top}\_{m}\boldsymbol{k}\_{n}=(\boldsymbol{R}^{d}\_{\Theta,m}\boldsymbol{W}\_{q}\boldsymbol{x}\_{m})^{\top}(\boldsymbol{R}^{d}\_{\Theta,n}\boldsymbol{W}\_{k}\boldsymbol{x}\_{n})=\boldsymbol{x}^{\top}\boldsymbol{W}\_{q}\boldsymbol{R}^{d}\_{\Theta,n-m}\boldsymbol{W}\_{k}\boldsymbol{x}\_{n}
\end{equation}

在 LLaMA2 中的一个关键性改进则在于引入了 Grouped-query 技术 [Ainslie et al., 2023](http://arxiv.org/abs/2305.13245) ：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/group_query.png" title="Group query" class="img-fluid rounded z-depth-1" caption="Group query" %}
    </div>
</div>

### Mistral-7B 架构

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/Mistral-7B.png" title="Mistral 7B" class="img-fluid rounded z-depth-1" caption="Mistral 7B" %}
    </div>
</div>

在 Transformers 模型的序列建模中需要引入一个因果掩码机制，在建模后继序列内容的时候保证仅引入之前的序列信息而不带来信息的泄露。掩码矩阵通常为一个上三角矩阵，Mistral-7B 模型在设计过程中改了这一步，一个后继 token 的建模只能看到离当前位置较近的一些前序 tokens，这样就可以在很大程度上减少整体模型的总体计算量。尽管在当前层每个 token 只能看到部分前继的信息，但是网络的层数越靠后，前面的信息就像生物富集似的全部汇聚在最后，所以整体效果上每个 token 的建模过程中还是用了它的全部前序信息。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/mistral-7b-performance.png" title="Mistral-7B performance" class="img-fluid rounded z-depth-1" caption="Mistral-7B performance" %}
    </div>
</div>

当然，Mistral-7B 的性能测试表示也非常亮眼。

## 总体训练流程

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/LLMs_training.png" title="LLMs training" class="img-fluid rounded z-depth-1" caption="LLMs training" %}
    </div>
</div>

根据 LLaMA 和 OpenAI 的公开内容，模型总体训练分为三个阶段：

1. 通过 Next Token Prediction 实现模型在海量互联网数据上的预训练
2. 将预训练完成的模型采用有监督微调策略来实现特定任务上的改进
3. 引入基于人类反馈的强化学习策略使模型进一步理解各类人类任务

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/RLHF.png" title="RLHF" class="img-fluid rounded z-depth-1" caption="RLHF" %}
    </div>
</div>

## Compression & Intelligence

DeepMind 的研究表示模型即使没有针对压缩任务进行特别设计和优化，也能够作为一种通用压缩器。[Delétang et al., 2023](http://arxiv.org/abs/2309.10668) 中表示经过预训练后的模型能够在图像、语音、文本这些类型的数据压缩能力上都不亚于专业的 gzip 等压缩软件。

> We empirically demonstrate that these models, while (meta-)trained primarily on text, also achieve state-of-the-art compression rates across different data modalities, using their context to condition a general-purpose compressor to excel at a particular task.
> 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/arithmetic_compression.png" title="arithmetic compression" class="img-fluid rounded z-depth-1" caption="arithmetic compression" %}
    </div>
</div>

以一串字符序列为例，字符串中的每个字母都能对应于一个边缘概率，表示它在环境中出现的概率。

1. 第一个字符为 A，编码应该落到 $$[0, 0.45]$$ 这个区间内
2. 下一个字符为 I，细化一下区间，编码应该落在 $$[0.09, 0.36]$$ 这个区间内
3. 下一个字符为 X，细化一下区间，编码应该落在 $$[0.266, 0.36]$$ 这个区间内
4. 最后一个字符为 I，细化一下区间，编码应该落在 $$[0.322, 0.341]$$ 这个区间内
5. 在 $$[0.322, 0.341]$$ 这个区间内任意取一个小数即可，因为这个编码肯定是小数，所以只要用01编码小数点后的数字即可，图中示意的编码即为 `b0101010` 

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/arithmetic_algorithm.png" title="Wiki arithmetic algorithm" class="img-fluid rounded z-depth-1" caption="Wiki arithmetic algorithm" %}
    </div>
</div>

算数编码的原理与哈夫曼编码类似，一个长串最终会被映射到某个01字符串上，算数编码的理论极限更加接近于香农熵的极限：

\begin{equation}
H=-\sum^{N}\_{i=1}P(i)\log\_{b}P(i)
\end{equation}

如果 $$b=2$$，熵的单位为bit，如果 $$b=e$$，熵的单位为 奈特。

在算数编码的流程开始时，需要所有基本字符对应的边缘概率，这个边缘概率反应了每个字符在这个场景中的统计概率。对于纯粹的文件压缩任务而言，这可以通过先读一遍文件所有的信息来获取。但是对于通用压缩的模型而言，它得掌握全宇宙中每个字符对应的基本出现概率。这显然无法做到，所以只能通过近似的方式来做。这个提升这个近似的过程其实就与我们的模型训练过程对应：

\begin{equation}
H(\rho, \hat{\rho}):=\mathbb{E}\_{x\sim \rho}\left[\sum^{n}\_{i=1}-\log\_{2}\hat{\rho}(x\_{i}|x\_{<i})\right].
\end{equation}

这个极大似然的目标也就对应于最小化序列 $$x_{1:n}$$ 压缩编码后的编码长度 $$-\sum^{n}_{i=1}\log_{2}\hat{\rho}(x_{i}\vert x_{<i})$$，因为完美的编码结果就是最小的，所以训练过程就是最小化参数降低模型的编码长度。这个损失项也就完整对应于当前各类大模型的预训练目标函数。

相应的，如果把这个编码形式改一改，刚好对应于：

\begin{equation}
\rho(x\_{i}|x\_{<i})=2^{\ell\_{c}(x\_{<i})-\ell\_{c}([x\_{<i},x\_{i}])}
\end{equation}

这就是 Next-Token prediction 的推理形式。

## 实验设计

大语言模型的输入上下文有窗口极限限制，一般的数据不能被一口气全部塞进模型，为了解决此类问题就引出两类策略：

1. 使用滑动编码策略，每个压缩器都在数据上滑动，每编码一个新的 byte 都会用到前 $$C-1$$ 个 bytes
2. 直接将输入分解为多个长度相同的块，然后一一将这些块输入到编码器中进行编码

在实际的实验中，本文的实验采用了平均分快的方法，所有的输入数据集被分割为多个 2048 bytes 的 chunk，然后这些输入块将被一个一个输入压缩器。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/compression_results.png" title="Compression results" class="img-fluid rounded z-depth-1" caption="Compression results" %}
    </div>
</div>

从实验结果可以看到各类大模型具备了比肩专业的压缩编码软件的能力。

- 更多参考解释：
    
  > [Language Modeling Is Compression?Google DeepMind 文章与Open AI的两次压缩与智能/泛化talk的笔记和想法 - beiluo的文章 - 知乎](https://zhuanlan.zhihu.com/p/657899967)
  >   
  > [压缩下一个 token 通向超过人类的智能 - 周昕宇的文章 - 知乎](https://zhuanlan.zhihu.com/p/619511222)
    

所以本质上，任何其他可以建模为极大似然估计的任务，都可以直接作为大模型的 next-token-prediction 任务。

是的，您的理解是正确的。在使用大型语言模型（如参数为 $$\theta$$ 的模型）进行编码和解码的过程中，模型的作用是估计给定前文的条件下，每个字符的概率分布。这一过程可以分为以下几个步骤：

### 编码过程

1. **概率分布估计**：对于序列中的每个字符 $$s_n$$，使用模型 $$p_{\theta}$$ 来计算在给定前面字符 $$s_{<n}$$ 的条件下，每个可能字符的概率 $$p_{\theta}(s_n\vert s_{<n})$$。
2. **转换为二进制编码**：基于这些概率估计，使用类似于算术编码的方法将整个序列转换为一个二进制编码。这个过程涉及根据每个字符的概率逐步细化一个表示整个序列的数值区间。

### 解码过程

1. **读取编码数据**：解码过程从读取代表原始序列的二进制编码开始。
2. **迭代概率计算**：使用模型 $$p_{\theta}$$ 逐步重建序列。对于每个位置 $$n$$，模型计算 $$p_{\theta}(s_0)$$， $$p_{\theta}(s_1\vert s_0)$$，...， $$p_{\theta}(s_n\vert s_{<n})$$。
3. **区间判断**：根据编码数据和这些概率估计，确定每个字符落在哪个概率区间内。这允许模型逐步确定并恢复原始序列中的每个字符。

这个过程依赖于模型对字符序列概率分布的准确估计。理论上，如果模型的估计非常准确，这种方法可以非常有效地压缩和恢复数据。然而，实际应用中的效率和准确性可能会受到多种因素的影响，包括模型的复杂性、训练数据的质量和范围，以及实际实现时的各种优化和权衡。

## Chinchilla Rule

\begin{equation}
\mathrm{FLOPs}(N,D)=C:N\_{opt}(C),D\_{opt}(C)=\mathop{\rm argmin}\_{N,D~s.t.~\mathrm{FLOPs}(N,D)=C}L(N,D).
\end{equation}

根据 Chinachilla Rule 可以估算出在给定计算量规模的前提下，如何设置参数量和训练数据集规模来实现最大化的模型优化水准。
所以经过一系列的工程实验之后，研究者们拟合出一个经验曲线：

\begin{equation}
\hat{L}(N,D)=E+\frac{A}{N^{\alpha}}+\frac{B}{D^{\beta}}
\end{equation}

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/Chinachilla_curve.png" title="Chinachilla curves" class="img-fluid rounded z-depth-1" caption="Chinachilla curves" %}
    </div>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2023-12-14-Introduction-to-LLMs/Chinachilla_fitness.png" title="Chinachilla fitness" class="img-fluid rounded z-depth-1" caption="Chinachilla fitness" %}
    </div>
</div>

但是后面又有一些讨论表示，Chinachilla Rule 是因为实验还是没有做到训练时间足够长。以及后面出现的 Mistral-7B 模型似乎也反驳了这类问题。

## 模型评估

当评估一个经过训练和调整的模型时，可以从多个方面进行考量，包括知识与能力、伦理与安全以及垂直领域评估。以下是一些常见的评估指标及其简要说明：

- **Perplexity (困惑度)**：这是一个衡量语言模型性能的标准指标，用于评估模型对测试数据的预测能力。困惑度越低，表明模型对语言的预测越准确。
- **BLEU (双语互译质量评估)**：主要用于机器翻译，通过比较机器翻译输出与一系列参考翻译之间的重叠度来评估翻译质量。
- **ROUGE (答案生成评估指标)**：常用于评估自动摘要或机器翻译的质量，主要通过比较生成的摘要或翻译与参考摘要或翻译之间的重叠来进行评估。
- **METEOR (翻译结果评估)**：这是另一种用于评估机器翻译质量的指标，它不仅考虑词汇的精确匹配，还考虑了同义词和词形变化，通常认为比BLEU更精细。
- **Human Evaluation (人工评估)**：这涉及到人类评审员对模型的输出进行评估，通常考虑准确性、可读性和相关性等多个维度。人工评估可以提供更直观、更全面的评价。
- **Zero-shot Evaluation (零样本评估)**：这是一种测试模型在没有接受特定任务训练的情况下对新任务的处理能力的方法。零样本评估检验模型的泛化能力和对新领域、新类型数据的适应性。

此外还有一些比较典型的评估指标。


---

[^gpt]: [Improving language understanding with unsupervised learning](https://openai.com/research/language-unsupervised)
[^zhihu]: [为什么现在的LLM都是Decoder only的架构？ - 知乎](https://www.zhihu.com/question/588325646)