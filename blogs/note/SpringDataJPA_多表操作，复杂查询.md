---
title: SpringDataJPA_多表操作，复杂查询
date: 2021-1-31 12:52:30
tags:
 - Spring
categories: 
 - 笔记
author: 山南水北
---

# 一、Specifications 动态查询

## 1.1 动态查询

### 1.paSpecificationExecutor 方法列表

```java
T findOne(Specification<T> spec);//查询单个对象
List<T> findAll(Specification<T> spec)；//查询列表
//查询全部，分页
//pageable:分页参数
//返回值：分页pageBean（page:是springdatajpa提供的）
Page<T> findAll(Specification<T> spec,Pageable pageable);
//查询列表
//Sort：排序参数
List<T> findAll(Specification<T> spec,Sort sort);
long count(Specification<T> spec);//统计查询
```

Specification：查询条件

自定义我们自己的Specification实现类

```java
//root:查询的根对象（查询的任何属性都可以从根对象中获取
//CriteriaQuery:顶层查询对象，自定义查询方式（了解：一般不用）
//CriteriaBuilder:查询的构造器，封装了很多的查询条件
Predicate toPredicate(Root<T> root,CriteriaQuery<?> query,CriteriaBuilder cb);//封装查询条件
```

## 1.2 查询单个对象

```java
package com.shannanshuibei;

import com.shannanshuibei.dao.ICustomerDao;
import com.shannanshuibei.domain.Customer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.persistence.criteria.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class SpecTest {

    @Autowired
    private ICustomerDao customerDao;

    /**
     * 根据条件，查询单个对象
     */
    @Test
    public void testSpec(){
        //匿名内部类
        /**
         * 自定义查询条件
         *      1.实现Specification接口（提供泛型：查询的对象类型）
         *      2.实现toPredicate方法（构造查询条件）
         *      3.需要借助方法参数中的两个参数（
         *          root：获取需要查询的对象属性
         *          CriteriaBuilder:构造查询条件的，内部封装了很多的查询条件（模糊查询，精准匹配）
         *       ）
         * 案例：根据客户名称查询，查询客户名为山南水北的客户
         *      查询条件
         *          1.查询方式
         *              cb对象
         *          2.比较的属性名称
         *              root对象
         */
        Specification<Customer> spec = new Specification<Customer>() {
            public Predicate toPredicate(Root<Customer> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                //1.获取比较的属性
                Path<Object> custName = root.get("custName");
                //2.构造查询条件：select * from cst_customer where cust_name = '山南水北'
                /**
                 * 参数1：需要比较的属性（path对象）
                 * 参数2：当前需要比较的取值
                 */
                Predicate predicate = criteriaBuilder.equal(custName, "山高水长");//进行精准的匹配（比较属性，比较的属性的取值）
                return predicate;
            }
        };
        Customer customer = customerDao.findOne(spec);
        System.out.println(customer);
    }
}
```

## 1.2 动态查询多条件

```java
@Test
    public void testSpec1(){
        /**
         * root:获取属性
         *      客户名
         *      所属行业
         * criteraBuilder：构造查询
         *      1.构造客户名的精准匹配查询
         *      2.构造所属行业的精准匹配查询
         *      3.将以上两个查询联合起来
         */
        Specification<Customer> customer = new Specification<Customer>() {
            public Predicate toPredicate(Root<Customer> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                Path<Object> custName = root.get("custName");
                Path<Object> custIndustry = root.get("custIndustry");

                //构造查询
                //1.构造客户名的精准匹配查询
                Predicate p1 = criteriaBuilder.equal(custName, "山高水长");//第一个参数，path（属性），第二个参数，属性的取值
                //2.构造所属行业的精准匹配查询
                Predicate p2 = criteriaBuilder.equal(custIndustry, "互联网");//第一个参数，path（属性），第二个参数，属性的取值
                //3;将多个查询条件组合起来
                Predicate and = criteriaBuilder.and(p1, p2);
                return and;
            }
        };
        Customer one = customerDao.findOne(customer);
        System.out.println(one);
    }
```

## 1.3 模糊查询

```java
    /**
     * 案例：完成根据客户名称的模糊匹配，返回客户列表
     *      客户名以‘山南水北’开头
     *
     * equal：直接得到path对象（属性），然后进行比较即可
     * gt,lt,ge,le,like:得到path对象，根据path指定比较的参数类型，再去进行比较
     *      指定参数类型：path.as（类型的字节码对象）
     */
    @Test
    public void testSpec3(){

        final Specification spec = new Specification() {
            public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {

                Path custName = root.get("custName");
                //查询方式：模糊查询
                Predicate p = criteriaBuilder.like(custName.as(String.class), "山南水北%");
                return p;
            }
        };

        List<Customer> list = customerDao.findAll();
        for (Customer customer : list){
            System.out.println(customer);
        }
    }
```

## 1.4 排序

 ```java
    @Test
    public void testSpec4(){

        final Specification spec = new Specification() {
            public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {

                Path custName = root.get("custName");
                //查询方式：模糊查询
                Predicate p = criteriaBuilder.like(custName.as(String.class), "山南水北%");
                return p;
            }
        };

        //添加排序
        //创建排序对象,需要调用构造方法实例化对象
        //参数1：排序的顺序（正序asc，倒序desc）
        //参数2：排序的属性名称
        Sort sort = new Sort(Sort.Direction.DESC,"custId");
        List<Customer> list = customerDao.findAll(spec, sort);
        for (Customer customer : list) {
            System.out.println(customer);
        }
    }
 ```

## 1.5 分页查询

```java
    /**
     * 分页查询
     *      findAll(Specification,Pageable)
     *      Pageable:分页参数
     *          分页参数：查询的页码，每页查询的条数
     *          findAll(Specification,Pageable):带条件的分页
     *          findAll(Pageable):没有条件的分页
     * 返回：Page（SpringDataJpa为我们封装好的pageBean对象，数据列表，共条数）
     */
    @Test
    public void testSpec5(){

        Specification spec = null;
        //PageRequest对象是Pageable接口的实现类
        /**
         * 创建PageRequest的过程，需要调用他的构造方法传入两个参数
         *      参数1：当前查询的页数（从0开始）；参数2：每页查询的数量
         */
        Pageable pageable = new PageRequest(0,2);
        //分页查询
        Page<Customer> page = customerDao.findAll(null, pageable);
        System.out.println(page.getContent());//得到数据集合列表
        System.out.println(page.getTotalElements());//得到总条数
        System.out.println(page.getTotalPages());//得到总页数
    }
```

# 二、多表之间的关系和操作多表的操作步骤

1. 表关系：
   1. 一对一：

   2. 一对多：

      1. 一的一方：主表

      2. 多的一方：从表

         外键：需要再从表上新建一列作为外键，他的取值来源于主表的主键

   3. 多对多：

      1. 中间表：中间表中最少应该由两个字段组成，这两个字段作为外键指向两张表的主键，又组成了联合主键

2. 实体类中的关系

   1. 包含关系：可以通过实体类中的包含关系描述表关系
   2. 继承关系

3. 分析步骤

   1. 明确表关系
   2. 确定表关系（描述 外键|中间表）
   3. 编写实体类，在实体类中描述表关系（包含关系）
   4. 配置映射关系

# 三、完成多表操作

## 3.1 一对多操作

案例：客户和联系人

* 客户：一家公司
* 联系人：这家公司的员工

一个客户可以具有多个联系人

一个联系人从属于一家公司

* 分析步骤
  * 明确表关系
    * 一对多关系
  * 确定表关系（描述 外键|中间表）
    * 主表：客户表
    * 从表：联系人表
      * 再从表上添加外键
  * 编写实体类，在实体类中描述表关系（包含关系）
    * 客户：在客户的实体类中包含一个联系人的集合
    * 联系人：在联系人的实体类中包含一个客户的对象
  * 配置映射关系
    * 使用jpa注解配置一对多映射关系
* 客户类

```java
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

    //配置客户和联系人之间的关系（一对多关系）
    /**
     * 使用注解的形式配置多表关系
     *      1.声明关系
     *          @OneToMany:配置一对多关系
     *              targetEntity:对方对象的字节码对象
     *          @JoinColumn:配置外键
     *              name：外键字段名称
     *              referencedColumnName:参照的主表的主键字段名称
     *      2.配置外键（中间表）
     *
     * 在客户实体类上（一的一方）添加了外键的配置，所以对于客户而言，也具备了维护外键的作用
     *
     */
    @OneToMany(targetEntity = LinkMan.class)
    @JoinColumn(name = "lkm_cust_id",referencedColumnName = "cust_id")
    private Set<LinkMan> linkMans = new HashSet<LinkMan>();

}

```

* 联系人类

```JAVA
@Data
@Accessors(chain = true)
@Entity
@Table(name = "cst_linkman")
public class LinkMan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lkm_id")
    private Long lkmId;//联系人编号(主键)
    @Column(name = "lkm_name")
    private String lkmName;//联系人姓名
    @Column(name = "lkm_gender")
    private String lkmGender;//联系人性别
    @Column(name = "lkm_phone")
    private String lkmPhone;//联系人办公电话
    @Column(name = "lkm_mobile")
    private String lkmMobile;//联系人手机
    @Column(name = "lkm_Email")
    private String lkmEmail;//联系人邮箱
    @Column(name = "lkm_position")
    private String lkmPosition;//联系人职位
    @Column(name = "lkm_memo")
    private String lkmMemo;//联系人备注

    /**
     * 配置联系人到客户的多对一关系
     *      使用注解的形式配置多对一关系
     *      1.配置表关系
     *          @ManyToOne:配置多对一关系
     *              targetEntity:对方对象的字节码对象
     *      2.配置外键（中间表）
     * 配置外键的过程，配置到多的一方，就在多的一方维护外键
     */
    @ManyToOne(targetEntity = Customer.class)
    @JoinColumn(name = "lkm_cust_id",referencedColumnName = "cust_id")
    private Customer customer;

}
```

* Dao

```java
public interface ICustomerDao extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
}

public interface ILinkManDao extends JpaRepository<LinkMan,Long>, JpaSpecificationExecutor<LinkMan> {
}

```

### 3.1.1 保存

* OneToManyTest

```java
/**
     * 保存一个客户，保存一个联系人
     * 效果：客户和联系人作为独立的数据保存到数据库中
     *      联系人外键为空
     * 原因：
     *      实体类中没有配置关系
     */
    @Test
    @Transactional
    @Rollback(false)//不自动回滚
    public void testAdd(){
        //创建一个客户，创建一个联系人
        Customer customer = new Customer().setCustName("百度");
        LinkMan linkMan = new LinkMan().setLkmName("小李");

        /**
         * 配置了客户到联系人的关系
         *      从客户的角度上：发送两条 insert语句，发送一条更新语句更新数据库（更新外键）
         * 由于配置了客户到联系人的关系：客户可以对外键进行维护
         */
        customer.getLinkMans().add(linkMan);

        customerDao.save(customer);
        linkManDao.save(linkMan);
    }

    @Test
    @Transactional
    @Rollback(false)//不自动回滚
    public void testAdd1(){
        //创建一个客户，创建一个联系人
        Customer customer = new Customer().setCustName("网易");
        LinkMan linkMan = new LinkMan().setLkmName("小王");

        /**
         * 配置了客户到联系人的关系(多对一）
         *      只发送了两条insert语句
         * 由于配置了联系人到客户的映射关系（多对一）
         *
         */
        linkMan.setCustomer(customer);

        customerDao.save(customer);
        linkManDao.save(linkMan);
    }
```

### 3.1.2 保存并让一的一方放弃对外键的维护

* 修改Customer

```java
    //配置客户和联系人之间的关系（一对多关系）
    /**
     * 使用注解的形式配置多表关系
     *      1.声明关系
     *          @OneToMany:配置一对多关系
     *              targetEntity:对方对象的字节码对象
     *          @JoinColumn:配置外键
     *              name：外键字段名称
     *              referencedColumnName:参照的主表的主键字段名称
     *      2.配置外键（中间表）
     *
     * 在客户实体类上（一的一方）添加了外键的配置，所以对于客户而言，也具备了维护外键的作用
     *
     */
//    @OneToMany(targetEntity = LinkMan.class)
//    @JoinColumn(name = "lkm_cust_id",referencedColumnName = "cust_id")
    /**
     * 放弃外键维护权
     *      mappingBy:对一方配置关系的属性名称
     */
    @OneToMany(mappedBy = "customer")
    private Set<LinkMan> linkMans = new HashSet<LinkMan>();
```

* OneToManyTest

```java
    /**
     * 会有一条多余的update取出来
     *      * 由于一的一方可以维护外键：会发送update语句
     *      * 解决此问题：只需要在一的一方放弃维护权即可
     */
    @Test
    @Transactional
    @Rollback(false)//不自动回滚
    public void testAdd2(){
        //创建一个客户，创建一个联系人
        Customer customer = new Customer().setCustName("网易");
        LinkMan linkMan = new LinkMan().setLkmName("小王");

        /**
         * 配置了客户到联系人的关系(多对一）
         *      只发送了两条insert语句
         * 由于配置了联系人到客户的映射关系（多对一）
         *
         */
        linkMan.setCustomer(customer);//由于配置了多的一方到一的一方的关联关系（当保存的时候，就已经对外键赋值
        customer.getLinkMans().add(linkMan);//由于配置了一的一方到多的一方的关联关系（发送一条update语句)

        customerDao.save(customer);
        linkManDao.save(linkMan);
    }
```

<p style="color:red">注意：使用@Data注解，实现该功能会出现栈溢出，需要将@Data注解换成 @Getter @Setter</p>

### 3.1.3 删除

* 有从表数据

  1、在默认情况下，它会把外键字段置为null，然后删除主表数据。如果在数据库的表结构上，外键字段有非空约束，默认情况就会报错了

  2、如果配置了放弃维护关联关系的权利，则不能删除（与外键字段是否允许为null没有关系）因为在删除时，它根本不会去更新从表的外键字段了

  3、如果还想删除，使用级联删除引用

  <p style="color:red">在实际开发中，级联删除请慎用！（在一对多的情况下)</p>

* 没有从表数据引用：随便删

* 级联：操作一个对象的同时操作他的关联对象

  * 级联操作：
    * 需要区分操作主体
    * 需要在操作主体的实体类上，添加级联属性（需要添加到多表映射关系的注解上
    * cascade(配置级联)

  ```java
      /**
       * 放弃外键维护权
       *      mappingBy:对一方配置关系的属性名称
       * cascade:配置级联(可以配置到设置多表的映射关系的注解上)
       *      CascadeType.All:        所有
       *                  MERGE:      更新
       *                  PERSIST:    保存
       *                  REMOVE:     删除
       */
      @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL)
      private Set<LinkMan> linkMans = new HashSet<LinkMan>();
  ```

  ```java
  /**
       * 级联添加：保存一个客户的同时，保存客户的所有联系人
       *
       *
       *      需要在操作主体的实体类上，配置casacde属性
       *
       */
      @Test
      @Transactional
      @Rollback(false)
      public void testCascadeAdd(){
          Customer customer = new Customer().setCustName("百度1");
          LinkMan linkMan = new LinkMan().setLkmName("小李1");
  
          linkMan.setCustomer(customer);
          customer.getLinkMans().add(linkMan);
  
          customerDao.save(customer);
      }
  
      /**
       * 级联删除
       *      删除1号客户的同时，删除1号客户的所有联系人
       */
      @Test
      @Transactional
      @Rollback(false)
      public void testCascadeRemove(){
  
          //1.查询1号客户
          Customer customer = customerDao.findOne(16l);
          System.out.println(customer);
          //1.删除1号客户
          customerDao.delete(customer);
      }
  ```

  * 级联添加：
    * 案例：当我保存一个客户的同时保存联系人
  * 级联删除：
    * 案例：当我删除一个客户的同时删除此客户的所有联系人

## 3.2 多对多操作

案例：用户和角色（多对多关系）

​		用户：

​		角色：

1. 分析步骤
   1. 明确表关系
      * 多对多关系
   2. 确定表关系（描述 外键|中间表）
      * 中间表
   3. 编写实体类，再实体类中描述关系（包含关系）
      * 用户：包含角色的集合
      * 角色：包含用户的集合
   4. 配置映射关系



- Dao

```java
public interface IRoleDao extends JpaRepository<Role,Long>, JpaSpecificationExecutor<Role> {
}

---------------------------------------------------------------------------------------------
public interface IUserDao extends JpaRepository<User,Long>, JpaSpecificationExecutor<User> {
}
```

* domain

  * User

  ```java
  @Getter
  @Setter
  @Accessors(chain = true)
  @Entity
  @Table(name = "sys_user")
  public class User {
  
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      @Column(name = "user_id")
      private Long userId;
      @Column(name = "user_name")
      private String userName;
      @Column(name = "user_age")
      private Integer age;
  
      /**
       * 配置用户到角色的多对多关系
       *      配置多对多的映射关系
       *          1.声明表关系
       *              @ManyToMany:多对多
       *                  targetEntity：代表对方的实体类字节码
       *          2.配置中间表（包含两个外键）
       *                  @JoinTable
       *                      name:中间表的名称
       *                      joinColumns：配置当前对象在中间表的外键
       *                          @JoinColumn的数组
       *                              name：外键名
       *                              referencedColumnName:参照的主表的主键名
       *                      inverseJoinColumns：配置对方对象在中间表的外键
       *                          @JoinColumn的数组
       *                              name：外键名
       *                              referencedColumnName:参照的主表的主键名
       */
      @ManyToMany(targetEntity = Role.class,cascade = CascadeType.ALL)
      @JoinTable(name = "sys_user_role",
          //joinColumns:当前对象再中间表中的外键
          joinColumns = {@JoinColumn(name = "sys_user_id",referencedColumnName = "user_id")},
          //inverseJoinColumns:对方对象在中间表的外键
          inverseJoinColumns = {@JoinColumn(name = "sys_role_id",referencedColumnName = "role_id")}
      )
      private Set<Role> roles = new HashSet<Role>();
  ```

  

  * Role

```java
@Getter
@Setter
@Accessors(chain = true)
@Entity
@Table(name = "sys_role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;
    @Column(name = "role_name")
    private String roleName;


    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<User>();
}
```

### 3.2.1 保存

```java
@Test
    @Transactional
    @Rollback(false)
    public void testAdd(){

        User user = new User().setUserName("小李").setAge(20);
        Role role = new Role().setRoleName("java程序员");

        //配置用户到角色关系，可以对中间表中的数据进行维护  1-1
        user.getRoles().add(role);
        //配置角色到用户关系，可以对中间表中的数据进行维护  1-1
        role.getUsers().add(user);
        //上述两个同时存在或出现两个相同主键，导致出现栈溢出，需要其中一个放弃维护

        userDao.save(user);
        roleDao.save(role);
    }
```

### 3.2.2 级联保存

```java
//测试级联添加（保存一个用户的同时保存用户的关联角色）
    @Test
    @Transactional
    @Rollback(false)
    public void testCasCadeAdd(){

        User user = new User().setUserName("小李").setAge(10);
        Role role = new Role().setRoleName("java程序员");

        //配置用户到角色关系，可以对中间表中的数据进行维护  1-1
        user.getRoles().add(role);
        //配置角色到用户关系，可以对中间表中的数据进行维护  1-1
        role.getUsers().add(user);
        //上述两个同时存在或出现两个相同主键，导致出现栈溢出，需要其中一个放弃维护

        userDao.save(user);

    }
```

### 3.2.3 删除

```java
/**
     * 案例：删除id为1的用户，同时删除他的关联对象
     */
    @Test
    @Transactional
    @Rollback(false)
    public void testCasCadeRemove(){

        //查询1号用户
        User user = userDao.findOne(1l);
        //删除1号用户
        userDao.delete(user);
    }
```

## 3.3 多表查询

### 3.3.1 对象导航查询

​	**查询一个对象的间时，通过此对象查询他的关联对象**

​	<u>从一方查询多方</u>

​				默认：使用延迟加载

​	<u>从多方查询一方</u>

​				默认：使用立即加载

---



​	案例：客户和联系人

1. 测试对象导航查询（查询一个对象的时候，通过此对象查询所有的关联对象

* Customer：默认查询方式

```java
    /**
     * fetch:配置关联对象的加载方式
     *      EAGER:立即加载
     *      LAZY:延迟加载
     */
    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL)
    private Set<LinkMan> linkMans = new HashSet<LinkMan>();
```

* Customer：立即查询方式

```java
    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private Set<LinkMan> linkMans = new HashSet<LinkMan>();
```



* Test：


```java
    //could not initialize proxy - no Session
    //测试对象导航查询（查询一个对象的时候，通过此对象查询所有的关联对象
    @Test
    @Transactional//解决在java代码中的no session问题
    public void testQuery1(){
        //查询id为1的客户
        Customer customer = customerDao.getOne(14l);
        //对象导航查询，此客户下的所有联系人
        Set<LinkMan> linkMans = customer.getLinkMans();
        for (LinkMan linkMan : linkMans) {
            System.out.println(linkMan);
        }
    }
```

2. 从联系人对象导航查询他的所属客户

* LinkMan:默认查询方式

```java
    @ManyToOne(targetEntity = Customer.class)
    @JoinColumn(name = "lkm_cust_id",referencedColumnName = "cust_id")
    private Customer customer;

```

* LinkMan:延迟查询方式

```java
    @ManyToOne(targetEntity = Customer.class,fetch = FetchType.LAZY)
    @JoinColumn(name = "lkm_cust_id",referencedColumnName = "cust_id")
    private Customer customer;
```

* Test

```java
    /**
     * 从联系人对象导航查询他的所属客户
     *      默认：立即加载
     * 延迟加载：
     */
    @Test
    @Transactional//解决在java代码中的no session问题
    public void testQuery3(){
        //查询id为1的客户
        LinkMan linkMan = linkManDao.findOne(2l);
        //对象导航查询，此联系人的所属客户
        Customer customer = linkMan.getCustomer();
        System.out.println(customer);
    }
```

