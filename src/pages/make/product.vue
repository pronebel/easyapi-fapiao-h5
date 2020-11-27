<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <Header @head-back="goBack()" headerTitle="开具电子发票" v-if="show"></Header>
    <div class="nav" style="margin-top: 0px">
      <div id="loading">
        <van-loading v-show="loadingList" type="spinner" color="#56cbf6"/>
      </div>
      <p>请选择发票类型</p>
      <van-row type="flex" justify="space-between" class="twoBox">
        <van-col span="12" v-show="ifElectronic ==='true'">
          <div :class="{'blueBox': invoiceForm.property=='电子', 'grayBox': invoiceForm.property!='电子' }"
               style="margin-right:5px"
               @click="changeElectronic">
            <p style="font-size: 16px; margin-top: -6px">电子发票</p>
            <p style="font-size: 12px; margin-top: 6px">最快1分钟开具</p>
          </div>
        </van-col>
        <van-col span="12" v-show="this.ifPaper ==='true'">
          <div :class="{'blueBox': invoiceForm.property=='纸质', 'grayBox': invoiceForm.property!='纸质' }"
               style="margin-left:5px" @click="changePaper">
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
        <van-cell title="发票类型" center v-show="invoiceForm.property == '纸质'">
          <van-radio-group class="van-radio-group_type" v-model="invoiceForm.type" direction="horizontal"
          >
            <van-radio style="margin-bottom: 5px;" name="增值税普通发票">增值税普通发票</van-radio>
            <van-radio name="增值税专用发票" v-if="invoiceForm.type==='企业'">增值税专用发票</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field label="发票抬头" v-if="invoiceForm.type === '个人'" placeholder="请输入姓名/事业单位"
                   v-model="invoiceForm.purchaserName"/>
        <van-field label="发票抬头" readonly v-if="invoiceForm.type === '企业'" @click="gotoCompany" right-icon="arrow"
                   placeholder="请选择发票抬头" v-model="invoiceForm.purchaserName"/>
        <van-field label="税号" value="" readonly v-if="invoiceForm.type === '企业'"
                   v-model="invoiceForm.purchaserTaxpayerNumber"/>
        <van-field label="更多" right-icon="arrow-down" v-if="invoiceForm.type === '企业'" @click="purchaserMore"
                   v-show="isHide"
                   readonly placeholder="地址、电话、开户行等"/>
        <div v-show="isShow">
          <van-field v-if="invoiceForm.type === '企业'" @click="purchaserMoreHide" label="地址" value="" readonly
                     v-model="invoiceForm.purchaserAddress" right-icon="arrow-up"/>
          <van-field v-if="invoiceForm.type === '企业'" label="电话" value="" readonly
                     v-model="invoiceForm.purchaserPhone"/>
          <van-field v-if="invoiceForm.type === '企业'" label="开户行" value="" readonly
                     v-model="invoiceForm.purchaserBank"/>
          <van-field v-if="invoiceForm.type === '企业'" label="银行账号" value="" readonly
                     v-model="invoiceForm.purchaserBankAccount"/>
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
      <van-field class="merge-order_price" label="发票金额" v-model="invoiceForm.price" readonly></van-field>
      <van-field label="备注" :placeholder="remarkPlaceholder" v-model="invoiceForm.remark"></van-field>
    </div>

    <div>
      <div v-show="this.ifElectronic">
        <div class="page-part" style="margin-bottom: 60px;">
          <p>接收方式</p>
          <van-field label="电子邮箱" v-model="invoiceForm.email"></van-field>
          <van-field label="联系方式" v-model="invoiceForm.addrMobile"></van-field>
        </div>
      </div>
      <div v-show="!this.ifElectronic">
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
      >提交
      </van-button>
    </div>
    <div>
      <router-view @select-company="selectCompany"></router-view>
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
      <van-submit-bar :price="productPrice * 100" button-text="添加商品" @submit="appendProduct" button-color="#1989fa"/>
    </van-popup>
  </div>
</template>

<script>
  import { getProductList } from "../../api/product";
  import { getCustomer } from "../../api/customer";
  import { getDefaultCompany } from "../../api/company";
  import { getDefaultAddress } from "../../api/address";
  import { getShopSupport } from "../../api/shop";
  import { getRule } from "../../api/info";
  import { productMakeInvoice } from "../../api/make";
  import Header from "../../components/header.vue";
  import { Toast } from "vant";
  import { Dialog } from "vant";
  import Isemail from "isemail";

  export default {
    name: "MakeProduct",
    components: {
      Header
    },
    data() {
      return {
        isShow: false,
        isHide: true,
        loadingList: true,
        ifElectronic: localStorage.getItem("ifElectronic"),
        ifPaper: localStorage.getItem("ifPaper"),
        showPopup: false,
        productList: "",//商品列表
        ifNeedMobile: false,//手机号码是否必填
        ifNeedEmail: false,//邮箱是否必填
        company: {},//抬头对象
        address: {},//地址对象
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
          remark: "",
          addrMobile: "",
          email: "",
          companyId: null,
          addressId: null,
          price: 0
        },
        productListAll: [],
        productKeyword: "",//商品服务搜索关键字
        productPrice: 0//选择商品总价
      };
    },

    methods: {
      /** 购买方更多信息 */
      purchaserMore() {
        this.isShow = true;
        this.isHide = false;
      },
      /** 隐藏购买方更多信息 */
      purchaserMoreHide() {
        this.isShow = false;
        this.isHide = true;
      },
      goBack() {
        history.go(-1);
      },
      selectCompany(company) {
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
      getCustomer() {
        getCustomer({}).then(res => {
          this.loadingList = false;
          this.invoiceForm.email = res.data.content.email;
          this.invoiceForm.addrMobile = res.data.content.mobile;
        });
      },
      makeInvoice() {
        //验证邮箱
        if (this.ifNeedEmail === true) {
          if (this.invoiceForm.email === "") {
            return Toast("请输入邮箱");
          } else if (!Isemail.validate(this.invoiceForm.email)) {
            return Toast("邮箱格式不正确");
          }
        } else {
          if (this.invoiceForm.email) {
            if (!Isemail.validate(this.invoiceForm.email)) {
              return Toast("邮箱格式不正确");
            }
          }
        }
        //手机号验证
        let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
        if (this.ifNeedMobile === true) {
          if (this.invoiceForm.addrMobile === "") {
            return Toast("请输入手机号码");
          } else if (!reg.test(this.invoiceForm.addrMobile)) {
            return Toast("手机格式不正确");
          }
        } else {
          if (this.invoiceForm.addrMobile) {
            if (!reg.test(this.invoiceForm.addrMobile)) {
              return Toast("手机格式不正确");
            }
          }
        }
        if (this.productList === null) {
          return Toast("商品服务不能为空");
        }
        Dialog.confirm({
          title: "提示",
          message: "确认抬头正确并开票吗？"
        }).then(() => {
          Toast.loading({
            message: "开票中...",
            forbidClick: true
          });
          this.invoiceForm.products = this.productList;
          productMakeInvoice(this.invoiceForm).then(res => {
            if (res.data.code === 1) {
              Toast.clear();
              this.$router.push(`/make/success`);
            }
          }).catch(error => {
            Toast(error.response.data.message);
          });
        }).catch(() => {
        });

        localStorage.removeItem("productList");
      },
      /** 计算发票金额 */
      calcAmount() {
        let money = 0;
        if (this.productList !== null) {
          for (let i = 0; i < this.productList.length; i++) {
            money += this.productList[i].price * this.productList[i].number;
          }
          this.invoiceForm.price = money.toFixed(2);
        }
      },
      /** 获取开票备注 */
      getInvoiceRemark() {
        getRule().then(res => {
          this.remarkPlaceholder = res.data.content.remark;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      },
      /** 删除商品 */
      deleteProduct(id) {
        for (let i = 0; i < this.productList.length; i++) {
          if (id === this.productList[i].productId) {
            this.productList.splice(i, 1);
          }
          localStorage.setItem("productList", JSON.stringify(this.productList));
          this.productList = JSON.parse(localStorage.getItem("productList"));
        }
        this.invoiceForm.price = 0;
        this.calcAmount();
      },
      /** */
      getShopSupport() {
        getShopSupport().then(res => {
          this.ifNeedMobile = res.data.content.ifNeedMobile;
          this.ifNeedEmail = res.data.content.ifNeedEmail;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      },
      /** */
      getProductList(params) {
        getProductList(params).then(res => {
          this.productListAll = res.data.content;
        });
      },
      /** */
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
      /** */
      showProductSearchPopup() {
        this.productPrice = 0;
        this.showPopup = true;
        this.productKeyword = "";
        this.getProductList();
      },
      /** */
      onProductSearch() {
        this.getProductList({ name: this.productKeyword });
      },
      /** */
      calcTotalPrice() {
        let total = 0;
        if (this.productListAll !== null) {
          for (let i = 0; i < this.productListAll.length; i++) {
            total += this.productListAll[i].price * (this.productListAll[i].number || 0);
          }
          this.productPrice = total;
        }
      },
      /** */
      resetPage() {
        this.productList = JSON.parse(localStorage.getItem("productList"));
        this.invoiceForm.type = localStorage.getItem("type");
        if (this.invoiceForm.type) {
          this.invoiceForm.type = localStorage.getItem("type");
        } else {
          this.invoiceForm.type = "企业";
        }
      },
      /** 选择发票类型 */
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
      changeElectronic() {
        this.invoiceForm.category = "增值税电子普通发票";
        this.invoiceForm.property = "电子";
      },
      changePaper() {
        this.invoiceForm.property = "纸质";
        this.invoiceForm.category = "增值税普通发票";
      },
      /** 前往抬头管理页 */
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
      /** 前往地址管理页 */
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
      if (localStorage.getItem("type")) {
        this.invoiceForm.type = localStorage.getItem("type");
        this.selectInvoiceType();
      }
    },
    activated() {
      this.selectCompany();
    },
    mounted() {
      this.calcAmount();
      this.getCustomer();
      this.getInvoiceRemark();
      this.getShopSupport();
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
      }
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
