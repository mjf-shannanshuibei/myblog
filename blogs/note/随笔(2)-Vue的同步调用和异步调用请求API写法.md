---
title: 随笔(2)-Vue的同步调用和异步调用请求API写法
date: 2021-2-3 21:32:00
tags:
 - 随笔
categories: 
 - 其他
author: 山南水北
---

## 异步调用

```javascript
export default {
    async asyncData(page) {
    return teacherApi.getById(page.route.params.id).then(response => {
      return {
        teacher: response.data.teacher,
        courseList: response.data.courseList
      }
    })
  }
}
```

## 同步调用

```javascript
export default {
    asyncData(page) {
       const response = await teacherApi.getById(page.route.params.id)
       return {
           teacher: response.data.teacher,
           courseList: response.data.courseList
       } 
    }
}
```

> 使用上面的异步调用的方法，无法做到获取两个Api的值，而使用同步调用的写法，可以解决这个问题
>
> ```javascript
> export default {
>     asyncData(page) {
>        const response = await teacherApi.getById(page.route.params.id)
>        const response1 = await courseApi.getById(page.route.params.id)
>        return {
>            teacher: response.data.teacher,
>            courseList: response1.data.courseList
>        } 
>     }
> }
> ```
>
> 在使用`Nuxt.js`中，因为是采用将后端数据渲染好再传给前端页面展示，因此都采用上面的同步写法，没必要使用异步处理。