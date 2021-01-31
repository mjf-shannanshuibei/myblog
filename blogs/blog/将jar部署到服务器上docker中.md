---
title: 将jar部署到服务器上docker中
date: 2021-1-30
tags:
 - 部署
categories: 
 - 博文
author: 山南水北
---

# 一、使用IDEA工具打包jar包
1. 进入pom文件，添加或修改打包方式为jar
    ```xml
    <packaging>jar</packaging>
    ```

2. 点击IDEA工具右侧的maven，进入Lifecycle目录，依次点击`clean`和`install`，如下图所示

    ![image-20200908054949025](https://raw.githubusercontent.com/mjf-shannanshuibei/githubBlogPhotograph/master/img/20200908054956.png)

    3. 打开IDEA工程的`target`目录，复制对应工程的jar包，如下图

       ![image-20200908055344572](https://raw.githubusercontent.com/mjf-shannanshuibei/githubBlogPhotograph/master/img/20200908055344.png)
       
       可以将其复制一份放入桌面，方便后续操作

# 二、将jar部署到服务器

1.  使用 FileZilla 工具上传

   * 连接服务器

     ![image-20200908055610633](https://raw.githubusercontent.com/mjf-shannanshuibei/githubBlogPhotograph/master/img/20200908055610.png)

   * 进入Linux服务器，打开你想要存放jar的文件夹，此处以`home`举例

     ![image-20200908055741630](https://raw.githubusercontent.com/mjf-shannanshuibei/githubBlogPhotograph/master/img/20200908055741.png)

   * 将桌面的 jar包直接拖入上传即可

2. 在jar的同级目录创建`Dockerfile`文件

   ```shell
   vi Dockerfile
   ```

   内容

   ```shell
   FROM openjdk:8-jdk-alpine			#jdk版本
   MAINTAINER "shannanshuibei"			#作者名
   LABEL description="个人博客"		 #描述
   WORKDIR /blog						#WORKDIR指令用于指定容器的一个目录， 容器启动时执行的命令会在该目录下执行。
   ADD blog.jar /blog/blog.jar			#将当前client.jar 复制到容器根目录下
   EXPOSE 8080							#暴露端口
   CMD java -jar /blog/blog.jar		#容器启动时执行的命令
   ```

3. 使用docker build 构建镜像

   ```shell
   docker build -t shannanshuibei .
   ```
   
   > shannanshuibei为自定义命名的容器名称
   >
   > . 不能漏掉
   
   结果：
   
   ![image-20200908060553229](https://raw.githubusercontent.com/mjf-shannanshuibei/githubBlogPhotograph/master/img/20200908060553.png)

4. 启动容器

   ```shell
   docker run -d -p 80:8080 shannanshuibei
   ```

5. 测试

   输入服务器域名

   ![image-20200908060829673](https://raw.githubusercontent.com/mjf-shannanshuibei/githubBlogPhotograph/master/img/20200908060829.png)

   