---
layout: post
title: 训练可视化
categories:
  - 机器学习
tags:
  - 可视化
  - Pytorch
  - Tensorflow
date: 2019-09-25 10:29:33
giscus_comments: true
---

要认真看文档，网上虽然存在很多看起来好用的小抄，但是很多还是不如直接去看文档更方便满足你的需求。

<!-- more -->

## 基于 Tensorboard

可以用 TensorBoard 来展现 TensorFlow 图，绘制图像生成的定量指标图以及显示附加数据（如其中传递的图像）。当 TensorBoard 完全配置好后，它将显示如下：

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-09-25-Training-Visualization/mnist_tensorboard.png" title="mnist_tensorboard" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

- Value
- Audio
- Image
- text

### Tensorflow 写法

下次再补，已经很久没有使用过 TensorFlow，等下次用到再来补充。

### Pytorch 写法

Pytorch 1.2.0 之后就正式支持了 TensorBoard 的内容记录，功能都实现在 [`torch.utils.tensorboard`](https://pytorch.org/docs/stable/tensorboard.html) 内。

另附，如果需要对中间的特征进行输出观察的话，可以用 PyTorch 的 hook 机制，可以在保持原始网络的结构的情况下实现中间特征的观测。

基于版本 1.2.0 共有两种 hook 机制，分别是针对 Tensor 的 hook 和针对 `nn.Module` 的 hook，有不同的用法。以针对 `nn.Module` 的用法，可以按照名字将模型中你关注的模块挑出，然后注册好传播所用的函数，以 HRNet 的特征层提取为例，这里可以针对某个 Branch 做输出观测。

```python
def feature_viz_stage4(module, inputs, outputs):
    # print("<- Stage4 -> ")
    for idx, item in enumerate(outputs):
        # print('branch {} ->'.format(idx), item.size())
        tensors = (item[0]-item[0].min())/(item[0].max()-item[0].min())
        writer_dict['writer'].add_image('stage4/branch{}'.format(idx),
                                        make_grid(tensors.view(item.size(1), 1, item.size(2), item.size(3))))
```

这里的注册需要的是一个回调函数，所有接口的定义要与官方文档中所给的一致，分别为：

- `module`：子模块
- `inputs`：这个子模块的输入
- `outputs`：这个子模块的输出

同样还有另外几个函数，可以在官方文档中找到详细的描述：

- [`register_backward_hook(hook)`](https://pytorch.org/docs/stable/nn.html?highlight=hook#torch.nn.Module.register_backward_hook)
- [`register_forward_pre_hook(hook)`](https://pytorch.org/docs/stable/nn.html?highlight=hook#torch.nn.Module.register_forward_pre_hook)

```python
# add feature monitor
for idx, (name, m) in enumerate(model.module.named_modules()):
    if name == 'stage4':
        m.register_forward_hook(feature_viz_stage4)
        print(idx, '->', name, 'hooked!')
    elif name == 'stage3':
        m.register_forward_hook(feature_viz_stage3)
        print(idx, '->', name, 'hooked!')
    elif name == 'stage2':
        m.register_forward_hook(feature_viz_stage2)
        print(idx, '->', name, 'hooked!')
```

另外，上面用的是 `model.module` 是因为在实际训练过程中使用了 `model = torch.nn.DataParallel(model, device_ids=cfg.GPUS).cuda()` 所以需要通过这一步拿到真正对应的模块名字。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-09-25-Training-Visualization/feature_training.png" title="中间的特征可视化结果" class="img-fluid rounded z-depth-1" caption="中间的特征可视化结果" %}
    </div>
</div>
