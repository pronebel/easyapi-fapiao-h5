<template>
  <div style="position: absolute; top: 0; bottom: 0; left: 0; right: 0">
    <Header
      @head-back="goBack()"
      :headerTitle="headerTitle"
      v-if="show"
    ></Header>
    <div class="nav" style="margin-top: 0px">
      <div id="loading">
        <van-loading color="#56cbf6" v-show="loadingList"/>
      </div>
      <p>请选择发票类型</p>
      <van-row type="flex" justify="space-between" class="twoBox">
        <van-col span="12" v-show="ifElectronic ==='true'">
          <div :class="{'blueBox': invoiceForm.property=='电子', 'grayBox': invoiceForm.property!='电子' }"
               style="margin-right:5px" @click="getEtr">
            <p style="font-size: 16px; margin-top: -6px">电子发票</p>
            <p style="font-size: 12px; margin-top: 6px">最快1分钟开具</p>
          </div>
        </van-col>
        <van-col span="12" v-show="this.ifPaper ==='true'">
          <div :class="{'blueBox': invoiceForm.property=='纸质', 'grayBox': invoiceForm.property!='纸质' }"
               style="margin-left:5px" @click="getPaper">
            <p style="font-size: 16px; margin-top: -6px">纸质发票</p>
            <p style="font-size: 12px; margin-top: 6px">预计一周送达</p>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="page-part invoice-con">
      <p>发票详情</p>
      <form action id="formBox" ref="invoiceForm" :model="invoiceForm">
        <van-cell title="抬头类型" center>
          <van-radio-group
            class="van-radio-group_type"
            v-model="invoiceForm.type"
            direction="horizontal"
            @change="selectInvoiceType"
          >
            <van-radio name="企业">企业</van-radio>
            <van-radio name="个人">个人</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell title="发票类型" center v-show="invoiceForm.property == '纸质'">
          <van-radio-group
            class="van-radio-group_type"
            v-model="invoiceForm.category"
            direction="horizontal"
          >
            <van-radio
              style="margin-bottom: 5px"
              name="增值税普通发票"
            >增值税普通发票
            </van-radio
            >
            <van-radio name="增值税专用发票" v-if="invoiceForm.type==='企业'"
            >增值税专用发票
            </van-radio
            >
          </van-radio-group>
        </van-cell>
        <van-field
          label="发票抬头"
          v-if="invoiceForm.type === '个人'"
          placeholder="请输入姓名/事业单位"
          v-model="invoiceForm.purchaserName"
        />
        <van-field
          label="发票抬头"
          readonly
          v-if="invoiceForm.type === '企业'"
          @click="gotoCompany"
          right-icon="arrow"
          placeholder="请选择发票抬头"
          v-model="invoiceForm.purchaserName"
        />
        <van-field
          label="税号"
          value=""
          readonly
          v-if="invoiceForm.type === '企业'"
          v-model="invoiceForm.purchaserTaxpayerNumber"
        />
        <van-field
          label="更多"
          right-icon="arrow-down"
          v-if="invoiceForm.type === '企业'"
          @click="purchaserMore"
          v-show="isHide"
          readonly
          placeholder="地址、电话、开户行等"
        />
        <div v-show="isShow">
          <van-field
            v-if="invoiceForm.type === '企业'"
            @click="purchaserMoreHide"
            label="地址"
            value=""
            readonly
            v-model="invoiceForm.purchaserAddress"
            right-icon="arrow-up"
          />
          <van-field
            v-if="invoiceForm.type === '企业'"
            label="电话"
            value=""
            readonly
            v-model="invoiceForm.purchaserPhone"
          />
          <van-field
            v-if="invoiceForm.type === '企业'"
            label="开户行"
            value=""
            readonly
            v-model="invoiceForm.purchaserBank"
          />
          <van-field
            v-if="invoiceForm.type === '企业'"
            label="银行账号"
            value=""
            readonly
            v-model="invoiceForm.purchaserBankAccount"
          />
        </div>
      </form>
    </div>
    <div class="invoice-contents">
      <p>发票内容</p>
      <van-field name="rate" label="发票内容">
        <template #input>
          <van-tag type="primary" size="medium" :class="{active:active=='商品明细'}" @click="showDetail('商品明细')">
            商品明细
          </van-tag>
          <van-tag type="primary" plain size="medium" :class="{active:active=='商品类别'}"
                   @click="showDetail('商品类别')" style="margin-left:5px">商品类别
          </van-tag>
        </template>
      </van-field>
      <van-field
        class="merge-order_price"
        label="发票金额"
        v-model="invoiceForm.mergeSum"
        readonly
      ></van-field>
      <van-field label="发票备注" :placeholder="remarkPlaceholder" v-model="invoiceForm.remark"></van-field>
    </div>
    <div class="page-part" style="margin-bottom: 60px" v-show="this.ifElectronic">
      <p>接收方式</p>
      <van-field label="电子邮箱" v-model="invoiceForm.email"></van-field>
      <van-field label="联系方式" v-model="invoiceForm.mobile"></van-field>
    </div>
    <div class="page-part" v-show="!this.ifElectronic">
      <p>接收方式</p>
      <van-field
        right-icon="arrow"
        label="收件人"
        readonly
        @click="gotoAddress"
        v-model="address.name"
      ></van-field>
      <van-field
        label="联系方式"
        v-model="address.mobile"
        readonly
      ></van-field>
      <van-cell
        title="邮寄地址"
        :value="
          address.province + address.city + address.district + address.addr
        "
        readonly
      ></van-cell>
    </div>
    <div class="page-part" style="margin-bottom: 60px" v-show="!this.ifElectronic">
      <p>开票金额不足200元，需支付邮费</p>
      <van-field label="支付方式" readonly></van-field>
    </div>
    <div class="bottom">
      <van-button
        type="info"
        class="submit"
        @click="makeInvoice"
        v-if="showDisabled"
      >提交
      </van-button>
      <van-button type="info" class="submit" v-else>开票中</van-button>
    </div>
  </div>
</template>

<script>
  import {getDefaultCompany} from "../../../api/company";
  import {getCustomer} from "../../../api/customer";
  import {queryShopOrder, getState} from "../../../api/query";
  import {getShopSupport} from "../../../api/shop";
  import {getRule} from "../../../api/info";
  import {makeInvoice} from "../../../api/make";
  import {Toast} from "vant";
  import {Dialog} from "vant";
  import Isemail from "isemail";

  export default {
    name: "singleOrder",
    data() {
      return {
        isHide: true,
        isShow: false,
        ifElectronic: localStorage.getItem("ifElectronic"),
        ifPaper: localStorage.getItem("ifPaper"),
        active: '商品明细',
        list: [
          {
            name: '商品明细'
          },
          {
            name: '商品类别'
          }
        ],
        loadingList: true,
        amountOfMoney: 0,
        outOrder: "",
        outOrderNo: "",//商户外部订单号
        address: {},
        company: {},
        showDisabled: true,
        selected: "1",
        headerTitle: "开具电子发票",
        contactInformation: "",
        ifNeedMobile: "",
        ifNeedEmail: "",
        sum: 0,
        item: {},
        remarkPlaceholder: "",
        invoiceForm: {
          type: "企业",
          category: "增值税电子普通发票",
          property: localStorage.getItem("ifElectronic") === "true" ? "电子" : "纸质",
          purchaserName: "",
          purchaserTaxpayerNumber: "",
          purchaserAddress: "",
          purchaserPhone: "",
          purchaserBank: "",
          purchaserBankAccount: "",
          addrMobile: "",
          email: "",
          remark: "",
          mergeSum: ""
        },
      };
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      }
    },
    methods: {
      //展示更多
      purchaserMore() {
        this.isShow = true;
        this.isHide = false;
      },
      selectInvoiceType() {
        localStorage.setItem("type", this.invoiceForm.type);
        if (this.invoiceForm.type === "企业") {
          this.getDefaultCompany();
        } else if (this.invoiceForm.type === "个人") {
          this.invoiceForm.purchaserName = "";
          this.invoiceForm.purchaserTaxpayerNumber = "";
          this.invoiceForm.address = "";
          this.invoiceForm.phone = "";
          this.invoiceForm.purchaserBank = "";
          this.invoiceForm.purchaserBankAccount = "";
          this.invoiceForm.companyId = "";
        }
      },
      //隐藏
      purchaserMoreHide() {
        this.isShow = false;
        this.isHide = true;
      },
      showDetail(name) {
        this.active = name
      },
      goBack() {
        history.go(-1);
      },
      SaveType(type) {
        localStorage.setItem("type", type);
        if (type == "企业") {
          this.getDefaultCompany();
        } else if (type == "个人") {
          this.invoiceForm.purchaserName = "";
          this.invoiceForm.purchaserTaxpayerNumber = "";
          this.invoiceForm.address = "";
          this.invoiceForm.phone = "";
          this.invoiceForm.purchaserBank = "";
          this.invoiceForm.purchaserBankAccount = "";
          this.invoiceForm.companyId = "";
        }
      },
      getDefaultCompany() {
        getDefaultCompany().then(res => {
          if (res.data.code === 0) {
            this.company = [];
          } else {
            this.company = res.data.content;
            if (localStorage.getItem("type") == "企业") {
              this.invoiceForm.purchaserName = this.company.name;
              this.invoiceForm.purchaserTaxpayerNumber = this.company.taxNumber;
              this.invoiceForm.purchaserAddress = this.company.address;
              this.invoiceForm.purchaserPhone = this.company.phone;
              this.invoiceForm.purchaserBank = this.company.bank;
              this.invoiceForm.purchaserBankAccount = this.company.bankAccount;
              this.invoiceForm.companyId = this.company.companyId;
            }
          }
        });
      },
      /** 前往抬头管理页 */
      gotoCompany() {
        this.$router.push({
          path: "/company/",
          name: "Company",
          params: {
            id: this.company ? this.company.companyId : "",
            from: "make"
          }
        });
      },
      /** 前往地址管理页 */
      gotoAddress() {
        this.$router.push({
          path: "/address/",
          name: "Address",
          params: {
            id: this.address ? this.address.addressId : "",
            from: "make"
          }
        });
      },
      getShopOrder() {
        getState(this.outOrderNo).then(res => {
          if (res.data.code === 1 && res.data.content) {
            this.$router.replace({path: "/invoice/detail", query: {id: res.data.content[0].invoiceId}});
          }
        });
        queryShopOrder(this.outOrderNo).then(res => {
          if (res.data.code == 1) {
            this.outOrder = res.data.content;
            this.amountOfMoney = res.data.content.price;
          }
        });
      },
      getCustomer() {
        getCustomer({taxNumber: this.taxNumber}).then(res => {
          this.loadingList = false;
          this.email = res.data.content.email ? res.data.content.email : "";
          this.contactInformation = res.data.content.mobile ? res.data.content.mobile : "";
        });
      },
      makeInvoice() {
        if (this.invoiceForm.type === '个人') {
          if (this.invoiceForm.purchaserName == "") {
            return Toast("请输入发票抬头");
          }
        }
        Dialog.confirm({
          title: '提示',
          message: '确认抬头正确并开票吗',
          showCancelButton: true
        }).then(action => {
          if (action === "confirm") {
            this.showDisabled = false;
            //验证邮箱
            if (this.ifNeedEmail === true) {
              if (this.email === "") {
                this.showDisabled = true;
                return Toast("请输入邮箱");
              } else if (!Isemail.validate(this.email)) {
                this.showDisabled = true;
                return Toast("邮箱格式不正确");
              }
            } else {
              if (this.email) {
                if (!Isemail.validate(this.email)) {
                  this.showDisabled = true;
                  return Toast("邮箱格式不正确");
                }
              }
            }
            //手机号验证
            let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
            if (this.ifNeedMobile === true) {
              if (this.contactInformation === "") {
                this.showDisabled = true;
                return Toast("请输入手机号码");
              } else if (!reg.test(this.contactInformation)) {
                this.showDisabled = true;
                return Toast("手机格式不正确");
              }
            } else {
              if (this.contactInformation) {
                if (!reg.test(this.contactInformation)) {
                  this.showDisabled = true;
                  return Toast("手机格式不正确");
                }
              }
            }
            this.invoiceForm.addrMobile = this.contactInformation;
            this.invoiceForm.email = this.email;
            this.invoiceForm.type = this.invoiceForm.type;
            this.invoiceForm.category = "增值税电子普通发票";
            this.invoiceForm.property = "电子";
            this.invoiceForm.outOrderNo = this.outOrder.outOrderNo;
            this.invoiceForm.items = this.outOrder.items;
            makeInvoice(this.invoiceForm).then(res => {
              if (res.data.code === 1) {
                this.$messagebox.alert(res.data.message);
                this.$router.go(0)
              }
            }).catch(error => {
              this.showDisabled = false;
              Toast(error.response.data.message);
              this.showDisabled = true;
            });
          }
        });
      },
      //获取备注
      getSpecifications() {
        getRule().then(res => {
          this.remarkPlaceholder = res.data.content.remark;
        });
      },
      getInvoicingService() {
        getShopSupport().then(res => {
          this.ifNeedMobile = res.data.content.ifNeedMobile;
          this.ifNeedEmail = res.data.content.ifNeedEmail;
        });
      },
      getEtr() {
        this.invoiceForm.category = "增值税电子普通发票";
        this.invoiceForm.property = "电子";
      },
      getPaper() {
        this.invoiceForm.property = "纸质";
        this.invoiceForm.category = "增值税普通发票";
      }
    },
    watch: {},
    created() {
      if (this.$route.query.accessToken) {
        localStorage.setItem("accessToken", this.$route.query.accessToken);
      }
      if (this.$route.query.taxNumber) {
        localStorage.setItem("taxNumber", this.$route.query.taxNumber);
      }
      if (localStorage.getItem("type")) {
        this.invoiceForm.type = localStorage.getItem("type");
        this.selectInvoiceType();
      }
      if (this.$route.query.outOrderNo) {
        localStorage.setItem("outOrderNo", this.$route.query.outOrderNo);
        this.outOrderNo = localStorage.getItem("outOrderNo");
      } else if (this.outOrderNo === "") {
        Toast("outOrderNo不能为空！");
      }
      this.outOrderNo = localStorage.getItem("outOrderNo");
    },
    activated() {
    },
    mounted() {
      this.getCustomer();
      this.getSpecifications();
      this.getInvoicingService();
      this.getShopOrder()
    }
  };
</script>

<style scoped>
  @import '../make.css';

  .nav {
    margin-top: 0;
  }

  .twoBox {
    height: 70px;
    /* border: 2px solid blue; */
    text-align: center;
    background: #fff;
    padding: 20px 10px
  }

  .blueBox {
    box-sizing: border-box;
    padding: 17px 0;
    font-size: 15px;
    height: 70px;
    border: 1px solid #1989fa;
    color: #1989fa;
    border-radius: 4px;
  }

  .grayBox {
    box-sizing: border-box;
    padding: 17px 0;
    font-size: 15px;
    height: 70px;
    border: 1px solid #999;
    color: #999;
    border-radius: 4px;
  }
</style>
