---
layout: post
title: Word Vector
date: 2018-02-12 15:19:35
categories:
 - 机器学习
tags:
 - NLP
giscus_comments: true
---


## Skip gram model ##

The main idea behind the skip-gram model is this: it takes every words in a large corpora and also takes one-by-one the words that surround it within a defined 'windows' to then feed a neural network that after training will predict the probability for each word to actually appear in the window around the focus word.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-02-12-Word-Vector/1_yiH5sZI-IBxDSQMKhvbcHw.png" title="1_yiH5sZI-IBxDSQMKhvbcHw" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
