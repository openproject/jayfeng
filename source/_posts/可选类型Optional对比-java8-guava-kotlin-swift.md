---
title: '可选类型Optional对比-java8,guava,kotlin,swift'
date: 2016-04-26 14:42:14
categories: java
tags: [java, guava, kotlin, swift]
---

其实可选类型并没有大家想的那么简单。
下面浅显的谈一下，后面重点对比一下其在各个语言中的最简单使用。

## 为什么需要可选类型？
我认为有三点原因（个人看法，仅供参考）：
1. null语义是模糊的
2. 契约式编程思想
3. 语法糖

<!-- more -->

第一点，举例说明，当你调用Map.get()返回null的时，这个值不存在还是这个值存在但是为null？这是语义不清晰的地方。Optional其实就是来明确不存在的新语法。这里特别要明确一点，Optional不是代替null的。
第二点，这里面的契约式编程思想(比较典型的例子就是断言)不多，只有一丝。Optional把NullPointException问题显式的拎出来问，这个值不存在，谁来付这个责任？这是要思考的。当然，还是以防御性编程为主的。（其实swift的guard关键字也类似有这么一层意思）
第三点，这点是最直观的，过去丑陋的null判断代码，通过新语法支持，终于可以变得得干净优雅了。当然这个可能需要一点学习成本，后面用代码演示。

很多人只关注了第三点，而忽略了前面两点，以为可选类型彻底解决了NullPointException问题，这是不对的，是肤浅的理解。我们应该**把可选类型当成一种新的类型**来学习，它就是不存在，先忽略语法糖，老老实实把这个概念搞懂，踏踏实实写这种新类型的代码，这样写出来的代码更安全。然后再去看语法糖，帮助写出更简洁更优雅的代码。

## 对比
#### 初始化可选类型
```java
// java8
Optional<User> user = Optional.empty();
// guava
Optional<User> user = Optional.absent();
// kotlin
var user: User?;
// swift
var user: User?;
```

#### 创建对象
```java
// java8
Optional<Integer> age = Optional.of(18);
Optional<Integer> age = Optional.ofNullable(null);
// guava
Optional<Integer> age = Optional.of(18);
Optional<Integer> age = Optional.fromNullable(null);
// kotlin
var age: Int? = 18
var age: Int?;
// swift
var age: Int? = 18
var age: Int?;
```

#### 是否存在
```java
// java
if (age.isPresent()) {}
// guava
if (age.isPresent()) {}
// kotlin
// 这一句雷到我了, 我需要思考一下...
if (age != null) {}
// swift
// 增强一下，解个包
if let age = age {}
```

#### 默认值
如果这个值真的不存在，则使用某个默认值
```java
// java
age.orElse(27)
// guava
age.or(27)
// kotlin
age ?: 27
// swift
age??27 // 非常简洁，相当于age = age.isPresent() ? age! : 27
```

#### 链式调用
现在有一个类C1，C1里面有个字段C2,C2里面有个字段C3，C3里面有个字符串字段F。要获取F：
```java
c1.c2.c3.f
```
上面的代码存在严重的NullPointException隐患，需要做检查处理，这里略过。
看看用Optional怎么改写这种情况：
```java
// java
Optional<C1> c1 = Optional.empty();
c1.ifPresent(presentC1 -> {
    presentC1.c2.ifPresent(presentC2 -> {
        presentC2.c3.ifPresent(presentC3 -> {
            String result = presentC3.f.orElse("default string here");
        });
    });
});
// guava
Optional<C1> c1 = Optional.absent();
if (c1.isPresent()
        && c1.get().c2.isPresent()
        && c1.get().c2.get().c3.isPresent()) {
    Optional<String> f = c1.get().c2.get().c3.get().f;
    String result = f.or("default string here");
}
```
如果觉得嵌套麻烦，可以在允许的范围试试这样：
```java
// 缺陷就是创建了太多空对象，如果这些空对象没有初始化值还能接受，否则就不建议了
c1.orElse(new C1())
  .c2.orElse(new C2())
  .c3.orElse(new C3())
  .f.orElse("default string here");
```
kotlin和swift就简单的多了：
```java
// kotlin
var result = c1?.c2?c3?.f
// 或
var result = c1?.c2?c3?.f ?: "default string here"
// swift
// 增强一下，解个包
if let result = c1?.c2?c3?.f {
}
// 或
if let result = (c1?.c2?c3?.f)??"default string here" {
}
```
明显看的出来，swift语法要简洁的多，java8则要差一些了。

## 官方文档
java8: [Optional](http://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)

guava: [Optional](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Optional.html)

kotlin: [Null Safety](http://kotlinlang.org/docs/reference/null-safety.html)

swift: [OptionalChaining](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/OptionalChaining.html)

## 小结
可以看的出来，java和guava非常相似，kotlin和swift非常相似，kotlin和swift作为全新语言的优势，在语法表达上要远优于java和guava。
