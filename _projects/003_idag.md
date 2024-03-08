---
layout: distill
title: iDAG
description: Invariant DAG Searching for Domain Generalization
img: assets/img/003_idag/motivation.png
importance: 1
category: research
tags:
  - Transfer Learning
  - Domain Adaptation
  - Low dimensional Structure
date: 2023-01-01
toc:
  sidebar: left

authors:
  - name: Zenan Huang
    url: "https://lccurious.github.io/about"
    affiliations:
      name: Zhejiang University
  - name: Jun Wen 
    url: "https://jungel2star.github.io/"
    affiliations:
      name: Harvard Medical School
  - name: Siheng Chen
    url: "https://siheng-chen.github.io/"
    affiliations:
      name: Shanghai Jiao Tong University
  - name: Linchao Zhu
    url: "https://ffmpbgrnn.github.io/"
    affiliations:
      name: Zhejiang University
  - name: Nenggan Zheng
    url: "https://person.zju.edu.cn/en/nengganzheng"
    affiliations:
      name: Zhejiang University
---


## Abstract

<div class="row">
    <iframe src="{{ '/assets/plotly/001_drda/tetrahedron_animation.html' | relative_url }}" frameborder='0' scrolling='no' height="400px" width="100%" style="border: 1px dashed grey;"></iframe>
</div>

Domain adaptation methods reduce domain shift typically by learning domain-invariant features. Most existing methods are built on distribution matching, e.g., adversarial domain adaptation, which tends to corrupt feature discriminability. In this paper, we propose Discriminative Radial Domain Adaptation (DRDA) which bridges source and target domains via a shared radial structure. It’s motivated by the observation that as the model is trained to be progressively discriminative, features of different categories expand outwards in different directions, forming a radial structure. We show that transferring such an inherently discriminative structure would enable to enhance feature transferability and discriminability simultaneously. Speciﬁcally, we represent each domain with a global anchor and each category a local anchor to form a radial structure and reduce domain shift via structure matching. It consists of two parts, namely isometric transformation to align the structure globally and local reﬁnement to match each category. To enhance the discriminability of the structure, we further encourage samples to cluster close to the corresponding local anchors based on optimal-transport assignment. Extensively experimenting on multiple benchmarks, our method is shown to consistently outperforms state-of-the-art approaches on varied tasks, including the typical unsupervised domain adaptation, multi-source domain adaptation, domainagnostic learning, and domain generalization.

## Motivation

### Feature Discriminability

When using the linear classifier formulation, the likelihood of $$i$$-th sample belonging to $$k$$-th category is:

$$
\begin{equation}
p_{ik}\propto \exp(\boldsymbol{W}^{\top}_{k}\boldsymbol{z}_{i}+b)
\end{equation}
$$

which means that the feature of each category expands outwards in different directions:

$$
\begin{equation}
p_{ik}\propto \exp(\|\boldsymbol{W}_{k}\| \|\boldsymbol{z}_{i}\|\cos(\boldsymbol{W}_{k},
                \boldsymbol{z}_{i})+b)
\end{equation}
$$

thereby, for enhancing the discriminability of the feature, model is trained to be progressively expand the feature of each category outwards in different directions:


Hereafter, a radial structure is formed, which is inherently discriminative.

We can naturally model the latent sketches of the two domain by just using their corresponding domain centroids and category centroids.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/001_drda/radial_expansion.gif" title="Radial Expansion" caption="Radial Expansion" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/001_drda/drda_gwd.gif" title="GWD adaptation" caption="GWD adaptation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### Global Alignment

Consider there is a global transformation $$\mathcal{T}(\cdot): \mathcal{V} \mapsto \mathcal{V}$$.

### Local Finetune

Consider the follow shapes, which have different details. More details about the optimal transport can be found in optimal transport and Gromov-Wasserstein Distance:

$$
\begin{equation}
GW^{2}_{2}(c_{s}, c_{t}, \mu, \nu) = \min_{\pi \in \Pi(\mathcal{V}^{s},\mathcal{V}^{t})} J(c_{s},
              c_{t}, \pi)
\end{equation}
$$

where

$$
\begin{equation}
J(c_{s}, c_{t}, \pi) = \sum_{i,j,k,l}|c_{s}(\boldsymbol{v}^{s}_{i},
              \boldsymbol{v}^{s}_{j})-c_{t}(\boldsymbol{v}^{t}_{k}, \boldsymbol{v}^{t}_{l})|\pi_{i,j}\pi_{k,l}
\end{equation}
$$

By minimizing the Gromov-Wasserstein distance, we can finetnue the two shapes to be similar.

Please see the paper for details.

## DRDA

The DRDA framework is a straightforward extension to Nerfies. The key difference is that the template NeRF is conditioned on additional higher-dimensional coordinates, where the higher dimensional coordinates are given by an "ambient slicing surface" which can be thought of as a higher dimensional analog to the deformation field.

<div class="l-page">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/001_drda/DRDA-Framework.png" title="Framework" caption="DRDA handles domain shifts by modeling a low-dimensional structure in high-dimensional space, thereby producing more reliable alignment on the different domains. (rotate and translate the target structure to align the source structure)" class="img-fluid" %}
    </div>
</div>


To give a intuitive illustration of the feature evolution during model training, we built a simpliﬁed LetNet while reducing the bottleneck dimension to 2 and training it with the task MNIST→USPS.


<div class="l-page">
    <div class="col-lg mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/001_drda/feature_evolution.png" title="Feature Evolution" caption="Feature Evolution" class="img-fluid z-depth-1" %}
    </div>
</div>

## Acknowledgements

Special thanks to [Weijie Liu](https://lccurious.github.io/projects/DRDA/) and [Changjian Shui](https://cjshui.github.io/) for their constructive suggestions.
