---
title: SpringDataJPA_运行原理及基本操作
date: 2021-1-31 12:58:10
tags:
 - Spring
categories: 
 - 笔记
author: 山南水北
---
# 一、SpringDataJPA的简介

## 1.1Spring Data JPA 概述

​		Spring Data JPA 是 Spring 基于 ORM 框架、JPA 规范的基础上封装的一套JPA应用框架，可使开发者用极简的代码即可实现对数据库的访问和操作。它提供了包括增删改查等在内的常用功能，且易于扩展！学习并使用 Spring Data JPA 可以极大提高开发效率！

<p style="color:red">&emsp;&emsp;Spring Data JPA 让我们解脱了DAO层的操作，基本上所有CRUD都可以依赖于它来实现,在实际的工作工程中，推荐使用Spring Data JPA + ORM（如：hibernate）完成操作，这样在切换不同的ORM框架时提供了极大的方便，同时也使数据库层操作更加简单，方便解耦</p>

## 1.2 Spring Data JPA 特性

![image-20200719205532284](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20200719205532284.png)

​		SpringData Jpa 极大简化了数据库访问层代码。 如何简化的呢？ 使用了SpringDataJpa，我们的dao层中只需要写接口，就自动具有了增删改查、分页查询等方法。

# 二、SpringDataJPA的入门操作

客户的基本CRUD

## 2.1搭建环境

1. 创建工程导入坐标

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
       <modelVersion>4.0.0</modelVersion>
   
       <groupId>com.shannanshuibei</groupId>
       <artifactId>jpa-day2</artifactId>
       <version>1.0-SNAPSHOT</version>
   
       <properties>
           <spring.version>4.2.4.RELEASE</spring.version>
           <hibernate.version>5.0.7.Final</hibernate.version>
           <slf4j.version>1.6.6</slf4j.version>
           <log4j.version>1.2.12</log4j.version>
           <c3p0.version>0.9.1.2</c3p0.version>
           <mysql.version>5.1.6</mysql.version>
       </properties>
   
       <dependencies>
           <!-- junit单元测试 -->
           <dependency>
               <groupId>junit</groupId>
               <artifactId>junit</artifactId>
               <version>4.9</version>
               <scope>test</scope>
           </dependency>
   
           <!-- spring beg -->
           <dependency>
               <groupId>org.aspectj</groupId>
               <artifactId>aspectjweaver</artifactId>
               <version>1.6.8</version>
           </dependency>
   
           <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-aop</artifactId>
               <version>${spring.version}</version>
           </dependency>
   
           <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-context</artifactId>
               <version>${spring.version}</version>
           </dependency>
   
           <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-context-support</artifactId>
               <version>${spring.version}</version>
           </dependency>
   
           <!-- spring对orm框架的支持包 -->
           <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-orm</artifactId>
               <version>${spring.version}</version>
           </dependency>
   
           <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-beans</artifactId>
               <version>${spring.version}</version>
           </dependency>
   
           <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-core</artifactId>
               <version>${spring.version}</version>
           </dependency>
   
           <!-- spring end -->
   
           <!-- hibernate beg -->
           <dependency>
               <groupId>org.hibernate</groupId>
               <artifactId>hibernate-core</artifactId>
               <version>${hibernate.version}</version>
           </dependency>
           <dependency>
               <groupId>org.hibernate</groupId>
               <artifactId>hibernate-entitymanager</artifactId>
               <version>${hibernate.version}</version>
           </dependency>
           <dependency>
               <groupId>org.hibernate</groupId>
               <artifactId>hibernate-validator</artifactId>
               <version>5.2.1.Final</version>
           </dependency>
           <!-- hibernate end -->
   
           <!-- c3p0 beg -->
           <dependency>
               <groupId>c3p0</groupId>
               <artifactId>c3p0</artifactId>
               <version>${c3p0.version}</version>
           </dependency>
           <!-- c3p0 end -->
   
           <!-- log end -->
           <dependency>
               <groupId>log4j</groupId>
               <artifactId>log4j</artifactId>
               <version>${log4j.version}</version>
           </dependency>
   
           <dependency>
               <groupId>org.slf4j</groupId>
               <artifactId>slf4j-api</artifactId>
               <version>${slf4j.version}</version>
           </dependency>
   
           <dependency>
               <groupId>org.slf4j</groupId>
               <artifactId>slf4j-log4j12</artifactId>
               <version>${slf4j.version}</version>
           </dependency>
           <!-- log end -->
   
   
           <dependency>
               <groupId>mysql</groupId>
               <artifactId>mysql-connector-java</artifactId>
               <version>${mysql.version}</version>
           </dependency>
   
           <!-- spring Data JPA必须引入 -->
           <dependency>
               <groupId>org.springframework.data</groupId>
               <artifactId>spring-data-jpa</artifactId>
               <version>1.9.0.RELEASE</version>
           </dependency>
   
           <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-test</artifactId>
               <version>${spring.version}</version>
           </dependency>
   
           <!-- el beg 使用spring data jpa 必须引入 -->
           <dependency>
               <groupId>javax.el</groupId>
               <artifactId>javax.el-api</artifactId>
               <version>2.2.4</version>
           </dependency>
   
           <dependency>
               <groupId>org.glassfish.web</groupId>
               <artifactId>javax.el</artifactId>
               <version>2.2.4</version>
           </dependency>
   
           <dependency>
               <groupId>org.projectlombok</groupId>
               <artifactId>lombok</artifactId>
               <version>1.18.12</version>
           </dependency>
           <!-- el end -->
       </dependencies>
   
   </project>
   ```

2. 配置Spring 的配置文件(配置Spring Data JPA 的整合)

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:jdbc="http://www.springframework.org/schema/jdbc" xmlns:tx="http://www.springframework.org/schema/tx"
          xmlns:jpa="http://www.springframework.org/schema/data/jpa" xmlns:task="http://www.springframework.org/schema/task"
          xsi:schemaLocation="
   		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
   		http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
   		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
   		http://www.springframework.org/schema/jdbc http://www.springframework.org/schema/jdbc/spring-jdbc.xsd
   		http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd
   		http://www.springframework.org/schema/data/jpa
   		http://www.springframework.org/schema/data/jpa/spring-jpa.xsd">
   
       <!-- Spring 和 Spring Data JPA 的配置 -->
   
       <!-- 1.创建EntityManagerFactory对象交给Spring容器管理 -->
       <bean id="entityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean" >
           <property name="dataSource" ref="dataSource"/>
           <!-- 配置扫描的包（实体类所在的包） -->
           <property name="packagesToScan" value="com.shannanshuibei.domain" />
           <!-- JPA的实现厂家（方式） -->
           <property name="persistenceProvider" >
               <bean class="org.hibernate.jpa.HibernatePersistenceProvider" />
           </property>
   
           <!-- JPA的供应商适配器 -->
           <property name="jpaVendorAdapter">
               <bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
                   <!-- 配置是否自动创建数据库表 -->
                   <property name="generateDdl" value="false" />
                   <!-- 指定数据库类型 -->
                   <property name="database" value="MYSQL" />
                   <!-- 数据库方言：支持的特有语法 -->
                   <property name="databasePlatform" value="org.hibernate.dialect.MySQLDialect" />
                   <!-- 是否显示sql语句 -->
                   <property name="showSql" value="true" />
               </bean>
           </property>
   
           <!-- JPA的方言：高级的特性 -->
           <property name="jpaDialect" >
               <bean class="org.springframework.orm.jpa.vendor.HibernateJpaDialect"></bean>
           </property>
   
       </bean>
   
       <!-- 2.创建数据库连接池 -->
       <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
           <property name="user" value="root" />
           <property name="password" value="112714" />
           <property name="jdbcUrl" value="jdbc:mysql:///jpa" />
           <property name="driverClass" value="com.mysql.jdbc.Driver" />
       </bean>
   
       <!-- 3.整合Spring Data JPA -->
       <jpa:repositories base-package="com.shannanshuibei.dao" transaction-manager-ref="transactionManager"
                         entity-manager-factory-ref="entityManagerFactory"></jpa:repositories>
   
       <!-- 4.配置事务管理器 -->
       <bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
           <property name="entityManagerFactory" ref="entityManagerFactory" />
       </bean>
   
       <!-- 5.声明式事务 -->
       <tx:advice id="txAdvice" transaction-manager="transactionManager">
           <tx:attributes>
               <tx:method name="save*" propagation="REQUIRED"/>
               <tx:method name="insert*" propagation="REQUIRED"/>
               <tx:method name="update*" propagation="REQUIRED"/>
               <tx:method name="delete*" propagation="REQUIRED"/>
               <tx:method name="get*" read-only="true"/>
               <tx:method name="find*" read-only="true"/>
               <tx:method name="*" propagation="REQUIRED"/>
           </tx:attributes>
       </tx:advice>
   
       <!-- 6.aop-->
       <aop:config>
           <aop:pointcut id="pointcut" expression="execution(* cn.itcast.service.*.*(..))" />
           <aop:advisor advice-ref="txAdvice" pointcut-ref="pointcut" />
       </aop:config>
   
       <!-- 7.配置包扫描 -->
       <context:component-scan base-package="com.shannanshuibei"></context:component-scan>
   
   </beans>
   
   ```

3. 编写实体类（Customer），使用JPA注解配置映射关系

   ```java
   package com.shannanshuibei.domain;
   
   import lombok.Data;
   import lombok.experimental.Accessors;
   
   import javax.persistence.*;
   
   /**
    * 1.实体类和表的映射关系
    *      @Entity
    *      @Table
    * 2.类中属性和表中字段的映射关系
    *      @Id
    *      @GeneratedValue
    *      @Column
    */
   @Data
   @Accessors(chain = true)
   @Entity
   @Table(name = "cst_customer")
   public class Customer {
   
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       @Column(name = "cust_id")
       private long custId;
       @Column(name = "cust_address")
       private String custAddress;
       @Column(name = "cust_industry")
       private String custIndustry;
       @Column(name = "cust_level")
       private String custLevel;
       @Column(name = "cust_name")
       private String custName;
       @Column(name = "cust_phone")
       private String custPhone;
       @Column(name = "cust_source")
       private String custSource;
       
   }
   
   ```

## 2.2 编写一个符合Spring Data JPA的dao层接口

* 只需要编写dao层接口，不需要编写dao层接口的实现类
* dao层接口规范
  1. 需要继承两个接口（JpaRepository，JpaSpecificationExecutor）
  2. 需要提供相应的泛型

```java
package com.shannanshuibei.dao;

import com.shannanshuibei.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * 符合Spring Data JPA的dao层规范
 *      JpaRepository<操作的实体类类型, 实体类中主键属性的类型>
 *          * 封装了基本的CRUD操作
 *      JpaSpecificationExecutor<操作的实体类类型>
 *          * 封装了复杂查询（分页）
 */
public interface ICustomerDao extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
}
```

## 2.3 入门案例（CRUD）

```java
package com.shannanshuibei;

import com.shannanshuibei.dao.ICustomerDao;
import com.shannanshuibei.domain.Customer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)//声明spring提供的单元测试环境
@ContextConfiguration(locations = "classpath:applicationContext.xml")//指定spring容器的配置信息
public class CustomerDaoTest {

    @Autowired
    private ICustomerDao customerDao;

    /**
     * 根据Id查询
     */
    @Test
    public void testFindOne(){
        Customer customer = customerDao.findOne(3l);
        System.out.println(customer);
    }

    /**
     * save：保存或更新
     *      根据传递的对象是否存在主键id
     *          如果没有id主键属性：保存
     *          存在id主键属性，根据id查询数据，更新数据
     */
    @Test
    public void testSave(){
        Customer customer = new Customer().setCustAddress("连云港").setCustIndustry("医疗").setCustName("山南水北医疗器械有限公司")
                .setCustLevel("一级").setCustPhone("516666666").setCustSource("自己");
        customerDao.save(customer);
    }

    @Test
    public void testUpdate(){
        Customer customer = new Customer().setCustId(3l).setCustLevel("二级").setCustSource("舔脸加入");
        customerDao.save(customer);
    }

    /**
     * 根据id删除客户
     */
    @Test
    public void testDeleteById(){
        customerDao.delete(4l);
    }

    /**
     * 查询所有客户
     */
    @Test
    public void testFindAll(){
        List<Customer> list = customerDao.findAll();
        for (Customer customer : list){
            System.out.println(customer);
        }
    }

}
```

# 三、SpringDataJPA的运行过程和原理剖析

1. 通过JdkDynamicAopProxy的invoke方法创建了一个动态代理对象
2. SimpleJpaRespository当中封装了jpa 的操作（借助JPA的api完成数据库的CRUD）
3. 通过Hibernate完成数据库操作（封装了jdbc）

# 四、复杂查询

## 4.1 借助接口定义的好的方法查询

findOne(id):根据id查询

## 4.2 jpql查询方式

特点：语法或关键字和sql语句类似，查询的是类和类中的属性

* 需要将JPQL语句配置到接口方法上
  1. 特有的查询：需要在dao接口上配置方法
  2. 在新添加的方法上，使用注解的形式配置jpql查询语句
  3. 注解：@Query

```java
/**
 * 符合Spring Data JPA的dao层规范
 *      JpaRepository<操作的实体类类型, 实体类中主键属性的类型>
 *          * 封装了基本的CRUD操作
 *      JpaSpecificationExecutor<操作的实体类类型>
 *          * 封装了复杂查询（分页）
 */

public interface ICustomerDao extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

    /**
     * 案例：根据客户名称，查询客户
     *      使用jpql的形式查询
     *  jpql：from Customer where custName = ?
     *
     *  配置jpql语句，使用@Query注解
     */

    @Query(value = "from Customer where custName=?")
    public Customer findJpql(String custName);

    /**
     * 案例：根据客户名称和客户id查询客户
     *      jpql："from Customer where custName = ? and custId = ?"
     *
     * 对于多个占位符参数
     *      赋值的时候，默认的情况下，占位符的位置需要和方法参数中的位置保持一致
     *
     * 可以指定占位符的参数
     *      ？ 索引的方式，指定此占位符的取值来源
     */
    //占位符一致情况
//    @Query(value = "from Customer where custName=? and custId=?")
//    public Customer findByCustNameAndCustId(String name,Long id);
    //占位符不一致情况
    @Query(value = "from Customer where custName=?2 and custId=?1")
    public Customer findByCustNameAndCustId(Long id,String name);

    /**
     * 使用jpql完成更新操作
     *      案例：根据id更新客户的名称
     *
     *      sql:update cst_customer set cust_Name = ? where cust_id = ?
     *      jpql:update Customer set custName=? where id = ?
     * @Query:代表的是查询
     *      * 需声明此方法是进行更新操作的
     * @Modifying:代表当前执行的是更新操作
     */
    @Query(value=" update Customer set custName = ?2 where custId = ?1 ")
    @Modifying
    public void updateByCustId(long custId,String custName);

}

```

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")//指定spring容器的配置信息
public class JpqlTest {

    @Autowired
    private ICustomerDao customerDao;

    @Test
    public void testFindJPQL(){
        Customer customer = customerDao.findJpql("山高水长");
        System.out.println(customer);
    }

    @Test
    public void testFindByNameAndId(){
        Customer customer = customerDao.findByCustNameAndCustId(0l,"阿里巴巴");
        System.out.println(customer);
    }

    /**
     * 测试jpql的更新操作
     *      * springDataJpa中使用jpql完成 更新/删除操作
     *          * 需要手动添加事务的支持
     *          * 默认会执行结束之后，回滚事务
     * @Rollback:设置是否回滚
     *
     */
    @Test
    @Transactional
    @Rollback(value = false)
    public void testUpdateByCustId(){
        customerDao.updateByCustId(0l,"阿里爸爸");
    }
}

```

## 4.3 sql语句查询

1. 特有的查询：需要在dao接口上配置方法
2. 在新添加的方法上，使用注解的形式配置sql查询语句
3. 注解：@Query
   * value：jpql语句|sql语句
   * nativeQuery：false|true（使用本地查询：sql查询）
     * 意义：是否使用本地查询

```java
    /**
     * 使用sql形式查询
     *      查询全部的客户
     *      sql：select * from cst_customer
     *      query:配置sql查询
     *          value：sql语句
     *          nativeQuery：查询方式
     *              true：sql查询
     *              false：jpql查询
     */
    @Query(value = "select * from cst_customer",nativeQuery=true)
    public List<Object[]> findAllBysql();

    //条件查询
    @Query(value = "select * from cst_customer where cust_name like ?",nativeQuery=true)
    public List<Object[]> SqlFindAllByname(String name);
```

```java
    @Test
    public void testFindAll(){
        List<Object[]> lists = customerDao.findAllBysql();
        for (Object[] obj : lists){
            System.out.println(Arrays.toString(obj));
        }
    }

    @Test
    public void testFindAllByName(){
        List<Object[]> lists = customerDao.SqlFindAllByname("山南水北%");
        for (Object[] obj : lists){
            System.out.println(Arrays.toString(obj));
        }
    }
```

## 4.4 方法名称规则查询

* 是对jpql查询，更加深入的一层封装

* 只需要按照Spring Data JPA提供的方法名称规则定义方法，不需要再去配置jpql语句，完成查询

  * findBy开头：代表查询

     		对象中属性的名称（首字母大写）
    
    * 含义根据属性名称进行查询

```java
    /**
     * 方法名的约定：
     *      findBy ：查询
     *          对象中的属性名（首字母大写）：查询条件
     *          CustName
     *          * 默认情况：使用 等于的方式查询
     *              特殊的查询方式
     *      fingByCustName  --  根据客户名称查询
     *
     *      在SpringDataJpa的运行阶段
     *          会根据方法名称进行解析     findBy          from    xxx（实体类）
     *                                          属性名称            where custName =
     *
     *      1、findBy + 属性名称（根据属性名称进行完成匹配的查询）
     *      2、findBy + 属性名称 + “查询方式（Like | isNull）”
     *              findByCustNameLike
     *      3、多条件查询
     *          findBy + 属性名 + “查询方式” + “多条件的连接符（and|or） + 属性名 + “查询方式”
     */
    public Customer findByCustName(String name);

    public List<Customer> findByCustNameLike(String name);

    //使用客户名称模糊匹配和客户所属行业精准匹配的查询
    public List<Customer> findByCustNameLikeAndCustIndustry(String name,String industry);//顺序不能颠倒
```

```java
    //测试方法命名规则查询方式
    @Test
    public void testNaming(){
        Customer customer = customerDao.findByCustName("阿里巴巴");
        System.out.println(customer);
    }

    //测试方法命名规则模糊查询方式
    @Test
    public void testFindByNameLike(){
        List<Customer> lists = customerDao.findByCustNameLike("山南水北%");
        for (Customer customer : lists){
            System.out.println(customer);
        }
    }

    //测试方法命名规则：使用客户名称模糊匹配和客户所属行业精准匹配的查询
    @Test
    public void testFindByNameLikeAndCustIndustry(){
        List<Customer> lists = customerDao.findByCustNameLikeAndCustIndustry("山南水北%","互联网");
        for (Customer customer : lists){
            System.out.println(customer);
        }
    }
```