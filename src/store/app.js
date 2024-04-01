import { defineStore } from 'pinia'
import { convertImgUrl } from '@/utils'
import api from '@/api'

export const useAppStore = defineStore('app', {
  state: () => ({
    searchFlag: false,
    loginFlag: false,
    registerFlag: false,
    collapsed: false, // 侧边栏折叠（移动端）

    page_list: [], // 页面数据
    // TODO: 优化
    blogInfo: {
      article_count: 0,
      category_count: 0,
      tag_count: 0,
      view_count: 0,
      user_count: 0,
    },
    blog_config: {
      website_name: '欢迎来到我们的博客网站',
      website_author: 'Cheng',
      website_intro: '这是一个基于Vue3 + Vite2 + Pinia + Element Plus + TypeScript + Markdown的博客网站',
      website_avatar: '',
      weibsite_notice: '此网站在不断完善中，欢迎大家提出宝贵意见',
    },
    avatar: 'https://img.zcool.cn/community/01f0865d45230ba8012187f485a17b.jpg@1280w_1l_2o_100sh.jpg',

  }),
  getters: {
    isMobile: () => !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i),
    articleCount: state => state.blogInfo.article_count ?? 0,
    categoryCount: state => state.blogInfo.category_count ?? 0,
    tagCount: state => state.blogInfo.tag_count ?? 0,
    viewCount: state => state.blogInfo.view_count ?? 0,
    pageList: state => state.page_list ?? [],
    blogConfig: state => state.blog_config,
    websiteName: state => state.blog_config.website_name ?? '欢迎来到我们的博客网站',
  },
  actions: {
    setCollapsed(flag) { this.collapsed = flag },
    setLoginFlag(flag) { this.loginFlag = flag },
    setRegisterFlag(flag) { this.registerFlag = flag },
    setSearchFlag(flag) { this.searchFlag = flag },

    async getBlogInfo() {
      try {
        const resp = await api.getHomeData()
        if (resp.code === 0) {
          this.blogInfo = resp.data
          this.blogConfig = resp.data.blog_config
          // this.blog_config = { // 重写整个对象
          //   ...resp.data.blog_config,
          //   website_avatar: convertImgUrl(resp.data.blog_config.website_avatar),
          // }
        }
        else {
          return Promise.reject(resp)
        }
      }
      catch (err) {
        return Promise.reject(err)
      }
    },

    async getPageList() {
      const resp = await api.getPageList()
      if (resp.code === 0) {
        this.page_list = resp.data
        this.page_list?.forEach(e => (e.cover = convertImgUrl(e.cover)))
      }
    },
  },
})
