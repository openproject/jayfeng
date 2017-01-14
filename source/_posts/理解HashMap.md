---
title: 理解HashMap
tags:
---

以 Android 最新源码里面的 HashMap 为例，其实也和 JDK8 里面的 HashMap 差不多。
位置：[aosp]/libcore/ojluni/src/main/java/java/util/HashMap.java

## 思考
如果从零开始设计一个 HashMap 结构该如何思考？
栈？队列？数组？链表？树？图？

## 结构
早期的 HashMap 的确是只使用了数组和链表，但从 Java8 中开始引入树（红黑树）结构以提高链表过长情况下的性能。
![HashMap Data Struct](http://7xawrk.com1.z0.glb.clouddn.com/bloghashmapimg.png)

数组:
```
transient Node<K,V>[] table;
```

链表 Node(next)：
```
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;

    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
```

红黑树 TreeNode(parent, left, right)：
```java
static final class TreeNode<K,V> extends LinkedHashMap.LinkedHashMapEntry<K,V> {
    TreeNode<K,V> parent;  // red-black tree links
    TreeNode<K,V> left;
    TreeNode<K,V> right;
    TreeNode<K,V> prev;    // needed to unlink next upon deletion
    boolean red;
    TreeNode(int hash, K key, V val, Node<K,V> next) {
        super(hash,key,val,next);
    }
}
```

## 基本原理
详细的细节后面会逐步阐述，HashMap 的核心原理就是，把数据的 key 转化为 hash 值，放到某 n 长度的数组中改 hash 对应的 position，比如 hash 为 0，则放在数组的第1个位置，如果 hash 为111，则放在数组的第 112 个位置。这样每次根据 hash 值就能直接知道放在什么位置，或者反过来，根据 hash 值就能直接知道从哪个位置取值。

但是这样做，会面临几个问题：
<!-- more -->
** 第一，hash 值一般都是很大，岂不是数组要很大？ **
这个问题好解决，hash按数组长度取模，这样无论多大的 hash 总能在数组的范围之内。
顺便一问，取模操作：(n - 1) & hash，想想为什么？
** 第二，取模后，那么多 hash 取模可能重复在数组的同一位置怎么办？ **
这个叫碰撞冲突，这个时候这个 hash 值对应的 Node 既不能放在正确的 position（已被其他占用），也不能随便的放在其他位置（否则下次就找不到了），我们发现，数组已经不能满足需求了。
上链表！
把这个 Node 挂到已经占用位置的 Node 的 next 上，如果 next 已经被挂了， 那就next-next顺藤摸瓜挂在最后一个 Node 的next上。
** 第三，挂起来容易，要查询的时候怎么找？ **
无碰撞冲突的情况下，定位到数组位置就找到了。
有碰撞冲突的情况下，定位到数组后，next-next顺藤摸瓜，根据key是否相等来判断是否找到（hash相同碰撞了，但是key总是不同的）。
** 第四， 好像没用到红黑树啊？ **
当链表过长时，可以用红黑树去优化性能，关于红黑树这里不多讲。

## 三个概念
容量、负载因子、阈值：

- 容量

```java
// 因为用的是数组，定义一个容量是一个好事，比每次需要动态改变容量性能总是要好的多的。
// 初始化默认值 16
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;
transient Node<K,V>[] table;
transient int size;
```
- 负载因子

```java
// 如果频繁的发生碰撞，那么性能就会直线下降。
// 为了提高性能，不要等到满了才扩容，而是当实际个数到达某个比例就扩容。
// 这个比例就是负载因子：loadFactor，默认为0.75。
final float loadFactor;
```
- 阈值

```java
// 超过这个值则以翻倍形式扩容(resize)
// 简单的计算：threshold = capacity * load factor
int threshold;
```

## 插入(PUT)
见注释。

```java
    /**
     * Implements Map.put and related methods
     *
     * @param hash hash for key
     * @param key the key
     * @param value the value to put
     * @param onlyIfAbsent if true, don't change existing value
     * @param evict if false, the table is in creation mode.
     * @return previous value, or null if none
     */
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        if ((tab = table) == null || (n = tab.length) == 0)
            // 空检查
            n = (tab = resize()).length;
        if ((p = tab[i = (n - 1) & hash]) == null)
            // 不存在，直接插入
            // 注意 i = (n - 1) & hash 就是取模定位数组的索引
            tab[i] = newNode(hash, key, value, null);
        else {
            // 已存在：一模一样的值或者碰撞冲突
            Node<K,V> e; K k;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                // 已经存在一个一模一样的值
                e = p;
            else if (p instanceof TreeNode)
                // 树，略
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                // 碰撞冲突，顺藤摸瓜挂在链表的最后一个next上
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            // 注意：if true, don't change existing value
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }
```

## 查询(GET)
见注释。

```java
    /**
     * Implements Map.get and related methods
     *
     * @param hash hash for key
     * @param key the key
     * @return the node, or null if none
     */
    final Node<K,V> getNode(int hash, Object key) {
        Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & hash]) != null) {
            // 注意 i = (n - 1) & hash 就是取模定位数组的索引
            if (first.hash == hash && // always check first node
                ((k = first.key) == key || (key != null && key.equals(k))))
                // 找到：hash相等 和 key也相等
                return first;
            if ((e = first.next) != null) {
                if (first instanceof TreeNode)
                    // 递归树查找
                    return ((TreeNode<K,V>)first).getTreeNode(hash, key);
                do {
                    // 遍历链表
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        return null;
    }
```
## 扩容(Resize)
resize 的代码我就不贴了，这里只强调一点：
每次扩容都需要重新分配数组，并把老的值再分配到新的数组，代价还是挺大的，所以尽量避免扩容。
举个例子，现在可能大约有 100 个<Key, Value>，我们比较一下：
```java
// 128 = 2^7 < 100/0.75 < 2^8 = 256
// 最简单的形式，只是纯粹的声明变量
// 初始化容量16 = 2^4，最后会到2^8才够用
// 中间会经历了4次扩容
new HashMap<String, String>();

// 指定容量，优化后，无扩容，又刚好够用
new HashMap<String, Strring>(256);
```

## 其他
常见的几个问题的简要说明。
#### HashMap 和 HashTable 区别
在 HashMap 的官方文档第一段里面就有句话：
> The HashMap class is roughly equivalent to Hashtable, except that it is unsynchronized and permits nulls.

简简单单的一句话道出了两点核心区别：
> 1. HashMap是unsynchronized，要注意线程安全；
> 2. HashMap允许null而HashTable不允许null。

#### 同步
HashMap 不是线程安全的，如果有并发问题，请使用 ConcurrentHashMap （当然也可以用 HashTable ）。
这个问题其实很重要，[《疫苗：Java HashMap的死循环》](http://coolshell.cn/articles/9606.html)提到，淘宝因为没考虑到 HashMap 在并发的情况下会有问题，出现死循环，CPU 达到100%。


#### Fail-Fast机制
在创建迭代器后，如果发现 HashMap 发生变化，则抛出 ConcurrentModificationException 异常，这就是 Fail-Fast 机制。
这也是一种契约约束吧。

HashMap 主要是通过 modCount 来记录和检测的，大概代码片段如下（仅作示意）：
```java
if (map.modCount != expectedModCount)
    throw new ConcurrentModificationException();
```

#### 巧妙的取模
加入数组长度是 n, 如果要对 hash 取模，大家可能想到的解法是：
```java
hash % n
```
而 HashMap 采用的方法是：
```java
// n 是 2 的次方，所以 n - 1 的而进制01111111111..
// hash “与” 01111111111实际上是取保留低位值，结果在 n 的范围之内，类似于取模。
// 对于我这种没见过市面的人来说，还是很巧妙的。
hash & (n - 1)
```
后者比前者性能据说要高好几倍，可以考虑一下为什么。


#### 数组长度为什么总是设定为 2 的 N 次方？
从上面的问题的答案中，基本可以管中窥豹，一切都是为了性能。
> ** 1. 取模快。**
其实就是上面为什么快的原因：位与取模比 % 取模要快的多。
** 2. 分散平均，减少碰撞。 **
这个是主要原因。
如果二进制某位包含 0，则此位置上的数据不同对应的 hash 却是相同，碰撞发生，而 (2^x - 1) 的二进制是 0111111...，分散非常平均，碰撞也是最少的。

## 小结
HashMap 做为一个经典的数据结构，值得我们去分析原理去理解透彻，很有帮助。
而且 HashMap 也是是最常见的面试问题。
