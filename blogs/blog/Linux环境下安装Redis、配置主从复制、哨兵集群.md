---
title: Linux环境下安装Redis、配置主从复制、哨兵集群
date: 2021-1-30
tags:
 - redis
categories: 
 - 博文
author: 山南水北
---

# 1. 安装Redis

```markdown
# 1.安装GCC（安装Redis需要gcc环境）
	yum install gcc
# 2.查看版本
	gcc -v
# 3.Centos7 默认安装的是4.8，Redis要求5.2以上，此处升级8为例
## 3.1 安装centos-release-scl
	sudo yum install centos-release-scl
## 3.2 安装devtoolset，如果想安装7.*版本的，就改成devtoolset-7-gcc*，以此类推
	sudo yum install devtoolset-8-gcc
## 3.3 激活对应的devtoolset
	scl enable devtoolset-8 bash
## 3.4 查看版本
	gcc -v
# 2.创建文件夹（此处放在root下）
	mkdir /root/redis
# 3.下载Redis（也可以将下好的Redis放入该文件夹）
	wget https://download.redis.io/releases/redis-6.0.8.tar.gz
# 4.解压到当前目录
	tar xzf redis-6.0.8.tar.gz
# 5.进入redis
	cd redis-6.0.8
# 6.安装
	make
```

> 如果出现安装错误看这条博客
>
> https://www.cnblogs.com/sanduzxcvbnm/p/12955145.html

测试：

```markdown
# 1.进入redis-6.0.8/src目录
# 2.开启redis服务
	./redis-server
```

![image-20201025163335325](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201025163335325.png)

```markdown
# 3.新建个终端，进入redis的src目录
	./redis-cli
# 4.操作redis数据库
```

![image-20201025163411204](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201025163411204.png)

# 2. 开启主从复制

```markdown
# 1.在/root/redis/文件夹下再创建三个redis文件夹，存放对应的redis.conf
	mkdir redis1 redis2 redis3
# 2.复制redis-6.0.8文件夹里的redis.conf文件，到三个文件夹中
	cp ../redis/redis-6.0.8/redis.conf /root/redis/redis1
	cp ../redis/redis-6.0.8/redis.conf /root/redis/redis2
	cp ../redis/redis-6.0.8/redis.conf /root/redis/redis3
# 3.更改redis-conf文件	
- redis1需要更改的地方
	port 6379
	bind 0.0.0.0
	
- redis2需要更改的地方
	port 6380
	bind 0.0.0.0
	slaveof 47.98.42.191 6379

- redis3需要更改的地方
	port 6381
	bind 0.0.0.0
	slaveof 47.98.42.191 6379
```

> vim redis-conf  输入 /name 关键词查找
>
> 如：/port查到port关键字



```markdown
- 为了以后操作方便，在/root/redis文件夹下创建个bin目录
	mkdir /root/redis/bin
- 复制redis-server,redis-cli,redis-sentinel
	cd /root/redis/bin
	cp ../redis-6.0.8/src/redis-server /root/redis/bin
	cp ../redis-6.0.8/src/redis-cli /root/redis/bin
	cp ../redis-6.0.8/src/redis-sentinel /root/redis/bin
	
# 4.根据配置文件启动redis-server服务（开启三个终端）
- cd /root/redis/bin
- ./redis-server /root/redis/redis1/redis.conf
- ./redis-server /root/redis/redis2/redis.conf
- ./redis-server /root/redis/redis3/redis.conf
# 5.进入Redis数据库（三个终端）
- cd /root/redis/bin
- ./redis-cli -p 6379 
- ./redis-cli -p 6380
- ./redis-cli -p 6381
```

主从测试不再赘述

# 3. 开启哨兵模式

```markdown
# 1.在/root/redis目录下创建三个sentinel文件夹
	mkdir /root/redis/sentinel1
	mkdir /root/redis/sentinel2
	mkdir /root/redis/sentinel3
# 2.创建sentinel.conf
	touch sentinel1/sentinel.conf
	touch sentinel2/sentinel.conf
	touch sentinel3/sentinel.conf
# 3.编辑sentinel.conf(redis1)
	sentinel monitor mymaster 47.98.42.191 6380 3
> mymaster为主从架构起的唯一名字
# 4.启动sentinel1
	./redis-sentinel /root/redis/sentinel1.conf
```

![image-20201025185524096](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201025185524096.png)

```markdown
# 5.打开sentinel1下的sentinel.conf
	cat /root/redis/sentinel1/sentinel.conf
# 6.复制如下信息
	port 26379
	dir "/root/redis/bin"
	sentinel monitor mymaster 47.98.42.191 6380 3
	bind 0.0.0.0
# bind 0.0.0.0 是后添加的，为了远程访问（但是我没配置也实现了远程操作该端口）
# 7.复制完将其粘贴到 sentinel2和sentinel3的配置文件中，将端口改为 26380 26381
- sentinel2
	port 26380
	dir "/root/redis/bin"
	sentinel monitor mymaster 47.98.42.191 6380 3
- sentinel3
	bind 0.0.0.0
	port 26381
	dir "/root/redis/bin"
	sentinel monitor mymaster 47.98.42.191 6380 3
	bind 0.0.0.0
# 8.和sentinel1一样的方法，启动这两个哨兵
```

哨兵测试不再赘述