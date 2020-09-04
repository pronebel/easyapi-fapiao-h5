<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="nav">
      <div id="loading">
        <mt-spinner
          color="#56cbf6"
          v-show="loadingList"
          type="fading-circle"
        ></mt-spinner>
      </div>
      <p>请选择发票类型</p>
      <mt-navbar v-model="selected" class="invoice-type">
        <mt-tab-item id="1">
          <p style="font-size: 16px">电子发票</p>
          <p style="font-size: 12px">最快1分钟开具</p>
        </mt-tab-item>
        <mt-tab-item id="2">
          <p style="font-size: 16px;">纸质发票</p>
          <p style="font-size: 12px;">预计一周送达</p>
        </mt-tab-item>
      </mt-navbar>
    </div>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="page-part invoice-con">
          <p>发票详情</p>
          <form action id="formBox" ref="invoiceForm" :model="invoiceForm">
            <van-cell title="抬头类型" center>
              <van-radio-group class="van-radio-group_type" v-model="invoiceForm.type" direction="horizontal"
                               @change="selectType">
                <van-radio name="企业">企业</van-radio>
                <van-radio name="个人">个人</van-radio>
              </van-radio-group>
            </van-cell>
            <van-field label="发票抬头" v-if="invoiceForm.type === '个人'"    placeholder="请输入姓名/事业单位"
                       v-model="invoiceForm.purchaserName"/>
            <van-field label="发票抬头" readonly v-if="invoiceForm.type === '企业'"     @click="gotoCompany" right-icon="arrow"
                       placeholder="请选择发票抬头" v-model="company.name"/>
            <van-field label="税号" value="" readonly v-if="invoiceForm.type === '企    业'" v-model="company.taxNumber"/>
            <van-field label="更多" right-icon="arrow-down" v-if="invoiceForm.type    === '企业'" @click="showMore" v-show="isHide"
                       readonly placeholder="地址、电话、开户行等"/>
            <div v-show="isShow">
              <van-field v-if="invoiceForm.type === '企业'" @click="hide" label="地址" value="" readonly
                         v-model="company.address" right-icon="arrow-up"/>
              <van-field v-if="invoiceForm.type === '企业'" label="电话" value=""     readonly v-model="company.phone"/>
              <van-field v-if="invoiceForm.type === '企业'" label="开户行" value=""     readonly v-model="company.bank"/>
              <van-field v-if="invoiceForm.type === '企业'" label="银行账号"    value="" readonly v-model="company.bankAccount"/>
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
          <div class="btn">
            <mt-button class="submit-btn" @click="showSearchPopup">
              +添加发票内容
            </mt-button
            >
          </div>
          <a class="mint-cell mint-field" style=" border-bottom: 1px solid#ddd;"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text"
                ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;"
                >发票金额</font
                ></font
                ></span
                >

              </div>
              <div class="mint-cell-value">
                <span v-if="make === 'true'" style="color:#ff4848 "
                >{{ amountOfMoney }} <span style="color: #999">元</span></span
                >
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
          <a class="mint-cell mint-field"
          >
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
                <input
                  :placeholder="remark"
                  type="text"
                  style="font-size: 15px"
                  class="mint-field-core"
                  v-model="invoiceForm.inputValue"
                />
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
          <a class="mint-cell mint-field"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text"
                ><font style="vertical-align: inherit;"
                ><font
                  style="vertical-align: inherit;color:#333;font-size: 15px"
                >电子邮件</font
                ></font
                ></span
                >

              </div>
              <div class="mint-cell-value">
                <input
                  placeholder=""
                  type="email"
                  class="mint-field-core"
                  style="color:#333;font-size: 15px"
                  v-model="email"
                />
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
          <a class="mint-cell mint-field"
             style="margin-bottom:60px;"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text"
                ><font style="vertical-align: inherit;"
                ><font
                  style="vertical-align: inherit; color:#333;font-size: 15px"
                >联系方式</font
                ></font
                ></span
                >

              </div>
              <div class="mint-cell-value">
                <input
                  placeholder=""
                  type="tal"
                  class="mint-field-core"
                  style="color:#333;font-size: 15px"
                  v-model="contactInformation"
                />
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
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="paper-capacitor">
          正在开发中...
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
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
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        @input="onSearch"
      />
      <!-- <van-list
        v-model="loading"
        :finished="true"
        finished-text="没有更多了"
        @load="onLoad"
      > -->
      <van-list
        :finished="true"
        finished-text="没有更多了"
      >
        <van-radio-group v-model="radio">
          <van-cell v-for="item in productListAll" :key="item.productId">
            <van-row type="flex" align="center">
              <van-col span="6">
                <van-image width="60" height="60" :src="item.img" />
              </van-col>
              <van-col span="11">
                <span style="display: block">{{ item.name }}</span >
                <span style="display: block; font-size: 12px; color: #888">{{ item.specification }}</span >
                <span>￥</span>
                <input style="width: 40px; text-align: center; border:none;" v-model=" item.price " @change="calcTotalPrice"/>
                <span> 元 / {{ item.unit }}</span >
              </van-col>
              <van-col span="7">
                <van-stepper v-model="item.number" integer min="0" max="99" default-value="0" @change="calcTotalPrice"/>
              </van-col>
            </van-row>
          </van-cell>
        </van-radio-group>
      </van-list>
      <van-submit-bar :price="totalPrice*100" button-text="添加商品" @submit="addTo" button-color="#1989fa"/>
    </van-popup>


  </div>
</template>

<script>
  import {getProductList} from "../../api/product";
  import Header from "../../components/header.vue";
  import {Navbar, TabItem} from "mint-ui";
  import {Toast} from "mint-ui";
  import {MessageBox} from "mint-ui";
  import Isemail from "isemail";
  import axios from '../../api/request'
  import {getDefaultCompany} from "../../api/company";

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
        make: "",
        order: "",
        showDisabled: true,
        selected: "1",
        headerTitle: "开具电子发票",
        active: "tab-container1",
        contactInformation: "",
        NeedMobile: "",
        NeedEmail: "",
        company: {},
        email: "",
        seletedOrderList: [],
        sum: 0,
        item: {},
        mergeTax: 0,
        remark: "",
        invoiceForm: {
          type: "",
          purchaserName: ""
        },
        isShow: false,
        isHide: true,

        // productId: "",
        // specification: "",
        // unit: "",
        // price: "",
        // number: "",
        productListAll: [],
        calcProductList: [],
        searchValue: '',
        showPopup: false,
        radio: null,
        totalPrice: 0,

      };
    },

    methods: {
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
      seletedOrder(item) {
        this.loadingList = false;
        this.company = item;
      },
      getDefaultCompany() {
        let username = this.$store.state.username;
        getDefaultCompany(username).then(res => {
          if (res.data.code === 0) {
            this.company = [];
          } else {
            this.company = res.data.content;
            this.invoiceForm.purchaserName = this.company.name;
            this.invoiceForm.purchaserTaxpayerNumber = this.company.taxNumber;
            this.invoiceForm.address = this.company.address;
            this.invoiceForm.phone = this.company.phone;
            this.invoiceForm.purchaserBank = this.company.bank;
            this.invoiceForm.purchaserBankAccount = this.company.bankAccount;
            this.invoiceForm.companyId = this.company.companyId;
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
      getEmailInfo() {
        let username = this.$store.state.username;
        axios.get("/api/user/" + username + "/invoice/money", {
          params: {
            accessToken: this.accessToken,
            invoiceForm: this.invoiceForm
          }
        }).then(res => {
          this.loadingList = false;
          this.email = res.data.content.email;
          this.contactInformation = res.data.content.mobile;
        });
      },
      goInvoiceSuccess() {
        this.showDisabled = false;
        //验证邮箱
        if (this.NeedEmail === true) {
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
        if (this.NeedMobile === true) {
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
        if (this.productList === null) {
          this.showDisabled = true;
          return Toast("商品服务不能为空");
        }
        let username = this.$store.state.username;
        //验证手机号
        axios.post('/invoice/product/make', {
          products: this.productList,
          accessToken: this.accessToken,
          type: this.invoiceForm.type,
          category: "增值税电子普通发票",
          property: "电子",
          ifUseMergeVm: "false",
          remark: this.invoiceForm.inputValue,
          username: username,
          companyId: this.company.companyId,
          email: this.email,
          addrMobile: this.contactInformation
        }).then(res => {
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
        localStorage.removeItem("productList");
      },
      //计算发票金额
      calculatedAmount() {
        let money = 0;
        if (this.productList !== null) {
          for (var i = 0; i < this.productList.length; i++) {
            money += this.productList[i].price * this.productList[i].number;
          }
          this.amountOfMoney = money.toFixed(2);
        }
      },
      //获取备注
      getSpecifications() {
        axios.get("/api/invoice/rule", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.remark = res.data.content.remark;
        }).catch(error => {
          console.log(error);
        });
      },
      //删除内容
      deleteContent(id) {
        for (var i = 0; i < this.productList.length; i++) {
          if (id === this.productList[i].productId) {
            this.productList.splice(i, 1);
          }
          localStorage.setItem("productList", JSON.stringify(this.productList));
          this.productList = JSON.parse(localStorage.getItem("productList"));
        }
        this.amountOfMoney = 0;
        this.calculatedAmount();
      },
      getInvoicingService() {
        axios.get("/api/shop/0/support", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.NeedMobile = res.data.content.ifNeedMobile;
          this.NeedEmail = res.data.content.ifNeedEmail;
        }).catch(error => {
          console.log(error);
        });
      },
      //跳转添加内容
      addContent() {
        this.$router.push(`/addProduct`);
      },
      getProductList(params) {
        getProductList(params).then(res => {
          this.productListAll = res.data.content;
        });
      },
      addTo() {
        let obj = {}
        for (var i = 0; i < this.productListAll.length; i++) {
          // console.log(this.productListAll[i],33333)
          if (this.productListAll[i].number > 0 ) {
            obj = {
                productId: this.productListAll[i].productId,
                specification: this.productListAll[i].specification,
                unit: this.productListAll[i].unit,
                price: this.productListAll[i].price,
                name: this.productListAll[i].name,
                number: this.productListAll[i].number
            };
            let oldList = JSON.parse(localStorage.getItem("productList")) || []
            oldList.push(obj)
            localStorage.setItem("productList", JSON.stringify(oldList))
          }

        }
        // calcProductList




        // let obj = {};
        // if (this.price !== "") {
        //   if (this.number !== "") {
        //     if (this.number !== "0" && this.price !== 0) {
        //       obj = {
        //         productId: this.productId,
        //         specification: this.specification,
        //         unit: this.unit,
        //         price: this.price,
        //         name: this.name,
        //         number: this.number
        //       };
        //       let oldList = JSON.parse(localStorage.getItem("productList")) || [];
        //       oldList.push(obj);
        //       localStorage.setItem("productList", JSON.stringify(oldList));
        //       this.$router.push({path: "/make/product"});
        //     } else {
        //       Toast.fail("数量,单价不能为0");
        //       // return true
        //     }
        //   } else {
        //     Toast.fail("数量不能为空");
        //     // return true
        //   }
        // } else {
        //   Toast.fail("单价不能为空");
        //   // return true
        // }
        this.resetPage()
        this.showPopup = false
      },
      showSearchPopup(){
        // console.log(this.totalPrice,333333)
        this.totalPrice = 0
        this.showPopup = true
        this.searchValue = ''
        this.getProductList()
      },
      chooseRadio(id){
        this.radio = id
        for (var i = 0; i < this.productListAll.length; i++) {
          if (this.radio === this.productListAll[i].productId) {
            this.productId = this.productListAll[i].productId
            this.specification = this.productListAll[i].specification;
            this.unit = this.productListAll[i].unit;
            this.price = this.productListAll[i].price;
            this.name = this.productListAll[i].name;
          }
        }
      },
      onSearch() {
        var searchVal = {name: this.searchValue}
        this.getProductList(searchVal)
      },
      calcTotalPrice(){
        let total = 0;
        if (this.productListAll !== null) {
          for (var i = 0; i < this.productListAll.length; i++) {
            total += this.productListAll[i].price * (this.productListAll[i].number || 0);
          }
          this.totalPrice = total;
        }
      },
      resetPage(){
        this.make = localStorage.getItem("make");
        this.order = localStorage.getItem("order");
        this.accessToken = localStorage.getItem("accessToken");
        this.productList = JSON.parse(localStorage.getItem("productList"));
        this.invoiceForm.type = localStorage.getItem("type");
        if (this.invoiceForm.type) {
          this.invoiceForm.type = localStorage.getItem("type");
        } else {
          this.invoiceForm.type = "企业";
        }
      },
      selectType() {
        console.log(this.invoiceForm.type);
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
        console.log(this.invoiceForm);

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
    mounted() {
      this.getProductList();
    },
    created() {
      this.resetPage()
    },
    activated() {
      this.seletedOrder();
    },
    mounted() {
      this.calculatedAmount();
      this.getDefaultCompany();
      this.getEmailInfo();
      this.getSpecifications();
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
  };

</style>
