---
title: Nginx
date: 2021-1-31 12:56:00
tags:
 - nginx
categories: 
 - 笔记
author: 山南水北
---
# 一、Nginx简介

## 1.1 Nginx概述

​		Nginx是一个高性能的HTTP和反向代理服务器，内存占用少，并发能力强。最高支持50000个并发连接数

## 1.2 反向代理

Nginx支持正向代理和反向代理

* 正向代理：在客户端（浏览器）配置代理服务器，通过代理服务器进行互联网访问

  ![image-20201025233202760](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201025233202760.png)

* 反向代理：将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据后，再返回给客户端，此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏真实服务器IP地址

  ![image-20201025233509350](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201025233509350.png)

## 1.3 负载均衡

负载均衡就是将原先请求集中到单个服务器上的情况改为将请求分发到多个服务器上，将负载分发到不同的服务器

![image-20201025234640281](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201025234640281.png)

## 1.4 动静分离

将动态页面和静态页面由不同的服务器来解析，加快解析速度。降低原来单个服务器的压力。

目的：为了加快网站的解析速度

![image-20201025235857471](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201025235857471.png)

# 二、Nginx安装

## 1. 安装依赖包

```shell
# 假如有gcc 去掉gcc就好，其他同理
yum -y install gcc zlib zlib-devel pcre-devel openssl openssl-devel
```

## 2. 下载并解压Nginx安装包

```markdown
# 1.创建文件夹
	cd /usr/local
	mkdir nginx
# 2.下载安装包
	cd nginx
	wget https://nginx.org/download/nginx-1.19.3.tar.gz	
# 3.解压
	tar -xvf nginx-1.19.3.tar.gz
```

## 3. 安装Nginx

```shell
cd nginx-1.19.3
./configure
make && make install
```

## 4. 启动Nginx

```shell
cd usr/local/nginx/sbin/
./nginx
# 查看nginx进程是否启动
ps -ef | grep nginx
# 浏览器访问
ip地址:端口
```

![image-20201027190018044](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201027190018044.png)


> 测试：ip地址：80
>
> 修改默认nginx监听端口：
>
> * 回退到nginx目录，进入conf目录下，找到nginx.conf
> * 找到 listen 80，该行设置nginx的监听端口，改为自己想要的端口
> * 再次进入sbin目录下，重载nginx：`./nginx -s reload`

# 三、配置Nginx 的反向代理

## 1. 访问Nginx端口，跳转至tomcat

![image-20201027192455636](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201027192455636.png)

* 打开Nginx的配置文件，在如下图所示的位置添加`proxy_pass http://ip:port`

![image-20201027192048161](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201027192048161.png)

* 重新加载Nginx：`./nginx -s reload`
* 输入 `47.98.42.191：81`，自动跳转到 `47.98.42.191:8080`

> 注意：Linux需要开放访问端口

## 2. 使用Nginx反向代理，根据访问路径跳转到不同端口的服务中

```markdown
- 使用nginx反向代理，根据访问的路径跳转到不同端口的服务中。
- nginx.监听端口为9001，。
- 访问http://127.0.0.1:9001/edu/ 直接跳转到127.0.0.1:8081
- 访问http://127.0.0.1:9001/vod/ 直接跳转到127.0.0.1:8082
```

* 准备两个Tomcat，在webapps目录下分别创建 edu、vod和方便区分的静态页面，如：
  * 在tomcat 8081上创建 edu
  * tomcat 8082上创建 vod

* 编辑nginx.conf，新添加个server节点（不是在原有的基础上修改）：

  ![image-20201027202011662](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201027202011662.png)

  ```markdown
  # location指令说明：
  - 该指令用于匹配URL语法如下
  
      location [ = | ~ | ~* | ^~] uri {
  
      }
  
  =: 用于不含正则表达式的uri前，要求请求字符串与uri严格匹配，如果匹配成功，就停止继续向下搜索并立即处理该请求
  ~: 用于表示uri包含正则表达式，并且区分大小写
  ~*: 用于表示uri包含正则表达式，并且不区分大小写
  ^~: 用于不含正则表达式的uri前，要求Nginx服务器找到标识uri和请求字符串匹配度最高的location后，立即使用此		location处理请求，而不再使用location块中的正则uri和请求字符串做匹配
  注意: 如果uri包含正则表达式，则必须要有~或者~*标识。
  ```

# 四、Nginx配置负载均衡

## 1. 配置

* 准备工作：

  * 准备两台tomcat 8080、8081
  * 在两台tomcat里的webapps目录中，创建名称是edu文件夹，在edu文件夹中创建个静态网页文件

* 在配置中进行负载均衡配置

  ![image-20201027204028815](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201027204028815.png)

  ![image-20201027204051384](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201027204051384.png)

  

## 2. Nginx分配服务器策略

* **1. 轮询（默认）**

  每个请求按时间顺序逐一分配到不 同的后端服务器，如果后端服务器down掉，能自动剔除

* **2. weight(权重)**
  weight代表权重默认为1,权重越高被分配的客户端越多。
  指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。例如: 

  ```
  upstream server_pool{
  	server 47.98.42.191 weight=5
  	server 47.98.42.192 weight=5
  }
  ```

* **3. ip hash**

  每个请求按访问ip的hash结果分配, 这样每个访客固定访问一个后端服务器,可以解诀session的问题。例如:

  ```
  upstream server pool{
      ip_ hash
      server 192.168.5.21:80
      server 192.168.5.22:80
  }
  ```

* **4. fair (第三方)**
  按后端服务器的响应时间来分配请求，响应时间短的优先分配

  ```
  upstream server_pool 
  	server 192.168.5.21:80;
  	server 192.168.5.22:80;
  	fair;
  }
  ```

  