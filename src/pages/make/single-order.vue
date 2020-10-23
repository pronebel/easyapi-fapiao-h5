<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <Header @head-back="goBack()" :headerTitle="headerTitle"></Header>
    <div class="nav">
      <div id="loading">
        <van-loading  v-show="loadingList" type="spinner" color="#56cbf6" />
      </div>
      <p>请选择发票类型</p>
      <van-row type="flex" justify="space-between" class="twoBox">
        <van-col span="12">
          <div :class="{'blueBox': isEInvoice, 'grayBox': isPInvoice }" style="margin-right:5px" @click="getEtr">
            <p style="font-size: 16px; margin-top: -6px">电子发票</p>
            <p style="font-size: 12px; margin-top: 6px">最快1分钟开具</p>
          </div>
        </van-col>
        <van-col span="12">
          <div :class="{'blueBox': !isEInvoice, 'grayBox': !isPInvoice }" style="margin-left:5px" @click="getPaper">
            <p style="font-size: 16px; margin-top: -6px">纸质发票</p>
            <p style="font-size: 12px; margin-top: 6px">预计一周送达</p>
          </div>
        </van-col>
      </van-row>
    </div>
    <div>
      <div v-show="this.isEInvoice">
        <div class="page-part invoice-con">
          <p>发票详情</p>
          <form action="" id="formBox" ref="invoiceForm" :model="invoiceForm">
            <van-cell title="抬头类型" center>
              <van-radio-group class="van-radio-group_type" v-model="invoiceForm.type" direction="horizontal"
                           @change="selectType">
                <van-radio name="企业">企业</van-radio>
                <van-radio name="个人">个人</van-radio>
              </van-radio-group>
            </van-cell>
            <van-field label="发票抬头" v-if="invoiceForm.type === '个人'" placeholder="请输入姓名/事业单位"
                   v-model="invoiceForm.purchaserName"/>
            <van-field label="发票抬头" readonly v-if="invoiceForm.type === '企业'" @click="gotoCompany" right-icon="arrow"
                   placeholder="请选择发票抬头" v-model="company.name"/>
            <van-field label="税号" value="" readonly v-if="invoiceForm.type === '企    业'" v-model="company.taxNumber"/>
            <van-field label="更多" right-icon="arrow-down" v-if="invoiceForm.type    === '企业'" @click="showMore"
                   v-show="isHide"
                   readonly placeholder="地址、电话、开户行等"/>
            <div v-show="isShow">
              <van-field v-if="invoiceForm.type === '企业'" @click="hide" label="税号" value="" readonly
                     v-model="company.taxNumber" right-icon="arrow-up"/>
              <van-field v-if="invoiceForm.type === '企业'" label="地址" value="" readonly v-model="company.address"/>
              <van-field v-if="invoiceForm.type === '企业'" label="电话" value="" readonly v-model="company.phone"/>
              <van-field v-if="invoiceForm.type === '企业'" label="开户行" value="" readonly v-model="company.bank"/>
              <van-field v-if="invoiceForm.type === '企业'" label="银行账号" value="" readonly v-model="company.bankAccount"/>
            </div>
          </form>
        </div>
        <div class="invoice-contents">
          <p>发票内容</p>
          <ul class="contents-title">
            <li style="width: 35%">商品名称</li>
            <li style="width: 35%">规格型号</li>
            <li>单位</li>
            <li>数量</li>
            <li>单价</li>
            <li>操作</li>
          </ul>
          <van-cell class="line"/>
          <ul
            class="contents-content"
            v-for="(product, index) in productList"
            :key="index"
          >
            <li style="width: 35%; line-height: 15px;padding-top:12px">
              {{ product.name }}
            </li>
            <li style="width: 35%; line-height: 15px;padding-top:12px">{{ product.specification }}</li>
            <li>{{ product.unit }}</li>
            <li>{{ product.number }}</li>
            <li>{{ product.price }}</li>
            <li
              style="color: #1989fa"
              @click="deleteContent(product.productId)"
            >
              删除
            </li>
          </ul>
          <!-- <van-cell class="line"/> -->
          <!-- <div class="btn">
            <van-button class="submit-btn" @click="showSearchPopup">
              +添加发票内容
            </van-button
            >
          </div> -->
          <van-cell class="line"/>
          <van-field class="merge-order_price" label="发票金额" v-model="amountOfMoney" readonly></van-field>
          <van-field label="备注" placeholder="请输入备注信息" v-model="invoiceForm.inputValue"></van-field>
        </div>
        <div class="page-part">
          <van-cell-group title="接收方式">
            <van-field label="电子邮件" value="" v-model="email"/>
            <van-field label="手机号码" type="tel" value="" v-model="contactInformation"/>
          </van-cell-group>
          <div class="bottom">
            <van-button
              type="info"
              class="submit"
              @click="goInvoiceSuccess"
              v-if="showDisabled"
            >提交
            </van-button>
            <van-button class="submit" v-else>开票中...</van-button>
          </div>
        </div>
      </div>
      <div v-show="!this.isEInvoice">
        <div class="paper-capacitor">
          正在开发中...
        </div>
      </div>
    </div>
    <div>
      <router-view @seletedOrder="seletedOrder"></router-view>
    </div>
  </div>
</template>

<script>
  import {getDefaultCompany} from "../../api/company";
  import {getCustomer} from "../../api/customer";
  import {getShopSupport} from "../../api/shop";
  import {getRule} from "../../api/info";
  import {mergeMakeInvoice} from "../../api/make";
  import Header from "../../components/header.vue";
  import {Navbar, TabItem} from "mint-ui";
  import {Toast} from "mint-ui";
  import {MessageBox} from "mint-ui";
  import Isemail from "isemail";

  export default {
    name: "singleOrder",
    components: {
      Header
    },
    data() {
      return {
        isShow: false,
        isHide: true,
        loadingList: true,
        amountOfMoney: 0,
        outOrder: '',
        contentList: "",
        outOrderNo: "",
        order: "",
        make: true,
        accessToken: "",
        scanContent: "",
        showDisabled: true,
        selected: "1",
        headerTitle: "开具电子发票",
        active: "tab-container1",
        contactInformation: "",
        ifNeedMobile: "",
        ifNeedEmail: "",
        company: {},
        itemIds: "",
        email: "",
        seletedOrderList: [],
        sum: 0,
        item: {},
        mergeTax: 0,
        howMany: "",
        remark: "",
        returnUrl: "",
        invoiceForm: {
          isPaper: false,
          type: "",
          purchaserName: ""
        },
        isEInvoice: true,
        isPInvoice: false
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      SaveType(type) {
        localStorage.setItem("type", type);
        if (type == "企业") {
          this.getDefaultCompany();
        } else if (type == "个人") {
          this.invoiceForm.purchaserName = "个人";
          this.invoiceForm.purchaserTaxpayerNumber = "";
          this.invoiceForm.address = "";
          this.invoiceForm.phone = "";
          this.invoiceForm.purchaserBank = "";
          this.invoiceForm.purchaserBankAccount = "";
          this.invoiceForm.companyId = "";
        }
      },
      seletedOrder(item) {
        this.loadingList = false;
        this.company = item;
      },
      getDefaultCompany() {
        getDefaultCompany().then(res => {
          if (res.data.code === 0) {
            this.company = [];
          } else {
            this.company = res.data.content;
            if (localStorage.getItem("type") == '企业') {
              this.invoiceForm.purchaserName = this.company.name;
              this.invoiceForm.purchaserTaxpayerNumber = this.company.taxNumber;
              this.invoiceForm.address = this.company.address;
              this.invoiceForm.phone = this.company.phone;
              this.invoiceForm.purchaserBank = this.company.bank;
              this.invoiceForm.purchaserBankAccount = this.company.bankAccount;
              this.invoiceForm.companyId = this.company.companyId;
            }
          }
        });
      },
      toAddressManage() {
        if (this.company.length === 0) {
          this.$router.push({
            path: "/company/",
            name: "Company",
            params: {
              id: "",
              from: "make"
            }
          });
        } else {
          this.$router.push({
            path: "/company/",
            name: "Company",
            params: {
              id: this.company.companyId,
              from: "make"
            }
          });
        }
      },
      getOutOrder() {
        let outOrderNo = this.outOrderNo;
        this.$ajax.get("/out-orders", {
          params: {
            size: this.size,
            accessToken: this.accessToken,
            taxNumber: this.taxNumber,
            state: 0,
            no: outOrderNo
          }
        }).then(res => {
          if (res.data.code == 1) {
            this.$router.push({
              path: "/invoice/detail",
              query: {id: res.data.content.invoice.invoiceId}
            });
          }
          this.outOrder = res.data.content[0];
          this.calculatedAmount();
        })
      },
      getCustomer() {
        getCustomer({taxNumber: this.taxNumber}).then(res => {
          this.loadingList = false;
          this.email = res.data.content.email ? res.data.content.email : "";
          this.contactInformation = res.data.content.mobile ? res.data.content.mobile : "";
        })
      },
      goInvoiceSuccess() {
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
        this.invoiceForm.outOrderIds = this.outOrder.outOrderId;
        mergeMakeInvoice(this.invoiceForm).then(res => {
            if (res.data.code === 1) {
              this.$messagebox.alert(res.data.message);
              this.$router.push({
                path: "/single-order-success",
                query: {returnUrl: this.returnUrl}
              });
            }
          }).catch(error => {
          this.showDisabled = false;
          Toast(error.response.data.message);
          this.showDisabled = true;
        });
      },
      //计算发票金额
      calculatedAmount() {
        if (this.outOrder !== null) {
          this.amountOfMoney = this.outOrder.price.toFixed(2);
        }
      },
      //获取备注
      getSpecifications() {
        getRule().then(res => {
          this.remark = res.data.content.remark;
        })
      },
      getInvoicingService() {
        getShopSupport().then(res => {
          this.ifNeedMobile = res.data.content.ifNeedMobile;
          this.ifNeedEmail = res.data.content.ifNeedEmail;
        })
      },
      getEtr() {
        this.isEInvoice = true;
        this.isPInvoice = false;
        localStorage.setItem("isPaper", false);
        this.orderType = localStorage.getItem("orderType");
        this.invoiceForm.mergeSum = localStorage.getItem("tot");
        this.seletedOutOrderList = JSON.parse(localStorage.getItem("seleted"));
        for (let i = 0; i < this.seletedOutOrderList.length; i++) {
          this.outOrderIds += this.seletedOutOrderList[i].outOrderId + ",";
          this.invoiceForm.outOrderIds = this.outOrderIds;
          this.invoiceForm.category = "增值税电子普通发票";
          this.invoiceForm.property = "电子";
        }
      },
      getPaper() {
        this.isEInvoice = false;
        this.isPInvoice = true;
        localStorage.setItem("isPaper", true);
        this.orderType = localStorage.getItem("orderType");
        this.invoiceForm.mergeSum = localStorage.getItem("tot");
        this.seletedOutOrderList = JSON.parse(localStorage.getItem("seleted"));
        for (let j = 0; j < this.seletedOutOrderList.length; j++) {
          this.outOrderIds += this.seletedOutOrderList[j].outOrderId + ",";
          this.invoiceForm.outOrderIds = this.outOrderIds;
          this.invoiceForm.category = this.paperForm.type;
          this.invoiceForm.property = "纸质";
        }
      },
      selectType() {
        localStorage.setItem("type", this.invoiceForm.type);
        if (this.invoiceForm.type === "企业") {
          this.getDefaultCompany();
          this.getDefaultAddress()
        } else if (this.invoiceForm.type === "个人") {
          this.invoiceForm.purchaserName = "个人";
          this.invoiceForm.purchaserTaxpayerNumber = "";
          this.invoiceForm.address = "";
          this.invoiceForm.phone = "";
          this.invoiceForm.purchaserBank = "";
          this.invoiceForm.purchaserBankAccount = "";
          this.invoiceForm.companyId = "";
        }
      },
      //展示更多
      showMore() {
        this.isShow = true;
        this.isHide = false;
      },
      //隐藏
      hide() {
        this.isShow = false;
        this.isHide = true;
      },
      gotoCompany() {
        if (this.company) {
          this.$router.push({
            path: "/company/",
            name: "Company",
            params: {
              id: this.company.companyId,
              from: "make"
            }
          });
        } else {
          this.$router.push({
            path: "/company/",
            name: "Company",
            params: {
              id: "",
              from: "make"
            }
          });
        }
      },
    },
    watch: {},
    created() {
      if (this.$route.query.accessToken) {
        localStorage.setItem("accessToken", this.$route.query.accessToken);
        this.accessToken = localStorage.getItem("accessToken");
      } else if (this.accessToken === "") {
        Toast("accessToken不能为空！");
      }
      if (this.$route.query.outOrderNo) {
        localStorage.setItem("outOrderNo", this.$route.query.outOrderNo);
        this.outOrderNo = localStorage.getItem("outOrderNo");
      } else if (this.outOrderNo === "") {
        Toast("outOrderNo不能为空！");
      }
      if (this.$route.query.returnUrl) {
        localStorage.setItem("returnUrl", this.$route.query.returnUrl);
        this.accessToken = localStorage.getItem("returnUrl");
      } else if (this.returnUrl === "") {
        Toast("returnUrl不能为空！");
      }
      this.accessToken = localStorage.getItem("accessToken");
      this.taxNumber = localStorage.getItem("taxNumber");
      this.outOrderNo = localStorage.getItem("outOrderNo");
      this.invoiceForm.type = localStorage.getItem("type");
      if (this.invoiceForm.type) {
        this.invoiceForm.type = localStorage.getItem("type");
      } else {
        this.invoiceForm.type = "企业";
      }
    },
    activated() {
      this.getDefaultCompany();
      this.seletedOrder();
    },
    mounted() {
      this.getCustomer();
      this.getDefaultCompany();
      this.getSpecifications();
      this.getInvoicingService();
      this.getOutOrder();
    }
  };
</script>

<style scoped>
  @import 'make.css';
  .twoBox {
    height: 70px;
    /* border: 2px solid blue; */
    text-align: center;
    background: #fff;
    padding: 20px 10px
  }

  .blueBox {
    box-sizing:border-box;
    padding: 17px 0;
    font-size: 15px;
    height: 70px;
    border: 1px solid #1989fa;
    color: #1989fa;
    border-radius: 4px;
  }
  .grayBox {
    box-sizing:border-box;
    padding: 17px 0;
    font-size: 15px;
    height: 70px;
    border: 1px solid #999;
    color: #999;
    border-radius: 4px;
  }
</style>
