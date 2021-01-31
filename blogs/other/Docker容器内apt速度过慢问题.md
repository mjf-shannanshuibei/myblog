---
title: Docker容器内apt速度过慢问题
date: 2021-1-30
tags:
 - docker
categories: 
 - 其他
author: 山南水北
---

# Docker 容器内 apt 速度过慢问题
## 1. 进入任意容器
```shell
docker exec -it 容器id或容器别名 /bin/bash
```
## 2. 更换镜像源
```shell
sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
```
> 此处采用的是中科大的镜像源

## 3. 测试
```shell
apt-get update
apt-get install -y vim
```
下载速度显著提升了