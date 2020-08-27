<template>
  <div class="invoice-record-con">
    <div v-show="empty">
      <van-empty image="search" description="暂时还没有开票记录"/>
    </div>
    <div style="margin-top: 10px">
      <div
        class="record-con parking-order header-d"
        v-for="(item, index) in invoiceList"
        :key="index"
        @click="goInvoiceDetail(item.invoiceId)"
      >
        <div class="record-con-top">
          <p hidden>{{ item.invoiceId }}</p>
          <p class="time">
            <span style="font-size: 16px;color: #333333">电子发票</span>
            <span class="record-status">{{ item.statements }}</span>
          </p>
        </div>
        <div class="record-con-bottom">
          <p class="record-invoice">
            <span style="color: #333;font-size: 14px">商品订单</span>
          </p>
          <p class="record-order">
            <span style="color: #333;font-size: 14px">{{
              item.addTime
            }}</span>
            <span class="price">￥{{ item.price }}</span>
          </p>
        </div>
      </div>
      <div class="page-infinite-loading">
        <p>{{ loadMoreText }}</p>
      </div>
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
  import {getInvoiceList} from "../../api/invoice";

  export default {
    name: "Invoice",
    data() {
      return {
        loadMoreText: "加载中...",
        loading: false, //下拉加载
        empty: false,//是否显示空页面
        headerTitle: "开票记录",
        page: {
          page: 0,
          size: 10,
          total: 0
        },
        invoiceList: [],
      };
    },
    methods: {
      getInvoiceList() {
        let params = {
          size: this.page.size,
          page: this.page.page,
          state: 0
        };
        params.username = localStorage.getItem("username");
        getInvoiceList(params).then(res => {
          if (res.data.code === 1) {
            let data = res.data.content;
            this.page.total = res.data.totalPages;
            if (this.invoiceList == null) {
              this.invoiceList = data;
            } else {
              this.invoiceList = this.invoiceList.concat(data);
            }
            this.loading = false;
          } else {
            this.empty = true;
            this.invoiceList = [];
            this.loadMoreText = "";
          }
        });
      },
      //上拉加载
      loadMore() {
        this.loading = true;
        if (this.page.total != 0 && this.page.page > 0 && this.page.page >= this.page.total) {
          this.loadMoreText = "没有更多数据了";
          return;
        }
        this.getInvoiceList();
        this.page.page++;
      },
      goInvoiceDetail(id) {
        this.$router.push({path: "/invoice/detail", query: {id: id}});
      }
    },
    created() {
    },
    mounted() {
      this.getInvoiceList();
    }
  };
</script>

<style scoped>
  .page-infinite-loading {
    text-align: center;
    height: 50px;
    line-height: 50px;
  }

  .no-record-con {
    margin-top: 80px;
    padding: 60px;
    text-align: center;
  }

  .invoice-record-con {
    padding: 0 10px;
  }

  .no-record-con img {
    width: 100%;
  }

  .record-con {
    background: url("../../assets/images/record-bg1.png") no-repeat center;
    background-size: 100% 100%;
    padding: 15px 24px 20px;
    margin-top: 10px;
  }

  .record-con .record-con-top {
    /*line-height: 40px;*/
  }

  .record-con .record-con-bottom {
    margin-top: 30px;
  }

  .record-con-bottom .record-order {
    margin-top: 10px;
  }

  .time > span:first-of-type {
    font-size: 14px;
  }

  .record-status {
    color: #80d4f7;
    float: right;
  }

  .price {
    color: #ff4848;
    float: right;
  }

  #loading {
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    z-index: 999;
  }
</style>
