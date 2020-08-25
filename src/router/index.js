import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export default new Router({
  mode: "history",
  // base: "./",
  routes: [
    {
      path: "/",
      name: "Index",
      component: resolve => require(["../pages/index.vue"], resolve)
    },
    {
      path: "/out-order",
      name: "OutOrder",
      component: resolve => require(["../pages/make/out-order.vue"], resolve),
      meta: {title: "开具发票"}
    },
    {
      path: "/record",
      name: "Record",
      component: resolve => require(["../pages/invoice/list.vue"], resolve),
      meta: {title: "开票记录"}
    },
    {
      path: "/company/",
      name: "Company",
      component: resolve => require(["../pages/company/list.vue"], resolve),
      meta: {title: "抬头管理"}
    },
    {
      path: "/company/edit",
      name: "EditCompany",
      component: resolve => require(["../pages/company/edit.vue"], resolve)
    },
    {
      path: "/rule",
      name: "Rule",
      component: resolve => require(["../pages/rule.vue"], resolve),
      meta: {title: "开票规则"}
    },
    {
      path: "/make/success",
      name: "MakeSuccess",
      component: resolve => require(["../pages/make/success.vue"], resolve)
    },
    {
      path: "/invoice/detail",
      name: "InvoiceDetail",
      component: resolve => require(["../pages/invoice/detail.vue"], resolve)
    },
    {
      path: "/invoice/out-order",
      name: "InvoiceOutOrder",
      component: resolve => require(["../pages/invoice/out-order.vue"], resolve)
    },
    {
      path: "/error",
      name: "Error",
      component: resolve => require(["../pages/error.vue"], resolve)
    },
    {
      path: "/addProduct",
      name: "AddProduct",
      component: resolve => require(["../pages/product.vue"], resolve)
    },
    {
      path: "/single-order",
      name: "SingleOrder",
      component: resolve => require(["../pages/make/single-order.vue"], resolve)
    },
    {
      path: "/single-query-order",
      name: "SingleQueryOrder",
      component: resolve => require(["../pages/make/single-query-order.vue"], resolve)
    },
    {
      path: "/single-order-success",
      name: "singleOrderSuccess",
      component: resolve =>
        require(["../pages/make/single-order-success.vue"], resolve)
    },
    {
      path: "/category",
      name: "Category",
      component: resolve => require(["../pages/make/category.vue"], resolve)
    },
    {
      path: "/product",
      name: "Product",
      component: resolve => require(["../pages/make/product.vue"], resolve)
    },
    {
      path: "/merge-order",
      name: "MergeOrder",
      component: resolve => require(["../pages/make/merge-order.vue"], resolve)
    }
  ]
});
