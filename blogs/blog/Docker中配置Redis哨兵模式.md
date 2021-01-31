---
title: Docker中配置Redis哨兵模式
date: 2021-1-30
tags:
 - redis
categories: 
 - 博文
author: 山南水北
---

# 1. 配置redis配置文件

```markdown
# 1.创建文件夹用来存放redis1、2、3的配置文件、存储数据
	mkdir -p /usr/local/redis1 /usr/local/redis1/data
	mkdir -p /usr/local/redis2 /usr/local/redis2/data
	mkdir -p /usr/local/redis3 /usr/local/redis3/data
# 2.进入redis1文件夹，创建redis.conf
	cd /usr/local/redis1
	vim redis.conf
# 3.redis.conf内容	
```

```shell
# Redis默认不是以守护进程的方式运行，可以通过该配置项修改，使用yes启用守护进程(此处必须是no，不然启动不了)
deamonize  no
# 你可以绑定单一接口，如果没有绑定，所有接口都会监听到来的连接
bind 0.0.0.0
# 因为redis本身同步数据文件是按上面save条件来同步的，所以有的数据会在一段时间内只存在于内存中。默认为no
appendonly no
# 设置Redis连接密码，如果配置了连接密码，客户端在连接Redis时需要通过
# auth <password>命令提供密码，默认关闭，设置密码为123123,
# requirepass 123123 
# 此处我不设置密码
```

```markdown
# 复制redis1中的redis.conf文件到redis2、3
	cp redis.conf ../redis2
	cp redis.conf ../redis3
```

# 2. 启动redis容器

```shell
# 主
docker run -p 6379:6379 -v /usr/local/redis1/conf/redis.conf:/etc/redis/redis.conf -v /usr/local/redis1/data:/data --name redis1 -d redis redis-server /etc/redis/redis.conf
# 从
docker run -p 6380:6379 -v /usr/local/redis2/conf/redis.conf:/etc/redis/redis.conf -v /usr/local/redis2/data:/data --name redis2 -d redis redis-server /etc/redis/redis.conf
# 从
docker run -p 6381:6379 -v /usr/local/redis3/conf/redis.conf:/etc/redis/redis.conf -v /usr/local/redis3/data:/data --name redis3 -d redis redis-server /etc/redis/redis.conf
```

> docker ps 查看3个Redis容器是否成功启动
>
> `命令说明`：
>
> ​		-v /usr/local/redis1/conf/redis.conf:/etc/redis/redis.conf :将主机/usr/local/redis/conf目录下redis.conf挂在到容器/etc/redis/redis.conf 
>
> ​		-v /usr/local/redis1/data:/data  : 将主机 /usr/local/redis/data目录下的data挂载到容器的/data



# 3. 获取三个Redis的内网容器

```shell
docker inspect redis1
docker inspect redis2
docker inspect redis3
# 此处我的分别是 
# 172.18.0.6（redis1 将redis1作为主库） 172.18.0.7(redis2) 172.18.0.8(redis3)
```

![image-20201023203437883](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201023203437883.png)

# 4. Redis主从配置

```markdown
# 1.进入 redis2 容器
	docker exec -it redis2 redis-cli
# 2.设置父节点
	#slaveof {master_ip地址} {端口}
	slaveof 172.18.0.6 6379 
# 3.redis3 同样操作
# 4.进入 redis1
	docker exec -it redis1 redis-cli
# 5.查看
	info replication
```

![image-20201023204238881](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201023204238881.png)

# 5.主从测试

```markdown
# 此处不在给出命令口述
# 1.进入主节点，创建类型
# 2.进入从节点，查看是否和主节点同步
# 3.从节点因只有读权限
```

# 6. 哨兵模式

```markdown
# 1.进入容器（此处最好开启三个终端，方便操作）
    docker exec -it redis1 /bin/bash
    docker exec -it redis2 /bin/bash
    docker exec -it redis3 /bin/bash
    此时进入的目录：root@405849c7000a:/data
# 2.更换镜像源（提高docker中下载速度，方便安装vim）
	sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
# 3.安装vim
	apt-get update
	apt-get install vim
# 4.在当前（data）目录下创建sentinel.conf
	vim sentinel.conf
# 5.配置文件内容
	 bind 0.0.0.0     
	 sentinel monitor master 172.18.0.6 6379 2
    sentinel down-after-milliseconds master 60000
    sentinel failover-timeout master 180000
    sentinel parallel-syncs master 1
# 6. 保存退出
# 7. 启动哨兵模式
	redis-sentinel sentinel.conf
# 8. redis2 redis3 同理，配置文件内容都相同不更改
```

进入哨兵模式会出现这样的界面，保留不要关闭，方便后续观察和错误解决，此时三个终端都是这样，建议开启第四个终端

![image-20201023205359047](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201023205359047.png)

# 7. 测试哨兵模式

```markdown
# 1.回到Redis1终端进行操作
	ctrl+c 退回容器内
	exit 退出容器
	docker stop redis1 关闭redis1主节点
# 2.等待一段时间
	此时到预先准备的第四个终端，进入redis2容器
	docker exec -it redis2 redis-cli
# 3.查看节点状态
# 4.查看哨兵界面
```

![image-20201023210332236](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201023210332236.png)

![image-20201023210357580](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201023210357580.png)

```markdown
# 从上面两张图看出：
	172.18.0.7 成为主节点 即redis2
# redis2信息展示 
	role:master  connected_slaves:1
# redis3哨兵
	416:X 23 Oct 2020 13:03:08.797 * +slave slave 172.18.0.6:6379 172.18.0.6 6379 @ master 172.18.0.7 6379
	416:X 23 Oct 2020 13:04:08.799 # +sdown slave 172.18.0.6:6379 172.18.0.6 6379 @ master 172.18.0.7 6379
# 测试redis2主节点：进入容器，操作redis数据库
	set vvv vvv(创建成功)
# 最后一步：重启redis1
docker start redis1
```

![image-20201023210801109](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201023210801109.png)

![image-20201023210811677](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20201023210811677.png)

> 从上面两图看出：redis1加入集群，称为从节点，redis2仍为主节点
>
> 测试成功