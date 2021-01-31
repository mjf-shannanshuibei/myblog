---
title: Mybatis Plus条件构造器和常用接口
date: 2021-1-30
tags:
 - mybatis
categories: 
 - 笔记
author: 山南水北
---
# **一、wapper介绍**

![image-20210110161203181](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20210110161203181.png)

Wrapper ： 条件构造抽象类，最顶端父类  

  AbstractWrapper ： 用于查询条件封装，生成 sql 的 where 条件

​    QueryWrapper ： 查询条件封装

​    UpdateWrapper ： Update 条件封装

  AbstractLambdaWrapper ： 使用Lambda 语法

​    LambdaQueryWrapper ：用于Lambda语法使用的查询Wrapper

​    LambdaUpdateWrapper ： Lambda 更新封装Wrapper

# 二、测试用例

## **1、ge、gt、le、lt、isNull、isNotNull**

```java
@Test
public void testDelete(){

    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    // queryWrapper.eq("age",18);//等于
    // queryWrapper.gt("age",18);//大于
    queryWrapper.ge("age",18)
            .isNotNull("email")
            .isNotNull("name");
    //UPDATE user SET deleted=1 WHERE deleted=0 AND (age >= ? AND email IS NOT NULL AND name IS NOT NULL) 
    int result = userMapper.delete(queryWrapper);
    System.out.println("删除了"+ result + "条记录");

}
```

## **2、eq、ne**

**注意：**seletOne()返回的是一条实体记录，当出现多条时会报错

```java
@Test
public void testSelectOne(){
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("name","山南水北");
    User user = userMapper.selectOne(queryWrapper);//只能返回一条记录，多余一条则抛出异常
    System.out.println(user);
}
```

## **3、between、notBetween**

包含大小边界

```java
@Test
public void testSelectCount() {
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    queryWrapper.between("age", 20, 30);
    Integer count = userMapper.selectCount(queryWrapper); //返回数据数量
    System.out.println(count);
}
```

## **4、like、notLike、likeLeft、likeRight**

selectMaps()返回Map集合列表，通常配合select()使用

```java
@Test
public void testSelectMaps() {
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    queryWrapper
            .select("name", "age")
            .like("name", "南")
            .likeRight("email", "5");

    List<Map<String, Object>> maps = userMapper.selectMaps(queryWrapper);//返回值是Map列表
    maps.forEach(System.out::println);
}
```

## **5、in、notIn、inSql、notinSql、exists、notExists**

in、notIn：

```
notIn("age",{1,2,3})--->age not in (1,2,3)notIn("age", 1, 2, 3)--->age not in (1,2,3)
```

inSql、notinSql：可以实现子查询

- 例: `inSql("age", "1,2,3,4,5,6")`--->`age in (1,2,3,4,5,6)`
- 例: `inSql("id", "select id from table where id < 3")`--->`id in (select id from table where id < 3)`

```java
@Test
public void testSelectObjs() {
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    //        queryWrapper.in("id", 1, 2, 3);
    queryWrapper.inSql("id", "select id from user where id <= 3");
    List<Object> objects = userMapper.selectObjs(queryWrapper);//返回值是Object列表
    objects.forEach(System.out::println);
}
```

## **6、or、and**

**注意：**这里使用的是 UpdateWrapper 

不调用`or`则默认为使用 `and `连

```java
@Test
public void testUpdate1() {
    //修改值
    User user = new User();
    user.setAge(99);
    user.setName("Andy");
    //修改条件
    UpdateWrapper<User> userUpdateWrapper = new UpdateWrapper<>();
    userUpdateWrapper
        .like("name", "山")
        .or()
        .between("age", 20, 30);
    int result = userMapper.update(user, userUpdateWrapper);
    System.out.println(result);
    /**
         * ==>  Preparing: UPDATE user SET name=?, age=?, update_time=? WHERE deleted=0 AND (name LIKE ? OR age BETWEEN ? AND ?) 
         * ==> Parameters: Andy(String), 99(Integer), 2021-01-10 16:53:50.473(Timestamp), %山%(String), 20(Integer), 30(Integer)
         */
}
```

## **7、lambda表达式**

lambda表达式内的逻辑优先运算

```java
@Test
public void testUpdate2() {
    //修改值
    User user = new User();
    user.setAge(23);
    user.setName("Andy");
    //修改条件
    UpdateWrapper<User> userUpdateWrapper = new UpdateWrapper<>();
    userUpdateWrapper
            .like("name", "A")
            .or(i -> i.like("name", "a").eq("age", 20));
    int result = userMapper.update(user, userUpdateWrapper);
    System.out.println(result);
}
```

## **8、orderBy、orderByDesc、orderByAsc**

```java
@Test
public void testSelectListOrderBy() {
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    queryWrapper.orderByDesc("age", "id");
    List<User> users = userMapper.selectList(queryWrapper);
    users.forEach(System.out::println);
}
```

## **9、set、setSql**

最终的sql会合并 user.setAge()，以及 userUpdateWrapper.set()  和 setSql() 中 的字段

```java
@Test
public void testUpdateSet() {
    //修改值
    User user = new User();
    user.setAge(30);
    //修改条件
    UpdateWrapper<User> userUpdateWrapper = new UpdateWrapper<>();
    userUpdateWrapper
            .like("name", "A")
            .set("name", "Peter")//除了可以查询还可以使用set设置修改的字段
            .setSql(" email = '123@qq.com'");//可以有子查询
    int result = userMapper.update(user, userUpdateWrapper);
    /**
     * ==>  Preparing: UPDATE user SET age=?, update_time=?, name=?, email = '123@qq.com' WHERE deleted=0 AND (name LIKE ?)
     * ==> Parameters: 30(Integer), 2021-01-10 17:00:01.0(Timestamp), Peter(String), %A%(String)
     */
}
```

# 三、查询方式

| **查询方式**     | **说明**                          |
| ---------------- | --------------------------------- |
| **setSqlSelect** | 设置 SELECT 查询字段              |
| **where**        | WHERE 语句，拼接 + WHERE 条件     |
| **and**          | AND 语句，拼接 + AND 字段=值      |
| **andNew**       | AND 语句，拼接 + AND (字段=值)    |
| **or**           | OR 语句，拼接 + OR 字段=值        |
| **orNew**        | OR 语句，拼接 + OR (字段=值)      |
| **eq**           | 等于=                             |
| **allEq**        | 基于 map 内容等于=                |
| **ne**           | 不等于<>                          |
| **gt**           | 大于>                             |
| **ge**           | 大于等于>=                        |
| **lt**           | 小于<                             |
| **le**           | 小于等于<=                        |
| **like**         | 模糊查询 LIKE                     |
| **notLike**      | 模糊查询 NOT LIKE                 |
| **in**           | IN 查询                           |
| **notIn**        | NOT IN 查询                       |
| **isNull**       | NULL 值查询                       |
| **isNotNull**    | IS NOT NULL                       |
| **groupBy**      | 分组 GROUP BY                     |
| **having**       | HAVING 关键词                     |
| **orderBy**      | 排序 ORDER BY                     |
| **orderAsc**     | ASC 排序 ORDER BY                 |
| **orderDesc**    | DESC 排序 ORDER BY                |
| **exists**       | EXISTS 条件语句                   |
| **notExists**    | NOT EXISTS 条件语句               |
| **between**      | BETWEEN 条件语句                  |
| **notBetween**   | NOT BETWEEN 条件语句              |
| **addFilter**    | 自由拼接 SQL                      |
| **last**         | 拼接在最后，例如：last(“LIMIT 1”) |