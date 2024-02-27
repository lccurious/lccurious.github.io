---
layout: post
title: Apex Cuda Acceleration
categories:
  - 工程
tags:
  - Apex
date: 2019-12-23 16:34:08
giscus_comments: true
---



在使用 Pytorch 进行训练的时候有些步骤可以进一步优化和提高整体训练的速度。其本质是通过将很多操作转化为 `Float16` 进行计算，其他仍保持原有的 `Float32` 精度计算，这样做的好处在于可以显著减小显存的占用。在不减少模型参数规模的前提下提高计算的速度和 `batchsize` 的调整空间。

<!-- more -->

## 安装

基于 Ubuntu 机器，在 CUDA 和 CUDNN 已经预备好的环境中，具体请以官方代码库为准。

```bash
git clone https://github.com/NVIDIA/apex
cd apex
pip install -v --no-cache-dir --global-option="--cpp_ext" --global-option="--cuda_ext" ./
```

## 使用

Apex 是一个辅助 Pytorch 的包，用以优化其运行过程的计算资源平衡，根据用户对于精度的敏感程度可以选择下面几种取舍等级。

```python
# 带检查的导入方式
try:
    from apex.parallel import DistributedDataParallel as DDP
    from apex.fp16_utils import *
    from apex import amp, optimizers
    from apex.multi_tensor_apply import multi_tensor_applier
except ImportError:
    raise ImportError("Please install apex from https://www.github.com/nvidia/apex to run this example.")


# Initialization
opt_level = 'O1'
model, optimizer = amp.initialize(model, optimizer, opt_level=opt_level)

# Train your model
...
with amp.scale_loss(loss, optimizer) as scaled_loss:
    scaled_loss.backward()
...

# Save checkpoint
checkpoint = {
    'model': model.state_dict(),
    'optimizer': optimizer.state_dict(),
    'amp': amp.state_dict()
}
torch.save(checkpoint, 'amp_checkpoint.pt')
...

# Restore
model = ...
optimizer = ...
checkpoint = torch.load('amp_checkpoint.pt')

model, optimizer = amp.initialize(model, optimizer, opt_level=opt_level)
model.load_state_dict(checkpoint['model'])
optimizer.load_state_dict(checkpoint['optimizer'])
amp.load_state_dict(checkpoint['amp'])

# Continue training
...
```

- O0：纯FP32训练，可以作为accuracy的baseline；
- O1：混合精度训练（推荐使用），根据黑白名单自动决定使用FP16（GEMM, 卷积）还是FP32（Softmax）进行计算。
- O2：“几乎FP16”混合精度训练，不存在黑白名单，除了Batch norm，几乎都是用FP16计算。
- O3：纯FP16训练，很不稳定，但是可以作为speed的baseline；
