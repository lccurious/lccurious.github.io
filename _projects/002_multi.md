---
layout: distill
title: MuLTI
description: Latent Processes Identification From Multi-View Time Series
img: assets/img/002_multi/motivation.png
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

bibliography: 002_multi.bib

toc:
  - name: Abstract
  - name: Motivation
  - name: Contrastive Module
  - name: Permutation
  - name: Framework
  - name: Experiments

_styles: >
  .row p {
    mjx-container[jax="CHTML"][display="true"] {
      display: unset;
    }
  }
  .caption {
    mjx-container[jax="CHTML"][display="true"] {
      display: unset;
    }
  }
---

## Abstract

Understanding the dynamics of time series data typically requires identifying the unique latent factors for data generation, a.k.a., latent processes identification. Driven by the independent assumption, existing works have made great progress in handling single-view data. However, it is a nontrivial problem that extends them to multi-view time series data because of two main challenges: (i) the complex data structure, such as temporal dependency, can result in violation of the independent assumption; (ii) the factors from different views are generally overlapped and are hard to be aggregated to a complete set. In this work, we propose a novel framework MuLTI that employs the contrastive learning technique to invert the data generative process for enhanced identifiability. Additionally, MuLTI integrates a permutation mechanism that merges corresponding overlapped variables by the establishment of an optimal transport formula. Extensive experimental results on synthetic and real-world datasets demonstrate the superiority of our method in recovering identifiable latent variables on multi-view time series.

## Motivation

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

<div class="row">
    <div class="col-lg-10 mt-3 mt-md-0 mx-auto">
      {% include figure.liquid loading="eager" path="assets/img/002_multi/problem_formulation.png" title="Problem formulation" caption="" class="img-fluid" %}
    </div>
</div>


## Contrastive Module

**Why use contrastive learning?**
 
Because we want make $$p(\tilde{\boldsymbol{z}}_{t}, \boldsymbol{z}_{H_{t}})$$ as close as possible to the ground truth $$p(\boldsymbol{z}_{t},\boldsymbol{z}_{H_{t}})$$, while contrastive learning can minimize the cross entropy between the two distributions<d-cite key="zimmermannContrastiveLearningInverts2021"></d-cite>.

$$
\begin{equation}
\begin{split}
    &\mathcal{L}_{\rm contr}(r,f;\mu,M):= \label{eq:loss_contr}\\
    &\underset{\substack{(\boldsymbol{x}, \tilde{\boldsymbol{x}}) \sim p_{\text {pos}} \\\left\{\boldsymbol{x}_{i}^{-}\right\}_{i=1}^{M} \stackrel{\text { i.i.d. }}{\sim} p_{\text {data }}}}{\mathbb{E}}\left[-\log \frac{e^{-\delta(\boldsymbol{z},\tilde{\boldsymbol{z}}) / \mu}}{e^{-\delta(\boldsymbol{z},\tilde{\boldsymbol{z}}) / \mu}+\sum_{i=1}^{M} e^{-\delta(\boldsymbol{z},\boldsymbol{z}^{-}) / \mu}}\right],
\end{split}
\end{equation}
$$

where $$\delta(\boldsymbol{z},\tilde{\boldsymbol{z}})$$ is the distance between two latent factors, $$\mu$$ is the temperature parameter, and $$\mathcal{L}_{\rm contr}$$ is the loss function for contrastive learning.


## Permutation

Assume there is a common source $$\boldsymbol{c}_{t}\in \mathbb{R}^{d_{c}}$$ shared across all views, we can identify the components of this source by exhausting the permuation corresponding to each view.

<div class="row">
    <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/002_multi/birkhoff_polytope.png" title="Brikhoff polytope" alt="Birkhoff polytope" class="img-fluid" %}
    </div>
    <div class="col-sm-8 mt-3 mt-md-0">
    $$
    \boldsymbol{B}=\theta_{1}\boldsymbol{P}_{1}+\theta_{2}\boldsymbol{P}_{2}+\dots+\theta_{M}\boldsymbol{P}_{M},
    $$
    <p>where $$\boldsymbol{P}_i$$ is the permutation matrix, and $$\theta_{i}$$ is the corresponding weight for the permutation matrix. Once the loss function is minimized, there solution converge to a unique permutation matrix, i.e., a vetex of the Birkhoff polytope.</p>
    </div>
</div>


## Framework

<div class="l-body-outset">
  <div class="col-lg mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/002_multi/framework.png" title="Framework" class="img-fluid" %}
  </div>
</div>
<div class="caption">
  Illustration of our MuLTI framework. On one hand, we recover the view-specific latent factors $$\boldsymbol{z}^v_t$$ from individual views, which are then merged to obtain $$\boldsymbol{z}_t$$. On the other hand, we exploit the temporal dependency to obtain a causal transited latent factor $$\tilde{\boldsymbol{z}}_{t}$$ from previously estimated $$\hat{\boldsymbol{z}}_{t}$$. Thereafter, we regard them as positive pairs to optimize the contrastive loss, which serves as a surrogate of mutual information maximization to achieve identifiability.
</div>

## Experiments

### Multi-view vector auto-regression

<div class="l-body-outset">
  <div class="col-lg mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/002_multi/exp_var_results.png" title="Multi-view vector auto-regression" class="img-fluid" %}
  </div>
</div>
<div class="caption">
  Identifiability results on the VAR process $$(d = 10, L = 2)$$. Mean+standard deviation over 5 random seeds.
</div>

### Mass-spring system

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include video.liquid path="assets/video/002_multi/view1-clip-0000.mp4" controls="false" autoplay="true" loop="true" width="100%" height="200px" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include video.liquid path="assets/video/002_multi/view2-clip-0000.mp4" controls="false" autoplay="true" loop="true" width="100%" height="200px" %}
  </div>
</div>
