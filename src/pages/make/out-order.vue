<template>
  <div style="padding: 0 10px;height: 100%;">
    <Header @head-back="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
    <div class="page-checklist header-d">
      <div style="margin-bottom: 30px;" v-if="minusPage.total>0">
        <p class="pd-left">有{{minusPage.total}}笔欠费金额，欠费金额小计：¥{{minusAmount}}元</p>
        <div
          class="mint-checklist page-part"
          v-for="(item, index) in minusOutOrderList"
          :key="index"
        >
          <a class="mint-cell">
            <div class="mint-cell-wrapper order-con">
              <div class="mint-cell-title order-left">
                <label class="mint-checklist-label">
                  <span class="mint-checkbox">
                    <input
                      type="checkbox"
                      checked='checked'
                      disabled="disabled"
                      class="mint-checkbox-input"
                      v-model="item.satus"
                      id
                    />
                    <span class="mint-checkbox-core"></span>
                  </span>
                </label>
              </div>
              <div class="order-right" @click="checked(index)">
                <van-cell-group :border="false">
                  <van-cell :title="'订单号：' + item.no" :border="false" class="orderNum"/>
                  <van-cell v-if="item.fields" :title="Object.values(JSON.parse(item.fields))[0]" :value="item.noY"
                            :border="false"/>
                  <van-cell :title="item.orderTime" class="price" :value="'￥' + item.price" :border="false"/>
                </van-cell-group>
              </div>
              <div class="clear"></div>
            </div>
          </a>
        </div>
        <div v-if="showMinus" class="page-infinite-loading minusBox">
          <p>没有欠费订单</p>
        </div>
      </div>
      <div class="no-record-con" v-show="empty">
        <van-empty image="search" description="暂无订单数据"/>
      </div>
      <div
        class="mint-checklist page-part"
        v-for="(item, index) in outOrderList"
        :key="index"
      >
        <a class="mint-cell">
          <div class="mint-cell-wrapper order-con">
            <div class="mint-cell-title order-left">
              <label class="mint-checklist-label">
                  <span class="mint-checkbox">
                    <input
                      type="checkbox"
                      class="mint-checkbox-input"
                      v-model="item.satus"
                      @change="itemChange()"
                      id
                    />
                    <span class="mint-checkbox-core"></span>
                  </span>
              </label>
            </div>
            <div class="order-right" @click="checked(index)">
              <van-cell-group :border="false">
                <van-cell :title="'订单号：' + item.no" :border="false" class="orderNum"/>
                <van-cell v-if="item.fields" :title="Object.values(JSON.parse(item.fields))[0]" :value="item.noY"
                          :border="false"/>
                <van-cell :title="item.orderTime" class="price" :value="'￥' + item.price" :border="false"/>
              </van-cell-group>
            </div>
            <div class="clear"></div>
          </div>
        </a>
      </div>
      <div class="page-infinite-loading">
        <p>{{ loadMoreText }}</p>
      </div>
    </div>
    <div class="mint-footer" v-show="outOrderList.length>0">
      <van-submit-bar :price="totalPrice*100" button-text="下一步" :disabled="selectList.length < 1"
                      button-color="#1989fa" @submit="goElectronicInvoice">
        <van-checkbox @change="change()" v-model="allCheck">本页全选</van-checkbox>
        <template #tip>
          最低开票金额{{minPrice}}元
        </template>
      </van-submit-bar>
    </div>
    <div class="clear"></div>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="0"
    >
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import Header from "../../components/header.vue";
  import {getOutOrderList} from "../../api/out-order";
  import {getShop} from "../../api/shop";
  import Vue from "vue";
  import {List} from "vant";
  import axios from "axios";

  Vue.use(List);

  export default {
    name: "InvoiceOutOrder",
    components: {
      Header: Header
    },
    data() {
      return {
        loadMoreText: "加载中...",
        showMinus: false,
        loading: false, //下拉加载
        empty: false,//是否显示空页面
        minusPage: {
          page: 0,
          size: 10,
          total: 0
        },
        minusAmount: 0,
        page: {
          page: 0,
          size: 10,
          total: 0
        },
        headerTitle: "开票",
        selectList: [],
        outOrderList: [],//外部订单列表
        minusOutOrderList: [],//欠费订单列表
        allCheck: false,//全部选择
        minPrice: 0.01,//最小开票金额
        accessToken: "",
        orderType: ""
      };
    },

    methods: {
      goBack() {
        history.go(-1);
      },
      checked(index) {
        if (this.outOrderList[index].satus === true) {
          this.outOrderList[index].satus = false;
        } else {
          this.outOrderList[index].satus = true;
        }
        this.selectList = this.outOrderList.filter(function (satus, index, outOrderList) {
          return outOrderList[index].satus === true;
        });
        this.selectList.length === this.outOrderList.length ? (this.allCheck = true) : (this.allCheck = false);
      },
      getOutOrderList() {
        this.loading = true;
        getOutOrderList({type: this.orderType}, this.page).then(res => {
          if (res.data.code === 1) {
            let data = res.data.content;
            this.page.total = res.data.totalPages;
            for (let v of data) {
              v.satus = false;
            }
            if (this.outOrderList == null) {
              this.outOrderList = data;
            } else {
              this.outOrderList = this.outOrderList.concat(data);
            }
            this.loading = false;
            axios({
              method: "GET",
              url: "/out-orders",
              params: {
                maxPrice: -0.01,
                accessToken: localStorage.getItem("accessToken"),
                type: this.orderType,
                state: 0,
                page: this.minusPage.page - 1,
                size: res.data.totalElements
              }
            }).then(res => {
              if (res.data.code == 1) {
                this.minusOutOrderList = res.data.content;
                for (let v of res.data.content) {
                  this.minusAmount += Number(v.price);
                }
              } else {
                this.minusOutOrderList = [];
                this.showMinus = true;
                this.minusPage.total = 0;
              }
            });
          } else {
            this.empty = true;
            this.loading = true;
            this.outOrderList = [];
            this.loadMoreText = "";
          }
        }).catch(error => {
          this.loading = false;
          console.log(error);
        });
      },
      //上拉加载
      loadMore() {
        this.allCheck = false;
        if (this.page.total != 0 && this.page.page > 0 && this.page.page >= this.page.total) {
          this.loadMoreText = "没有更多数据了";
          return;
        }
        this.getOutOrderList();
        this.page.page++;
      },
      //全选
      change: function () {
        let _this = this;
        _this.outOrderList.forEach(function (v) {
          return (v.satus = _this.allCheck);
        });
        if (_this.allCheck === true) {
          this.selectList = _this.outOrderList;
        } else {
          this.selectList = [];
        }
      },
      //单选勾住后全选
      itemChange: function () {
        this.selectList = this.outOrderList.filter(function (v) {
          return v.satus === true;
        });
        this.selectList.length === this.outOrderList.length ? (this.allCheck = true) : (this.allCheck = false);
      },
      goElectronicInvoice() {
        console.log(this.selectList);
        localStorage.setItem("tot", this.totalPrice);
        localStorage.setItem("seleted", JSON.stringify(this.selectList));
        this.$router.push({path: "/make/merge-order"});
      },
      //获取发票类型
      getShop() {
        getShop().then(res => {
          this.minPrice = res.data.content.minPrice;
        }).catch(error => {
          console.log(error);
        });
      }
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      },
      ...mapGetters([
        "sidebar"
      ]),
      //计算总价
      totalPrice: function () {
        let totalPrice = 0;
        if (this.outOrderList.length == 0) {
          return totalPrice;
        }
        for (let i = 0; i < this.outOrderList.length; i++) {
          let item = this.outOrderList[i];
          if (item.satus === true) {
            totalPrice += item.price;
          }
        }
        return (totalPrice - this.minusAmount).toFixed(2);
      }
    },
    created() {
      this.accessToken = localStorage.getItem("accessToken");
      this.orderType = this.$route.query.orderType;
      localStorage.setItem("orderType", this.orderType);
    },
    mounted() {
      this.getShop();
    }
  };
</script>
<style scoped>
  @import 'make.css';
</style>
