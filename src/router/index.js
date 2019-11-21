import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: './',
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve => require(['../pages/index.vue'], resolve)
    },
    {
      path: '/out-order',
      name: 'out-order',
      component: resolve => require(['../pages/make/out-order.vue'], resolve),
      meta: {title: '开具发票'}
    },
    {
      path: '/record',
      name: 'record',
      component: resolve => require(['../pages/invoice/list.vue'], resolve),
      meta: {title: '开票记录'}
    },
    {
      path: '/company/',
      name: 'company',
      component: resolve => require(['../pages/company/list.vue'], resolve),
      meta: {title: '抬头管理'}
    },
    {
      path: '/address/',
      name: 'address',
      component: resolve => require(['../pages/company/edit.vue'], resolve)
    },
    {
      path: '/rule',
      name: 'rule',
      component: resolve => require(['../pages/rule.vue'], resolve),
      meta: {title: '开票规则'}
    },
    {
      path: '/make/success',
      name: 'make-success',
      component: resolve => require(['../pages/make/success.vue'], resolve)
    },
    {
      path: '/invoice/detail',
      name: 'invoiceDetail',
      component: resolve => require(['../pages/invoice/detail.vue'], resolve)
    },
    {
      path: '/out-order',
      name: 'out-order',
      component: resolve => require(['../pages/invoice/out-order.vue'], resolve)
    },
    {
      path: '/error',
      name: 'error',
      component: resolve => require(['../pages/error.vue'], resolve)
    },
    {
      path: '/addProduct',
      name: 'addProduct',
      component: resolve => require(['../pages/product.vue'], resolve)
    },
    {
      path: '/single-order',
      name: 'singleOrder',
      component: resolve => require(['../pages/make/single-order.vue'], resolve)
    },
    {
      path: '/single-order-success',
      name: 'singleOrderSuccess',
      component: resolve => require(['../pages/make/single-order-success.vue'], resolve)
    },
    {
      path: '/category',
      name: 'category',
      component: resolve => require(['../pages/make/category.vue'], resolve)
    },
    {
      path: '/product',
      name: 'product',
      component: resolve => require(['../pages/make/product.vue'], resolve)
    },
    {
      path: '/merge-order',
      name: 'mergeOrder',
      component: resolve => require(['../pages/make/merge-order.vue'], resolve)
    }
  ]
})
