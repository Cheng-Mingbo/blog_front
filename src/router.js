import { createRouter, createWebHistory } from 'vue-router'

import NProgress from 'nprogress'
import './styles/nprogress.css'
import axios from 'axios'
import { useUserStore } from '@/store/user'

const basicRoutes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
  {
    name: 'Manage',
    path: '/manage',
  },
  {
    name: 'Article',
    path: '/article/:id',
    component: () => import('@/views/article/detail/index.vue'),
  },
  {
    name: 'Archive',
    path: '/archives',
    component: () => import('@/views/discover/archive/index.vue'),
    meta: {
      title: '归档',
    },
  },
  {
    name: 'Category',
    path: '/categories',
    component: () => import('@/views/discover/category/index.vue'),
    meta: {
      title: '分类',
    },
  },
  {
    name: 'CategoryArticles',
    path: '/categories/:categoryId',
    component: () => import('@/views/article/list/index.vue'),
    meta: {
      title: '分类',
    },
  },
  {
    name: 'Tag',
    path: '/tags',
    component: () => import('@/views/discover/tag/index.vue'),
    meta: {
      title: '标签',
    },
  },
  {
    name: 'TagArticles',
    path: '/tags/:tagId',
    component: () => import('@/views/article/list/index.vue'),
    meta: {
      title: '标签',
    },
  },
  {
    name: 'Album',
    path: '/albums',
    component: () => import('@/views/entertainment/album/index.vue'),
    meta: {
      title: '相册',
    },
  },
  {
    name: 'Link',
    path: '/links',
    component: () => import('@/views/link/index.vue'),
    meta: {
      title: '友情链接',
    },
  },
  {
    name: 'About',
    path: '/about',
    component: () => import('@/views/about/index.vue'),
    meta: {
      title: '关于我',
    },
  },
  // {
  //   name: 'MessageBoard',
  //   path: '/message',
  //   component: () => import('@/views/home/components/chat.vue'),
  //   meta: {
  //     title: '留言',
  //   },
  // },
  {
    name: 'User',
    path: '/user',
    component: () => import('@/views/user/index.vue'),
    meta: {
      title: '个人中心',
    },
  },

  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
  },
  // 无匹配路由跳转 404
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    isHidden: true,
  },
]

export const router = createRouter({
  history: createWebHistory('/'),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.afterEach((to) => {
  document.title = `${to.meta?.title ?? import.meta.env.VITE_APP_TITLE}`
})

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  for (let i = 0; i < 5; i++) NProgress.inc()
  setTimeout(() => NProgress.done(), 300)
  next()
})

// router.beforeEach((to, from, next) => {
//   if (to.path === '/manage') {
//     // const { token } = useUserStore()
//     window.open('http://localhost:3000/home', '_blank') // 在新窗口打开项目 B
//     // const url = `http://localhost:3000/home?token=${token}`
//     // window.open(url, '_blank')
//     next(false)
//   }
//   next()
// })

router.beforeEach((to, from, next) => {
  if (to.path === '/manage') {
    const { token } = useUserStore()
    axios.get('http://localhost:8765/api/home', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((resp) => {
      if (resp.status === 200) {
        window.open(`http://localhost:3000/home`, '_blank')
      }
    }).catch((err) => {
      console.log(err)
    })
    next(false)
  }
  next()
})
