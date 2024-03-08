---
layout: distill
title: MuLTI
description: Latent Processes Identification From Multi-View Time Series
img: assets/img/002_multi/motivation.png
importance: 1
category: research
tags:
  - causal discovery
  - multi-view
  - contrastive learning
date: 2023-09-01

authors:
  - name: Zenan Huang
    url: "https://lccurious.github.io/about"
    affiliations:
      name: Zhejiang University
  - name: Haobo Wang
    url: "https://hbzju.github.io/"
    affiliations:
      name: Zhejiang University
  - name: Junbo Zhao
    url: "http://jakezhao.net/"
    affiliations:
      name: Zhejiang University
  - name: Nenggan Zheng
    url: "https://person.zju.edu.cn/en/nengganzheng"
    affiliations:
      name: Zhejiang University

toc: true
---


## Abstract

Understanding the dynamics of time series data typically requires identifying the unique latent factors for data generation, a.k.a., latent processes identification. Driven by the independent assumption, existing works have made great progress in handling single-view data. However, it is a nontrivial problem that extends them to multi-view time series data because of two main challenges: (i) the complex data structure, such as temporal dependency, can result in violation of the independent assumption; (ii) the factors from different views are generally overlapped and are hard to be aggregated to a complete set. In this work, we propose a novel framework MuLTI that employs the contrastive learning technique to invert the data generative process for enhanced identifiability. Additionally, MuLTI integrates a permutation mechanism that merges corresponding overlapped variables by the establishment of an optimal transport formula. Extensive experimental results on synthetic and real-world datasets demonstrate the superiority of our method in recovering identifiable latent variables on multi-view time series.

## Motivation

<div class="l-body">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/002_multi/problem_formulation.png" title="Problem formulation" caption="" class="img-fluid" %}
    </div>
</div>

$$
\begin{equation}
\boldsymbol{z}_{i,t}=f_{i}(\boldsymbol{Pa}(z_{i,t}), \epsilon_{i,t})
\end{equation}
$$

where $$\textbf{Pa}(z_{i,t})$$ denotes causal parents of $$i$$-th factor at current step $t$, $$\epsilon_{i,t}$$ denotes a noise component of causal transition.
While $$\boldsymbol{z}_t$$ contains a complete set of latent factors that we are truly interested in, we note that each observed view may be dependent on only a subset of it. 
Formally, we have the following data-generating process,

$$
\begin{equation}
    \boldsymbol{x}^{1}_{t}  = g^{1}(\boldsymbol{z}^{1}_{t}), \quad 
    \boldsymbol{x}^{2}_{t}  = g^{2}(\boldsymbol{z}^{2}_{t}), \quad 
    \text{where}~~\boldsymbol{z}_{t} = \boldsymbol{z}^{1}_{t}\cup \boldsymbol{z}^{2}_{t},
\end{equation}
$$

## Contrastive Module

