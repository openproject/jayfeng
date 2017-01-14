---
title: 理清WebSocket和HTTP的关系
date: 2016-07-25 08:46:33
tags:
---

最近公司内部同事分享了WebSocket相关的一些知识，之前也用过WebSocket做过一个即时通信的应用。基本上但凡提到WebSocket和HTTP的关系都会有以下两条：

> 1. WebSocket和HTTP都是基于TCP协议的两个不同的协议
> 2. WebSocket依赖于HTTP连接

作为结论性的总结，直接了当，但是我需要更多的实现细节来解释上述结论。
因为都是基于TCP的两个独立的协议，WebSocket按理说可以和HTTP没有关系，所以这里面包含两个问题：

> 1. WebSocket依赖于HTTP连接，那么它如何从连接的HTTP协议转化为WebSocket协议？
> 2. WebSocket为什么要依赖于HTTP协议的连接？

## 问题一

幸运的是，第一个问题的答案很容易找到。

每个WebSocket连接都始于一个HTTP请求。
具体来说，WebSocket协议在第一次握手连接时，通过HTTP协议在传送WebSocket支持的版本号，协议的字版本号，原始地址，主机地址等等一些列字段给服务器端：
```java
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key:dGhlIHNhbXBsZSBub25jZQ==
Origin: http://example.com
Sec-WebSocket-Version: 13
```
注意，关键的地方是，这里面有个Upgrade首部，用来把当前的HTTP请求升级到WebSocket协议，这是HTTP协议本身的内容，是为了扩展支持其他的通讯协议。
如果服务器支持新的协议，则必须返回101：
```java
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept:s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```
至此，HTTP请求物尽其用，如果成功出发onopen事件，否则触发onerror事件，后面的传输则不再依赖HTTP协议。
总结一下，这张图比较贴切：
![WebSocket and HTTP](/images/websocket_websocket_http_tcp.gif)

## 问题二

经过学习和理解，我认为有两点：

第一，WebSocket设计上就是天生为HTTP增强通信（全双工通信等），所以在HTTP协议连接的基础上是很自然的一件事，并因此而能获得HTTP的诸多便利。
第二，这诸多便利中有一条很重要，基于HTTP连接将获得最大的一个兼容支持，比如即使服务器不支持WebSocket也能建立HTTP通信，只不过返回的是onerror而已，这显然比服务器无响应要好的多。


## 最后
关于WebSocket和HTTP的讨论其实网上并不少，但因为一些资料本身就逻辑混乱，往往看的越多可能对于它们的关系越糊涂。
理清一下这个简单的关系对于了解它们的应用场景还是有必要的，这也是我做这个分析的出发点所在。

