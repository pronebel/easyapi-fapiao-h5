<template>
  <div>
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="invoiced">
      <a class="mint-cell" @click="viewPicture"
      ><span class="mint-cell-mask"></span>
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">

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
      <a class="mint-cell mint-field">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text"
            ><font style="vertical-align: inherit;"
            ><font style="vertical-align: inherit;">发票抬头</font></font
            ></span>
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
            ><font style="vertical-align: inherit;">地址、电话</font></font
            ></span
            >
          </div>
          <div class="mint-cell-value" style="display: block;">
            <span>{{ invoiceDetail.purchaserAddress }} {{ invoiceDetail.purchaserPhone }}</span>
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
            >开户行及账号</font
            ></font
            ></span
            >
          </div>
          <div class="mint-cell-value">
            <span>{{ invoiceDetail.purchaserBank }} {{ invoiceDetail.purchaserBankAccount }}</span>
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
    <mt-popup
      v-model="popupVisible"
      position="middle"
      style="padding:30px"
      align="center">
      <p style="fontSize:17px">发票预览</p>
      <img :src="imgUrl" alt="" style="width:350px">
      <div style="margin-bottom:20px">
        <mt-button type="primary" size="small" data-clipboard-action="copy" class="copyPdfUrl"
                   :data-clipboard-text="url" @click="copyLink">复制发票下载地址
        </mt-button>
      </div>
      <div style="width:200px,fontSize:12px">
        <textarea :value="url" style="width:300px"/>
      </div>
      <p style="margin-top:7px">复制发票下载地址并在浏览器中打开进行下载</p>
    </mt-popup>
  </div>
</template>

<script>
  import {getInvoice} from "../../api/invoice";
  import Header from "../../components/header.vue";
  import {MessageBox} from "mint-ui";
  import Clipboard from "clipboard";

  export default {
    name: "InvoiceDetail",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: "发票详情",
        active: "tab-container1",
        invoiceDetail: {},
        invoiceItems: [],
        serviceType: "",
        url: "",
        imgUrl: "",
        popupVisible: false
      };
    },

    methods: {
      //查看发票
      viewPicture() {
        if (this.invoiceDetail.state === 1) {
          this.popupVisible = true
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
        this.$router.push(`/invoice/out-order`);
      },
      getInvoiceDetail() {
        getInvoice(this.$route.query.id).then(res => {
          this.invoiceDetail = res.data.content;
          this.url = res.data.content.electronicInvoiceUrl;
          this.imgUrl = res.data.content.electronicInvoiceImg;
          this.serviceType = res.data.content.serviceType;
          this.invoiceItems = this.invoiceDetail.invoiceItems;
        }).catch(error => {
          console.log(error);
        });
      },
      goAssociatedOrder() {
        this.$router.push({
          path: "/invoice/out-order",
          query: {id: this.$route.query.id}
        });
      },
      copyLink() {
        let _this = this;
        let clipboard = new this.clipboard(".copyPdfUrl");
        clipboard.on('success', function () {
          _this.$toast({message:"复制成功", className: 'top-toast'})
        });
        clipboard.on('error', function () {
          _this.$toast({message:"复制失败", className: 'top-toast'})
        });
      }
    },
    created() {
      this.id = this.$route.query.id;
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
