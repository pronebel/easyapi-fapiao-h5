<template>
  <div>
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="invoiced">
      <a class="mint-cell" @click="viewPicture"
        ><span class="mint-cell-mask"></span>
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <!---->
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;"
                  >电子发票（{{ invoiceDetail.statements }}）</font
                ></font
              ></span
            >
            <span class="mint-cell-label"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">{{
                  invoiceDetail.updateTime
                }}</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value is-link"><span></span></div>
          <i class="mint-cell-allow-right"></i>
        </div>
        <div class="mint-cell-right"></div>
      </a>
    </div>
    <div class="page-part invoice-con">
      <p>发票详情</p>
      <a class="mint-cell mint-field"
        ><!---->
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <!---->
            <span class="mint-cell-text">抬头类型</span>
            <!---->
          </div>
          <div class="mint-cell-value">
            <span>{{ invoiceDetail.type }}</span>
          </div>
        </div>
      </a>
      <a class="mint-cell mint-field"
        ><!---->
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">发票抬头</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value">
            <span>{{ invoiceDetail.purchaserName }}</span>
            <div class="mint-field-clear" style="display: none;">
              <i class="mintui mintui-field-error"></i>
            </div>
            <span class="mint-field-state is-default"
              ><i class="mintui mintui-field-default"></i
            ></span>
            <div class="mint-field-other"></div>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">税号</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value">
            <span>{{ invoiceDetail.purchaserTaxpayerNumber }}</span>
            <div class="mint-field-clear" style="display: none;">
              <i class="mintui mintui-field-error"></i>
            </div>
            <span class="mint-field-state is-default"
              ><i class="mintui mintui-field-default"></i
            ></span>
            <div class="mint-field-other"></div>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">发票金额</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value">
            <span>￥{{ invoiceDetail.price }}</span>
            <div class="mint-field-clear" style="display: none;">
              <i class="mintui mintui-field-error"></i>
            </div>
            <span class="mint-field-state is-default"
              ><i class="mintui mintui-field-default"></i
            ></span>
            <div class="mint-field-other"></div>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">地址和电话</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value" style="display: block;">
            <span>{{ invoiceDetail.purchaserAddress }}</span>
            <div class="mint-field-clear" style="display: none;">
              <i class="mintui mintui-field-error"></i>
            </div>
            <span class="mint-field-state is-default"
              ><i class="mintui mintui-field-default"></i
            ></span>
            <div class="mint-field-other"></div>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;"
                  >开户行和账号</font
                ></font
              ></span
            >
          </div>
          <div class="mint-cell-value">
            <span>{{ invoiceDetail.purchaserBank }}</span>
            <div class="mint-field-clear" style="display: none;">
              <i class="mintui mintui-field-error"></i>
            </div>
            <span class="mint-field-state is-default"
              ><i class="mintui mintui-field-default"></i
            ></span>
            <div class="mint-field-other"></div>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">备注</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value">
            <span>{{ invoiceDetail.remark }}</span>
            <div class="mint-field-clear" style="display: none;">
              <i class="mintui mintui-field-error"></i>
            </div>
            <span class="mint-field-state is-default"
              ><i class="mintui mintui-field-default"></i
            ></span>
            <div class="mint-field-other"></div>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
    </div>
    <div class="page-part">
      <p>接收方式</p>

      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">电子邮件</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value">
            <span>{{ invoiceDetail.email }}</span>
            <div class="mint-field-clear" style="display: none;">
              <i class="mintui mintui-field-error"></i>
            </div>
            <span class="mint-field-state is-default"
              ><i class="mintui mintui-field-default"></i
            ></span>
            <div class="mint-field-other"></div>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">联系方式</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value">
            <span>{{ invoiceDetail.addrMobile }}</span>
            <div class="mint-field-clear" style="display: none;">
              <i class="mintui mintui-field-error"></i>
            </div>
            <span class="mint-field-state is-default"
              ><i class="mintui mintui-field-default"></i
            ></span>
            <div class="mint-field-other"></div>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <a class="mint-cell" @click="goAssociatedOrder"
        ><span class="mint-cell-mask"></span>
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;"
                  ><span>1</span>张发票，含<span>{{
                    this.invoiceItems.length
                  }}</span
                  >个商品</font
                ></font
              ></span
            >
            <span class="mint-cell-label"
              ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">{{
                  invoiceDetail.updateTime
                }}</font></font
              ></span
            >
          </div>
          <div class="mint-cell-value is-link"><span></span></div>
          <i class="mint-cell-allow-right"></i>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <div class="bottom">
        <!--<mt-button class="submit" @click="goElectronicInvoice">重发电子发票与订单</mt-button>-->
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import Header from "../../components/header.vue";
import { MessageBox } from "mint-ui";

export default {
  name: "invoiceDetail",
  components: {
    Header
  },
  data() {
    return {
      headerTitle: "发票记录详情",
      active: "tab-container1",
      invoiceDetail: {},
      invoiceItems: [],
      serviceType: "",
      url: "",
      accessToken: ""
    };
  },

  methods: {
    //查看发票
    viewPicture() {
      if (this.invoiceDetail.state === 1) {
        window.location.href = this.url;
      } else if (this.invoiceDetail.state === 2) {
        this.$toast("当前发票作废了");
      } else if (this.invoiceDetail.state === 3) {
        this.$toast("当前发票退票中");
      } else if (this.invoiceDetail.state === 4) {
        this.$toast("正在开票中");
      } else {
        this.$toast("等待后台审核通过");
      }
    },
    goBack() {
      history.go(-1);
    },
    goElectronicInvoice() {
      this.$router.push(`/out-order`);
    },
    getInvoiceDetail() {
      this.id = this.$route.query.id;
      this.$ajax
        .get("/api/invoice/record/" + this.id, {
          params: {
            accessToken: this.accessToken,
            username: this.$store.state.username
          }
        })
        .then(res => {
          this.invoiceDetail = res.data.content;
          this.url = res.data.content.electronicInvoiceUrl;
          this.serviceType = res.data.content.serviceType;
          this.invoiceItems = this.invoiceDetail.invoiceItems;
        })
        .catch(error => {
          console.log(error);
        });
    },
    goAssociatedOrder() {
      this.$router.push({
        path: "/out-order",
        query: { id: this.$route.query.id }
      });
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.accessToken = localStorage.getItem("accessToken");
  },
  watch: {},
  mounted() {
    this.getInvoiceDetail();
  }
};
</script>

<style scoped>
.invoiced {
  margin-top: 60px;
}

.page-part p {
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
  color: #666;
}

.page-part a {
  border-bottom: 1px solid #f4f4f4;
}

.bottom {
  padding: 0 10px;
  margin-top: 20px;
}

.bottom .submit {
  width: 100%;
  background: #56cbf6;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: #fff;
}

.mint-cell-wrapper {
  background: none !important;
}
</style>
