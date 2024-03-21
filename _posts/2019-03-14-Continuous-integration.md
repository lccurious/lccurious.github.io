---
layout: post
title: 持续集成
categories:
  - 工程
tags:
  - CI
  - Continuous integration
  - 持续集成
date: 2019-03-14 14:29:09
giscus_comments: true
---

互联网软件的开发和发布，已经形成了一套标准呢流程，最重要的部分就是持续集成（Continuous integration，CI）。持续集成强调开发人员提交了新代码之后，立刻进行构建、（单元）测试。根据测试结果，我们可以确定新代码和原有代码能否正确地集成在一起。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-03-14-Continuous-integration/CI.jpg" title="持续集成" class="img-fluid rounded z-depth-1" caption="持续集成" %}
    </div>
</div>

<!-- more -->

## 什么是 CI ？

因为在有些产品的开发周期中会有非常多非常快速密集的变更（例如一天多次将代码集成到主干上），所以在开发过程中有很多的错误难以被及时发现。采用持续集成的方法，虽然并不能使得产品避免bug，但是可以更早更及时地发现问题，不至于累计成难以解决的大问题[^1]。持续继承可以给团队带来的好处有：

- 避免漫长紧张的集成
- 提高项目的透明度和团队交流
- 及早找到问题并且处理掉
- 减少调试成本并且增加更多的特性
- 建立比较稳定的基础
- 更快地交付代码

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-03-14-Continuous-integration/Snipaste_2019-03-14_13-37-48.png" title="Snipaste_2019-03-14_13-37-48" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

大部分的持续集成系统都会有一套相同的基本工具和过程。当开发者将一个新的工作增加到分支上时，服务器机会自动编译和测试代码来确定是否能够正常工作，是否能够和主开发分支上的代码集成。持续集成服务会输出编译结果和这个分支能否通过所有集成到主开发分支上的要求。针对每一次提交，CI就能够输出连续的交付（Continuous Delivery，CD），新版本的软件通过质量团队或者用户的评审之后，可以进入生产阶段。代码通过评审的下一步是进入持续部署（Continuous Deployment）[^2]，代码通过评审之后自动部署到生产环境中去。

## CI 流程

根据持续集成的设计，整个过程从提交代码到生产，主要有以下几步[^3]。

### 提交

开发者完成一部分的代码编写之后，向代码仓库提交代码。所有后面的步骤都始于本地代码的一次提交（commit）。

### 测试

代码仓库对commit操作配置了钩子（hook），只要提交代码或者合并进主干，就会跑自动化测试。

测试有好几种。

> - 单元测试：针对函数或模块的测试
> - 集成测试：针对整体产品的某个功能的测试，又称功能测试
> - 端对端测试：从用户界面直达数据库的全链路测试

至少单元测试要能够通过保证这个新加的模块是能够正常使用的。这样至少可以合并到主干分支中去，但是还需要确定这种合并之后的软件是不是能够很正常运作，所以还需要进行集成测试，甚至端对端测试来保证每次提交的结果是正确的。如果不能保证整体是能够正常运行的，那就不能到下一步的部署阶段。

### 部署

通过所有的测试之后，代码是可以部署到生产环境了，将这个版本的所有文件打包就可以发布到服务器上了。

生产服务器将打包文件，解包成本地的一个目录，再将运行路径的符号链接（symlink）指向这个目录，然后重新启动应用。这方面的部署工具有[Ansible](http://www.ansible.com/)，[Chef](https://www.chef.io/chef/)，[Puppet](https://puppetlabs.com/)等。

## Github 和 CI

在Github上你可以通过添加WebHook来连接你的CI服务器，一旦你发布了新的内容或者有新的pull，都会被拷贝到服务器上然后运行编译和测试程序。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-03-14-Continuous-integration/Snipaste_2019-03-14_13-53-21.png" title="Snipaste_2019-03-14_13-53-21" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

然后服务器会及时返回测试结果给GitHub，来告知是否通过测试。所有的过程都是高度自动自动化，这个结果还会产生一个build的徽章，你可以把它添加到你的README文件中去。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2019-03-14-Continuous-integration/Snipaste_2019-03-14_13-55-24.png" title="Snipaste_2019-03-14_13-55-24" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

---

[^1]: <https://www.thoughtworks.com/continuous-integration>
[^2]: <https://www.youtube.com/watch?v=xSv_m3KhUO8>
[^3]: <http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html>
