---
layout: post
title: 一个3D模型（译）
categories:
  - 工程
tags:
  - 3D
  - CAD
  - 500L
  - 翻译
date: 2018-05-05 15:52:49
giscus_comments: true
---


这是500Lines项目中的A 3D modeller文章的翻译版，讲述如何使用Python，OpenGL，GLUT进行3D建模程序的设计。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-05-05-A-3D-Modeller-zh/500l-cover.png" title="500l-cover" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<!-- more -->

## 绪论 ##

人类非常具有创造力。我们在不断地设计和创造新颖有用并且非常有趣的东西。在现代，我们编写软件来辅助这一设计和创造的过程。计算机辅助设计软件让创造者们能够设计建筑、桥梁、视频游戏艺术、电影特效、3D打印的物体，以及很多构建实物之前的设计版本。

作为他们的核心，CAD工具是能够将3D的设计物体抽象成可以在2D屏幕上展示的方法。为了达到这种定义，CAD工具必须提供三类基础的方法。第一，它们必须要有能够表现设计的3D物体的数据结构：这是计算机理解的用户正在构建的东西。第二，CAD工具必须提供一些方法把它展现在屏幕上。虽然人设计的东西是3维的，但是屏幕只有2维。CAD工具必须对我们如何理解物体进行建模，并且把它们绘制在屏幕上以保证人能够理解全部的3维结构。第三，CAD工具还要提供能够交互设计物体的方法。为了能够让用户创造出想要的物体，必须能能够添加或者修改这个设计。额外的，所有的工具都需要一种在磁盘上保存和加载方法以便用户可以修改、分享、和存储他们的工作。

一个领域特定的CAD工具可以根据这个领域的需求针对性地提供很多额外的特性。例如，一个建筑CAD工具可以提供很多物理模拟针对气候压力来测试建筑物，一个3D打印的工具将会测试这个设计是否真的是可以打印的，一个电气CAD工具将会模拟电流流经电线的物理现象，一个电影特效套件将会包括精细地模拟火焰术的特征。

然而，所有的CAD工具都必须包括至少三个上面讨论过的特性：一个用于表达设计的数据结构，将其展现在屏幕上的能力，可以交互设计的方法。

记住这些东西，让我们来探索如何表达3D设计，把这些展现在屏幕上，并且和它交互，用500行Python代码。

## 指南 ##

很多3D模型背后的设计决策的驱动力都是渲染过程。我们希望能够在我们的设计中存储和渲染复杂的对象，但是我们又希望能够使得存储和渲染的代码复杂度尽量低。让我们来考察渲染的过程，并且探索能让我们用简单的渲染逻辑处理任意的复杂对象。

### 管理接口和主循环 ###

在我们开始渲染前，有几样东西我们要先建立起来。第一，我们需要创建一个展示我们的设计的窗口。第二，我们希望能够和图形驱动交流来渲染到屏幕上。我们一般不会直接和显示驱动交流，所以我们用跨平台的抽象层称为OpenGL，还有一个叫GLUT（the OpenGL Utility Toolkit）来管理我们的窗口。

### OpenGL 笔记 ##

OpenGL是一个跨平台的图形程序编程接口开发工具。是一个开发跨平台图形程序的标准接口。OpenGL有两个主要的变体：传统OpenGL和现代OpenGL。

在OpenGL上进行渲染是基于由顶点和法线定义的多边形。例如，要渲染方块的一个面，我们需要指定四个顶点和这面的法线。

传统OpenGL提供了“固定功能流水线”。通过设置全局变量，程序员可以启用和禁用诸如照明，着色，表面剔除等功能的自动化实现。然后OpenGL自动使用启用的功能呈现场景。此功能已弃用。

另一方面，现代OpenGL具有可编程渲染流水线，程序员在其中编写称为“着色器”的小程序，该程序在专用图形硬件（GPU）上运行。 Modern OpenGL的可编程流水线已经取代了Legacy OpenGL。

在这个项目中，尽管Legacy OpenGL已被弃用，但我们使用它。 Legacy OpenGL提供的固定功能对于保持较小的代码尺寸非常有用。 它减少了所需的线性代数知识的数量，并简化了我们将要编写的代码。

### 关于 GLUT ###

与OpenGL捆绑在一起的GLUT允许我们创建操作系统窗口并注册用户界面回调。 这个基本功能对我们来说已经足够了。 如果我们想要一个更全面的窗口管理和用户交互库，我们会考虑使用像GTK或Qt这样的完整窗口工具包。

### 观察 ###

为了管理GLUT和OpenGL的建立，并且驱动下面的模型，我们创建一个叫`Viewer`的类。我们一个一个`Viewer`实例，这个实例可以管理窗口的创建和渲染，并且包括很多我们程序的主循环。在`Viewer`的初始化中，我们创建一个图形化窗口，并且初始化OpenGL。

`init_interface`函数创建一个窗口放被渲染的模型，并指定需要渲染设计是调用的函数。`init_opengl`函数建立起项目中OpenGL需要的状态。它设定矩阵，实现背面剔除，注册光线以照亮场景，并告诉OpenGL我们希望哪些物体被着色。`init_scence`函数创建`Scene`（场景）对象并且放置一些初始节点让用户开始。我们很快就会看到`Scene`数据结构。最后，`init_interaction`注册让用户交互的回调函数，我们将在后面讨论。

初始化`Viewer`以后，我们调用`glutMainLoop`来将程序执行转移到GLUT。这个函数从不返回。我们在GLUT事件上注册的回调将在这些事件发生时被调用。

```python
import numpy as np
from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GLUT import *


class Viewer(object):
    def __init__(self):
        """ Initialize the viewer. """
        self.init_interface()
        self.init_opengl()
        self.init_scene()
        self.init_interaction()
        init_primitives()

    def init_interface(self):
        """ initialize the window and register the render function """
        glutInit()
        glutInitWindowSize(640, 480)
        glutCreateWindow("3D Modeller")
        glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB)
        glutDisplayFunc(self.render)

    def init_opengl(self):
        """ initialize the opengl setting to render the scene """
        self.inverseModelView = np.identity(4)
        self.modelView = np.identity(4)

        glEnable(GL_CULL_FACE)
        glCullFace(GL_BACK)
        glEnable(GL_DEPTH_TEST)
        glDepthFunc(GL_LESS)

        glEnable(GL_LIGHT0)
        glLightfv(GL_LIGHT0, GL_POSITION, GLfloat_4(0, 0, 1, 0))
        glLightfv(GL_LIGHT0, GL_SPOT_DIRECTION, GLfloat_3(0, 0, -1))

        glColorMaterial(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE)
        glEnable(GL_COLOR_MATERIAL)
        glClearColor(0.4, 0.4, 0.4, 0.0)

    def init_scene(self):
        """ initialize the scene object and initial scene """
        self.scene = Scene()
        self.create_sample_scene()

    def create_sample_scene(self):
        cube_node = Cube()
        cube_node.translate(2, 0, 2)
        cube_node.color_index = 2
        self.scene.add_node(cube_node)

        sphere_node = Sphere()
        sphere_node.translate(-2, 0, 2)
        sphere_node.color_index = 3
        self.scene.add_node(sphere_node)

        hierarchical_node = SnowFigure()
        hierarchical_node.translate(-2, 0, -2)
        self.scene.add_node(hierarchical_node)

    def init_interaction(self):
        """ init user interaction and callbacks """
        self.interaction.register_callback('pick', self.pick)
        self.interaction.register_callback('move', self.move)
        self.interaction.register_callback('place', self.place)
        self.interaction.register_callback('rotate_color', self.rotate_color)
        self.interaction.register_callback('scale', self.scale)

    def main_loop(self):
        glutMainLoop()

if __name__ == '__main__':
    viewer = Viewer()
    viewer.main_loop()
```

在我们深入`render`函数之前，我们要先讨论一些线性代数。

### 坐标空间 ###

根据我们的目的，坐标空间是一个原点和一组3个基向量，通常是$$x$$，$$y$$和$$z$$轴。

### 点 ###

三维中的任何点都可以表示为从原点开始的$$x$$，$$y$$和$$z$$方向的偏移量。 点的表示与点所在的坐标空间有关。同一点在不同的坐标空间中有不同的表示。 三维中的任何点都可以在任何三维坐标空间中表示。

### 向量 ###

向量是一个$$x$$，$$y$$和$$z$$值，分别表示$$x$$，$$y$$和$$z$$轴中两个点之间的差异。

### 变换矩阵 ###

在计算机图形学中，为不同类型的点使用多个不同的坐标空间是很方便的。 变换矩阵将点从一个坐标空间转换为另一个坐标空间。 为了将矢量$$v$$从一个坐标空间转换到另一个坐标空间，我们乘以一个变换矩阵$$M$$：$$v'= Mv$$。 一些常见的变换矩阵是平移，缩放和旋转。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-05-05-A-3D-Modeller-zh/newtranspipe.png" title="title:变换流程" class="img-fluid rounded z-depth-1" caption="title:变换流程" %}
    </div>
</div>

为了能够将一个东西绘制在屏幕上，我们需要在几个不同的坐标空间中进行转换。

在上图的右边，包括OpenGL将会为我们处理的所有从眼见空间到视点空间的变换。

从眼睛空间转换到齐次投影空间由`gluPerspective`处理，并且转换为标准化设备空间和视点空间由`glViewport`处理。 这两个矩阵相乘并存储为GL_PROJECTION矩阵。 我们不需要知道术语或这些矩阵如何为这个项目工作的细节。

然而，我们确实需要自己管理图表的左侧。 我们定义一个矩阵，将模型中的点（也称为网格）从模型空间转换为世界空间，称为模型矩阵。 我们还定义了从世界空间转换到眼睛空间的视图矩阵。 在这个项目中，我们这两个矩阵结合从而得到ModelView矩阵。

要了解更多关于整个图形渲染流水线和涉及的坐标空间的信息，请参阅实时渲染的第2章或其他介绍性计算机图形书籍。

## 用Viewer渲染 ##

`render`函数首先设置渲染时需要完成的全部OpenGL状态。 它通过`init_view`初始化投影矩阵，并使用来自交互成员的数据从场景空间转换到世界空间的转换矩阵初始化ModelView矩阵。 我们将在下面看到更多关于Interaction类的内容。 它用`glClear`清除屏幕，再告诉场景渲染自己，然后呈现单元网格。

在渲染网格之前，我们禁用OpenGL的照明。 在禁用照明的情况下，OpenGL渲染纯色的项目，而不会去模拟光源。 这样，网格就具有与场景的视觉差异。 最后，`glFlush`通知图形驱动程序我们已准备好将缓冲区刷新并显示在屏幕上。

```python
    # class Viewer
    def render(self):
        """ The render pass for the scene """
        self.init_view()

        glEnable(GL_LIGHTING)
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)

        # Load the modelview matrix from the current state of the trackball
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()
        glLoadIdentity()
        loc = self.interaction.translation
        glTranslated(loc[0], loc[1], loc[2])
        glMultMatrixf(self.interaction.trackball.matrix)

        # store the inverse of the current modelview.
        currentModelView = numpy.array(glGetFloatv(GL_MODELVIEW_MATRIX))
        self.modelView = numpy.transpose(currentModelView)
        self.inverseModelView = inv(numpy.transpose(currentModelView))

        # render the scene. This will call the render function for each object
        # in the scene
        self.scene.render()

        # draw the grid
        glDisable(GL_LIGHTING)
        glCallList(G_OBJ_PLANE)
        glPopMatrix()

        # flush the buffers so that the scene can be drawn
        glFlush()

    def init_view(self):
        """ initialize the projection matrix """
        xSize, ySize = glutGet(GLUT_WINDOW_WIDTH), glutGet(GLUT_WINDOW_HEIGHT)
        aspect_ratio = float(xSize) / float(ySize)

        # load the projection matrix. Always the same
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()

        glViewport(0, 0, xSize, ySize)
        gluPerspective(70, aspect_ratio, 0.1, 1000.0)
        glTranslated(0, 0, -15)
```

## 要渲染什么：场景 ##

既然我们已经初始化渲染管道来处理世界坐标空间中的绘图，那么我们将渲染什么？ 回想一下，我们的目标是有一个由三维模型组成的设计。 我们需要一个数据结构来包含设计，我们需要使用这个数据结构来渲染设计。 注意上面，我们从查看器的渲染循环中调用`self.scene.render()`。 场景是什么？

`Scene`类是我们用来表示设计的数据结构的接口。 它抽象出数据结构的细节，并提供与设计交互所需的必要接口功能，包括渲染，添加项目和操作项目的功能。 Viewer拥有一个`Scene`对象。 `Scene`实例保存了场景中所有项目的列表，名为`node_list`。 它也跟踪所选项目。 场景中的渲染函数只需在`node_list`的每个成员上调用渲染。

```python
class Scene(object):

    # the default depth from the camera to place an object at
    PLACE_DEPTH = 15.0

    def __init__(self):
        # The scene keeps a list of nodes that are displayed
        self.node_list = list()
        # Keep track of the currently selected node.
        # Actions may depend on whether or not something is selected
        self.selected_node = None

    def add_node(self, node):
        """ Add a new node to the scene """
        self.node_list.append(node)

    def render(self):
        """ Render the scene. """
        for node in self.node_list:
            node.render()
```

## Nodes ##

在场景的`render`函数中，我们对场景中`node_list`的每个项目调用`render`函数。但是这些列表中的元素都是什么呢？我们称他们为节点。理论上，一个节点就是可以放在场景中任何东西。在面向对象的软件中，我们把`Node`写成一个抽象基类。任何在`Scene`中表示对象的东西都是从这个`Node`继承而来的。这个基类让我们可以抽象地解释场景。代码库地其余部分不需要知道它显示对象的细节；它只需要知道它们是类节点。

每种`Node`都定义了渲染它或者和它交互的行为。这个`Node`保持跟踪关于它自己的重要数据：平移矩阵、缩放矩阵、颜色等。将节点的平移矩阵乘上它的缩放矩阵就得将它从节点模型坐标空间到世界坐标空间的转换矩阵。该节点还存储一个轴对齐的边界框（AABB）。 当我们在下面讨论选择时，我们会看到更多关于AABB的信息。

`Node`最简单的具体实现是一个原语。 基元是可以添加到场景中的单个固体形状。 在这个项目中，基元是`Cube`和`Sphere`。

```python
class Node(object):
    """ Base class for scene elements """
    def __init__(self):
        self.color_index = random.randint(color.MIN_COLOR, color.MAX_COLOR)
        self.aabb = AABB([0.0, 0.0, 0.0], [0.5, 0.5, 0.5])
        self.translation_matrix = numpy.identity(4)
        self.scaling_matrix = numpy.identity(4)
        self.selected = False

    def render(self):
        """ renders the item to the screen """
        glPushMatrix()
        glMultMatrixf(numpy.transpose(self.translation_matrix))
        glMultMatrixf(self.scaling_matrix)
        cur_color = color.COLORS[self.color_index]
        glColor3f(cur_color[0], cur_color[1], cur_color[2])
        if self.selected:  # emit light if the node is selected
            glMaterialfv(GL_FRONT, GL_EMISSION, [0.3, 0.3, 0.3])

        self.render_self()

        if self.selected:
            glMaterialfv(GL_FRONT, GL_EMISSION, [0.0, 0.0, 0.0])
        glPopMatrix()

    def render_self(self):
        raise NotImplementedError(
            "The Abstract Node Class doesn't define 'render_self'")

class Primitive(Node):
    def __init__(self):
        super(Primitive, self).__init__()
        self.call_list = None

    def render_self(self):
        glCallList(self.call_list)


class Sphere(Primitive):
    """ Sphere primitive """
    def __init__(self):
        super(Sphere, self).__init__()
        self.call_list = G_OBJ_SPHERE


class Cube(Primitive):
    """ Cube primitive """
    def __init__(self):
        super(Cube, self).__init__()
        self.call_list = G_OBJ_CUBE
```

基于每个节点存储的转换矩阵对节点进行渲染。节点的变换矩阵是其缩放矩阵与其平移矩阵的组合。 无论节点是什么类型，渲染的第一步是将OpenGL ModelView矩阵设置为变换矩阵，以便从模型坐标空间转换为视图坐标空间。 一旦OpenGL矩阵是最新的，我们就调用`render_self`来通知节点进行必要的OpenGL调用来绘制自己。 最后，我们撤销对该特定节点对OpenGL状态所做的任何更改。 我们使用OpenGL中的`glPushMatrix`和`glPopMatrix`函数在渲染节点之前和之后保存和恢复ModelView矩阵的状态。 请注意，节点存储其颜色，位置和比例，并在渲染之前将这些应用在OpenGL状态。

如果节点当前被选中，我们使它发光。 这样，用户就可以看到他们选择了哪个节点。

为了渲染基元，我们使用OpenGL的调用列表功能。 OpenGL调用列表是一系列OpenGL调用，它们被定义一次并以单一名称捆绑在一起。 可以使用`glCallList(LIST_NAME)`分配调用。 每个基元（球体和立方体）定义了渲染它所需的调用列表（未显示）。

例如，立方体的调用列表绘制了立方体的6个面，其中心位于原点，而边缘正好为1个单位长。

```pseudo
# Pseudocode Cube definition
# Left face
((-0.5, -0.5, -0.5), (-0.5, -0.5, 0.5), (-0.5, 0.5, 0.5), (-0.5, 0.5, -0.5)),
# Back face
((-0.5, -0.5, -0.5), (-0.5, 0.5, -0.5), (0.5, 0.5, -0.5), (0.5, -0.5, -0.5)),
# Right face
((0.5, -0.5, -0.5), (0.5, 0.5, -0.5), (0.5, 0.5, 0.5), (0.5, -0.5, 0.5)),
# Front face
((-0.5, -0.5, 0.5), (0.5, -0.5, 0.5), (0.5, 0.5, 0.5), (-0.5, 0.5, 0.5)),
# Bottom face
((-0.5, -0.5, 0.5), (-0.5, -0.5, -0.5), (0.5, -0.5, -0.5), (0.5, -0.5, 0.5)),
# Top face
((-0.5, 0.5, -0.5), (-0.5, 0.5, 0.5), (0.5, 0.5, 0.5), (0.5, 0.5, -0.5))
```

仅使用基元对于建模应用程序来说是相当有限的。 3D模型通常由多个基元组成（或三角形网格，这在本项目的范围之外）。 幸运的是，我们的`Node`类的设计使多个基元节点组成场景变得方便。 事实上，我们可以在不增加复杂性的情况下支持任意节点分组。

作为动力，让我们考虑一个非常基本的数字：一个典型的雪人，或由三个球体组成的雪花图。 即使该图由三个独立的基元组成，我们希望能够将它视为单个对象。

我们创建一个名为`HierarchicalNode`的类，一个包含其他节点的节点。 它管理一系列“孩子”。`HierarchicalNode`的`render_self`函数只需在每个子节点上调用`render_self`。 使用`HierarchicalNode`类，向场景添加图像非常简单。 现在，定义雪图与指定构成它的形状以及它们的相对位置和大小一样简单。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-05-05-A-3D-Modeller-zh/nodes.jpg" title="title:Node 子类的层次结构" class="img-fluid rounded z-depth-1" caption="title:Node 子类的层次结构" %}
    </div>
</div>

```python
class HierarchicalNode(Node):
    def __init__(self):
        super(HierarchicalNode, self).__init__()
        self.child_nodes = []

    def render_self(self):
        for child in self.child_nodes:
            child.render()
```

```python
class SnowFigure(HierarchicalNode):
    def __init__(self):
        super(SnowFigure, self).__init__()
        self.child_nodes = [Sphere(), Sphere(), Sphere()]
        self.child_nodes[0].translate(0, -0.6, 0) # scale 1.0
        self.child_nodes[1].translate(0, 0.1, 0)
        self.child_nodes[1].scaling_matrix = numpy.dot(
            self.scaling_matrix, scaling([0.8, 0.8, 0.8]))
        self.child_nodes[2].translate(0, 0.75, 0)
        self.child_nodes[2].scaling_matrix = numpy.dot(
            self.scaling_matrix, scaling([0.7, 0.7, 0.7]))
        for child_node in self.child_nodes:
            child_node.color_index = color.MIN_COLOR
        self.aabb = AABB([0.0, 0.0, 0.0], [0.5, 1.1, 0.5])
```

你可能会观察到`Node`对象形成了一个树形数据结构。 渲染函数通过分层节点在树中进行深度优先遍历。 在遍历时，它会把用于转换到世界空间的ModelView矩阵压入栈中。 在每个步骤中，它将当前的ModelView矩阵入栈，当它完成所有子节点的渲染时，它会将矩阵从堆栈中弹出，并将父节点的ModelView矩阵留在堆栈的顶部。

通过以这种方式使`Node`类可扩展，我们可以向场景添加新类型的形状，而无需更改用于场景操纵和渲染的任何其他代码。 使用节点概念来抽象出一个场景对象可能有很多孩子的事实被称为复合设计模式。

## 用户交互 ##

现在我们的建模器能够存储和显示场景，我们需要一种与之交互的方式。 我们需要促进两种类型的互动。 首先，我们需要改变场景观看角度的能力。 我们希望能够在场景中移动眼睛或相机。 其次，我们需要能够添加新节点并修改场景中的节点。

要启用用户交互，我们需要知道用户何时按下键或移动鼠标。 幸运的是，操作系统已经知道这些事件何时发生。 GLUT允许我们注册一个函数，在某个事件发生时被调用。 我们编写函数来解释按键和鼠标移动，并告诉GLUT在按下相应的键时调用这些函数。 一旦我们知道用户正在按下哪些按键，我们需要解释输入并将预期动作应用到场景中。

在`Interaction`类中可以找到用于监听操作系统事件并解释其含义的逻辑。 我们之前编写的`Viewer`类拥有`Interaction`的单一实例。 我们将使用GLUT回调机制来注册当按下鼠标按钮时（`glutMouseFunc`），当移动鼠标时（`glutMotionFunc`），按下键盘按钮（`glutKeyboardFunc`），以及按下方向键时要调用的函数（`glutSpecialFunc`）。 我们将很快看到处理输入事件的函数。

```python
class Interaction(object):
    def __init__(self):
        """ Handles user interaction """
        # currently pressed mouse button
        self.pressed = None
        # the current location of the camera
        self.translation = [0, 0, 0, 0]
        # the trackball to calculate rotation
        self.trackball = trackball.Trackball(theta = -25, distance=15)
        # the current mouse location
        self.mouse_loc = None
        # Unsophisticated callback mechanism
        self.callbacks = defaultdict(list)

        self.register()

    def register(self):
        """ register callbacks with glut """
        glutMouseFunc(self.handle_mouse_button)
        glutMotionFunc(self.handle_mouse_move)
        glutKeyboardFunc(self.handle_keystroke)
        glutSpecialFunc(self.handle_keystroke)
```

### 操作系统回调函数 ###

为了有意义地解释用户输入，我们需要结合鼠标位置，鼠标按钮和键盘的知识。 因为将用户输入解释为有意义的动作需要很多代码行，所以我们将它封装在一个独立的类中，远离主代码路径。 `Interaction`类隐藏了与代码库其余部分无关的复杂性，并将操作系统事件转换为应用程序级事件。

```python
    # class Interaction 
    def translate(self, x, y, z):
        """ translate the camera """
        self.translation[0] += x
        self.translation[1] += y
        self.translation[2] += z

    def handle_mouse_button(self, button, mode, x, y):
        """ Called when the mouse button is pressed or released """
        xSize, ySize = glutGet(GLUT_WINDOW_WIDTH), glutGet(GLUT_WINDOW_HEIGHT)
        y = ySize - y  # invert the y coordinate because OpenGL is inverted
        self.mouse_loc = (x, y)

        if mode == GLUT_DOWN:
            self.pressed = button
            if button == GLUT_RIGHT_BUTTON:
                pass
            elif button == GLUT_LEFT_BUTTON:  # pick
                self.trigger('pick', x, y)
            elif button == 3:  # scroll up
                self.translate(0, 0, 1.0)
            elif button == 4:  # scroll up
                self.translate(0, 0, -1.0)
        else:  # mouse button release
            self.pressed = None
        glutPostRedisplay()

    def handle_mouse_move(self, x, screen_y):
        """ Called when the mouse is moved """
        xSize, ySize = glutGet(GLUT_WINDOW_WIDTH), glutGet(GLUT_WINDOW_HEIGHT)
        y = ySize - screen_y  # invert the y coordinate because OpenGL is inverted
        if self.pressed is not None:
            dx = x - self.mouse_loc[0]
            dy = y - self.mouse_loc[1]
            if self.pressed == GLUT_RIGHT_BUTTON and self.trackball is not None:
                # ignore the updated camera loc because we want to always
                # rotate around the origin
                self.trackball.drag_to(self.mouse_loc[0], self.mouse_loc[1], dx, dy)
            elif self.pressed == GLUT_LEFT_BUTTON:
                self.trigger('move', x, y)
            elif self.pressed == GLUT_MIDDLE_BUTTON:
                self.translate(dx/60.0, dy/60.0, 0)
            else:
                pass
            glutPostRedisplay()
        self.mouse_loc = (x, y)

    def handle_keystroke(self, key, x, screen_y):
        """ Called on keyboard input from the user """
        xSize, ySize = glutGet(GLUT_WINDOW_WIDTH), glutGet(GLUT_WINDOW_HEIGHT)
        y = ySize - screen_y
        if key == 's':
            self.trigger('place', 'sphere', x, y)
        elif key == 'c':
            self.trigger('place', 'cube', x, y)
        elif key == GLUT_KEY_UP:
            self.trigger('scale', up=True)
        elif key == GLUT_KEY_DOWN:
            self.trigger('scale', up=False)
        elif key == GLUT_KEY_LEFT:
            self.trigger('rotate_color', forward=True)
        elif key == GLUT_KEY_RIGHT:
            self.trigger('rotate_color', forward=False)
        glutPostRedisplay()
```

### 内部回调 ###

在上面的代码片段中，您会注意到，当`Interaction`实例解释用户操作时，它会使用描述操作类型的字符串调用`self.trigger`。`Interaction`类的触发器函数是我们将用于处理应用程序级事件的简单回调系统的一部分。 回想一下，`Viewer`类的`init_interaction`函数通过调用`register_callback`来注册`Interaction`实例上的回调函数。

```python
    # class Interaction
    def register_callback(self, name, func):
        self.callbacks[name].append(func)
```

当用户界面代码需要在场景中触发事件时，`Interaction`类会调用它为该特定事件保存的所有回调：

```python
    # class Interaction
    def trigger(self, name, *args, **kwargs):
        for func in self.callbacks[name]:
            func(*args, **kwargs)
```

这个应用程序级回调系统抽象了系统其余部分了解操作系统输入的需求。 每个应用程序级别的回调代表了应用程序中的有意义的请求。 `Interaction`类充当操作系统事件和应用程序级事件之间的转换器。 这意味着如果我们决定将建模器移植到除GLUT之外的另一个工具包中，我们只需要用一个将新工具箱的输入转换为同一组有意义的应用级回调的类来替换`Interaction`类。 我们在下表中使用回调和参数

|回调函数|参数|作用|
|:---|:---|:---|
|pick|x:number, y:number|Selects the node at the mouse pointer location.|
|move|x:number, y:number|Moves the currently selected node to the mouse pointer location.|
|place|shape:string, x:number, y:number|Places a shape of the specified type at the mouse pointer location.|
|rotate_color|forward:boolean|Rotates the color of the currently selected node through the list of colors, forwards or backwards.|
|scale|up:boolean|Scales the currently selected node up or down, according to parameter.|

这个简单的回调系统提供了我们在这个项目中需要的所有功能。 然而，在构建3D建模器中，用户界面对象通常是动态创建和销毁的。 在这种情况下，我们需要一个更复杂的事件监听系统，其中对象既可以注册也可以取消注册事件回调。

## 接入场景 ##

通过我们的回调机制，我们可以从`Interaction`类接收关于用户输入事件的有意义的信息。 我们准备将这些操作应用到场景中。

### 移动场景 ###

在这个项目中，我们通过变换场景来完成相机运动。换句话说，相机处于固定位置，用户输入移动场景而不是移动相机。相机放置在$$[0, 0, -15]$$并且对着世界空间的中心（或者，我们可以改变透视矩阵来移动相机而不是场景。 这个设计决定对其余的项目影响很小。）重新浏览`Viewer`中的`render`函数，我们看到`Interaction`状态用于在渲染场景之前转换OpenGL矩阵状态。 有两种与`Scene`交互的类型：旋转和平移。

### 用一个轨迹球旋转场景 ###

我们通过使用轨迹球算法来完成场景的旋转。 轨迹球是用于三维操纵场景的直观界面。 从概念上讲，轨迹球界面的功能就好像场景在透明球体内一样。 将一只手放在地球表面并推动它旋转地球。 同样，单击鼠标右键并在屏幕上移动它可以旋转场景。你可以在[OpenGL Wiki](<http://www.opengl.org/wiki/Object_Mouse_Trackball>)中找到更多关于轨迹球理论的信息。 在这个项目中，我们使用作为[Glumpy](<https://code.google.com/p/glumpy/source/browse/glumpy/trackball.py>)的一部分提供的轨迹球实施。

我们使用`drag_to`函数与轨迹球进行交互，将鼠标的当前位置作为起始位置，并将鼠标位置的变化作为参数。

```python
self.trackball.drag_to(self.mouse_loc[0], self.mouse_loc[1], dx, dy)
```

当渲染场景时，生成的旋转矩阵是`Viewer`中的`trackball.matrix`。

### 补充：四元数 ###

旋转有两种传统的方式表示。 第一个是围绕每个轴的旋转值; 你可以将它存储为浮点数的三元组。 旋转的另一种常见表示是四元数，由具有$$x$$，$$y$$和$$z$$坐标的矢量以及$$w$$旋转组成的元素。 使用四元数对于每轴旋转有许多好处; 特别是它们在数值上更稳定。 使用四元数可以避免类似万向节锁的问题。 四元数的缺点是它们不太直观，难以理解。 如果你很勇敢并想了解更多关于四元数的内容，可以参考[这个解释](<http://3dgep.com/?p=1815>)。

轨迹球的实现使通过在内部使用四元数存储场景的旋转来避免万向节锁定。 幸运的是，我们不需要直接使用四元数，因为轨迹球上的矩阵成员会将旋转转换为矩阵。

### 场景转换 ###

场景转移（即滑动场景）比旋转场景要简单得多。 提供随鼠标滚轮和鼠标左键一起的场景转换。 鼠标左键在$$x$$和$$y$$坐标中转换场景。 滚动鼠标滚轮可以将场景转换为$$z$$坐标（朝向或远离摄像机）。 `Interaction`类存储当前的场景转换并使用平移功能修改它。 查看器在渲染过程中检索交互摄像头位置以用于`glTranslated`调用。

### 选择场景对象 ###

现在，用户可以移动和旋转整个场景以获得他们想要的视角，下一步是允许用户修改和操作构成场景的对象。

为了让用户操作场景中的对象，他们需要能够选择场景中的对象。

要选择一个项目，我们使用当前投影矩阵生成代表鼠标点击的光线，就好像鼠标指针将射线投射到场景中一样。 所选节点是射线与射线相交的最近节点。 因此，拾取问题简化为在光线和场景中的节点之间找到交点的问题。 所以问题是：我们如何判断光线是否碰到节点？

准确计算光线是否与节点相交是一个在代码复杂性和性能方面具有挑战性的问题。 我们需要为每种类型的基元编写一个光线对象交叉检查。 对于具有许多面的复杂网格几何形状的场景节点，计算精确的光线对象相交将需要测试每个面的光线，并且计算起来会有很高的代价。

为了保持代码紧凑和性能合理，我们使用简单，快速的近似值进行光线对象相交测试。 在我们的实现中，每个节点都保存一个轴对齐的边界框（AABB），它是节点占据的空间的近似值。 为了测试光线是否与节点相交，我们测试光线是否与节点的AABB相交。 这种实现意味着所有节点共享相同的代码进行相交测试，对于所有节点类型而言这意味着性能开销都是固定的小的。

```python
    # class Viewer
    def get_ray(self, x, y):
        """ 
        Generate a ray beginning at the near plane, in the direction that
        the x, y coordinates are facing 

        Consumes: x, y coordinates of mouse on screen 
        Return: start, direction of the ray 
        """
        self.init_view()

        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()

        # get two points on the line.
        start = numpy.array(gluUnProject(x, y, 0.001))
        end = numpy.array(gluUnProject(x, y, 0.999))

        # convert those points into a ray
        direction = end - start
        direction = direction / norm(direction)

        return (start, direction)

    def pick(self, x, y):
        """ Execute pick of an object. Selects an object in the scene. """
        start, direction = self.get_ray(x, y)
        self.scene.pick(start, direction, self.modelView)
```

为了确定哪个节点被点击，我们遍历场景来测试光线是否碰到任何节点。 我们取消选择当前选择的节点，然后选择最靠近射线源的交点。

```python
    # class Scene
    def pick(self, start, direction, mat):
        """
        Execute selection.

        start, direction describe a Ray. 
        mat is the inverse of the current modelview matrix for the scene.
        """
        if self.selected_node is not None:
            self.selected_node.select(False)
            self.selected_node = None

        # Keep track of the closest hit.
        mindist = sys.maxint
        closest_node = None
        for node in self.node_list:
            hit, distance = node.pick(start, direction, mat)
            if hit and distance < mindist:
                mindist, closest_node = distance, node

        # If we hit something, keep track of it.
        if closest_node is not None:
            closest_node.select()
            closest_node.depth = mindist
            closest_node.selected_loc = start + direction * mindist
            self.selected_node = closest_node
```

在`Node`类中，`pick`函数测试光线是否与节点的轴对齐边界框相交。 如果选择了节点，则选择功能切换节点的选定状态。 请注意，AABB的`ray_hit`函数接受框的坐标空间和光线坐标空间之间的变换矩阵作为第三个参数。 在进行`ray_hit`函数调用之前，每个节点都将自己的变换应用于矩阵。

```python
    # class Node
    def pick(self, start, direction, mat):
        """ 
        Return whether or not the ray hits the object

        Consume:  
        start, direction form the ray to check
        mat is the modelview matrix to transform the ray by 
        """

        # transform the modelview matrix by the current translation
        newmat = numpy.dot(
            numpy.dot(mat, self.translation_matrix), 
            numpy.linalg.inv(self.scaling_matrix)
        )
        results = self.aabb.ray_hit(start, direction, newmat)
        return results

    def select(self, select=None):
       """ Toggles or sets selected state """
       if select is not None:
           self.selected = select
       else:
           self.selected = not self.selected
```

ray-AABB选择方法非常易于理解和实施。 但是，在某些情况下结果是错误的。

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-05-05-A-3D-Modeller-zh/AABBError.png" title="title:AABB 错误" class="img-fluid rounded z-depth-1" caption="title:AABB 错误" %}
    </div>
</div>

例如，在`Sphere`基元的情况下，球体本身只触及每个AABB面的中心的AABB。 但是，如果用户点击`Sphere`的AABB的角落，即使用户打算点击`Sphere`后面的某个东西，碰撞也会被`Sphere`检测到。

复杂性，性能和准确性之间的这种折衷在计算机图形学和软件工程的许多领域中是常见的。

### 调整场景对象 ###

接下来，我们希望允许用户操纵选定的节点。 他们可能想要移动，调整大小或更改所选节点的颜色。 当用户输入命令来操作节点时，`Interaction`类将输入转换为用户所需的操作，并调用相应的回调。

当`Viewer`收到其中一个事件的回调时，它会调用场景上的相应功能，然后将该变换应用于当前选定的节点。

```python
    # class Viewer
    def move(self, x, y):
        """ Execute a move command on the scene. """
        start, direction = self.get_ray(x, y)
        self.scene.move_selected(start, direction, self.inverseModelView)

    def rotate_color(self, forward):
        """ 
        Rotate the color of the selected Node. 
        Boolean 'forward' indicates direction of rotation. 
        """
        self.scene.rotate_selected_color(forward)

    def scale(self, up):
        """ Scale the selected Node. Boolean up indicates scaling larger."""
        self.scene.scale_selected(up)
```

### 改变颜色 ###

操作颜色是通过一系列可能的颜色来完成的。 用户可以通过箭头键在列表中循环。 场景将颜色更改命令分派给当前选定的节点。

```python
    # class Scene
    def rotate_selected_color(self, forwards):
        """ Rotate the color of the currently selected node """
        if self.selected_node is None: return
        self.selected_node.rotate_color(forwards)
```

每个节点存储其当前颜色。 `rotate_color`函数只是修改节点的当前颜色。 渲染节点时，颜色将通过`glColor`传递给OpenGL。

```python
    # class Node
    def rotate_color(self, forwards):
        self.color_index += 1 if forwards else -1
        if self.color_index > color.MAX_COLOR:
            self.color_index = color.MIN_COLOR
        if self.color_index < color.MIN_COLOR:
            self.color_index = color.MAX_COLOR
```

### 节点缩放 ###

与颜色一样，场景会将所有缩放修改分派给所选节点（如果有的话）。

```python
    # class Scene
    def scale_selected(self, up):
        """ Scale the current selection """
        if self.selected_node is None: return
        self.selected_node.scale(up)
```

每个节点有一个存储其比例的当前矩阵。 在这些相应方向上通过参数x，y和z缩放的矩阵是：

\begin{equation}
\begin{bmatrix}
x & 0 & 0 & 0\\\\\\\\
0 & y & 0 & 0\\\\\\\\
0 & 0 & z & 0\\\\\\\\
0 & 0 & 0 & 1
\end{bmatrix}
\end{equation}

当用户修改节点的缩放比例时，就把生成的缩放矩阵乘以该节点的当前缩放矩阵。

```python
    # class Node
    def scale(self, up):
        s =  1.1 if up else 0.9
        self.scaling_matrix = numpy.dot(self.scaling_matrix, scaling([s, s, s]))
        self.aabb.scale(s)
```

给定一个含$$x$$，$$y$$和$$z$$缩放因子的列表，函数`scaling`返回这样一个矩阵。

### 移动节点 ###

为了转化节点，我们使用与选取对象相同的射线计算方法。 我们将代表当前鼠标位置的射线传递给场景的`move`函数。 节点的新位置应该在射线上。 为了确定光线放置节点的位置，我们需要知道节点距相机的距离。 由于我们存储节点的位置和相机在选中时的位置（在`pick`函数中），我们可以在这里使用这些数据。 我们发现沿着目标光线与相机距离相同的点，并计算新旧位置之间的矢量差。 然后我们通过结果向量来转换节点。

```python
    # class Scene
    def move_selected(self, start, direction, inv_modelview):
        """
        Move the selected node, if there is one.

        Consume:
        start, direction describes the Ray to move to
        mat is the modelview matrix for the scene 
        """
        if self.selected_node is None: return

        # Find the current depth and location of the selected node
        node = self.selected_node
        depth = node.depth
        oldloc = node.selected_loc

        # The new location of the node is the same depth along the new ray
        newloc = (start + direction * depth)

        # transform the translation with the modelview matrix
        translation = newloc - oldloc
        pre_tran = numpy.array([translation[0], translation[1], translation[2], 0])
        translation = inv_modelview.dot(pre_tran)

        # translate the node and track its location
        node.translate(translation[0], translation[1], translation[2])
        node.selected_loc = newloc
```

请注意，新位置和旧位置是在相机坐标空间中定义的。 我们需要在世界坐标空间中定义我们的平移。 因此，我们通过乘以模型视图矩阵的逆，从摄像机空间平移到世界空间。

与缩放一样，每个节点存储代表其平移的矩阵。平移矩阵如下所示：

\begin{equation}
\begin{bmatrix}
1 & 0 & 0 & x \\\\\\\\
0 & 1 & 0 & y \\\\\\\\
0 & 0 & 1 & z \\\\\\\\
0 & 0 & 0 & 1
\end{bmatrix}
\end{equation}

当节点被平移时，我们为当前平移构建一个新的平移矩阵，并将其乘以节点的平移矩阵以便在渲染过程中使用。

```python
    # class Node
    def translate(self, x, y, z):
        self.translation_matrix = numpy.dot(
            self.translation_matrix, 
            translation([x, y, z]))
```

平移函数返回给定表示x，y和z平移距离的列表的平移矩阵。

### 放置节点 ###

节点布局使用拾取和平移技术。 我们对当前鼠标位置使用相同的光线计算来确定放置节点的位置。

```python
    # class Viewer
    def place(self, shape, x, y):
        """ Execute a placement of a new primitive into the scene. """
        start, direction = self.get_ray(x, y)
        self.scene.place(shape, start, direction, self.inverseModelView)
```

要放置一个新节点，我们首先创建相应类型节点的新实例并将其添加到场景中。 我们希望将节点放置在用户的光标下，因此我们在距离相机固定距离的光线上找到一个点。 因为，光线是在相机空间中表示的，所以我们通过将其与逆模型视图矩阵相乘，将得到的平移向量转换为世界坐标空间。 最后，我们通过计算出的矢量来转换新节点。

```python
    # class Scene
    def place(self, shape, start, direction, inv_modelview):
        """
        Place a new node.

        Consume:
        shape the shape to add
        start, direction describes the Ray to move to
        inv_modelview is the inverse modelview matrix for the scene 
        """
        new_node = None
        if shape == 'sphere': new_node = Sphere()
        elif shape == 'cube': new_node = Cube()
        elif shape == 'figure': new_node = SnowFigure()

        self.add_node(new_node)

        # place the node at the cursor in camera-space
        translation = (start + direction * self.PLACE_DEPTH)

        # convert the translation to world-space
        pre_tran = numpy.array([translation[0], translation[1], translation[2], 1])
        translation = inv_modelview.dot(pre_tran)

        new_node.translate(translation[0], translation[1], translation[2])
```

## 总结 ##

恭喜！ 我们已经成功实现了一个小型3D建模器！

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2018-05-05-A-3D-Modeller-zh/StartScene.png" title="title:简单场景" class="img-fluid rounded z-depth-1" caption="title:简单场景" %}
    </div>
</div>

我们看了如何开发一个可扩展的数据结构来表示场景中的对象。 我们注意到，使用Composite设计模式和基于树的数据结构可以轻松遍历场景进行渲染，并允许我们添加新类型的节点而不增加复杂性。 我们利用这个数据结构将设计渲染到屏幕上，并在场景图的遍历中操纵OpenGL矩阵。 我们为应用程序级事件构建了一个非常简单的回调系统，并使用它来封装操作系统事件的处理。 我们讨论了射线 - 物体碰撞检测的可能实现方式，以及正确性，复杂性和性能之间的权衡。 最后，我们实现了处理场景内容的方法。

你可以在工业3D软件中找到这些相同的基本构建模块。场景图结构和相对坐标空间可用于许多类型的3D图形应用程序，从CAD工具到游戏引擎。 该项目的一个主要简化是在用户界面上。工业3D建模器要求具有完整的用户界面，这将需要更复杂的事件系统而不是我们设计的简单的回调系统。

我们可以做进一步的实验来为这个项目添加新的功能。 尝试其中之一：

- 添加`Node`类型以支持任意形状的三角形网格。
- 添加撤消堆栈，以允许撤消/重做模型操作。
- 使用DXF等3D文件格式保存/加载设计。
- 整合渲染引擎：导出设计以用于照片级渲染器。
- 通过精确的光线对象交叉来改善碰撞检测。

## 更多拓展 ##

为了深入了解真实世界的3D建模软件，一些开源项目很有趣。

[Blender](<http://www.blender.org/>)是一款开源的全功能3D动画套件。 它提供了一个完整的3D管道，用于在视频中创建特殊效果或创建游戏。 建模器是该项目的一小部分，它是将建模器集成到大型软件套件中的一个很好的例子。

[OpenSCAD](<http://www.openscad.org/>)是一款开源3D建模工具。 它不是互动的; 相反，它读取指定如何生成场景的脚本文件。 这可以让设计师“完全控制建模过程”。

有关计算机图形学算法和技术的更多信息，[Graphics Gems](<http://tog.acm.org/resources/GraphicsGems/>)是一个很好的资源。