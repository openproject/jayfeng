---
title: Retrofit2源码设计模式分析
tags:
---

## 背景

Retrofit2是Square公司刚出品不久的“类型安全的Http Client”，非常强大。

官网：http://square.github.io/retrofit/
github: https://github.com/square/retrofit

## 基本使用

略

## 探索设计模式

#### 1. 外观模式

Retrofit使用的第一个认知的类就是Retrofit，这是一个入口类，也可以说是一个全局类，对于开发者来说，基本上都是围绕这个类就够了。
这样的一个对外统一的类就是外观类，使用的就是设计模式的外观模式的思想：
第一，简化了开发者的学习成本，易于使用。
第二，封装了系统内部类的关系，对内是高内聚的，对外是松耦合的。

这是一种良好的设计规范，值得借鉴！

#### 2. 建造者模式

虽然我们现在只需要关注这一个Retrofit类，但是Retrofit承载的东西比我们要的要多，大家看它的结构，有很多方法是用不到的，如果让我们去直接创建一个Retrofit将会在碰到这些用不到的方法上困惑，建造者模式提供了一个很好的思路，我们把这个Retrofit的创建分离出来为一个Retrofit.Builder（最简单的建造者模型），在这个Retrofit里面就只做“构建”这一件事情，顺理成章的这个Builder也应该只包含构建所需的方法，用户的学习成本由一个需要了解大类简化成了只需要了解这个Builder，大大降低。

从这个Builder的使用来看，采用的是流式接口风格，这个体验比传很多参数要好很多。很多人把流式接口当成是建造者模式的特性了，这里简单的补充一下，不是这样的，两者本没有直接关系。但是我们要反思一个问题，为什么在Builder上这么喜欢使用流式风格而在其他的类上却很少这么做？答案就是，Builder是一个很特殊的类，职责非常单一，而且就是构建，这样的类能否非常自然非常统一的结合流式风格，如果直接在Retrofit上使用流式接口的话，很多其他的业务方法则无法使用了。

#### 3. 代理模式

前面的基本使用中，我们都是用Retrofit.create方法得到具体的Api Service实现，然后调这个Service相应的方法就能拿到网络返回的结果。
Retrofit对每个Api Service的调用都是封装在create方法里，看看create方法会发现，从结构上这是一个典型的动态代理实现。我们看看具体实现，
```java
(T) Proxy.newProxyInstance(service.getClassLoader(), new Class<?>[] { service },
        new InvocationHandler() {
        private final Platform platform = Platform.get();

        @Override public Object invoke(Object proxy, Method method, Object... args)
        throws Throwable {
        // If the method is a method from Object then defer to normal invocation.
        if (method.getDeclaringClass() == Object.class) {
        return method.invoke(this, args);
        }
        if (platform.isDefaultMethod(method)) {
        return platform.invokeDefaultMethod(method, service, proxy, args);
        }
        ServiceMethod serviceMethod = loadServiceMethod(method);
        OkHttpCall okHttpCall = new OkHttpCall<>(serviceMethod, args);
        return serviceMethod.callAdapter.adapt(okHttpCall);
        }
        });
```

如果是Object的方法，就按照正常调用。
如果是静态方法（java8），基本上也是正常调用。
接下来是重点了：ServiceMethod。

这个ServiceMethod是干嘛的呢？专门处理Api Service上定义的注解，参数等等，同时还有CallAdapter等。
得到这个ServiceMethod之后，传给OkHttpCall，这个OkHttpCall就是对okhttp的网络请求封装的一个类。现在把ServiceMethod传给OkHttpCall实际上就是把网络接口所需要的url，参数等所有条件传给了OkHttpCall，也就是说，已经可以基本进行网络请求了。

如果不配置CallAdapter，则使用默认的DefaultCallAdapterFactory, 得到的结果是Call<?>。

所以这里的代理模式和正常的代理模式还有点不一样，正常的代理模式只是对真实实现对象的一层控制，这个真实对象是实现对应的接口的，而这里并没有真实的对象，它把方法调用最终全部转发到了OKHttp上面去了，很有意思，把代理模式灵活的变成了一个好用的工具类一样。虽然不一样，但是思想都是想通的。

#### 4. 简单工厂
这里的Platform里面的判断就是一个简单工厂，不过是一个自动判断的简单工厂，findPlatform方法自己判断系统的类型。

#### 5. 享元模式

大家看ServiceMethod是通过loadServiceMethod方法返回的。我们看看这个方法的实现:

```java
private final Map<Method, ServiceMethod> serviceMethodCache = new LinkedHashMap<>();

ServiceMethod loadServiceMethod(Method method) {
    ServiceMethod result;
    synchronized (serviceMethodCache) {
        result = serviceMethodCache.get(method);
        if (result == null) {
            result = new ServiceMethod.Builder(this, method).build();
            serviceMethodCache.put(method, result);
        }
    }
    return result;
}
```

这个方法做了缓存处理，这个是很好理解的，大家定义的接口就那么几十个，但是不停的请求，每天几百几千次都是很正常的，把这些接口的信息缓存起来是非常有必要的一个优化手段。把这些创建后的ServiceMethod放到一个缓存池serviceMethodCache中，这个缓存池是一个hash结构。像loadServiceMethod这样的实现方式就是享元工厂的使用，是享元模式。不过这里没有涉及到内部状态外部状态，是一个简单版本的享元模式，但是用的非常多。

#### 6. 适配器模式

我们再分析一下CallAdapter，CallAdapter是干嘛的？默认的情况下，把返回的T转化为Call<T>。Call<T>是方便我们开发者调用的，包含一个成功和失败的结果返回，是给开发者统一适配的一个结果，实现代码在内置的DefaultCallAdapterFactory，同理，如果集成了Rxjava的RxJavaCallAdapterFactory则返回的是Observable<T>，方便使用Rxjava的同学使用。

这就是一个适配器模式，对结果适配，想要用那个就调用哪个适配器。

#### 7. 工厂方法

这个CallAdapter都是由对应的适配器工厂生产的，DefaultCallAdapterFactory生产CallAdapter<Call<?>>, RxJavaCallAdapterFactory生产CallAdapter<Observable<?>>，GuavaCallAdapterFactory生产CallAdapter<ListenableFuture<?>>, Java8CallAdapterFactory生产CallAdapter<CompletableFuture<?>>,这些工厂都是由开发者自行选择配置在Retrofit.Builder中的，这是不是一个典型的工厂方法呢？
后面我们加入需要新的返回值，是不是只需要增加新的工厂，生产新的CallAdapter就行了？完全不需要修改现有的一行代码一个字母，非常灵活。


#### 8. 策略模式
不同的CallAdapter是不是代表着不同的策略，当我们调用这些不同的适配器的方法时，就能得到不同的结果，这个是策略模式。

这里大家可能会分不清工厂方法和策略模式，其实区别很明显。
工厂方法强调的是生产不同的对象。策略模式强调的是这些不同对象的那个方法的具体实现，是在创建对象之后。
所以这两个模式，是应用在不同阶段的。

#### 9. 抽象工厂
CallAdapter是T转化成了另外一个结构，这个T是怎么来的？是由json解析而来。
有一个专门的Convert类，里面也有一个抽象的Factory，包含两个抽象方法：responseBodyConverter, requestBodyConverter，分别负责把okhttp返回的ResponseBody转为T, 把请求的信息转化okhttp的RequestBody。
这个Converter.Factory有很多扩展的实现，在retrofit-converters中，有gson，jackson等等。
这个和前面的工厂方法是不是很像，但是注意，这里生产的是相关的两个对象，所以这里是抽象工厂。

为什么这个地方一定不要用抽象工厂，用工厂方法不行吗？用工厂方法可以做到，但是非常不好。
因为，我们希望网络请求和响应的转化应该是内聚的，如果用工厂方法，则分离开来，客户端则需要传2个工厂，破坏了内聚，同时增加了开发者的复杂度。

#### 10 .单例模式

针对RequestBody，ResponseBody的转化，系统内置了一些转化器在BuildInConverters里，用到了大量的单例模式。
其他很多地方还有一些单例模式，这些模式基本都æesponseBodyConverter, requestBodyConverter，分别负责把okhttp返回的Re¼¨retrofit-converters中，有gson，jackson等等。
这个和前面的工厂方法是不是很像，但是注意，豉模式。而对一些启动就需要的，或者明显全局经常用且不会对系统造成压力的对象则可用饿汉式，以前一直讲懒汉式，饿汉式也有它的优点，第一，饿汉式是线程安全的；第二，形式简单，写起来干净。

#### 11. 原型模式

前面使用的OkHttpCall类，其实是实现Call<T>接口的，这个Call<T>又是继承了Cloneable接口的。
```java
  @Override public OkHttpCall<T> clone() {
    return new OkHttpCall<>(serviceMethod, args);
  }
```
OkHttpCall对这个clone的实现就是重新new了一个一样的对象，用于其他地方重用相同的Call，在ExecutorCallbackCall中有用到。
这是原型模式在Retrofit中的应用。

#### 12. 观察者模式

这个Call支持enqueue(Callback<T> callback)注册一个回调进去，当执行完毕，则会调用这个回调，这个enqueue是异步的。
这是一个简单的注册-被通知的模型，在异步环境中的经典应用。
注意：这个回调最终是传给了Okhttp的call，然后在那边负责通知回来。

## 最后
这些基本上是Retrofit包含的一些设计模式，无论包含多少种设计模式，我希望大家的焦点不是它设计模式有多少个，而是这些设计模式是起了什么作用？理解每个模式在其中发挥的作用而不是每个模式本身的作用。
