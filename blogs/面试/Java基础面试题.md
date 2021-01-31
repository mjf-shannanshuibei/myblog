---
title: Java基础面试题
date: 2021-1-30
tags:
 - java
categories: 
 - 面试
---
# 一、Java基础

## 1. JDK和JRE区别

JDK（Java development kit）：java开发者工具箱，包括

* 各种Java工具（Java编译器、捆绑工具、部署工具等）
* 调试器
* Java核心类库（Java API）
* JRE（Java Runtime Environment）：java运行环境
  * JVM
  * 代码库
  * java程序运行所需组件

## 2. == 与 Equals有什么区别

==：

* 基本数据类型，比较左右两边**值**是否相等
  * a = 10, b = 10, a == b  true
* 引用类型，则该关系操作符判断的是左右两边操作数的**内存地址**是否相同
  * 在Java中引用类型的变量存储并不是“值”本身，而是地址，因此看引用的地址是否是同一个
  * 如 String a = “abc”, String b = new String(“abc”), a == b 返回的是false

equals：比较的是两个对象的**内容**是否相同

* 它是基类Object中的方法，任何继承Object类都会有该方法

* 在Java中常用的对象已经重写了equals方法，方便我们调用进行比较

* equals判断是否相同三步骤

  * 1. 是否是同一对象,是直接返回true，相等，false进入第二步

       ```java
       if (this == anObject) {     // 先判断引用是否相同(是否为同一对象),
           return true;
       }
       ```

  * 2. 比较类型是否相同，不同直接false，相等，进行第三步

  * 3. 比较**内容**是否相同

    ```java
    if (anObject instanceof String) {   // 再判断类型是否一致,
        // 最后判断内容是否一致.
        String anotherString = (String)anObject;
        int n = count;
        if (n == anotherString.count) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = offset;
            int j = anotherString.offset;
            while (n-- != 0) {
                if (v1[i++] != v2[j++])
                    return false;
            }
            return true;
        }
    }
    return false;
    ```

* equals重写原则

  * 对称性：a.equals(b) ==  true 那么  b.equals(a) == true
  * 自反性：a.equals(a) == true
  * 类推性：a.equals(b) ==  true， b.equals(c) == true，那么a.equals(c) ==  true
  * 一致性：a.equals(b) == true 那么执行无论多少次都应该是 true
  * 任何情况下，**x.equals(null)【应使用关系比较符 ==】，永远返回是“false”；x.equals(和x不同类型的对象)永远返回是“false”**

## 3. HashCode 与 Equals 相同吗

不同，hashCode和equals虽然都是Object类中的方法，并且都能够被重写，但是

* **hashcode本意是系统用来快速检索对象而使用**，**equals方法本意是用来判断引用的对象是否一致**

- **hashCode 方法是基类Object中的实例native方法，equals则是equals方法**
- **原则也不同**
  - 原则 1 ： 如果 x.equals(y) 返回 “true”，那么 x 和 y 的 hashCode() 必须相等 ；如果 x 和 y 的 hashCode() 不相等，那么 x.equals(y) 一定返回 “false” ；
  - 原则 2 ： 如果 x.equals(y) 返回 “false”，那么 x 和 y 的 hashCode() 有可能相等，也有可能不等 ；
  - 原则 3 ： 一般来讲，equals 这个方法是给用户调用的，而 hashcode 方法一般用户不会去调用 ；
  - 原则 4 ： 当一个对象类型作为集合对象的元素时，那么这个对象应该拥有自己的equals()和hashCode()设计，而且要遵守前面所说的几个原则。

## 4. 哈希

**概念**

​		hash就是将任意长度的输入，通过**散列算法**，变换成固定长度的输出（int），该输出就是散列值为int型。这种转换是一种压缩映射，散列值的空间远小于输入的空间。**简单的说，就是一种将任意长度的消息压缩到某一固定长度的消息摘要的函数。**

​		缺点：不同的输入会有相同的输出，因此不可能从散列值来唯一的确定输入值。这也导致了hashcode和equals不同的原则之一

**应用—数据结构**

* **哈希表**：结合了数组和链表的优点，是一种寻址容易，插入和删除也容易的数据结构
* 实现哈希表的常用方法**拉链法（链表的数组）**，
  * 拉链法适用范围： 快速查找，删除的基本数据结构，通常需要总数据量可以放入内存

> **要点 ：**
> hash函数选择，针对字符串，整数，排列，具体相应的hash方法；
> 碰撞处理，一种是open hashing，也称为拉链法，另一种就是closed hashing，也称开地址法，opened addressing。

## 5. Final有什么作用

Final作用于：

* 类：类不能被继承
* 方法：方法不能被重写
* 变量：final 修饰的变量叫常量，常量必须初始化，初始化之后值就不能被修改

## 6. 操作字符串有哪些类？它们之间有什么区别

* 操作字符串的类主要有三种：String、StringBuffer、StringBuilder
* String与StringBuffer、StringBuilder的区别：**String声明的是不可变的对象**，每次操作都会生成新的 String 对象，然后将指针指向它，stringBuilder、StringBuffer声明之后还可在原有的基础上修改。
* StringBuffer和StringBuilder区别在于：
  * **StringBuffer是线程安全的**，多线程仍可以保证数据安全；**StringBuilder非线程安全**，多线程无法保证数据安全
  * **在性能上**：StringBuilder > StringBuffer > String

> StringBuffer在jdk1.1后出现  StringBuilder则是在jdk 1.5

## 7. Java中的Math.round(-1.5)等于多少

坐标轴：-3 -2 -1 0 1 2 3

故Math.round(-1.5) = -1，Math.round(1.5) = 2

## 8. String属于基础的数据类型吗

不属于基础类型,基本数据类型只有八种，分别是：boolean、byte、char、short、int、float、double、long，String它属于对象

## 9.  String str = “a”和String str = new String(“a”)一样吗

不一样，因为它们的内存分配方式不一样。JVM虚拟机会将前者分配至常量池中，后者则会被分到堆内存中。

## 10. **如何将字符串反转？**

可以使用StringBuilder或StringBuffer中的reverse()方法

```java
StringBuilder a = new StringBuilder("abcd");
StringBuffer b = new StringBuffer("abcd");
System.out.println(a.reverse());
System.out.println(b.reverse());
```

## 11. **String 类的常用方法都有那些？**

- indexOf()：返回指定字符的索引。
- charAt()：返回指定索引处的字符。
- replace()：字符串替换。
- trim()：去除字符串两端空白。
- split()：分割字符串，返回一个分割后的字符串数组。
- getBytes()：返回字符串的 byte 类型数组。
- length()：返回字符串长度。
- toLowerCase()：将字符串转成小写字母。
- toUpperCase()：将字符串转成大写字符。
- substring()：截取字符串。
- equals()：字符串比较。

## 12. 抽象类必须要有抽象方法吗

不需要，抽象类不一定非要有抽象方法。

```java
abstract class cat{
    public void sayHi(){
        System.out.println("hello");
    }
}
```

## 13. **普通类和抽象类有哪些区别？**

抽象类可以包含抽象方法，但普通类不行

抽象类不能直接实例化，但是普通类可以

## 14. **抽象类能使用 final 修饰吗？**

不能，抽象类的特性就是不能直接实例化，需要被继承。一旦被final修饰，就无法被继承，这是矛盾的。

## 15. 接口和抽象类有什么区别

* 实现方法上：
  * 抽象类的子类是通过extends来继承，接口则是需要implements来实现接口
  * 类可以实现多个接口，但只能有一个继承类
* 构造函数上：抽象类可以有构造函数，而接口不能
* main方法上：抽象类可以有自己的main方法并可以执行，但是接口不能
* 访问修饰符：接口中的方法默认使用 public 修饰；抽象类中的方法可以是任意访问修饰符。

## 16.  **java 中 IO 流分为几种？**

* 按功能来分：输入流（input）、输出流（output）。

* 按类型来分：字节流和字符流。
  * 字节流和字符流的区别是：字节流按 8 位传输以字节为单位输入输出数据，字符流按 16 位传输以字符为单位输入输出数据。
  * 字节流可用于任何类型的对象，包括二进制对象，而字符流只能处理字符或者字符串

> 读文本文件的时候用字符流，非文本文件用字节流

## 17. **BIO、NIO、AIO 有什么区别？**

- BIO：Block IO 同步阻塞式IO，就是我们传统使用的IO， 特点是模式简单，使用方便，但是并发处理能力低。
  - 服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销，当然可以通过线程池机制改善。
- NIO：New IO 同步非阻塞式IO，是传统IO的升级，客户端和服务端通过Channel（通道）通信，实现了多路复用
  - 服务器实现模式为一个请求一个线程，即客户端发送的连接请求都会注册到多路复用器上，多路复用器轮询到连接有I/O请求时才启动一个线程进行处理。
- AIO：Asynchronous IO 则是 NIO 的升级，叫异步非阻塞式IO，又称NIO2，异步IO的操作基于事件和回调机制
  - 服务器实现模式为一个有效请求一个线程，客户端的I/O请求都是由OS先完成了再通知服务器应用去启动线程进行处理。

> #### 适用场景分析
>
> - BIO方式适用于连接数目比较小且固定的架构，这种方式对服务器资源要求比较高，并发局限于应用中，JDK1.4以前的唯一选择，但程序直观简单易理解。
> - NIO方式适用于轻操作（连接数目多且连接比较短）的架构，比如聊天服务器，并发局限于应用中，编程比较复杂，JDK1.4开始支持。
> - AIO方式使用于重操作（连接数目多且连接比较长）的架构，比如相册服务器，充分调用OS参与并发操作，编程比较复杂，JDK7开始支持。

## 18. **Files的常用方法都有哪些？**

- Files.exists()：检测文件路径是否存在。
- Files.createFile()：创建文件。
- Files.createDirectory()：创建文件夹。
- Files.delete()：删除一个文件或目录。
- Files.copy()：复制文件。
- Files.move()：移动文件。
- Files.size()：查看文件个数。
- Files.read()：读取文件。
- Files.write()：写入文件。

# 二、容器

## 19. **java 常见容器都有哪些？**

![image-20201024220712092](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201024220712092.png)

## 20. **Collection 和 Collections 有什么区别？**

* Collection是一个集合类的顶级接口，提供对集合对象进行基本操作的通用接口方法。它的意义是为各种具体的集合提供了最大化的统一操作方式，其直接继承接口有List与Set和queue。
* Collections则是集合类的一个工具类，它提供了一系列静态方法，用于对集合中元素进行排序、搜索以及线程安全等各种操作。

## 21. **List、Set、Map 之间的区别是什么？**

* List和Set都继承接口Collection，Map不是
* 三者的实现类也不同
  * List实现类常见的有：ArrayList、LinkedList、Vector
  * Set实现类：HashSet、LinkedHashSet、TreeSet
  * Map：HashMap、HashTable、TreeMap
* 元素：List可重复、Set，Map不可重复
* 顺序：List有序、Set无序
* 线程安全：Vector线程安全、HashTable线程安全

## 22. HashMap和HashTable的区别

* 继承不同：Hashtable是基于陈旧的Dictionary类的，HashMap是Java 1.2引进的Map接口的一个实现。
* HashMap去掉了HashTable的contains方法，添加了containKey（）和containValue（）方法
* HashMap是非同步，HashTable是同步的，因此效率上HashMap比HashTable高
* HashMap允许空键值，HashTable不允许
* 哈希值的使用不同：HashTable直接调用hashCode，HashMap需要重新计算Hash值

## 23. **如何决定使用 HashMap 还是 TreeMap？**

两者对比的话HashMap的用途更加广泛，简单来说HashMap非常适合插入、删除和定位元素这类场景，而TreeMap则更适合对一个有序的key集合进行遍历的应用场景。

## 24. **Map**

接口java.util.Map，类继承关系如下图所示

![image-20201104222039084](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201104222039084.png)

各个实现类的特点：

* HashMap：根据键的hashCode值存储数据，大多数情况下可以直接定位到它的值，因而具有很快的访问速度，但遍历顺序却是不确定的。 HashMap最多只允许一条记录的键为null，允许多条记录的值为null。HashMap非线程安全，即任一时刻可以有多个线程同时写HashMap，可能会导致数据的不一致。如果需要满足线程安全，可以用 Collections的synchronizedMap方法使HashMap具有线程安全的能力，或者使用ConcurrentHashMap。

*  Hashtable：Hashtable是遗留类，很多映射的常用功能与HashMap类似，不同的是它承自Dictionary类，并且是线程安全的，任一时间只有一个线程能写Hashtable，并发性不如ConcurrentHashMap，因为ConcurrentHashMap引入了分段锁。不需要线程安全的场合可以用HashMap替换，需要线程安全的场合可以用ConcurrentHashMap替换。
* LinkedHashMap：LinkedHashMap是HashMap的一个子类，保存了记录的插入顺序，在用Iterator遍历LinkedHashMap时，先得到的记录肯定是先插入的，也可以在构造时带参数，按照访问次序排序。
* TreeMap：TreeMap实现SortedMap接口，能够将数据根据键排序，默认是按键值的升序排序，也可以指定排序。如果使用排序的映射，建议使用TreeMap。在使用TreeMap时，key必须实现Comparable接口或者在构造TreeMap传入自定义的Comparator，否则会在运行时抛出java.lang.ClassCastException类型的异常。

对于上述四种Map类型的类，要求映射中的key是不可变对象。不可变对象是该对象在创建后它的哈希值不会被改变。如果对象的哈希值发生变化，Map对象很可能就定位不到映射的位置了。

## 25. HashMap原理

HashMap是什么，即它的存储结构-字段；其次弄明白它能干什么，即它的功能实现-方法。



* Hash底层结构在JDK1.7前是：数组+链表，JDK1.8后是：数组+链表+红黑树（链表长度大于8时转换为红黑树，加快查询速度，时间由O(n)变为O(log~n~)）
  ![image-20201104225315925](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201104225315925.png)

 从源码可知，HashMap类中有一个非常重要的字段，就是 Node[] table，即哈希桶数组，明显它是一个Node的数组。我们来看Node[JDK1.8]是何物。

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;    //用来定位数组索引位置
    final K key;
    V value;
    Node<K,V> next;   //链表的下一个node

    Node(int hash, K key, V value, Node<K,V> next) { ... }
    public final K getKey(){ ... }
    public final V getValue() { ... }
    public final String toString() { ... }
    public final int hashCode() { ... }
    public final V setValue(V newValue) { ... }
    public final boolean equals(Object o) { ... }
}
```

Node是HashMap的一个内部类，实现了Map.Entry接口，本质是就是一个映射(键值对)。

* **HashMap就是使用哈希表来存储的**。哈希表为解决冲突，可以采用开放地址法和链地址法等来解决问题，**Java中HashMap采用了链地址法**。**链地址法**: 就是数组加链表的结合。在每个数组元素上都一个链表结构，当数据被Hash后，得到数组下标，把数据放在对应下标元素的链表上。例如程序执行下面代码：

  ```map.put("美团","小美");```

  系统将调用"美团"这个key的hashCode()方法得到其hashCode 值（该方法适用于每个Java对象），然后再通过Hash算法的后两步运算（高位运算和取模运算，下文有介绍）来定位该键值对的存储位置

  > 有时两个key会定位到相同的位置，表示发生了Hash碰撞。当然Hash算法计算结果越分散均匀，Hash碰撞的概率就越小，map的存取效率就会越高。)
  >
  > 如果哈希桶数组很大，即使较差的Hash算法也会比较分散，如果哈希桶数组数组很小，即使好的Hash算法也会出现较多碰撞，所以就需要在空间成本和时间成本之间权衡，其实就是在根据实际情况确定哈希桶数组的大小，并在此基础上设计好的hash算法减少Hash碰撞。那么通过什么方式来控制map使得Hash碰撞的概率又小，哈希桶数组（Node[] table）占用空间又少呢？答案就是好的Hash算法和扩容机制。

* Hash和扩容流程

  在理解Hash和扩容流程之前，我们得先了解下HashMap的几个字段。从HashMap的默认构造函数源码可知，构造函数就是对下面几个字段进行初始化，源码如下：

  ```java
  int threshold;          // 所能容纳的key-value对极限 
  final float loadFactor;    // 负载因子
  int modCount;  
  int size;
  ```

  ​		首先，**Node[] table（哈希桶）的初始化长度length(默认值是16)**，**Load factor为负载因子(默认值是0.75)**，threshold是HashMap所能容纳的最大数据量的Node(键值对)个数。**threshold = length * Load factor**。也就是说，在数组定义好长度之后，负载因子越大，所能容纳的键值对个数越多。

  ​		结合负载因子的定义公式可知，threshold就是在此Load factor和length(数组长度)对应下允许的最大元素数目，**超过这个数目就重新resize(扩容)，扩容后的HashMap容量是之前容量的两倍。**

  > `默认的负载因子0.75是对空间和时间效率的一个平衡选择，建议不要修改，除非在时间和空间比较特殊的情况下，如果内存空间很多而又对时间效率要求很高，可以降低负载因子Load factor的值；相反，如果内存空间紧张而对时间效率要求不高，可以增加负载因子loadFactor的值，这个值可以大于1。`

  ​		**size就是HashMap中实际存在的键值对数量**。（threshold是所能容纳的键值对极限数量）。

  ​		**modCount用来记录HashMap内部结构发生变化的次数，主要用于迭代的快速失败**。强调一点，内部结构发生变化指的是结构发生变化，例如put新键值对，但是某个key对应的value值被覆盖不属于结构变化。
  ​		**在HashMap中，哈希桶数组table的长度length大小必须为2的n次方(一定是合数)，这是一种非常规的设计，**常规的设计是把桶的大小设计为素数。相对来说素数导致冲突的概率要小于合数，具体证明可以参考http://blog.csdn.net/liuqiyao_01/article/details/14475159，Hashtable初始化桶大小为11，就是桶大小设计为素数的应用（Hashtable扩容后不能保证还是素数）。**HashMap采用这种非常规设计，主要是为了在取模和扩容时做优化，同时为了减少冲突，HashMap定位哈希桶索引位置时，也加入了高位参与运算的过程。**

  ​        这里存在一个问题，即使负载因子和Hash算法设计的再合理，也免不了会出现拉链过长的情况，一旦出现拉链过长，则会严重影响HashMap的性能。于是，在JDK1.8版本中，对数据结构做了进一步的优化，引入了红黑树。而当链表长度太长（默认超过8）时，链表就转换为红黑树，利用红黑树快速增删改查的特点提高HashMap的性能，其中会用到红黑树的插入、删除、查找等算法。本文不再对红黑树展开讨论，想了解更多红黑树数据结构的工作原理可以参考http://blog.csdn.net/v_july_v/article/details/6105630。

* **HashMap功能实现 - 方法**

  HashMap的内部功能实现很多，本文主要从根据key获取哈希桶数组索引位置、put方法的详细执行、扩容过程三个具有代表性的点深入展开讲解。
  
  博文：https://blog.csdn.net/qq_40574571/article/details/97612100

## 26. HashSet的实现原理

* HashSet是基于HashMap实现的（一个初始容量为16，负载因子为0.75 的hashmap）。
* 所有放入HashSet 中的集合元素实际上由 HashMap 的 key 来保存，而 HashMap 的 value 则存储了一个 PRESENT，它是一个静态的 Object 对象。

* 当把某个类的对象当成HashMap的 key，或试图将这个类的对象放入 HashSet 中保存时，需要重写该类的equals(Object obj)方法和 hashCode() 方法，两个方法的返回值必须保持一致：当该类的两个的 hashCode() 返回值相同时，它们通过 equals() 方法比较也应该返回 true。通常来说，所有参与计算 hashCode() 返回值的关键属性，都应该用于作为 equals() 比较的标准。
* HashSet的其他操作都是基于HashMap的

## 27.  ArrayList

* ArrayList特点：是有序的，元素可重复，支持动态扩容；增删慢，查询快；线程不安全

* ArrayList动态扩容：

  ​		①ArrayList在刚创建的时候，它的长度是0

  ​		②执行第一次add操作时，会重新创建一个size大小为10的新数组。

  ​		③再一次进行add操作的时候会调用ensureCapacityInternal方法传入当前的新添加元素的下标，进行比较。

  ​		④首先是判断当前数组是不是刚初始化的数组，是的话就将默认数组大小就和传入的下标进行比较，返回较大的一个，否则就直接返回传入的下标。

  ​		⑤再将返回的数在进行判断，如果添加新元素之后的元素总数是否大于数组的总长度.如果大于的话会继续调用grow()方法,创建一个大小为原数组1.5的新数组，并将原数组数据复制给新数组，最后再完成新元素的添加操作。

## **28. ArrayList 和 LinkedList 的区别是什么？**

ArrayList的底层结构是数组+链表（jdk1.8+红黑树），支持随机访问。

LinkedList底层结构是双向链表，不支持随机访问。因此指定下标的情况下，ArrayList的时间复杂度是O(1)，LinkedList是O(n)

## 29. **如何实现数组和 List 之间的转换？**

- List转换成为数组：调用ArrayList的toArray()方法。
- 数组转换成为List：调用Arrays的asList()方法。

## **30. ArrayList 和 Vector 的区别是什么？**

* 线程安全：Vector是线程安全的，ArrayList不是线程安全的
* 性能：ArrayList性能优于Vector
* 扩容：Vector每次宽容会增加一倍，ArrayList则是增加0.5倍

## 31. **Array 和 ArrayList 有何区别？**

- Array可以容纳基本类型和对象，而ArrayList只能容纳对象。 
- Array大小是固定的，而ArrayList大小是动态变化的。 
- ArrayList提供了更多的方法和特性，比如：addAll()，removeAll()，iterator()等等。

应用：对于基本类型数据，ArrayList 使用自动装箱来减少编码工作量；而当处理固定大小的基本数据类型的时候，这种方式相对比较慢，这时候应该使用Array。

## 32.**在 Queue 中 poll()和 remove()有什么区别？**

poll() 和 remove() 都是从队列中取出一个元素，但是 poll() 在获取元素失败的时候会返回空，但是 remove() 失败的时候会抛出异常。

## 33.**哪些集合类是线程安全的？**

- vector：就比arraylist多了个同步化机制（线程安全），因为效率较低，现在已经不太建议使用。在web应用中，特别是前台页面，往往效率（页面响应速度）是优先考虑的。
- statck：堆栈类，先进后出。
- hashtable：就比hashmap多了个线程安全。
- enumeration：枚举，相当于迭代器。

## 34.迭代器 Iterator 是什么？

迭代器是一种设计模式（行为型模式），它是一个“轻量级”的对象（创建它的代价小），它可以遍历并选择序列中的对象，而不需要了解该序列的底层结构。

## 35.**Iterator 怎么使用？有什么特点？**

Java中的Iterator功能比较简单，并且只能单向移动：

(1) 使用方法iterator()要求容器返回一个Iterator。

(2) 使用next()获得序列中的下一个元素(第一次调用Iterator的next()方法时，它返回序列的第一个元素)。

(3) 使用hasNext()检查序列中是否还有元素。

(4) 使用remove()将迭代器新返回的元素删除。

> Iterator是Java迭代器最简单的实现，为List设计的ListIterator具有更多的功能，它可以从两个方向遍历List，也可以从List中插入和删除元素。

## 36.**Iterator 和 ListIterator 有什么区别？**

- Iterator可用来遍历Set和List集合，ListIterator只能用来遍历List。 
- Iterator对集合只能是前向遍历，ListIterator是双向的。 
- ListIterator实现了Iterator接口，并包含其他的功能，比如：增加元素，替换元素，获取前一个和后一个元素的索引，等等。

# 三、**多线程**

## 37. 并行和并发有什么区别？

- 并行是指两个及以上事件在同一时刻发生；而并发是指两个及以上事件在同一时间间隔发生。
- 并行是在不同实体上的多个事件，并发是在同一实体上的多个事件。
- 并行在多台处理器上同时处理多个任务（如hadoop分布式集群），并发在一台处理器上“同时”处理多个任务

所以并发编程的目标是充分的利用处理器的每一个核，以达到最高的处理性能。

##  38.线程和进程的区别？

* 进程是程序运行和资源分配的基本单位，一个程序至少有一个进程，一个进程至少有一个线程。进程在执行过程中拥有独立的内存单元，而多个线程共享内存资源，减少切换次数，从而效率更高。

* 线程是进程的一个实体，是cpu调度和分派的基本单位。同一进程中的多个线程之间可以并发执行。

## 39.**守护线程是什么？**

守护线程（即daemon thread），是个服务线程，准确地来说就是服务其他的线程。

## 40.**创建线程有哪几种方式？**

①. 继承Thread类创建线程类

- 定义Thread类的子类，并重写该类的run方法，该run方法的方法体就代表了线程要完成的任务。因此把run()方法称为执行体。
- 创建Thread子类的实例，即创建了线程对象。
- 调用线程对象的start()方法来启动该线程。

②. 通过Runnable接口创建线程类

- 定义runnable接口的实现类，并重写该接口的run()方法，该run()方法的方法体同样是该线程的线程执行体。
- 创建 Runnable实现类的实例，并依此实例作为Thread的target来创建Thread对象，该Thread对象才是真正的线程对象。
- 调用线程对象的start()方法来启动该线程。

③. 通过Callable和Future创建线程

- 创建Callable接口的实现类，并实现call()方法，该call()方法将作为线程执行体，并且有返回值。
- 创建Callable实现类的实例，使用FutureTask类来包装Callable对象，该FutureTask对象封装了该Callable对象的call()方法的返回值。
- 使用FutureTask对象作为Thread对象的target创建并启动新线程。
- 调用FutureTask对象的get()方法来获得子线程执行结束后的返回值。

## 41.**说一下 runnable 和 callable 有什么区别？**

有点深的问题了，也看出一个Java程序员学习知识的广度。

- Runnable接口中的run()方法的返回值是void，它做的事情只是纯粹地去执行run()方法中的代码而已；
- Callable接口中的call()方法是有返回值的，是一个泛型，和Future、FutureTask配合可以用来获取异步执行的结果。

## 42.**线程有哪些状态**

线程通常都有五种状态，创建、就绪、运行、阻塞和死亡。

- 创建状态。在生成线程对象，并没有调用该对象的start方法，这是线程处于创建状态。
- 就绪状态。当调用了线程对象的start方法之后，该线程就进入了就绪状态，但是此时线程调度程序还没有把该线程设置为当前线程，此时处于就绪状态。在线程运行之后，从等待或者睡眠中回来之后，也会处于就绪状态。
- 运行状态。线程调度程序将处于就绪状态的线程设置为当前线程，此时线程就进入了运行状态，开始运行run函数当中的代码。
- 阻塞状态。线程正在运行的时候，被暂停，通常是为了等待某个时间的发生(比如说某项资源就绪)之后再继续运行。sleep,suspend，wait等方法都可以导致线程阻塞。
- 死亡状态。如果一个线程的run方法执行结束或者调用stop方法后，该线程就会死亡。对于已经死亡的线程，无法再使用start方法令其进入就绪

## 43. **sleep() 和 wait() 有什么区别？**

* **sleep()：是线程类（Thread）的静态方法，让调用线程进入睡眠状态，将执行机会给其他线程，等到休眠时间结束后，线程进入就绪状态和其他线程一起竞争cpu的执行时间**。因为sleep() 是静态方法，不能改变对象的机锁，当一个synchronized块中调用了sleep() 方法，线程虽然进入休眠，但是**对象的机锁没有被释放，其他线程依然无法访问这个对象。**

* **wait()：是Object类的方法，当一个线程执行到wait方法时，它就进入到一个和该对象相关的等待池，同时释放对象的机锁，使得其他线程能够访问，可以通过notify，notifyAll方法来唤醒等待的线程。**

## 44.**notify()和 notifyAll()有什么区别？**

`调用notify()和 notifyAll()的前提`：线程调用了对象的wait()方法，线程便会处于该对象的等待池中，等待池中的线程不会去竞争该对象的锁。

(被唤醒的的线程便会进入该对象的锁池中，锁池中的线程会去竞争该对象锁。)

notifyAll()：唤醒等待池中所有wait线程并都移动到锁池中

notify()：只随机唤醒一个wait线程并入锁池，等待锁竞争

> 优先级高的线程竞争到对象锁的概率大，假若某线程没有竞争到该对象锁，它还会留在锁池中，唯有线程再次调用 wait()方法，它才会重新回到等待池中。而竞争到对象锁的线程则继续往下执行，直到执行完了 synchronized 代码块，它会释放掉该对象锁，这时锁池中的线程会继续竞争该对象锁。

## 45. **线程的 run()和 start()有什么区别？**

每个线程都是通过某个特定Thread对象所对应的方法run()来完成其操作的，方法run()称为线程体。通过调用Thread类的start()方法来启动一个线程。

start()方法来启动一个线程，真正实现了多线程运行。这时无需等待run方法体代码执行完毕，可以直接继续执行下面的代码； 这时此线程是处于就绪状态， 并没有运行。 然后通过此Thread类调用方法run()来完成其运行状态， 这里方法run()称为线程体，它包含了要执行的这个线程的内容， Run方法运行结束， 此线程终止。然后CPU再调度其它线程。

run()方法是在本线程里的，只是线程里的一个函数,而不是多线程的。 如果直接调用run(),其实就相当于是调用了一个普通函数而已，直接待用run()方法必须等待run()方法执行完毕才能执行下面的代码，所以执行路径还是只有一条，根本就没有线程的特征，所以在多线程执行时要使用start()方法而不是run()方法。

## 46. **创建线程池有哪几种方式？**

①. newFixedThreadPool(int nThreads)

创建一个固定长度的线程池，每当提交一个任务就创建一个线程，直到达到线程池的最大数量，这时线程规模将不再变化，当线程发生未预期的错误而结束时，线程池会补充一个新的线程。

②. newCachedThreadPool()

创建一个可缓存的线程池，如果线程池的规模超过了处理需求，将自动回收空闲线程，而当需求增加时，则可以自动添加新线程，线程池的规模不存在任何限制。

③. newSingleThreadExecutor()

这是一个单线程的Executor，它创建单个工作线程来执行任务，如果这个线程异常结束，会创建一个新的来替代它；它的特点是能确保依照任务在队列中的顺序来串行执行。

④. newScheduledThreadPool(int corePoolSize)

创建了一个固定长度的线程池，而且以延迟或定时的方式来执行任务，类似于Timer。

## **47.线程池都有哪些状态？**

线程池有5种状态：Running、ShutDown、Stop、Tidying、Terminated。

![image-20201109213431733](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201109213431733.png)

## 48. **线程池中submit()和 execute()方法有什么区别**

- 接收的参数不一样
- submit有返回值，而execute没有
- submit方便Exception处理

## 49. **在 java 程序中怎么保证多线程的运行安全？**

线程安全满足这三个特性 ：

- 原子性：提供互斥访问，同一时刻只能有一个线程对数据进行操作，（atomic,synchronized）；
  - JDK Atomic开头的原子类、synchronized、LOCK，可以解决原子性问题
- 可见性：一个线程对主内存的修改可以及时地被其他线程看到，（synchronized,volatile）；
  - synchronized、volatile、LOCK，可以解决可见性问题
- 有序性：一个线程观察其他线程中的指令执行顺序，由于指令重排序，该观察结果一般杂乱无序，（happens-before原则）。
  - Happens-Before 规则可以解决有序性问题，规则如下
  - 
  - +
    - 程序次序规则：在一个线程内，按照程序控制流顺序，书写在前面的操作先行发生于书写在后面的操作
    - 管程锁定规则：一个unlock操作先行发生于后面对同一个锁的lock操作
    - volatile变量规则：对一个volatile变量的写操作先行发生于后面对这个变量的读操作
    - 线程启动规则：Thread对象的start()方法先行发生于此线程的每一个动作
    - 线程终止规则：线程中的所有操作都先行发生于对此线程的终止检测
    - 线程中断规则：对线程interrupt()方法的调用先行发生于被中断线程的代码检测到中断事件的发生
    - 对象终结规则：一个对象的初始化完成(构造函数执行结束)先行发生于它的finalize()方法的开始

## 50. **多线程锁的升级原理是什么？**

在Java中，锁共有4种状态，级别从低到高依次为：无状态锁，偏向锁，轻量级锁和重量级锁状态，这几个状态会随着竞争情况逐渐升级。锁可以升级但不能降级。

![image-20201111210445399](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201111210445399.png)

> 锁分级别原因：
>
> 没有优化以前，synchronized是重量级锁（悲观锁），使用 wait 和 notify、notifyAll 来切换线程状态非常消耗系统资源；线程的挂起和唤醒间隔很短暂，这样很浪费资源，影响性能。所以 JVM 对 synchronized 关键字进行了优化，把锁分为 无锁、偏向锁、轻量级锁、重量级锁 状态。

**无锁**：没有对资源进行锁定，所有的线程都能访问并修改同一个资源，但同时只有一个线程能修改成功，其他修改失败的线程会不断重试直到修改成功。

**偏向锁**：对象的代码一直被同一线程执行，不存在多个线程竞争，该线程在后续的执行中自动获取锁，降低获取锁带来的性能开销。偏向锁，指的就是偏向第一个加锁线程，该线程是不会主动释放偏向锁的，只有当其他线程尝试竞争偏向锁才会被释放。
		偏向锁的撤销，需要在某个时间点上没有字节码正在执行时，先暂停拥有偏向锁的线程，然后判断锁对象是否处于被锁定状态。如果线程不处于活动状态，则将对象头设置成无锁状态，并撤销偏向锁；
		如果线程处于活动状态，升级为轻量级锁的状态。 

**轻量级锁**：轻量级锁是指当锁是偏向锁的时候，被第二个线程 B 所访问，此时偏向锁就会升级为轻量级锁，线程 B 会通过自旋的形式尝试获取锁，线程不会阻塞，从而提高性能。
当前只有一个等待线程，则该线程将通过自旋进行等待。但是当自旋超过一定的次数时，轻量级锁便会升级为重量级锁；当一个线程已持有锁，另一个线程在自旋，而此时又有第三个线程来访时，轻量级锁也会升级为重量级锁。

**重量级锁**：指当有一个线程获取锁之后，其余所有等待获取该锁的线程都会处于阻塞状态。
		重量级锁通过对象内部的监视器（monitor）实现，而其中 monitor 的本质是依赖于底层操作系统的 Mutex Lock 实现，操作系统实现线程之间的切换需要从用户态切换到内核态，切换成本非常高。

![image-20201111220705253](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201111220705253.png)

## 51. **什么是死锁？**

死锁是指两个或两个以上的进程在执行过程中，由于竞争资源或者由于彼此通信而造成的一种阻塞的现象，若无外力作用，它们都将无法推进下去。此时称系统处于死锁状态或系统产生了死锁，这些永远在互相等待的进程称为死锁进程。是操作系统层面的一个错误，是进程死锁的简称（最早在 1965 年由 Dijkstra 在研究银行家算法时提出的，它是计算机操作系统乃至整个并发程序设计领域最难处理的问题之一）

## **52. 怎么防止死锁？**

死锁的四个必要条件：

- 互斥条件：进程对所分配到的资源不允许其他进程进行访问，若其他进程访问该资源，只能等待，直至占有该资源的进程使用完成后释放该资源
- 请求和保持条件：进程获得一定的资源之后，又对其他资源发出请求，但是该资源可能被其他进程占有，此事请求阻塞，但又对自己获得的资源保持不放
- 不可剥夺条件：是指进程已获得的资源，在未完成使用之前，不可被剥夺，只能在使用完后自己释放
- 环路等待条件：是指进程发生死锁后，若干进程之间形成一种头尾相接的循环等待资源关系

这四个条件是死锁的必要条件，只要系统发生死锁，这些条件必然成立，而只要上述条件之 一不满足，就不会发生死锁。

理解了死锁的原因，尤其是产生死锁的四个必要条件，就可以最大可能地避免、预防和 解除死锁。

所以，在系统设计、进程调度等方面注意如何不让这四个必要条件成立，如何确 定资源的合理分配算法，避免进程永久占据系统资源。

此外，也要防止进程在处于等待状态的情况下占用资源。因此，对资源的分配要给予合理的规划。

## **53.说一下 synchronized 底层实现原理？**

synchronized可以保证方法或者代码块在运行时，同一时刻只有一个方法可以进入到临界区，同时它还可以保证共享变量的内存可见性。

Java中每一个对象都可以作为锁，这是synchronized实现同步的基础：

- 普通同步方法，锁是当前实例对象
- 静态同步方法，锁是当前类的class对象
- 同步方法块，锁是括号里面的对象

## 54. **synchronized 和 volatile 的区别是什么？**

- volatile本质是在告诉jvm当前变量在寄存器（工作内存）中的值是不确定的，需要从主存中读取； synchronized则是锁定当前变量，只有当前线程可以访问该变量，其他线程被阻塞住。
- volatile仅能使用在变量级别；synchronized则可以使用在变量、方法、和类级别的。
- volatile仅能实现变量的修改可见性，不能保证原子性；而synchronized则可以保证变量的修改可见性和原子性。
- volatile不会造成线程的阻塞；synchronized可能会造成线程的阻塞。
- volatile标记的变量不会被编译器优化；synchronized标记的变量可以被编译器优化。

## 55.