---
title: Elasticsearch
date: 2021-1-30
tags:
 - es
categories: 
 - 笔记
author: 山南水北
---

# 一、使用Java客户端管理ES

## 1. 创建索引库

* 步骤：

  1. 创建一个java工程

  2. 添加jar包，添加maven的坐标

  3. 编写测试方法实现创建索引库

     1. 创建一个Settings对象，相当于是一个配置信息。主要配置集群的名称。
     2. 创建一个客户端Client对象
     3. 使用Client对象创建一个索引库
     4. 关闭Client对象

     ```JAVA
     
         @Test
         public void createIndex() throws Exception{
             //1. 创建一个Settings对象，相当于是一个配置信息。主要配置集群的名称。
             Settings settings = Settings.builder()
                     .put("cluster.name","my-elasticsearch")
                     .build();
             //2. 创建一个客户端Client对象
             TransportClient client = new PreBuiltTransportClient(settings);
             client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9301));
             client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9302));
             client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9303));
             //3. 使用Client对象创建一个索引库
             client.admin().indices().prepareCreate("index_hello")
                     //执行操作
                     .get();
             //4. 关闭Client对象
             client.close();
         }
     ```

     

## 2. 使用Java客户端设置Mappings

​	步骤：

1. 创建一个Settings对象
2. 创建一个Client对象
3. 创建一个mapping信息，应该是与一个json数据，可以是字符串，也可以是XContextBuilder对象
4. 使用Client向es服务器发送mapping信息
5. 关闭Client对象

```Java
    @Test
    public void setMappings() throws Exception{
        //1. 创建一个Settings对象
        Settings settings = Settings.builder()
                .put("cluster.name","my-elasticsearch")
                .build();
        //2. 创建一个TransPortClient对象
        TransportClient client = new PreBuiltTransportClient(settings)
                .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9301))
                .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9302))
                .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9303));
        //3. 创建一个mapping信息，应该是与一个json数据，可以是字符串，也可以是XContextBuilder对象
        /*
            {
                "article":{
                    "properties":{
                        "id":{
                            "type":"long",
                                "store":true;
                        },
                        "title":{
                            "type":"text",
                                "store":true,
                                "index":true,
                                "analyzer":"ik_smart"
                        },
                        "context":{
                            "type":"text",
                                "index":true,
                                "store":true,
                                "analyzer":"ik_smart"
                        }
                    }
                }
            }
         */
        XContentBuilder builder = XContentFactory.jsonBuilder()
                .startObject()
                    .startObject("article")
                        .startObject("properties")
                            .startObject("id")
                                .field("type","long")
                                .field("store",true)
                            .endObject()
                            .startObject("title")
                                .field("type","text")
                                .field("store",true)
                                .field("analyzer","ik_smart")
                            .endObject()
                            .startObject("content")
                                .field("type","text")
                                .field("store",true)
                                .field("analyzer","ik_smart")
                            .endObject()
                        .endObject()
                    .endObject()
                .endObject();
        //4. 使用Client向es服务器发送mapping信息
        client.admin().indices()
                .preparePutMapping("index_hello")//设置要做映射的索引
                .setType("article")//设置要做映射的type
                .setSource(builder)//mappings信息，可以是XContentBuilder对象，也可以是json格式的字符串
                .get();//执行操作

        //5. 关闭Client对象
        client.close();
    }
```

## 3.添加文档

步骤：

1. 创建一个Settings对象
2. 创建一个Client对象
3. 创建一个文档对象，创建一个json格式的字符串，或者使用XContentBuilder
4. 使用Client对象把文档添加到索引库中
5. 关闭Client

```java
public class ElasticSearchClientTest {

    //创建一个客户端Client对象
    private TransportClient client;

    @Before
    public void init() throws Exception{
        //创建一个Settings对象
        Settings settings = Settings.builder()
                .put("cluster.name","my-elasticsearch")
                .build();
        //new PreBuiltTransportClient
        client = new PreBuiltTransportClient(settings)
                .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9301))
                .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9302))
                .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"),9303));
    }

    @Test
    public void testAddDocument() throws Exception{
        //创建client对象
        //创建文档对象
        XContentBuilder builder = XContentFactory.jsonBuilder()
                .startObject()
                    .field("id",1l)
                    .field("title","福奇面对疫情直言不讳 却遭白宫冷落")
                    .field("content","近日，美国有线电视新闻网的一则报道称，随着疫情反弹明显，佐治亚州亚特兰大市市长宣布该市重启方案恢复到第一阶段，仅允许基本生活需求商业活动重开。而与此同时，美国总统特朗普却表现出越来越脱离疫情实际形势，也越来越脱离安东尼·福奇教授。\n")
                .endObject();

        //把文档对象添加进索引库
        client.prepareIndex()
                .setIndex("index_hello")//设置索引名称
                .setType("article")//设置Type
                .setId("1")//设置文档的id，如果不设置，会自动生成一个id
                .setSource(builder)//设置文档信息
                .get();//执行操作
    }

    @After
    public void end(){
        //5. 关闭Client对象
        client.close();
    }
}
```

## 4. 添加文档的第二章方式

步骤：

1. 创建个pojo类
2. 使用工具类把pojo转换成json字符串
3. 把文档写入索引库
4. 关闭

```Java
    @Test
    public void testAddDocument2() throws Exception{
        //创建Article对象
        Article article = new Article();
        //设置对象的属性
        article.setId(3l);
        article.setTitle("又一趣味的“宅家”亲子玩法，用手指绘画，简单又可爱！收藏了");
        article.setContent("手指画形式自由，操作简单，无论你有没有绘画基础，一样可以画出漂亮的创意画，今天小编与大家分享用指纹画的创意装饰画，一起动");
        //把article对象转换成json格式的字符串
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(article);
        System.out.println(json);
        //使用client对象把文档写入索引库
        client.prepareIndex("index_hello","article","3")
                .setSource(json, XContentType.JSON)
                .get();
    }
```

# 二、使用es客户端实现搜索

步骤：

 	1. 创建一个Client对象
 	2. 创建一个对象，可以使用QueryBuilders工具类创建QueryBuilder对象。//三种方法的区别就是使用哪种工具
 	3. 使用Client执行查询，
 	4. 得到查询的结果
 	5. 去查询结果的总记录数
 	6. 取查询结果列表
 	7. 关闭Client

```Java
//调用的查询方法
private void search(QueryBuilder queryBuilder) throws Exception{
    //执行查询
    SearchResponse searchResponse = client.prepareSearch("index_hello")
        .setTypes("article")
        .setQuery(queryBuilder)
        .get();
    //4. 得到查询的结果
    SearchHits searchHits = searchResponse.getHits();
    //5. 去查询结果的总记录数
    System.out.println("查询结果的总记录数：" + searchHits.getTotalHits());
    //遍历
    Iterator<SearchHit> iterator = searchHits.iterator();
    while (iterator.hasNext()){
        SearchHit searchHit = iterator.next();
        //打印文档对象，以json格式输出
        System.out.println(searchHit.getSourceAsString());
        //取文档的属性
        System.out.println("-------------文档的属性-----------");
        Map<String, Object> document = searchHit.getSource();
        System.out.println(document.get("id"));
        System.out.println(document.get("title"));
        System.out.println(document.get("content"));
    }
}
```



## 1. 根据 id 搜索

```Java
@Test
public void testSearchById() throws Exception{
    //1. 创建一个Client对象
    //2. 创建一个查询对象，可以使用QueryBuilders工具类创建QueryBuilder对象
    QueryBuilder queryBuilder = QueryBuilders.idsQuery().addIds("1","2");
    search(queryBuilder);
}
```



## 2. 根据 Term 查询（关键词）

```Java
@Test
public void testQueryByTerm() throws Exception{
    //1. 创建一个Client对象
    //2. 创建一个查询对象，可以使用QueryBuilders工具类创建QueryBuilder对象
    //参数1：要搜索的字段;参数2：要搜索的关键词
    QueryBuilder queryBuilder = QueryBuilders.termQuery("title","疫情");
    search(queryBuilder);
}
```



## 3. QueryString查询方式（带分析的查询）

```Java
@Test
public void testQueryStringQuery() throws Exception{
    //创建一个QueryBuilder对象
    QueryBuilder queryBuilder = QueryBuilders.queryStringQuery("美国政府宣布授课")//有这句话的任意关键词都遍历出来
        .defaultField("content");//设置默认搜索域
    search(queryBuilder);
}
```



## 4. 分页的处理

* 在Client对象中执行查询之前，设置分页信息，然后查询。

* 分页需要设置两个值，一个from、size
  * from：起始的行号，从0开始
  * size：每页显示的记录数

```Java
//执行查询
SearchResponse searchResponse = client.prepareSearch("index_hello")
    .setTypes("article")
    .setQuery(queryBuilder)
    //设置分页信息
    .setFrom(0)
    //每页显示行数，原始数据默认10
    .setSize(5)
    .get();
```



## 5. 查询结果高亮显示

1. 高亮的配置
   1. 设置高亮显示的字段
   2. 设置高亮显示的前缀
   3. 设置高亮显示的后缀

2. 在Client对象执行查询之前，设置高亮显示的信息
3. 遍历结果列表时可以从结果中取高亮结果

```Java
private void search(QueryBuilder queryBuilder,String highLightField) throws Exception{

    HighlightBuilder highlightBuilder = new HighlightBuilder();
    //高亮显示的字段
    highlightBuilder.field(highLightField);
    highlightBuilder.preTags("<em>");
    highlightBuilder.postTags("</em>");
    //执行查询
    SearchResponse searchResponse = client.prepareSearch("index_hello")
        .setTypes("article")
        .setQuery(queryBuilder)
        //设置分页信息
        .setFrom(0)
        //每页显示行数，原始数据默认10
        .setSize(5)
        //设置高亮信息
        .highlighter(highlightBuilder)
        .get();
    //4. 得到查询的结果
    SearchHits searchHits = searchResponse.getHits();
    //5. 去查询结果的总记录数
    System.out.println("查询结果的总记录数：" + searchHits.getTotalHits());
    //遍历
    Iterator<SearchHit> iterator = searchHits.iterator();
    while (iterator.hasNext()){
        SearchHit searchHit = iterator.next();
        //打印文档对象，以json格式输出
        System.out.println(searchHit.getSourceAsString());
        //取文档的属性
        System.out.println("-------------文档的属性-----------");
        Map<String, Object> document = searchHit.getSource();
        System.out.println(document.get("id"));
        System.out.println(document.get("title"));
        System.out.println(document.get("content"));
        System.out.println("****************高亮结果****************");
        Map<String, HighlightField> highlightFields = searchHit.getHighlightFields();
        System.out.println(highlightFields);
        //取tite高亮显示的结果
        HighlightField field = highlightFields.get(highLightField);
        Text[] fragments = field.getFragments();
        if (fragments != null){
            String title = fragments[0].toString();
            System.out.println(title);
        }
    }
}


@Test
public void testQueryStringQueryPage() throws Exception{
    //创建一个QueryBuilder对象
    QueryBuilder queryBuilder = QueryBuilders.queryStringQuery("手指可爱")
        .defaultField("title");//设置默认搜索域
    search(queryBuilder,"title");
}
```

# 三、Spring Data ElasticSearch 使用

## 3.1 Spring Data ElasticSearch简介

### 3.1.1 什么是Spring Data

​		Spring Data是一个用于简化数据库访问，并支持云服务的开源框架。其主要目标是使得对数据的访问变得方便快捷，并支持 map-reduce框架和云计算数据服务。 Spring Data可以极大的简化PA的写法，可以在几乎不用写实现的情况下，实现对数据的访问和操作。除了CRUD外，还包括如分页、排序等一些常用的功能。

### 3.1.2 什么是Spring Data ElasticSearch

​		Spring Data ElasticSearch 基于 spring data API 简化 elasticSearch操作，将原始操作elasticSearch的客户端API 进行封装 。Spring Data为Elasticsearch项目提供集成搜索引擎。Spring Data Elasticsearch POJO的关键功能区域为中心的模型与Elastichsearch交互文档和轻松地编写一个存储库数据访问层。

## 3.2 Spring Data ElasticSearch入门

### 3.2.1 工程搭建

   1. 创建一个java工程

   2. 把相关jar包添加到工程中，如果maven工程就添加坐标

   3. 创建一个spring的配置文件

      1. 配置TransportClient
      2. 配置包扫描器，扫描dao

      3. 配置elasticsearchTemplate对象，就是一个bean

      ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <beans xmlns="http://www.springframework.org/schema/beans"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:context="http://www.springframework.org/schema/context"
             xmlns:elasticsearch="http://www.springframework.org/schema/data/elasticsearch"
             xsi:schemaLocation="
      		http://www.springframework.org/schema/beans
      		http://www.springframework.org/schema/beans/spring-beans.xsd
      		http://www.springframework.org/schema/context
      		http://www.springframework.org/schema/context/spring-context.xsd
      		http://www.springframework.org/schema/data/elasticsearch
      		http://www.springframework.org/schema/data/elasticsearch/spring-elasticsearch-1.0.xsd
      		">
      
          <!-- elastic客户端对象的配置 -->
          <elasticsearch:transport-client id="esClient" cluster-name="my-elasticsearch"
                                          cluster-nodes="127.0.0.1:9301,127.0.0.1:9302,127.0.0.1:9303" />
      
          <!-- 配置包扫描器,扫描dao的接口 -->
          <elasticsearch:repositories base-package="com.shannanshuibei.es.repositories" />
      
          <!--  -->
          <bean id="elasticsearchTemplate" class="org.springframework.data.elasticsearch.core.ElasticsearchTemplate">
              <constructor-arg name="client" ref="esClient" />
          </bean>
      
      </beans>
      ```

### 3.2.2 管理索引库

   1. 创建一个entity类，其实就是一个javaBean(pojo)映射到一个文档上，需要添加一些注解进行标注。
   2. 创建一个Dao，是一个接口，需要继承ElasticSearchRepository接口。
   3. 编写测试代码。

   * entity包

     Article类

     ```java
     @Data
     @Document(indexName = "sdes_blog",type = "article")
     public class Article {
     
         @Id
         @Field(type = FieldType.Long,store = true)
         private long id;
         @Field(type = FieldType.text,store = true,analyzer = "ik_smart")
         private String title;
         @Field(type = FieldType.text,store = true,analyzer = "ik_smart")
         private String content;
     }
     ```

   * repositories包

     ArticleRepository接口

     ```Java
     public interface ArticleRepository extends ElasticsearchRepository<Article,Long> {
     }
     ```

   * 测试

     ```JAva
     @RunWith(SpringJUnit4ClassRunner.class)
     @ContextConfiguration("classpath:applicationContext.xml")
     public class SpringDataElasticSearchTest {
     
         @Autowired
         private ArticleRepository articleRepository;
         @Autowired
         private ElasticsearchTemplate template;
     
         @Test
         public void createIndex() throws Exception{
             //创建索引，并配置映射关系
             template.createIndex(Article.class);
             //配置映射关系
             //template.putMapping(Article.class);//存在索引，但是没有配置映射时 采用该方法
     
         }
     }
     ```

### 3.2.3 创建索引

   直接使用ElasticsearchTemplate对象的createIndex方法创建索引，并配置映射关系

   ```java
   @RunWith(SpringJUnit4ClassRunner.class)
   @ContextConfiguration("classpath:applicationContext.xml")
   public class SpringDataElasticSearchTest {
   
       @Autowired
       private ArticleRepository articleRepository;
       @Autowired
       private ElasticsearchTemplate template;
   
       @Test
       public void createIndex() throws Exception{
           //创建索引，并配置映射关系
           template.createIndex(Article.class);
           //配置映射关系
           //template.putMapping(Article.class);//存在索引，但是没有配置映射时 采用该方法
   
       }
   }
   ```

### 3.2.4 添加文档

   1. 创建一个Article对象
   2. 使用ArticleRepository对象想索引库中添加文档

   ```java
   @Test
   public void addDocument() throws Exception{
       //创建一个Article对象
       Article article = new Article();
       article.setId(1);
       article.setTitle("人之初，性本善;性相近，习相远。");
       article.setContent("苟不教 性乃迁. 教之道 贵以专 昔孟母 择邻处 子不学 断机杼. 窦燕山 有义方 教五子 名俱扬 养不教 父之过. 教不严 师之惰");
       //把文档写入索引库
       articleRepository.save(article);
   }
   ```

   ### 3.2.5 删除文档

1. 直接使用ArticleRepository对象的deleteById方法删除

   ```Java
   @Test
   public void deleteById() throws Exception{
       articleRepository.deleteById(1l);
   }
   ```

2. 全部删除

   ```java
   @Test
   public void deleteAll() throws Exception{
       articleRepository.deleteAll();
   }
   ```

### 3.2.6 修改文档

1. 修改文档，和添加文档相同，设置需要更新的文档的id，会进行删除并重新添加操作

### 3.2.7 查询索引库

1. 简单查询
   1. 直接使用ArticleRepository对象的findAll()、findById()方法查询

```java
@Test
public void findAll() throws Exception{
    Iterable<Article> articles = articleRepository.findAll();
    articles.forEach(a -> System.out.println(a));
}

@Test
public void findById() throws Exception{
    Optional<Article> optional = articleRepository.findById(10l);
    Article article = optional.get();
    System.out.println(article);
}
```

2. 自定义查询

* 需要根据SpringDataES的命名规则来命名，如果不设置分页信息，默认带分页，每页显示10条数据。

* 如果设置分页信息，应该在方法中添加一个参数Pageable

  ```java
  Pageable pageable = PageRequest.of(0,20);
  ```

  <u>注意：设置分页信息，默认是从0页开始</u>

  * 常用查询规则

|    关键字     |       命名规则        |            解释             |         示例          |
| :-----------: | :-------------------: | :-------------------------: | :-------------------: |
|      and      | findByField1AndField2 | 根据 Field1和Field2获得数据 | findByTitleAndContent |
|      or       | findByField1OrField2  | 根据 Field1或Field2获得数据 | findByTitleOrContent  |
|      is       |      findByField      |      根据Field获得数据      |      findByTitle      |
|      not      |    findByFieldNot     |   根据 Field获得补集数据    |    findByTitleNot     |
|    between    |  findByFieldBetween   |     获得指定范围的数据      |  findByPriceBetween   |
| lessThanEqual |  findByFieldLessThan  |  获得小于等于指定值的数据   |  findByPriceLessThan  |

* ArticleRepository接口

  ```java
  public interface ArticleRepository extends ElasticsearchRepository<Article,Long> {
      List<Article> findByTitle(String title);
      List<Article> findByTitleOrContent(String title,String content);
      //带分页
      List<Article> findByTitleOrContent(String title, String content, Pageable pageable);
  }
  ```

* 测试

  ```java
  @Test
  public void testFindByTitle() throws Exception{
      List<Article> list = articleRepository.findByTitle("人之初");
      list.stream().forEach(a-> System.out.println(a));
  }
  
  @Test
  public void testFindByTitleOrContent() throws Exception{
      List<Article> list = articleRepository.findByTitleOrContent("人之初","参考文章");
      list.stream().forEach(a-> System.out.println(a));
  }
  
  @Test
  public void testFindByTitleOrContentPage() throws Exception{//带分页
      Pageable pageable = PageRequest.of(0,20);
      List<Article> list = articleRepository.findByTitleOrContent("人之初","参考文章",pageable);
      list.stream().forEach(a-> System.out.println(a));
  }
  ```

  <u>注意：可以对搜索的内容先分词然后再进行查询。但每个词之间都是 and 的关系</u>

* 使用原生的查询条件查询

  NativeSearchQuery对象

  使用方法：

  1. 创建一个NativeSearchQuery对象
  2. 使用ElasticSearchTemplate对象执行查询
  3. 取查询结果

  ```Java
  @Test
  public void testNativeSearchQuery() throws Exception{
      //创建一个查询对象
      NativeSearchQuery query = new NativeSearchQueryBuilder()
          .withQuery(QueryBuilders.queryStringQuery("kibana创建索引模式时")
                     .defaultField("content"))
          .withPageable(PageRequest.of(0,15))
          .build();
      //执行查询
      List<Article> articles = template.queryForList(query, Article.class);
      articles.forEach(a->System.out.println(a));
  }
  ```

  