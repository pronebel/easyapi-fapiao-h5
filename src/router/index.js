import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Index",
      component: resolve => require(["../pages/index.vue"], resolve),
      meta: {title: "发票管理", keepAlive: true}
    },
    {
      path: "/rule",
      name: "Rule",
      component: resolve => require(["../pages/rule.vue"], resolve),
      meta: {title: "开票规则", keepAlive: false}
    },
    {
      path: "/product",
      name: "Product",
      component: resolve => require(["../pages/make/modules/product.vue"], resolve),
      meta: {title: "选择商品", keepAlive: false}
    },
    {
      path: "/company/",
      name: "Company",
      component: resolve => require(["../pages/company/list.vue"], resolve),
      meta: {title: "抬头管理", keepAlive: false}
    },
    {
      path: "/company/edit",
      name: "EditCompany",
      component: resolve => require(["../pages/company/edit.vue"], resolve),
      meta: {title: "编辑抬头", keepAlive: false}
    },
    {
      path: "/address/",
      name: "Address",
      component: resolve => require(["../pages/address/list.vue"], resolve),
      meta: {title: "地址管理", keepAlive: false}
    },
    {
      path: "/address/edit",
      name: "EditAddress",
      component: resolve => require(["../pages/address/edit.vue"], resolve),
      meta: {title: "编辑地址", keepAlive: false}
    },
    {
      path: "/out-order",
      name: "OutOrder",
      component: resolve => require(["../pages/out-order/list.vue"], resolve),
      meta: {title: "选择订单", keepAlive: false}
    },
    {
      path: "/make/single-order",
      name: "SingleOrder",
      component: resolve => require(["../pages/make/single-order.vue"], resolve),
      meta: {title: "开具发票", keepAlive: false}
    },
    {
      path: "/make/single-query-order",
      name: "SingleQueryOrder",
      component: resolve => require(["../pages/make/single-query-order.vue"], resolve),
      meta: {title: "开具发票", keepAlive: false}
    },
    {
      path: "/make/single-order-success",
      name: "SingleOrderSuccess",
      component: resolve => require(["../pages/make/single-order-success.vue"], resolve),
      meta: {title: "提交成功", keepAlive: false}
    },
    {
      path: "/make/category",
      name: "MakeCategory",
      component: resolve => require(["../pages/make/category.vue"], resolve),
      meta: {title: "开具发票", keepAlive: false}
    },
    {
      path: "/make/category-success",
      name: "MakeCategorySuccess",
      component: resolve => require(["../pages/make/category-success.vue"], resolve),
      meta: {title: "提交成功", keepAlive: false}
    },
    {
      path: "/make/product",
      name: "MakeProduct",
      component: resolve => require(["../pages/make/product.vue"], resolve),
      meta: {title: "开具发票", keepAlive: false}
    },
    {
      path: "/make/merge-order",
      name: "MergeOrder",
      component: resolve => require(["../pages/make/merge-order.vue"], resolve),
      meta: {title: "开具发票", keepAlive: false}
    },
    {
      path: "/make/success",
      name: "MakeSuccess",
      component: resolve => require(["../pages/make/success.vue"], resolve),
      meta: {title: "提交成功", keepAlive: false}
    },
    {
      path: "/invoice/",
      name: "Invoice",
      component: resolve => require(["../pages/invoice/list.vue"], resolve),
      meta: {title: "开票记录", keepAlive: true}
    },
    {
      path: "/invoice/detail",
      name: "InvoiceDetail",
      component: resolve => require(["../pages/invoice/detail.vue"], resolve),
      meta: {title: "发票详情", keepAlive: false}
    },
    {
      path: "/invoice/out-order",
      name: "InvoiceOutOrder",
      component: resolve => require(["../pages/invoice/out-order.vue"], resolve),
      meta: {title: "订单明细", keepAlive: false}
    },
    {
      path: "/error",
      name: "Error",
      component: resolve => require(["../pages/error.vue"], resolve),
      meta: {title: "错误", keepAlive: false}
    }
  ]
});



