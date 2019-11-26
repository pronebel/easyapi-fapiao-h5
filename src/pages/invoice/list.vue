<template>
  <div class="invoice-record-con">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <!--<div v-if="invoiceRecordList.length<1">-->
    <!--<div class="no-record">-->
    <!--<my-header @headBack="goBack()" :headerTitle="headerTitle"></my-header>-->
    <!--</div>-->
    <div class="no-record-con" v-show="isNull">
      <p>
        <img src="../../assets/images/no-reaord_03.png" alt />
      </p>
      <p class="record-text">暂时还没有记录!</p>
    </div>
    <!--</div>-->
    <div style="margin-top: 60px">
      <div id="loading">
        <mt-spinner
          color="#56cbf6"
          v-show="loadingList"
          type="fading-circle"
        ></mt-spinner>
      </div>

      <div
        class="record-con parking-order header-d"
        v-for="(item, index) in invoiceRecordList"
        :key="index"
        @click="goInvoiceDetail(item.invoiceId)"
      >
        <div class="record-con-top">
          <p hidden>{{ item.invoiceId }}</p>
          <p class="time">
            <span style="font-size: 15px;color: #333">电子发票</span>
            <span class="record-status">{{ item.statements }}</span>
          </p>
        </div>
        <div class="record-con-bottom">
          <p class="record-invoice">
            <span style="color: #333;font-size: 14px">{{
              item.orderType
            }}</span>
          </p>
          <p class="record-order">
            <span style="color: #333;font-size: 14px">{{
              item.updateTime
            }}</span>
            <span class="price">￥{{ item.price }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../../components/header.vue";

export default {
  name: "record",
  components: {
    Header
  },
  data() {
    return {
      headerTitle: "开票记录",
      invoiceRecordList: [],
      loadingList: true,
      id: "",
      isNull: false,
      accessToken: ""
    };
  },
  methods: {
    goBack() {
      history.go(-1);
    },
    // 获取当前行数据
    getInvoiceRecordList() {
      this.$ajax
        .get("/api/invoice/records", {
          params: {
            accessToken: this.accessToken,
            username: this.$store.state.username,
            size: 500
          }
        })
        .then(res => {
          if (res.data.code !== 0) {
            this.isNull = false;
            setTimeout(() => {
              this.loadingList = false;
              this.invoiceRecordList = res.data.content;
            }, 2000);
          } else {
            this.isNull = true;
            this.loadingList = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goInvoiceDetail(id) {
      this.$router.push({ path: "/invoice/detail", query: { id: id } });
    }
  },
  created() {
    this.accessToken = localStorage.getItem("accessToken");
  },
  mounted() {
    this.getInvoiceRecordList();
  }
};
</script>

<style scoped>
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

.record-text {
  margin-top: 20px;
  color: #ccc;
}
.record-con {
  background: url("../../assets/images/recor-bg1.png") no-repeat center;
  background-size: 100% 100%;
  padding: 15px 24px 30px;
  margin-top: 10px;
}

.record-con .record-con-top {
  /*height: 40px;*/
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
