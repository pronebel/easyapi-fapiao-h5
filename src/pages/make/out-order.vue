<template>
  <div style="padding: 0 10px;height: 100%;">
    <Header @headBack="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
    <div class="no-record-con" v-show="checkItem==null">
      <p><img src="../../assets/images/no-record_03.png" alt=""/></p>
      <p class="record-text">暂时还没有记录！</p>
    </div>
    <div class="page-checklist header-d">
      <div
        class="mint-checklist page-part"
        v-for="(item, index) in checkItem"
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
              <p class="num">
                <span>订单号：</span>
                <span>{{ item.no }}</span>
              </p>
              <p class="name">
                <span v-if="item.fields">{{Object.values(JSON.parse(item.fields))[0]}}</span>
              </p>
              <p>
                <span class="time">{{ item.orderTime }}</span>
                <span class="price">￥{{ item.price }}</span>
              </p>
            </div>
          </div>
        </a>
      </div>
      <div class="page-infinite-loading">
        <p>{{ loadMoreText }}</p>
      </div>

    </div>
    <div class="mint-footer" v-show="checkItem!=null">
      <label class="mint-checklist-label" style="margin-left: 12px;">
        <div style="display: inline">
          <span class="mint-checkbox">
          <input
            type="checkbox"
            class="mint-checkbox-input"
            @change="change()"
            v-model="allCheck"
          />
          <span class="mint-checkbox-core"></span>
        </span>
          <span style="margin-left: 9px;">本页全选</span>
          <span style="margin-left:15%">合计：</span>
          <span class="price">￥{{ totalPrice }}</span>
        </div>
        <div style="display: inline;height: 50px;width: 50px">
          <mt-button
            class="next-button next-button-to"
            @click="goElectronicInvoice"
            :disabled="selectList.length < 1"
          >下一步
          </mt-button
          >
        </div>
      </label>
    </div>
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
  import Vue from 'vue';
  import {List} from 'vant';

  Vue.use(List);

  export default {
    name: "out-order",
    components: {
      Header: Header
    },
    data() {
      return {
        loadMoreText: "加载中...",
        loading: false, //下拉加载
        page: {
          page: 0,
          size: 10,
          total: 0,
        },
        headerTitle: "开票",
        arr: [],
        invoiceList: [],
        selectList: [],
        checkItem: null,
        allCheck: false,
        accessToken: ""
      };
    },

    methods: {
      goBack() {
        history.go(-1);
      },
      checked(index) {
        if (this.checkItem[index].satus === true) {
          this.checkItem[index].satus = false;
        } else {
          this.checkItem[index].satus = true;
        }
        this.selectList = this.checkItem.filter(function (satus, index, checkItem) {
          return checkItem[index].satus === true;
        });
        this.selectList.length === this.checkItem.length ? (this.allCheck = true) : (this.allCheck = false);
      },
      getOutOrderList() {
        this.$ajax.get("/out-orders", {
          params: {
            size: this.page.size,
            page: this.page.page,
            accessToken: this.accessToken,
            username: this.$store.state.username,
            state: 0,
            sort: "addTime,desc"
          }
        }).then(res => {
          if (res.data.code === 1) {
            let data = res.data.content;
            this.page.total = res.data.totalPages;
            for (let v of data) {
              v.satus = false;
            }
            if (this.checkItem == null) {
              this.checkItem = data;
            }
            else {
              this.checkItem = this.checkItem.concat(data)
            }
          } else {
            this.checkItem = []
            this.loadMoreText = "";
          }
          this.loading = false;
        }).catch(error => {
          this.loading = false;
          console.log(error);
        });
      },
      //上拉加载
      loadMore() {
        this.loading = true;
        this.allCheck = false;
        if (this.page.total != 0 && this.page.page > 0 && this.page.page >= this.page.total) {
          this.loadMoreText = "没有更多数据了";
          return;
        }
        console.log(this.page.total, this.page.page)
        this.getOutOrderList();
        this.page.page++;
      },
      //全选
      change: function () {
        let _this = this;
        _this.checkItem.forEach(function (v) {
          return (v.satus = _this.allCheck);
        });
        if (_this.allCheck === true) {
          this.selectList = _this.checkItem;
        } else {
          this.selectList = [];
        }
      },
      //单选勾住后全选
      itemChange: function () {
        this.selectList = this.checkItem.filter(function (v) {
          return v.satus === true;
        });
        this.selectList.length === this.checkItem.length ? (this.allCheck = true) : (this.allCheck = false);
      },
      goElectronicInvoice() {
        localStorage.setItem("tot", this.totalPrice);
        localStorage.setItem("seleted", JSON.stringify(this.selectList));
        this.$router.push({path: "/merge-order"});
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
        if (this.checkItem == null) {
          return totalPrice;
        }
        for (let i = 0; i < this.checkItem.length; i++) {
          let item = this.checkItem[i];
          if (item.satus === true) {
            totalPrice += item.price;
          }
        }
        //千位分隔符正则
        return totalPrice.toFixed(2);
      }
    },
    created() {
      this.accessToken = localStorage.getItem("accessToken");
    },
    mounted() {
    },
  };
</script>
<style scoped>
  @import 'make.css';
</style>
