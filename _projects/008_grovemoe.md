---
layout: distill
title: GroveMoE-Base / -Inst (33B-3.28B)
description: GroveMoE — a sparse MoE architecture with adjugate experts for dynamic computation allocation, with 33B total parameters and only 3.14–3.28B active per token, up-cycled from Qwen3-30B-A3B-Base via mid-training and SFT.
img: assets/img/008_grovemoe/architecture.png
importance: 5
category: work
tags:
  - LLM
  - MoE
  - efficient inference
date: 2025-08-18

toc:
  - name: Overview
  - name: Highlights
  - name: Resources
---

## Overview

**GroveMoE** introduces a new sparse MoE architecture using **adjugate experts** for dynamic computation allocation. In this design, shared computation across expert groups is executed once and then reused, cutting FLOPs compared with conventional homogeneous MoE layers.

The released models total 33B parameters with only **3.14–3.28B active per token**. They are produced by mid-training + SFT **up-cycling from Qwen3-30B-A3B-Base**, which preserves prior knowledge while adding new capabilities. GroveMoE comes in `Base` (for research and continued pre-training) and `Inst` (instruction-tuned) variants.

> Conventional MoE activates a fixed number of homogeneous experts regardless of input complexity. GroveMoE groups adjugate experts with ordinary experts so shared computation is computed once and reused — the key to its FLOPs reduction.
{: .block-tip }

{% include figure.liquid loading="eager" path="assets/img/008_grovemoe/comparison.png" title="Traditional MoE layer vs. Grove MoE layer" class="img-fluid rounded z-depth-1" zoomable=true caption="Figure 2 — adjugate experts are grouped with ordinary experts so shared computation runs once and is reused, cutting FLOPs at equal active parameters. Source: arXiv:2508.07785." %}
## Highlights

- **Adjugate experts**: novel sparse grouping where shared computation is executed once and reused across experts.
- **High sparsity**: 33B total params, only 3.14–3.28B activated per token (~10× sparsity).
- **Efficient up-cycling**: mid-training + SFT from Qwen3-30B-A3B-Base preserves prior knowledge while adding capabilities.
- **Strong benchmarks**: competitive results on MMLU-Pro, SuperGPQA, GPQA-Diamond, OlympiadBench, AIME'25, and LiveCodeBench v6 at a fraction of the compute.
- **Ecosystem**: deployable via SGLang and supported in llama.cpp ([PR #15510](https://github.com/ggml-org/llama.cpp/pull/15510)).

## Resources

- **Collection**: [inclusionAI/GroveMoE on HuggingFace](https://huggingface.co/collections/inclusionAI/grovemoe)
- **Models**: [GroveMoE-Base](https://huggingface.co/inclusionAI/GroveMoE-Base) · [GroveMoE-Inst](https://huggingface.co/inclusionAI/GroveMoE-Inst)
- **Paper**: [GroveMoE: Towards Efficient and Superior MoE LLMs with Adjugate Experts (arXiv:2508.07785)](https://arxiv.org/abs/2508.07785)
- **Code**: [inclusionAI/GroveMoE](https://github.com/inclusionAI/GroveMoE)
