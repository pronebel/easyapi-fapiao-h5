<template>
  <div class="invoice-list">
    <div>
      <div v-if="showDataChoose">
        <van-cell title="发票日期" :value="date" @click="show = true" v-show="showDown" is-link arrow-direction="down"/>
        <van-cell title="发票日期" :value="date" @click="show = true" v-show="showCross">
          <template #right-icon>
            <van-icon name="cross" @click.stop="clearDate"/>
          </template>
        </van-cell>
        <van-calendar v-model="show" type="range" color="#1989fa" :min-date="minDate" @confirm="onConfirm"/>
      </div>
      <div v-show="empty">
        <van-empty image="search" description="暂时还没有开票记录"/>
      </div>
      <div
        class="invoice-list_item"
        v-for="(item, index) in invoiceList"
        :key="index"
        @click="goInvoiceDetail(item.invoiceId)"
      >
        <div class="invoice-list_item_top">
          <p hidden>{{ item.invoiceId }}</p>
          <p>
            <van-tag v-if="item.category ==='增值税电子普通发票'" type="danger">电</van-tag>
            <van-tag v-else-if="item.category ==='增值税普通发票'" type="danger">普</van-tag>
            <van-tag v-else-if="item.category ==='增值税专用发票'" type="danger">专</van-tag>
            <van-tag v-else type="danger">票</van-tag>
            <span class="status">{{ item.statements }}</span>
          </p>
        </div>
        <div class="invoice-list_item_bottom">
          <p class="text">
            <span>{{ item.purchaserName }}</span>
          </p>
          <p class="invoice-list_item_bottom_time">
            <span>{{item.addTime}}</span>
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
  import {getInvoiceList} from "../../../api/invoice";
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
        showDown: true,
        showCross: false,
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
        getInvoiceList(params).then(res => {
          if (res.data.code === 1) {
            this.empty = false;
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
        this.endAddTime = moment(date[1]).format('YYYY-MM-DD 23:59:59');
        this.page.page = 0;
        this.invoiceList = [];
        this.loadMoreText = "加载中...";
        this.empty = false;
        this.loadMore();
        this.showDown = false;
        this.showCross = true;
      },
      clearDate() {
        this.date = ''
        this.startAddTime = '';
        this.endAddTime = '';
        this.page.page = 0;
        this.invoiceList = [];
        this.loadMoreText = "加载中...";
        this.empty = false;
        this.loadMore();
        this.showDown = true;
        this.showCross = false;
      }
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

  .invoice-list {
    padding: 10px 10px;
  }

  .invoice-list_item {
    background: url("../../../assets/images/record-bg.png") no-repeat center;
    background-size: 100% 100%;
    padding: 15px 24px 20px;
    margin-top: 10px;
  }

  .invoice-list_item_top .status {
    color: #1989fa;
    float: right;
  }

  .invoice-list_item .invoice-list_item_bottom {
    margin-top: 30px;
  }

  .invoice-list_item_bottom .text {
    color: #333;
    font-size: 14px
  }

  .invoice-list_item_bottom .invoice-list_item_bottom_time {
    margin-top: 10px;
    color: #666;
    font-size: 12px
  }

  .invoice-list_item_bottom .price {
    color: #ff4848;
    float: right;
  }

  .van-cell .van-icon-cross {
    color: #969799;
    line-height: 24px;
    margin-left: 4px;
    font-size: 16px;
  }

</style>
