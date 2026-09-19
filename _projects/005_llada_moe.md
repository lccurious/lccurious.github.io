---
layout: distill
title: LLaDA-MoE-7B-A1B
description: The first open-source sparse MoE diffusion language model — LLaDA-MoE-7B-A1B has 7B total parameters with only ~1.4B activated per token, pre-trained from scratch on ~20T tokens (Base / Instruct / Instruct-TD).
img: assets/img/005_llada_moe/dinfer_tps.png
importance: 2
category: work
tags:
  - LLM
  - diffusion model
  - MoE
date: 2025-09-10

toc:
  - name: Overview
  - name: Model Series
  - name: Highlights
  - name: Resources
---

## Overview

**LLaDA-MoE** is a new and upgraded series of the LLaDA diffusion language model family, released in the official [LLaDA collection](https://huggingface.co/collections/inclusionAI/llada) by inclusionAI. It is the **first open-source Mixture-of-Experts (MoE) diffusion large language model**, pre-trained from scratch on approximately **20 trillion tokens**.

With 7B total parameters and only ~1.4B activated per token, LLaDA-MoE significantly reduces inference cost while outperforming open-source dense models of similar scale. It is particularly strong at code generation, advanced mathematical reasoning, and tool calling / agentic tasks.

## Model Series

| Model | Description |
| :--- | :--- |
| [`LLaDA-MoE-7B-A1B-Base`](https://huggingface.co/inclusionAI/LLaDA-MoE-7B-A1B-Base) | Base pre-trained model for research and secondary development |
| [`LLaDA-MoE-7B-A1B-Instruct`](https://huggingface.co/inclusionAI/LLaDA-MoE-7B-A1B-Instruct) | Instruction-tuned model optimized for practical applications |
| [`LLaDA-MoE-7B-A1B-Instruct-TD`](https://huggingface.co/inclusionAI/LLaDA-MoE-7B-A1B-Instruct-TD) | Instruction-tuned variant with **Trajectory Distillation** for accelerated inference |

## Highlights

- **Sparse MoE diffusion**: first open-source MoE architecture for discrete diffusion language modeling; only ~1B activated parameters per token in practice.
- **Diffusion-style decoding**: generates via block-wise masked diffusion with confidence-based remasking instead of next-token autoregression.
- **20T-token pre-training from scratch**, with strong results on code and complex reasoning benchmarks and support for tool calling.
- **Ecosystem**: paired with the [dInfer](https://github.com/inclusionAI/dInfer) inference framework from inclusionAI.

{% include figure.liquid loading="eager" path="assets/img/005_llada_moe/benchmarks.png" title="Benchmarks" class="img-fluid rounded z-depth-1" zoomable=true caption="LLaDA-MoE-7B-A1B-Instruct against open-source dense and MoE baselines across general, code and math tasks. Source: model card." %}

{% include figure.liquid loading="eager" path="assets/img/005_llada_moe/benchmarks_detail.png" title="Architecture and parameter details" class="img-fluid rounded z-depth-1" zoomable=true caption="Total vs. activated parameters and per-task scores. Source: model card." %}

{% include figure.liquid loading="eager" path="assets/img/005_llada_moe/dinfer_tps.png" title="Inference throughput" class="img-fluid rounded z-depth-1" zoomable=true caption="Average and HumanEval tokens/s: dInfer on LLaDA-MoE variants vs. Fast-dLLM and a vLLM AR baseline. Source: model card." %}
## Resources

- **Collection**: [inclusionAI/LLaDA on HuggingFace](https://huggingface.co/collections/inclusionAI/llada)
- **Paper**: [LLaDA-MoE: A Sparse MoE Diffusion Language Model (arXiv:2509.24389)](https://arxiv.org/abs/2509.24389)
- **Code**: [inclusionAI/dInfer](https://github.com/inclusionAI/dInfer)
