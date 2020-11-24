<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <Header @head-back="goBack()" headerTitle="开具电子发票"></Header>
    <div class="nav">
      <div id="loading">
        <van-loading v-show="loadingList" type="spinner" color="#56cbf6"/>
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

    <div class="page-part invoice-con">
      <p>发票详情</p>
      <form action id="formBox" ref="invoiceForm" :model="invoiceForm">
        <van-cell title="抬头类型" center>
          <van-radio-group class="van-radio-group_type" v-model="invoiceForm.type" direction="horizontal"
                           @change="selectInvoiceType">
            <van-radio name="企业">企业</van-radio>
            <van-radio name="个人">个人/事业单位</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell title="发票类型" center v-show="!this.isEInvoice">
          <van-radio-group class="van-radio-group_type" v-model="invoiceForm.type" direction="horizontal"
          >
            <van-radio style="margin-bottom: 5px;" name="增值税普通发票" @click="getRadioVal">增值税普通发票</van-radio>
            <van-radio name="增值税专用发票" @click="getRadioVal">增值税专用发票</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field label="发票抬头" v-if="invoiceForm.type === '个人'" placeholder="请输入姓名/事业单位"
                   v-model="invoiceForm.purchaserName"/>
        <van-field label="发票抬头" readonly v-if="invoiceForm.type === '企业'" @click="gotoCompany" right-icon="arrow"
                   placeholder="请选择发票抬头" v-model="company.name"/>
        <van-field label="税号" value="" readonly v-if="invoiceForm.type === '企业'" v-model="company.taxNumber"/>
        <van-field label="更多" right-icon="arrow-down" v-if="invoiceForm.type === '企业'" @click="showMore"
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
    <div class="invoice-contents" v-if="make === 'true'">
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
          @click="deleteProduct(product.productId)"
        >
          删除
        </li>
      </ul>
      <van-cell class="line"/>
      <div class="btn">
        <van-button class="submit-btn" @click="showProductSearchPopup">
          +添加发票内容
        </van-button
        >
      </div>

      <van-cell class="line"/>
      <van-field class="merge-order_price" label="发票金额" v-model="amountOfMoney" readonly></van-field>
      <van-field label="备注" placeholder="请输入备注信息" v-model="invoiceForm.remark"></van-field>
    </div>

    <div>
      <div v-show="this.isEInvoice">
        <div class="page-part" style="margin-bottom: 60px;">
          <p>接收方式</p>
          <van-field label="电子邮箱" v-model="invoiceForm.email"></van-field>
          <van-field label="联系方式" v-model="invoiceForm.addrMobile"></van-field>
        </div>
      </div>
      <div v-show="!this.isEInvoice">
        <div class="page-part">
          <p>接收方式</p>
          <van-field right-icon="arrow" label="收件人" readonly @click="gotoAddress" v-model="address.name"></van-field>
          <van-field label="联系方式" v-model="address.mobile" readonly></van-field>
          <van-cell title="邮寄地址" :value="address.province + address.city + address.district + address.addr"
                    readonly></van-cell>
        </div>
        <div class="page-part" style="margin-bottom: 60px;">
          <p>开票金额不足200元，需支付邮费</p>
          <van-field label="支付方式" readonly></van-field>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-button
        type="info"
        class="submit"
        @click="makeInvoice"
        v-if="showDisabled"
      >提交
      </van-button>
      <van-button class="submit" v-else>开票中...</van-button>
    </div>
    <div>
      <router-view @seletedOrder="seletedOrder"></router-view>
    </div>
    <van-popup
      class="popupClass"
      v-model="showPopup"
      position="bottom"
      style="height: 75%; padding-top: 4px;"
    >
      <van-search
        v-model="productKeyword"
        placeholder="请输入搜索关键词"
        @input="onProductSearch"
      />
      <van-list
        :finished="true"
        finished-text="没有更多了"
      >
        <van-radio-group>
          <van-cell v-for="item in productListAll" :key="item.productId">
            <van-row type="flex" align="center">
              <van-col span="6">
                <van-image width="60" height="60" :src="item.img"/>
              </van-col>
              <van-col span="11">
                <span style="display: block">{{ item.name }}</span>
                <span style="display: block; font-size: 12px; color: #888">{{ item.specification }}</span>
                <span>￥</span>
                <input style="width: 40px; text-align: center; border:none;" v-model=" item.price "
                       @change="calcTotalPrice"/>
                <span> 元 / {{ item.unit }}</span>
              </van-col>
              <van-col span="7">
                <van-stepper v-model="item.number" integer min="0" default-value="0" @change="calcTotalPrice"/>
              </van-col>
            </van-row>
          </van-cell>
        </van-radio-group>
      </van-list>
      <van-submit-bar :price="totalPrice*100" button-text="添加商品" @submit="appendProduct" button-color="#1989fa"/>
    </van-popup>
  </div>
</template>

<script>
  import {getProductList} from "../../api/product";
  import {getCustomer} from "../../api/customer";
  import {getDefaultCompany} from "../../api/company";
  import {getDefaultAddress} from "../../api/address";
  import {getShopSupport} from "../../api/shop";
  import {getRule} from "../../api/info";
  import {productMakeInvoice} from "../../api/make";
  import Header from "../../components/header.vue";
  import {Navbar, TabItem} from "mint-ui";
  import {Toast} from "mint-ui";
  import {MessageBox} from "mint-ui";
  import Isemail from "isemail";

  export default {
    name: "MakeProduct",
    components: {
      Header
    },
    data() {
      return {
        loadingList: true,
        amountOfMoney: 0,
        productList: "",
        accessToken: "",
        showDisabled: true,
        selected: 1,
        ifNeedMobile: false,
        ifNeedEmail: false,
        company: {},
        address: {},
        invoiceForm: {
          type: "企业",
          category: "增值税普通发票",
          property: "",
          purchaserName: "",
          purchaserTaxpayerNumber: "",
          purchaserAddress: "",
          purchaserPhone: "",
          purchaserBank: "",
          purchaserBankAccount: "",
          remark: "",
          addrMobile: "",
          email: "",
          companyId: null,
          addressId: null,
          isPaper: false
        },
        isShow: false,
        isHide: true,

        productListAll: [],
        productKeyword: "",
        showPopup: false,
        totalPrice: 0,
        isEInvoice: true,
        isPInvoice: false
      };
    },

    methods: {
      getRadioVal() {
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
      goBack() {
        history.go(-1);
      },
      SaveType(type) {
        localStorage.setItem("type", type);
      },
      seletedOrder(company) {
        this.loadingList = false;
        this.company = company;
      },
      getDefaultCompany() {
        getDefaultCompany().then(res => {
          if (res.data.code === 0) {
            this.company = [];
          } else {
            this.company = res.data.content;
            this.invoiceForm.purchaserName = this.company.name;
            this.invoiceForm.purchaserTaxpayerNumber = this.company.taxNumber;
            this.invoiceForm.purchaserAddress = this.company.address;
            this.invoiceForm.purchaserPhone = this.company.phone;
            this.invoiceForm.purchaserBank = this.company.bank;
            this.invoiceForm.purchaserBankAccount = this.company.bankAccount;
            this.invoiceForm.companyId = this.company.companyId;
          }
        });
      },
      getDefaultAddress() {
        getDefaultAddress().then(res => {
          if (res.data.code === 1) {
            this.address = res.data.content;
            this.invoiceForm.addressId = this.address.addressId;
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
      getCustomer() {
        getCustomer({}).then(res => {
          this.loadingList = false;
          this.invoiceForm.email = res.data.content.email;
          this.invoiceForm.addrMobile = res.data.content.mobile;
        });
      },
      makeInvoice() {
        this.invoiceForm.isPaper = JSON.parse(localStorage.getItem("isPaper"));
        this.invoiceForm.property = this.invoiceForm.isPaper ? "纸质" : "电子";
        this.invoiceForm.category = !this.invoiceForm.isPaper ? "增值税电子普通发票" : this.invoiceForm.category;
        this.showDisabled = false;
        if (this.selected == 1) {
          MessageBox({
            title: "提示",
            message: "确认抬头正确并开票吗？",
            showCancelButton: true
          }).then(action => {
            if (action === "confirm") {
              //验证邮箱
              if (this.ifNeedEmail === true) {
                if (this.invoiceForm.email === "") {
                  this.showDisabled = true;
                  return Toast("请输入邮箱");
                } else if (!Isemail.validate(this.invoiceForm.email)) {
                  this.showDisabled = true;
                  return Toast("邮箱格式不正确");
                }
              } else {
                if (this.invoiceForm.email) {
                  if (!Isemail.validate(this.invoiceForm.email)) {
                    this.showDisabled = true;
                    return Toast("邮箱格式不正确");
                  }
                }
              }
              //手机号验证
              let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
              if (this.ifNeedMobile === true) {
                if (this.invoiceForm.addrMobile === "") {
                  this.showDisabled = true;
                  return Toast("请输入手机号码");
                } else if (!reg.test(this.invoiceForm.addrMobile)) {
                  this.showDisabled = true;
                  return Toast("手机格式不正确");
                }
              } else {
                if (this.invoiceForm.addrMobile) {
                  if (!reg.test(this.invoiceForm.addrMobile)) {
                    this.showDisabled = true;
                    return Toast("手机格式不正确");
                  }
                }
              }
              if (this.productList === null) {
                this.showDisabled = true;
                return Toast("商品服务不能为空");
              }
              this.invoiceForm.products = this.productList;
              productMakeInvoice(this.invoiceForm).then(res => {
                if (res.data.code === 1) {
                  this.$messagebox.alert(res.data.message);
                  this.$router.push(`/make/success`);
                }
              }).catch(error => {
                if (error.response.data.code === 1) {
                  this.showDisabled = false;
                  Toast(error.response.data.message);
                  this.showDisabled = true;
                } else {
                  this.showDisabled = false;
                  Toast("请检查信息并完善");
                  this.showDisabled = true;
                }
              });
            }
          });
        } else {
          MessageBox({
            title: "提示",
            message: "确认以上信息并开票吗？",
            showCancelButton: true
          }).then(action => {
            if (action === "confirm") {
              if (this.productList === null) {
                this.showDisabled = true;
                return Toast("商品服务不能为空");
              }
              this.invoiceForm.products = this.productList;
              productMakeInvoice(this.invoiceForm).catch(error => {
                if (error.response.data.code === 1) {
                  this.showDisabled = false;
                  Toast(error.response.data.message);
                  this.showDisabled = true;
                } else {
                  this.showDisabled = false;
                  Toast("请检查信息并完善");
                  this.showDisabled = true;
                }
              });
            }
          });
        }
        localStorage.removeItem("productList");
      },
      //计算发票金额
      calcAmount() {
        let money = 0;
        if (this.productList !== null) {
          for (let i = 0; i < this.productList.length; i++) {
            money += this.productList[i].price * this.productList[i].number;
          }
          this.amountOfMoney = money.toFixed(2);
        }
      },
      //获取开票备注
      getInvoiceRemark() {
        getRule().then(res => {
          this.invoiceForm.remark = res.data.content.remark;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      },
      //删除商品
      deleteProduct(id) {
        for (let i = 0; i < this.productList.length; i++) {
          if (id === this.productList[i].productId) {
            this.productList.splice(i, 1);
          }
          localStorage.setItem("productList", JSON.stringify(this.productList));
          this.productList = JSON.parse(localStorage.getItem("productList"));
        }
        this.amountOfMoney = 0;
        this.calcAmount();
      },
      getInvoicingService() {
        getShopSupport().then(res => {
          this.ifNeedMobile = res.data.content.ifNeedMobile;
          this.ifNeedEmail = res.data.content.ifNeedEmail;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      },
      getProductList(params) {
        getProductList(params).then(res => {
          this.productListAll = res.data.content;
        });
      },
      appendProduct() {
        let obj = {};
        for (let i = 0; i < this.productListAll.length; i++) {
          if (this.productListAll[i].number > 0) {
            obj = {
              productId: this.productListAll[i].productId,
              specification: this.productListAll[i].specification,
              unit: this.productListAll[i].unit,
              price: this.productListAll[i].price,
              name: this.productListAll[i].name,
              number: this.productListAll[i].number
            };
            let oldList = JSON.parse(localStorage.getItem("productList")) || [];
            oldList.push(obj);
            localStorage.setItem("productList", JSON.stringify(oldList));
          }
        }
        this.resetPage();
        this.calcAmount();
        this.showPopup = false;
      },
      showProductSearchPopup() {
        this.totalPrice = 0;
        this.showPopup = true;
        this.productKeyword = "";
        this.getProductList();
      },
      onProductSearch() {
        this.getProductList({name: this.productKeyword});
      },
      calcTotalPrice() {
        let total = 0;
        if (this.productListAll !== null) {
          for (let i = 0; i < this.productListAll.length; i++) {
            total += this.productListAll[i].price * (this.productListAll[i].number || 0);
          }
          this.totalPrice = total;
        }
      },
      resetPage() {
        this.accessToken = localStorage.getItem("accessToken");
        this.productList = JSON.parse(localStorage.getItem("productList"));
        this.invoiceForm.type = localStorage.getItem("type");
        if (this.invoiceForm.type) {
          this.invoiceForm.type = localStorage.getItem("type");
        } else {
          this.invoiceForm.type = "企业";
        }
      },
      selectInvoiceType() {
        localStorage.setItem("type", this.invoiceForm.type);
        if (this.invoiceForm.type === "企业") {
          this.getDefaultCompany();
          this.getDefaultAddress();
        } else if (this.invoiceForm.type === "个人") {
          this.invoiceForm.purchaserName = "个人";
          this.invoiceForm.purchaserTaxpayerNumber = "";
          this.invoiceForm.purchaserAddress = "";
          this.invoiceForm.purchaserPhone = "";
          this.invoiceForm.purchaserBank = "";
          this.invoiceForm.purchaserBankAccount = "";
          this.invoiceForm.companyId = null;
        }
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
      gotoAddress() {
        if (this.address) {
          this.$router.push({
            path: "/address/",
            name: "Address",
            params: {
              id: this.address.addressId,
              from: "make"
            }
          });
        } else {
          this.$router.push({
            path: "/address/",
            name: "Address",
            params: {
              id: "",
              from: "make"
            }
          });
        }
      }
    },
    mounted() {
      this.getProductList();
    },
    created() {
      this.resetPage();
      this.accessToken = localStorage.getItem("accessToken");
      this.invoiceForm.isPaper = JSON.parse(localStorage.getItem("isPaper"));
      this.selected = this.invoiceForm.isPaper ? 2 : 1;
      if (localStorage.getItem("type")) {
        this.invoiceForm.type = localStorage.getItem("type");
      } else {
        this.invoiceForm.type = "企业";
      }
    },
    activated() {
      this.seletedOrder();
    },
    mounted() {
      this.calcAmount();
      this.getDefaultAddress();
      this.getDefaultCompany();
      this.getCustomer();
      this.getInvoiceRemark();
      this.getInvoicingService();
    }
  };
</script>

<style scoped>
  @import 'make.css';

  .mint-btn div {
    margin: 20px;
    height: 44px;
    background-color: #1989fa;
    border-radius: 8px;
    box-shadow: 0px 3px 15px 0px rgba(12, 143, 192, 0.23);
    color: #fff;
    text-align: center;
    line-height: 44px;
    font-size: 16px;
  }

  ;

  .van-cell__value {
    min-width: 74%;
  }

  .page-part .van-cell__title {
    width: 6.2em;
    flex: none;
  }

  .page-part .van-cell__value {
    flex: 3;
    text-align: left;
  }

  .line {
    padding: 1px;
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
