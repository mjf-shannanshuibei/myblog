---
title: 为什么要用MAVEN的分布式聚合效应
date: 2021-1-30
tags:
 - maven
categories: 
 - 其他
author: 山南水北
---

# 1. 传统架构

![image-20210108203857156](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20210108203857156.png)

问题：

* 模块之间耦合度高，其中一个升级，其他都要升级
* 开发困难，各个团队开发最后都要整合一起
* 系统扩展性差
* 不能灵活的分布式部署

解决方法：

* 系统拆分

  * 优点：

    把模块拆分成独立的工程，单点运行。如果某一点压力大可以对这一个点单独增加配置，其他点不受影响

  把系统拆分成多个工程，要完成系统的工程需要多个工程协作完成。这种形式叫做分布式。

  * 分布式架构：

    ![image-20210108204215465](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20210108204215465.png)

  * 