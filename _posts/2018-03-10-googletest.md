---
layout: post
title: Google Test 基础
categories:
  - 工程
tags:
  - 测试
  - GoogleTest
date: 2018-03-10 09:23:36
giscus_comments: true
---


Google Test是一个C\++的测试框架, 在Linux, Windows和Mac上都可以使用这个工具来对C++代码进行测试.
Google Test的一些特性:

1. **独立**, 测试样例的测试结果不会受其他测试的影响, 每个测试都是被隔离开来的.
1. **结构**, 测试能够很好地反应测试代码的组织结构.
1. **重用**, 测试可以被移植和重用, 能够支持许多不同的系统和编译器.
1. **定位**, 测试失败了之后可以马上定位到这个错误发生的位置.
1. **简单**, 不会增加使用者的负担.

<!-- more -->

## 安装GoogleTest ##

首先从github上获取代码然后编译安装, 通过CMake的方式进行,没有碰到什么坑.

## 基本概念 ##

在使用Google Test我们从断言开始熟悉整个过程, 我们通过断言来判断程序的行为是否正确. 断言的结果分别为 success, nonfatal failure, 或者 fatal failure. 如果出现fatal failure则会终端当前的函数.

### 简单测试 ###

通过下面的方式创建测试:

1. 用`TEST()`宏来定义测试函数.
1. 在这个函数中可以用Google Test测试任何C++语句.
1. 测试结果由断言给定, 任意断言测试错误, 这整个测试结果就是失败.

```c++
TEST(test_case_name, test_name) {
    ...test body ...
}
```

例如可以参考下面比较简单的测试样例：

```c++
TEST(MyTest, Add)
{
    EXPECT_EQ(1 + 1, 2);
    ASSERT_EQ(1 + 1, 2);
}
```

### 基本断言 ###

| **Fatal assertion** | **Nonfatal assertion** | **Verifies** |
|:-------------------:|:----------------------:|:------------:|
|`ASSERT_TRUE(`condition`)`;|`EXPECT_TRUE(`condition`)`;| condition is true |
|`ASSERT_FALSE(`condition`)`;|`EXPECT_FALSE(`condition`)`;| condition is false |

如果是`ASSERT_*`条件不成立, 则会直接报致命错误然后程序返回, 如果是`EXPECT_*`条件不成立则会继续进行.

## 在测试函数之间共享数据 ##

同一批测试数据有时候会被多次使用，但是如果像下面那样调用就有点不太优雅。

```c++
TEST(MyTest, Sum)
{
    std::vector<int> vec;
    vec.push_back(1);
    vec.push_back(2);
    EXPECT_EQ(3, std::accumulate(vec.begin(), vec.end(), 0));
}
TEST(MyTest, Size)
{
    std::vector<int> vec;
    vec.push_back(1);
    vec.push_back(2);
    EXPECT_EQ(2, vec.size());
}
```

更好的做法是，在初始化数据时创建的一个数据，并且所有的数据都可以在本地环境中对其进行修改，但是这种修改不会影响到原始数据[^1]。如果你觉得有必要可以再写一个`SetUp()`对所需要使用的数据进行初始化，也还可以再写一个`TearDown()`来释放全部的资源空间。

```c++
#include <gtest/gtest.h>
#include <vector>
class VectorTest : public testing::Test
{
protected:
    virtual void SetUp() override
    {
        vec.push_back(1);
        vec.push_back(2);
        vec.push_back(3);
    }
    std::vector<int> vec;
};
// 注意这里使用 TEST_F，而不是 TEST
TEST_F(VectorTest, PushBack)
{
    // 虽然这里修改了 vec，但对其它测试函数来说是不可见的
    vec.push_back(4);
    EXPECT_EQ(vec.size(), 4);
    EXPECT_EQ(vec.back(), 4);
}
TEST_F(VectorTest, Size)
{
    EXPECT_EQ(vec.size(), 3);
}
int main(int argc, char *argv[])
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

## 在Qt中使用GoogleTest ##

因为如果要使用Qt内置的googletest要重新新建一个项目，还是希望能统一在同一个项目中完成这些设置，所以还是决定在当前项目中开一个测试目录专门用于测试。

## Gtest进阶 ##

- <https://github.com/google/googletest/blob/master/googletest/docs/AdvancedGuide.md>


---

[^1]: <https://github.com/google/googletest/blob/master/googletest/docs/Primer.md>