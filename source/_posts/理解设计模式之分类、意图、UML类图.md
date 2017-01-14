---
title: 理解设计模式之分类、意图、UML类图
date: 2016-04-02 12:00:00
categories: 理解设计模式
tags: [设计模式, 面向对象, OOP, 意图, UML]
---

本文作为设计模式的组织大纲，用于设计模式的快速浏览和查询。
## 分类
基于两条原则对模式进行分类：
> **一、目的原则。**模式是用来完成什么工作的，据此分为创建型、结构型、行为型。创建型模式与对象的创建有关；结构型模式处理类或对象的组合；行为型模式对类或对象怎样交互和怎样分配职责进行描述。
> **二、范围原则。**指定模式主要是用于类还是用于对象。类模式处理类和子类的关系，通过继承建立，是静态的，在编译时刻便确定下来了。对象模式处理处理对象间的关系，在运行时刻是可以变化的，更具动态性。但是几乎所有模式都使用继承机制，所有这里的类模式只指那些集中于处理类间关系的模式。而大部分莫死都属于对象模式的范畴。

这种分类有助于学习现有的模式，对发现新的模式也有指导作用，整理成表格如下：<table><thead><tr><td colspan=2></td><td colspan=3 style="text-align:center">**目的**</td></tr></thead><tbody><tr><td colspan=2></td><td style="text-align:center">创建型</td><td style="text-align:center">结构型</td><td style="text-align:center">行为型</td></tr><tr><td rowspan=11 style="text-align:center">**范围**</td><td rowspan=2 style="text-align:center">类</td><td>[工厂方法模式](#FactoryMethod)</td><td>[适配器（类）模式](#Adapter)</td><td>[解释器模式](#Interpreter)</td></tr><tr><td></td><td></td><td>[模板方法模式](#TemplateMethod)</td></tr><tr><td rowspan=9 style="text-align:center">对象</td><td>[抽象工厂](#AbstractFactory)</td><td>[适配器（对象）模式](#Adapter)</td><td>[职责链模式](#ChainOfResponsibility)</td></tr><tr><td>[建造者模式](#Builder)</td><td>[桥接模式](#Bridge)</td><td>[命令模式](#Command)</td></tr><tr><td>[原型模式](#ProtoType)</td><td>[组合模式](#Composite)</td><td>[迭代器模式](#Iterator)</td></tr><tr><td>[单例模式](#Singleton)</td><td>[装饰者模式](#Decorator)</td><td>[中介者模式](#Mediator)</td></tr><tr><td rowspan=5></td><td>[门面模式](#Facade)</td><td>[备忘录模式](#Memento)</td></tr><tr><td>[享元模式](#Flyweight)</td><td>[观察者模式](#Observer)</td></tr><tr><td>[代理模式](#Proxy)</td><td>[状态模式](#State)</td></tr><tr><td rowspan=2></td><td>[策略模式](#Strategy)</td></tr><tr><td>[访问者模式](#Visitor)</td></tr></tbody></table>

## 意图、UML类图
{% cq %}
### 创建型模式
与对象的创建有关。
{% endcq %}

#### <a name="FactoryMethod">工厂方法</a>
> 定义一个用于创建对象的接口，让子类决定实例化哪一个类。Factory Method 使一个类的实例化延迟到其子类。

![简单工厂UML类图](/images/dp_uml_factory_simple.png)
![工厂方法UML类图](/images/dp_uml_factory_method.png)
<!-- more -->
#### <a name="AbstractFactory">抽象工厂</a>
> 提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。

![抽象工厂UML类图](/images/dp_uml_factory_abstract.png)

#### <a name="Builder">建造者模式</a>
> 将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

![建造者模式UML类图](/images/dp_uml_builder.png)

#### <a name="ProtoType">原型模式</a>
> 用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。

![原型模式UML类图](/images/dp_uml_prototype.png)

#### <a name="Singleton">单例模式</a>
> 保证一个类仅有一个实例，并提供一个访问它的全局访问点。

![单例模式UML类图](/images/dp_uml_singleton.png)

{% cq %}
### 结构型模式
处理类或对象的组合。
{% endcq %}

#### <a name="Adapter">适配器模式</a>
> 将一个类的接口转换成客户希望的另外一个接口。Adapter 模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

![类适配器UML类图](/images/dp_uml_adapter_class.png)
![对象适配器UML类图](/images/dp_uml_adapter_object.png)

#### <a name="Bridge">桥接模式</a>
> 将抽象部分与它的实现部分分离，使它们都可以独立地变化。

![桥接模式UML类图](/images/dp_uml_bridge.png)

#### <a name="Composite">组合模式</a>
> 将对象组合成树形结构以表示“部分 -整体”的层次结构。 Composite使得用户对单个对象和组合对象的使用具有一致性。

![组合模式UML类图](/images/dp_uml_composite.png)

#### <a name="Decorator">装饰者模式</a>
> 动态地给一个对象添加一些额外的职责。就增加功能来说, Decorator模式相比生成子类更为灵活。

![装饰者模式UML类图](/images/dp_uml_decorator.png)

#### <a name="Facade">门面模式</a>
> 为子系统中的一组接口提供一个一致的界面，Facade模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。

![门面模式UML类图](/images/dp_uml_facade.png)

#### <a name="Flyweight">享元模式</a>
> 运用共享技术有效地支持大量细粒度的对象。

![享元模式UML类图](/images/dp_uml_flyweight.png)

#### <a name="Proxy">代理模式</a>
> 为其他对象提供一种代理以控制对这个对象的访问。

![代理模式UML类图](/images/dp_uml_proxy.png)

{% cq %}
### 行为型模式
对类或对象怎样交互和怎样分配职责进行描述。
{% endcq %}

#### <a name="Interpreter">解释器模式</a>
> 用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。

![解释器模式UML类图](/images/dp_uml_interpreter.png)

#### <a name="TemplateMethod">模板方法模式</a>
> 定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。TemplateMethod 使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。

![模板方法模式UML类图](/images/dp_uml_template_method.png)

#### <a name="ChainOfResponsibility">职责链模式</a>
> 使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

![职责链模式UML类图](/images/dp_uml_chainofresponsibility.png)

#### <a name="Command">命令模式</a>
> 将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化；对请求排队或记录请求日志，以及支持可撤消的操作。

![命令模式UML类图](/images/dp_uml_command.png)

#### <a name="Iterator">迭代器模式</a>
> 提供一种方法顺序访问一个聚合对象中各个元素, 而又不需暴露该对象的内部表示。

![迭代器模式UML类图](/images/dp_uml_iterator.png)

#### <a name="Mediator">中介者模式</a>
> 用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。

![中介者模式UML类图](/images/dp_uml_mediator.png)

#### <a name="Memento">备忘录模式</a>
> 在不破坏封装性的前提下,捕获一个对象的内部状态,并在该对象之外保存这个状态。这样以后就可将该对象恢复到原先保存的状态。

![备忘录模式UML类图](/images/dp_uml_memento.png)

#### <a name="Observer">观察者模式</a>
> 定义对象间的一种一对多的依赖关系 ,当一个对象的状态发生改变时 , 所有依赖于它的对象都得到通知并被自动更新。

![观察者模式UML类图](/images/dp_uml_observer.png)

#### <a name="State">状态模式</a>
> 允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它的类。

![状态模式UML类图](/images/dp_uml_state.png)

#### <a name="Strategy">策略模式</a>
> 定义一系列的算法,把它们一个个封装起来, 并且使它们可相互替换。本模式使得算法可独立于使用它的客户而变化。

![策略模式UML类图](/images/dp_uml_strategy.png)

#### <a name="Visitor">访问者模式</a>
> 表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作。

![访问者模式UML类图](/images/dp_uml_visitor.png)
