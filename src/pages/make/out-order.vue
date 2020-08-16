<template>
  <div>
    <Header @headBack="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
    <div class="no-record-con" v-show="isNull">
      <p><img src="../../assets/images/no-record_03.png" alt=""/></p>
      <p class="record-text">暂时还没有记录！</p>
    </div>
    <div class="page-checklist header-d" style="margin-top: 60px">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="50"
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
        <p v-if="loading2">{{ loadMoreText }}</p>
      </div>
    </div>
    <div class="mint-footer" v-show="isNull == false">
      <label class="mint-checklist-label" style="margin-left: 12px;">
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
        <span class="price">￥{{ pricetotale }}</span>
        <!--<button class="next-button">下一步</button>-->
        <mt-button
          class="next-button next-button-to"
          @click="goElectronicInvoice"
          :disabled="seletedList.length < 1"
        >下一步
        </mt-button
        >
      </label>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Header from "../../components/header.vue";

  export default {
    name: "out-order",
    components: {
      Header: Header,
    },
    data() {
      return {
        loadMoreText: "加载中...",
        loading: false, //下拉加载
        loading2: false, //下拉加载
        // loadingList: true, //列表加载
        isNull: false,
        page: 0,
        size: 4,
        headerTitle: "开票",
        invoiceList: [],
        seletedList: [],
        checkItem: [],
        allCheck: false,
        tatol: 0,
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
        this.seletedList = this.checkItem.filter(function (satus, index, checkItem) {
          return checkItem[index].satus === true;
        });

        this.seletedList.length === this.checkItem.length ? (this.allCheck = true) : (this.allCheck = false);
      },
      //上拉加载
      loadMore() {
        this.loading = true;
        this.loading2 = true;
        this.size++;
        this.allCheck = false;
        this.getOutOrderList();
      },
      getOutOrderList() {
        this.$ajax.get("/out-orders", {
          params: {
            size: this.size,
            accessToken: this.accessToken,
            username: this.$store.state.username,
            state: 0
          }
        }).then(res => {
          if (res.data.code !== 0) {
            var data = res.data.content;
            this.isNull = false;
            for (var v of data) {
              v.satus = false;
            }
            this.checkItem = data;
            if (this.checkItem.length === res.data.content.length) {
              this.loadMoreText = "";
              this.loading = true;
            } else {
              this.loading = false;
              this.checkItem = data;
            }
          } else {
            this.loadMoreText = "";
            this.isNull = true;
          }
        }).catch(error => {
          console.log(error);
        });
      },
      //全选
      change: function () {
        var that = this;
        that.checkItem.forEach(function (v) {
          return (v.satus = that.allCheck);
        });
        if (that.allCheck === true) {
          this.seletedList = that.checkItem;
        } else {
          this.seletedList = [];
        }
      },
      //单选勾住后全选
      itemChange: function () {
        this.seletedList = this.checkItem.filter(function (v) {
          return v.satus === true;
        });
        this.seletedList.length === this.checkItem.length ? (this.allCheck = true) : (this.allCheck = false);
      },
      goElectronicInvoice() {
        localStorage.setItem("tot", this.pricetotale);
        localStorage.setItem("seleted", JSON.stringify(this.seletedList));
        this.$router.push({path: "/merge-order"});
      }
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar
      },
      ...mapGetters([
        'sidebar'
      ]),
      //计算总价
      pricetotale: function () {
        let tatol = 0;
        for (var i = 0; i < this.checkItem.length; i++) {
          var item = this.checkItem[i];
          if (item.satus === true) {
            tatol += item.price;
          }
        }
        tatol = tatol.toFixed(2);
        //千位分隔符正则
        return tatol;
      }
    },
    created() {
      this.accessToken = localStorage.getItem("accessToken");
    },
    mounted() {
      this.getOutOrderList();
    }
  };
</script>
<style scoped>
  @import 'make.css';
  .mint-cell {
    margin: 5px;
    box-shadow: 0 0 5px rgba(0,0,0,0.15);
  }
</style>
