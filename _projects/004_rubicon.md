---
layout: distill
title: Rubicon-preview (30B-A3B)
description: Rubicon-preview — a 30B-A3B model trained with a novel reinforcement learning framework built on rubric anchors, targeting open-ended, creative and humanities-centric tasks where verifiable rewards are hard to define.
img: assets/img/004_rubicon/seesaw.png
importance: 1
category: work
tags:
  - LLM
  - reinforcement learning
  - RLVR
date: 2025-08-18

toc:
  - name: Overview
  - name: Highlights
  - name: Resources
---

## Overview

Rubicon is a reinforcement learning framework that uses **rubric anchors** to train large language models for open-ended, subjective, and humanities-centric tasks — domains where verifiable rewards are hard to define. The released **Rubicon-preview** is a 30B-A3B parameter model built on the Qwen3-30B-A3B base.

Unlike conventional RLVR (Reinforcement Learning from Verifiable Rewards), which confines itself to code or math, Rubicon defines fine-grained rubric criteria as training anchors, enabling the model to be optimized for style, emotional expressiveness, and human-like writing.

> 30B total parameters with 3B activated per token (30B-A3B), trained under the Apache-2.0 license.
{: .block-tip }

{% include figure.liquid loading="eager" path="assets/img/004_rubicon/rubric_system.png" title="Rubicon rubric system" class="img-fluid rounded z-depth-1" zoomable=true caption="Figure 1 — Rubicon's rubric system: offline data filtering feeds rubric instantiation, which drives rubric updating during RL. Source: arXiv:2508.12790." %}
## Highlights

- **Token-efficient gains**: +5.2% absolute improvement on subjective, humanities-centric tasks using only **5K training samples**, outperforming DeepSeek-V3-671B by +2.42% on average.
- **Stylistic controllability**: rubric anchors precisely steer output style, producing responses that are more human-like, emotionally expressive, and less formulaic.
- **Preserved general abilities**: no degradation on general tasks — a common side effect of specialized RL — plus gains on reasoning benchmarks such as AIME 2024 (+4.1%).

### Subjective & open-ended benchmarks (average of 7 tasks)

| Model | Avg |
| :--- | ---: |
| Qwen3-30B-A3B (base) | 65.29 |
| **Rubicon-preview** | **70.50** |
| DeepSeek-V3-671B | 68.08 |

{% include figure.liquid loading="eager" path="assets/img/004_rubicon/seesaw.png" title="The Seesaw Effect" class="img-fluid rounded z-depth-1" zoomable=true caption="Figure 2 — the creativity vs. instruction-following trade-off. Rubrics that reward strict compliance cost creative/empathic quality, and vice versa. Source: arXiv:2508.12790." %}
## Resources

- **Model**: [inclusionAI/Rubicon-Preview](https://huggingface.co/inclusionAI/Rubicon-Preview)
- **Paper**: [Reinforcement Learning with Rubric Anchors (arXiv:2508.12790)](https://arxiv.org/abs/2508.12790)
