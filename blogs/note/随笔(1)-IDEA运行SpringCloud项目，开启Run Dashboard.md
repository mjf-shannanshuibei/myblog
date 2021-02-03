---
title: 随笔(1)-IDEA运行SpringCloud项目，开启Run Dashboard
date: 2021-2-2 19:24:00
tags:
 - 随笔
categories: 
 - 其他
author: 山南水北
---

# 开启RunDashboard后，启动多个服务展示

![image-20210111135011494](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20210111135011494.png)

# 开启方法

1. 打开该项目的`.idea`文件夹下的workspace.xml文件

![image-20210111135110075](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20210111135110075.png)

2. `Ctrl+F`搜索是否有`<component name="RunDashboard">`，没有则添加

   ```xml
   <component name="RunDashboard">
       <option name="configurationTypes">
         <set>
           <option value="SpringBootApplicationConfigurationType" />
         </set>
       </option>
       <option name="ruleStates">
         <list>
           <RuleState>
             <option name="name" value="ConfigurationTypeDashboardGroupingRule" />
           </RuleState>
           <RuleState>
             <option name="name" value="StatusDashboardGroupingRule" />
           </RuleState>
         </list>
       </option>
     </component>
   ```

3. 关闭项目，重新打开，启动项目

   ![image-20210111135306075](https://ivans-bucket.oss-cn-beijing.aliyuncs.com/typora/image-20210111135306075.png)