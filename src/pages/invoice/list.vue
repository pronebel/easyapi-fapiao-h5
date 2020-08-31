<template>
  <div class="invoice-record-con">
    <div style="margin-top: 10px">
      <div v-if="showDataChoose">
        <van-cell title="发票日期" :value="date" @click="show = true" is-link arrow-direction="down" class="dataChooseCell"/>
        <van-calendar v-model="show" type="range" color="#80d4f7" :min-date="minDate" @confirm="onConfirm" />
      </div>
      <div v-show="empty">
        <van-empty image="search" description="暂时还没有开票记录"/>
      </div>
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
  import moment from 'moment'

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
        startAddTime: '',
        endAddTime: '',
        invoiceList: [],
        showDataChoose: false,
        date: '',
        show: false,
        minDate: new Date(2000, 0, 1)
      };
    },
    methods: {
      getInvoiceList() {
        let params = {
          size: this.page.size,
          page: this.page.page,
          startAddTime: this.startAddTime,
          endAddTime: this.endAddTime
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
            this.showDataChoose = true
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
      },
      formatDate(date) {
        return `${date.getYear() + 1900}/${date.getMonth() + 1}/${date.getDate()}`;
      },
      onConfirm(date) {
        const [start, end] = date;
        this.show = false;
        this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
        this.startAddTime = moment(date[0]).format('YYYY-MM-DD 00:00:00');
        this.endAddTime =  moment(date[1]).format('YYYY-MM-DD 23:59:59');
        this.page.page = 0;
        this.invoiceList = [];
        this.loadMoreText = "加载中..."
        this.loadMore()
      },
    },
    created() {
    },
    mounted() {
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
    background: url("../../assets/images/record-bg.png") no-repeat center;
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

  .dataChooseCell {
    margin-top: 10px;
    border-radius: 7px;
    border: solid 1px #E1E1E1;
    padding: 12px 24px;
  }

  .dataChooseCell .van-cell__title span {
    font-size: 16px;
  }

  .dataChooseCell .van-cell__value {
    flex: 2;
  }

  .dataChooseCell .van-cell__value span {
    font-size: 16px;
  }
</style>
