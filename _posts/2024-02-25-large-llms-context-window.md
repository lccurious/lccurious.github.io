---
layout: post
title: Large LLMs context Window
description: an example of a distill-style blog post and main elements
tags:
  - LLMs
  - context window
categories: LLMs
giscus_comments: true
date: 2024-02-25
thumbnail: assets/img/2024-02-25-large-llms-context-window/9448554a_Untitled.png
---

## Introduction

Large context window is absolutely desirable feature in Large language models (LLMs). However, previous concepts located in enhance the ability during pretraining period, this requires costly data collection and quadratic memory resources. Thereby, in past year, large context window technology became a battlefield attracted a log of fire. There are two desired property: input context length and model output length. Generally, people focus more on the input context length because rare people except the one want LLMs to write long story want to read long context output[^gpt].

The large context conditions are extremely important during RAG, due to we want LLMs to read comprehensive materials and output a perfect summary or utilize the key idea of Retrieved references. Even, some models said they read a whole book, but with the development, we still want the model on then hand can read a list of books, or a large table etc. So, LLMs can finally became an irreplaceable workflow.

But with limited resources on the hand, most user are not able to retrain the models or fine-tune the model on the hand. Therefore, there are urgent demands of creating resources efficient adaptation and inference methods. No retraining or SFT requirements.

## Methodology

Currently, there is no fine-tuning free methods available. As LongRoPE [📑Ding et al., 2024](http://arxiv.org/abs/2402.13753) extend the context length by rescaling the RoPE positional encoding [📑Su et al., 2023](http://arxiv.org/abs/2104.09864)  frequencies to gradually extend the context window. For a LLM targeting a context window size of $$L’$$ and lengthy input document  $$\boldsymbol{X}$$,

\begin{equation}
\mathop{\arg\min}_{\boldsymbol{x}\in \boldsymbol{X};|\boldsymbol{x}|\geq L'}\mathcal{L}(LLM(RoPE,\boldsymbol{X}))
\end{equation}

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2024-02-25-large-llms-context-window/9448554a_Untitled.png" title="context window positional interpolation" class="img-fluid rounded z-depth-1" caption="context window positional interpolation" %}
    </div>
</div>

### Uniformly distribute the 4096 into 2048 position grids

As what they discussed in the [📑Chen et al., 2023](http://arxiv.org/abs/2306.15595), they mentioned 

## Evaluation

### Needle-in-a-Haystack test

<br/>

### Passkey retrieval

<br/>

## Conclusion

<br/>

---

[^gpt]: [Improving language understanding with unsupervised learning](https://openai.com/research/language-unsupervised)