---
title: 本地Redis Desktop Manager连接阿里云中docker下Redis
date: 2021-1-30
tags:
 - redis
categories: 
 - 博文
author: 山南水北
---

# 1.创建文件夹，存放redis配置文件

```shell
# 自行创建到自定义路径
cd /usr
#创建文件夹
mkdir redis/data
#进入
cd redis
#下载redis官方配置文件
wget https://raw.githubusercontent.com/antirez/redis/5.0/redis.conf -O redis.conf
#查看
ls
```

![image-20201005170540909](https://raw.githubusercontent.com/mjf-shannanshuibei/Photograph/master/img/20201005170541.png)

# 2.Redis默认只支持本地链接，修改默认配置

```markdown
# 编辑redis.conf
	- vi redis.conf
> 注: 行数可能出现不同，对应修改

# 更改第69行本地链接限制
	修改前: bind 127.0.0.1
	修改后: bind 0.0.0.0
# 第88行配置修改为no
	修改前: protected-mode yes
	修改后: protected-mode no
# 第136行配置修改为yes（后台进程方式启动）
	修改前: daemonize no
	修改后: daemonize yes
# 设置连接远程连接Redis密码
# 第507行requirepass foobared去掉注释，foobared改为自己的密码
	修改前: #requirepass foobared
	修改后: requirepass xxxx
# 保存退出
```

# 3.docker启动 redis 指定配置文件且设置了密码

```shell
# 端口映射，data目录映射，配置文件映射。
docker run -d -p 6379:6379 --name myredis -v $PWD/redis.conf:/usr/redis/data/redis.conf -v $PWD/data:/usr/redis/data  redis --appendonly yes
```



``` markdown
# 命令说明：
	--name myredis : 指定容器名称
	-d : 后台启动
	-p 6379:6379 : 端口映射，默认redis启动的是6379
	-v $PWD/redis.conf:/etc/redis/redis.conf : 将主机中当前目录下的redis.conf配置文件映射。
	-v $PWD/data:/data -d redis:3.2 : 将主机中当前目录下的data挂载到容器的/data
	--appendonly yes :打开redis持久化配置
	
# 查看redis是否启动
	docker ps
> 存在 redis说明成功
> 没有输入 docker ps -a 是否有redis,有则说明启动存在问题，
> 核查路径是否正确
	-v $PWD/redis.conf:/usr/redis/data/redis.conf -v $PWD/data:/usr/redis/data -d 
```

# 4.Redis Deskktop Manager连接

```markdown
# 远程连接
```

![image-20201005173231906](https://raw.githubusercontent.com/mjf-shannanshuibei/Photograph/master/img/20201005173300.png)



``` markdown
# 成功
```

![image-20201005173252227](https://raw.githubusercontent.com/mjf-shannanshuibei/Photograph/master/img/20201005173252.png)

> 连接失败:  
>
> 1. 查看自己的云服务器对应的端口是否开放
> 2. 上诉设置的`requirepass foobared去掉注释，foobared改为自己的密码`
> 3. 服务器的redis是否成功启动

![image-20201005173628148](https://raw.githubusercontent.com/mjf-shannanshuibei/Photograph/master/img/20201005173705.png)