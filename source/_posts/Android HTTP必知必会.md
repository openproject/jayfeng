title: "Android HTTP必知必会"
date: 2016-01-08 14:57:36
categories: android
tags: [http, android]
---

HTTP协议使用如此广泛，开发者务必要做到“知”，“会”。

## 引子
用curl请求百度首页全解析的过程：
```
@feng ➜  jayfeng.com (master) ✗ curl -v http://www.baidu.com > ~/http_get.txt
* Rebuilt URL to: http://www.baidu.com/
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
Dload  Upload   Total   Spent    Left  Speed
0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0*   Trying 119.75.217.109...
* Connected to www.baidu.com (119.75.217.109) port 80 (#0)
> GET / HTTP/1.1
> Host: www.baidu.com
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Date: Thu, 28 Jan 2016 14:53:51 GMT
< Content-Type: text/html; charset=utf-8
< Transfer-Encoding: chunked
< Connection: Keep-Alive
< Vary: Accept-Encoding
< Set-Cookie: BAIDUID=D75C20ED3D7551221E1C32F79C698867:FG=1; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com
< Set-Cookie: BIDUPSID=D75C20ED3D7551221E1C32F79C698867; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com
< Set-Cookie: PSTM=1453992831; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com
< Set-Cookie: BDSVRTM=0; path=/
< Set-Cookie: BD_HOME=0; path=/
< Set-Cookie: H_PS_PSSID=18880_1458_18879_12824_18205_18777_17000_17072_15544_11476_10634; path=/; domain=.baidu.com
< P3P: CP=" OTI DSP COR IVA OUR IND COM "
< Cache-Control: private
< Cxy_all: baidu+1257c154f891fc3a17374fed141622bd
< Expires: Thu, 28 Jan 2016 14:53:00 GMT
< X-Powered-By: HPHP
< Server: BWS/1.1
< X-UA-Compatible: IE=Edge,chrome=1
< BDPAGETYPE: 1
< BDQID: 0xe5ff10b4000dd380
< BDUSERID: 0
<
{ [2880 bytes data]
100 98345    0 98345    0     0   665k      0 --:--:-- --:--:-- --:--:--  671k
* Connection #0 to host www.baidu.com left intact
```

## 示意图
把上面的过程画成示意图如下：
![http 请求和响应过程](/images/http_request_and_response.gif)
但是那些代码到底是什么意思呢？
听我慢慢说来。

<!-- more -->

## 结构
说起来http的结构确实是简单，从上面的示意图大概也能看出来，包括三部分(请求和响应用/区分)：
```
- - - - - - - - - - - - - - - - - - - - - - - - - -
| Request Line / Response Line                    |
- - - - - - - - - - - - - - - - - - - - - - - - - -
| ...                                             |
| Request Header / Response Header                |
| ...                                             |
- - - - - - - - - - - - - - - - - - - - - - - - - -
| Optional Request Body / Optional Response Body  |
| ...                                             |
- - - - - - - - - - - - - - - - - - - - - - - - - -
```

### 1. 请求行/状态行
以上面百度为例子，请求行是：
```java
// 包括了基本的请求方法: GET，请求资源路径: /, HTTP协议版本: HTTP/1.1
> GET / HTTP/1.1
```
状态行是：
```java
// 包括服务器响应的HTTP协议版本: HTTP/1.1, 响应状态码: 200, 状态码描述: OK
< HTTP/1.1 200 OK
```

### 2. 首部
首部可分为请求首部，响应首部, 实体首部，非正式首部，但是这些首部会有一些相同名称的首部，我们把它们定位为通用首部。
请求首部:
```
> User-Agent: curl/7.43.0
```
响应首部：
```
< Connection: Keep-Alive
```
实体首部：
```
 Content-Type: text/html; charset=utf-8
```
非正式首部：
```
Set-Cookie: BDSVRTM=0; path=/
```
更多首部，下一节会专门详解。

### 3. 实体内容
对于请求消息，如果是POST请求，可以设置请求内容：传参，甚至上传文件。
对于响应消息，返回的主体内容，就是响应内容：网页，图片等资源都是。

## 首部字段概览
从HTTP的结构来看，HTTP的重头戏当属那些预定义的首部了。

| 首部字段名 | 说明 |
| -----|----|
|**通用首部字段**|请求报文和响应报文两方都会使用的首部|
|CacheControl| 控制缓存的行 |
|Connection|允许客户端和服务器指定与请求/响应连接有关的选项|
|Date|报文创建时间|
|Progma|报文指令|
|Trailer|报文末端的首部一览|
|Transfer-Encoding|指定报文主体的传输编码方式|
|Upgrade|升级为其它协议|
|Via|代理服务器的相关信息|
|Warning|错误通知|
|**请求首部字段**|从客户端向服务器端发送请求报文时使用的首部。补充了请求的附加内容、客户端信息、响应内容相关优先级等信息|
|Accept|用户代理可处理的媒体类型|
|Accept-Charset|优先的字符集|
|Content-Encoding|优先的内容编码|
|Connectionntent-Language|优先的语言|
|Authorization|Web认证信息|
|Expect|期待服务器的特定行为|
|From|用户的电子邮箱地址|
|Host|请求资源所在服务器|
|If-Match|比较实体标记(ETag)|
|If-Modified-Since|比较资源的更新时间|
|If-None-Match|比较实体标记较实体标记(与If-Match相反)|
|If-Range|资源未更新时发送实体Byte的范围请求|
|If-Unmodified-Since|比较资源的更新æ¶间(与If-Modified-Since相反)|
|Max-Forwards|最大传输逐跳数|
|Proxy-Authorization|代理服务器要求客户端的认证信息|
|Range|实体的字节范围请求|
|Referer|对请求中URI的原始获取方|
|TE|传输编码的优先级|
|User-Agent|HTTP客户端程序的信息|
|**响应首部字段**|从服务器端向客户端返回响应报文时使用的首部。补充了响应的附加内容，也会要求客户端附加额外的内容信息|
|Accept-Ranges|是否接受字节范围请求|
|Agente|推算资源创建经过时间|
|Etag|资源的匹配信息|
|Location|令客户端重定向至指定URI|
|Proxy-Authenticate|代理服务器对客户端的认证信息|
|Retry-After|对再次发起请求的时机要求|
|Server|HTTP服务器的安装信息|
|Vary|代理服务器缓存的管理信息|
|WWW-Authenticate|服务器对客户端的认证信息|
|**实体首部字段**|针对请求报文和响应报文的实体部分使用的首部。补充了资源内容更新时间等与实体相关的信息|
|Allow|资源可支持的HTTP方法|
|Content-Encoding|实体主体适用的编码方式|
|Content-Language|实体主体的自然语言|
|Content-Length|实体主体的大小|
|Content-Location|替代对应资源的URI|
|Content-MD5|实体主体的报文摘要|
|Content-Rangesge|实体主体的位置范围|
|Content-Type|实体主体的媒体类型|
|Expires|实体主体过期的日期时间|
|Last-Modified|资源的最后修改日期时间|

对一些常用字段深入了解是很有必要，这里不做详述，有些字段单独拿出来就能另外再写一篇文章了，请参考文末附录。

## 常见状态码
HTTP状态码标明客户端HTTP请求的返回结果，结果是否正确，应该怎么处理等信息。

| 状态码 | 描述 |
| -----|----|
|200 |OK|
|301 |Moved Permanently|
|302 |Found|
|304 |Not Modified|
|307 |Temporary Redirect|
|400 |Bad Request|
|401 |Unauthorized|
|403 |Forbidden|
|404 |Not Found|
|410 |Gone|
|500 |Internal Server Error|
|501 |Not Implemented|

## 值得注意的几个热点
### 1. 持久连接
在这个无网不冲浪，推送满天飞的年代，理解持久连接的概念非常重要。
引用wiki的解释：
>HTTP持久连接（HTTP persistent connection，也称作HTTP keep-alive或HTTP connection reuse）是使用同一个TCP连接来发送和接收多个HTTP请求/应答，而不是为每一个新的请求/应答打开新的连接的方法。

可以说，http1.1相对于http1.0的一个最大的改进就是默认支持http持久连接了。
![http 持久连接示意图](/images/http_persistent.png)

在android客户端中如果要关闭持久连接（以google http client为例）
```java
request.getHeaders().set("Connection", "close");
```
另外，关于持久连接造成EOFException的问题，我一直没用找到可靠的解决方案，okhttp的issues下关于这个讨论也是很热闹：
[EOFException in RealBufferedSource.readUtf8LineStrict](https://github.com/square/okhttp/issues/1114)
[EOFException in RealBufferedSource.readUtf8LineStrict(): 0-bytes in stream](https://github.com/square/okhttp/issues/1517)
[EOFException in RealBufferedSource.readUtf8LineStrict(): corrupt stream](https://github.com/square/okhttp/issues/1518)
但是，像xutils3这样的修复方案是真的对吗？
[尝试修复Android4.4之前HttpUrlConnection偶发的EOFException问题](https://github.com/wyouflf/xUtils3/commit/6c30604182d48aaac8e0b0fde41282ac1d09f908)

直接把4.4之前的长连接给关闭了，虽然干净了，但是是否会对性能造成影响？这个问题的解法是否要联调一下服务器的keepalive_timeout？如果真的和keepalive_timeout，keepalive_timeout设置应该设置多少（这个值不能设置太大，否则可能会把服务器搞挂）？
请高手赐教。

### 2. 断点续传
断点续传的原理其实非常简单，就是利用HTTP的请求首部中的Range字段。
第一步，计算本地文件大小。
```java
FileInputStream fis = null;
try {
    // 读取本地文件
    fis = new FileInputStream(dest);
    // currentSize就是本地文件大小
    currentSize = fis.available();
} catch (IOException e) {
    throw e;
} finally {
    if (fis != null) {
        fis.close();
    }
}
```
第二步，设置Range值，明确告知服务器从哪里接着下载。
```java
HttpURLConnection conn;
...
// 如果本地文件存在，设置RANGE为"bytes=currentSize-", -后面不写具体值，表示接着下载到文件结尾
if (currentSize > 0) {
    conn.setRequestProperty("RANGE", "bytes=" + currentSize + "-");
}
...

```

完整代码请参考：[http之download方法](https://github.com/openproject/LessCode/blob/master/lesscode-core/src/main/java/com/jayfeng/lesscode/core/HttpLess.java#L224)
PS: 这里只是说明原理，如果是可变文件（比如图片资源一般定义为不变文件），还要考虑文件校验。
### 3. 上传文件
对上传文件的理解程度某个意义上就代表了你对HTTP结构的理解程度。
第一步，为了后续代码可读性，先定义几个常量。
```java
String BOUNDARY = "--------------" + UUID.randomUUID().toString();
String PREFIX = "--",
String LINEND = "\r\n";
String MULTIPART_FROM_DATA = "multipart/form-data";
```

第二步，定义Content-Type。
Content-Type为"multipart/form-data"，因为有文件只能以二进制的形式传输。同时定义内容分隔符。
```
// ${bound} 是一个占位符, 为了表示唯一，可以用一些特殊的随机组合，比如---------------4365423423423423
Content-Type: multipart/form-data; boundary=${bound}
```
第三步，传参数（可选）。
传文件并不是说就不能再传参数了。
```java
for (Map.Entry<String, String> entry : params.entrySet()) {
    sb.append(PREFIX);
    sb.append(BOUNDARY);
    sb.append(LINEND);
    sb.append("Content-Disposition: form-data; name=\"" + entry.getKey() + "\"" + LINEND);
    sb.append("Content-Type: text/plain; charset=GBK" + LINEND);
    sb.append("Content-Transfer-Encoding: 8bit" + LINEND);
    sb.append(LINEND);
    sb.append(entry.getValue());
    sb.append(LINEND);
}
```
第四步，传文件。
```
for (Map.Entry<String, File> file : files.entrySet()) {
    StringBuilder sb1 = new StringBuilder();
    sb1.append(PREFIX);
    sb1.append(BOUNDARY);
    sb1.append(LINEND);
    // 添加文件描述
    sb1.append("Content-Disposition: form-data; name=\"uploadfile\"; filename=\""
            + file.getValue().getName() + "\"" + LINEND);
    sb1.append("Content-Type: application/octet-stream; charset=GBK" + LINEND);
    sb1.append(LINEND);
    os.write(sb1.toString().getBytes());

    is = new FileInputStream(file.getValue());
    byte[] buffer = new byte[1024];
    int len = 0;
    while ((len = is.read(buffer)) != -1) {
        os.write(buffer, 0, len);
    }
    is.close();
    os.write(LINEND.getBytes());
}
```
第五步，末尾边界。
特别写出这一步是为了强调，请务必注意各个段落的分割。
```java
byte[] end_data = (PREFIX + BOUNDARY + PREFIX + LINEND).getBytes();
os.write(end_data);

```
可以看的出来，所谓上传文件，就是以二进制的形式把这些参数，文件等数据以一定边界区分并拼装在一起发送给服务器。
完整代码请参考：[http之upload方法](https://github.com/openproject/LessCode/blob/master/lesscode-core/src/main/java/com/jayfeng/lesscode/core/HttpLess.java#L328)
关于上传如果想了解更多，可以学习一下lite http的部分源码：[lite http之content](https://github.com/litesuits/android-lite-http/tree/master/library2.0/src/com/litesuits/http/request/content)

### 4. Last Modified和ETag
通过Last Modified作为服务器文件的时间戳，来判断服务器文件是否有更新。
```java
public static long getLastModified(URL url) throws IOException {

    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    connection.setConnectTimeout(TIME_OUT);
    connection.setReadTimeout(TIME_OUT);
    long lastModified = connection.getLastModified();

    connection.disconnect();
    return lastModified;

}
```
ETag，其实和Last Modified一样，只不过它不是时间戳而是一串标志量，也可以判断服务器文件是否发生变化。
这个我没有使用过，这里不细讲。
具体请参考： [ETag使用效果对比&经验分享](http://zhanzhang.baidu.com/college/articleinfo?id=487?edm1117) 、 [对站点服务器如何配置ETag](http://zhanzhang.baidu.com/college/articleinfo?id=457)

### 5. HTTPS
HTTPS是在HTTP层之下添加了SSL层，大大增强了数据传输的安全性。
在android中，如何解析https的接口呢？（以下代码因为是多年前代码，可能有些地方欠缺严谨，仅供学习参考）
第一步，生成客户端私钥。
```java
if [ -z $1 ]; then
echo "Usage: importcert.sh <CA cert PEM file>"
exit 1
fi

CACERT=$1
BCJAR=bcprov-jdk16-145.jar

TRUSTSTORE=../app/src/main/res/raw/mytruststore.bks
ALIAS=`openssl x509 -inform PEM -subject_hash -noout -in $CACERT`

if [ -f $TRUSTSTORE ]; then
rm $TRUSTSTORE || exit 1
fi

echo "Adding certificate to $TRUSTSTORE..."
keytool -import -v -trustcacerts -alias $ALIAS \
            -file $CACERT \
            -keystore $TRUSTSTORE -storetype BKS \
            -providerclass org.bouncycastle.jce.provider.BouncyCastleProvider \
            -providerpath $BCJAR \
            -storepass 123456abc

echo ""
echo "Added '$CACERT' with alias '$ALIAS' to $TRUSTSTORE..."
```
使用这个脚本，利用pem文件，最终在res/raw目录下生成一个mytruststore.bks文件。

第二步，根据私钥和密码生成SSLSocketFactory：
```java
// 为了更好的性能，这里使用全局静态变量
private static SSLSocketFactory sCustomerSSLSocketFactory = null;
public static SSLSocketFactory getCustomerSSLSocketFactory(Context context) {
    if (sCustomerSSLSocketFactory != null) {
        return sCustomerSSLSocketFactory;
    }

    try {
        KeyStore trusted = KeyStore.getInstance("BKS");
        InputStream in = context.getResources().openRawResource(R.raw.mytruststore);
        try {
            trusted.load(in, "aike_client".toCharArray());
        }
        finally {
            in.close();
        }

        sCustomerSSLSocketFactory = new SSLSocketFactory(trusted);
        sCustomerSSLSocketFactory.setHostnameVerifier(new AllowAllHostnameVerifier());
        return sCustomerSSLSocketFactory;
    } catch(Exception e) {
        throw new AssertionError(e);
    }
}
```
第三步，在google http client中使用SSLSocketFactory。
```java
ApacheHttpTransport.Builder builder = new ApacheHttpTransport.Builder();
HttpRequestFactory httpRequestFactory = builder
    .setSocketFactory(AppConfig.getCustomerSSLSocketFactory(mContext))
    .build()
    .createRequestFactory();
HttpRequest request = httpRequestFactory.buildPostRequest(url, content);
...
```
至此https的基本使用流程大概是这样的。

## 小结
通过对HTTP结构和首部的深入学习，相信大家对http协议的理解会上一个台阶。
如果有兴趣，可自行去拓展学习一下HTTP2.0，SPDY，WebSocket等。


## 附录
[1]. [What really happens when you navigate to a URL](http://igoro.com/archive/what-really-happens-when-you-navigate-to-a-url/)
[2]. [HTTP专题 by Jerry Qu](https://imququ.com/series.html#toc-7)
[3]. [HTTP/2专题 by Jerry Qu](https://imququ.com/series.html#toc-6)
[4]. [HTTP 协议中的 Transfer-Encoding](https://imququ.com/post/transfer-encoding-header-in-http.html)
[5]. [Http 协议中的Range请求头例子](http://emacsist.github.io/2015/12/29/Http-%E5%8D%8F%E8%AE%AE%E4%B8%AD%E7%9A%84Range%E8%AF%B7%E6%B1%82%E5%A4%B4%E4%BE%8B%E5%AD%90/)
[6]. [HTTP 2.0的那些事](http://music4kid.github.io/blog/http2/)
[7]. [HTTP持久连接](https://zh.wikipedia.org/wiki/HTTP%E6%8C%81%E4%B9%85%E8%BF%9E%E6%8E%A5)
