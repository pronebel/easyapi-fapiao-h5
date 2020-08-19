<template>
  <div style="padding: 0 10px;height: 100%;">
    <Header @headBack="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
    <div class="no-record-con" v-show="isNull">
      <p><img src="../../assets/images/no-record_03.png" alt=""/></p>
      <p class="record-text">暂时还没有记录！</p>
    </div>
    <div class="page-checklist header-d" style="margin-top: 10px;height: 100%;overflow:scroll!important; ">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10"
        :auto-fill="false"
      >
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
                  <span>订单编号：</span>
                  <span>{{ item.no }}</span>
                </p>
                <p class="name">
                  <!-- <span>产品名称：</span> -->
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
      </div>
      <div class="page-infinite-loading">
        <p v-if="loading">{{ loadMoreText }}</p>
        <p v-if="noMore">没有更多数据了</p>
      </div>
    </div>
    <div class="mint-footer" v-show="isNull == false">
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
          <!--<p style="position: relative;top: 0;left: 0">开票金额不得低于90元</p>-->
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
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import Header from "../../components/header.vue";

  export default {
    name: "out-order",
    components: {
      Header: Header
    },
    data() {
      return {
        totalPages: "",
        loadMoreText: "加载中...",
        busy: false, //下拉加载
        loading: false, //下拉加载
        isNull: false,
        noMore: false,
        page: 0,
        size: 10,
        headerTitle: "开票",
        arr: [],
        invoiceList: [],
        selectList: [],
        checkItem: [],
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
        this.selectList = this.checkItem.filter(function(satus, index, checkItem) {
          return checkItem[index].satus === true;
        });
        this.selectList.length === this.checkItem.length ? (this.allCheck = true) : (this.allCheck = false);
      },
      getOutOrderList() {
        this.busy = true;
        this.$ajax.get("/out-orders", {
          params: {
            size: this.size,
            page: this.page,
            accessToken: this.accessToken,
            username: this.$store.state.username,
            state: 0
          }
        }).then(res => {
          this.totalPages = res.data.totalPages;
          if (res.data.code !== 0) {
            let data = res.data.content;
            this.isNull = false;
            for (var v of data) {
              v.satus = false;
            }
            console.log(this.page);
            this.checkItem = data;
            console.log(data);
          } else {
            this.loadMoreText = "";
            this.noMore = true;
          }
        }).catch(error => {
          console.log(error);
        });
        this.loading = false;
        this.busy = false;
      },
      //上拉加载
      loadMore() {
        console.log("我被执行了")
        this.busy = true;
        this.loading = true;
        this.noMore = false;
        this.page += 1;
        this.allCheck = false;
        console.log(this.page);
        if (this.page <= this.totalPages) {
          this.loading = true;
          this.busy = false;
          this.checkItem = this.checkItem.concat();
          console.log(this.checkItem);
        } else {
          this.loadMoreText = "";
          this.loading = true;
          this.loading = false;
          this.noMore = true;
        }
        // for (var i = 0; i < this.arr.length; i++) {
        //   this.checkItem.push(this.arr[i]);
        // }
        this.getOutOrderList();
      },
      //全选
      change: function() {
        let _this = this;
        _this.checkItem.forEach(function(v) {
          return (v.satus = _this.allCheck);
        });
        if (_this.allCheck === true) {
          this.selectList = _this.checkItem;
        } else {
          this.selectList = [];
        }
      },
      //单选勾住后全选
      itemChange: function() {
        this.selectList = this.checkItem.filter(function(v) {
          return v.satus === true;
        });
        this.selectList.length === this.checkItem.length ? (this.allCheck = true) : (this.allCheck = false);
      },
      goElectronicInvoice() {
        localStorage.setItem("tot", this.totalPrice);
        localStorage.setItem("seleted", JSON.stringify(this.selectList));
        this.$router.push({ path: "/merge-order" });
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
      totalPrice: function() {
        let totalPrice = 0;
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
      this.getOutOrderList();
    },
  };
</script>
<style scoped>
  @import 'make.css';
</style>
