module.exports = {
  title: "山南水北的个人博客",
  description: '愿时光能缓，愿故人不散！',
  dest: 'public',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  themeConfig: {
    // 修改默认样式
    locales: {
      '/': {
        recoLocales: {
          homeBlog: {
            article: '文章', // 默认 文章
            tag: '标签', // 默认 标签
            category: '类别', // 默认 分类
            friendLink: '友链' // 默认 友情链接
          },
          pagation: {
            prev: '上一页',
            next: '下一页',
            go: '前往',
            jump: '跳转至'
          }
        }
      }
    },
    // 评论功能 valine配置，详情看vuepress-theme-reco官网评论功能配置
    // valineConfig: {
    //   appId: 'your appId',// your appId
    //   appKey: 'your appKey', // your appKey
    // },
    valineConfig: {
      appId: 'bRvjLHpEMJlinzfnqpg8kEkS-gzGzoHsz',// your appId
      appKey: 'kfr8lg7VrVvzJayWPxowTG1k', // your appKey
    },

    nav: [
      { text: '首页', link: '/', icon: 'reco-home' },
      { text: '时间线', link: '/timeline/', icon: 'reco-date' },
      { text: 'Docs', 
        icon: 'reco-message',
        items: [
          { text: 'vuepress-reco', link: '/docs/theme-reco/' }
        ]
      },
      { text: '友链', 
        icon: 'reco-message',
        items: [
          { text: 'GitHub', link: 'https://github.com/mjf-shannanshuibei', icon: 'reco-github' },
          { text: '码云', link: 'https://gitee.com/ivansgitee', icon: 'reco-mayun' },
          { text: '白', link: 'http://106.15.201.82/', icon: 'reco-coding' },
          { text: 'DDD', link: 'http://47.99.206.142:8081/', icon: 'reco-coding' },
          { text: '山南水北', link: 'http://47.98.42.191:82/', icon: 'reco-coding' }
        ]
      }
    ],
    sidebar: {
      '/docs/theme-reco/': [
        '',
        'theme',
        'plugin',
        'api'
      ]
    },  
    type: 'blog',
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: '分类' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: '标签' // 默认 “标签”
      }
    },
    // 友链
    friendLink: [
      {
        title: '白',
        desc: 'Walk into my little station.',
        email: '377092613@qq.com',
        logo: '/friendLink/friendLink-bai.png',
        link: 'http://106.15.201.82/'
      },
      {
        title: 'DDD',
        desc: 'Walk into my little station.',
        email: '190851047@qq.com',
        logo: '/friendLink/friendLink-ddd.png',
        link: 'http://47.99.206.142:8081/'
      },
      {
        title: '午后南杂',
        desc: 'Enjoy when you can, and endure when you must.',
        email: '1156743527@qq.com',
        logo: '/friendLink/firendLink-reco.png',
        link: 'https://www.recoluan.com'
      },
      {
        title: 'springboot搭建的个人博客',
        desc: 'Enjoy the convenience of the Internet...',
        avatar: "logo.png",
        link: 'http://47.98.42.191:82/'
      },
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://vuepress-theme-reco.recoluan.com'
      },
    ],
    logo: '/logo.jpg',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    // sidebar: 'auto',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: '山南水北',
    // 作者头像
    authorAvatar: '/avatar.png',
    // 备案号
    record: '网站信息 - 苏ICP备2020053803号-1 - 网站内容 - -博客/个人空间',
    recordLink: 'https://beian.miit.gov.cn/#/Integrated/index',
    // 项目开始时间
    startYear: '2021'
    /**
     * 密钥 (if your blog is private)
     */

    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },

    /**
     * valine 设置 (if you need valine comment )
     */

    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
  },
  markdown: {
    lineNumbers: true
  }
}  
