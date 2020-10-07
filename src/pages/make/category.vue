<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <Header @head-back="goBack()" :headerTitle="headerTitle"></Header>
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
          <form action="" id="formBox" ref="invoiceForm" :model="invoiceForm">
            <a class="mint-cell mint-field">
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <span
                    class="mint-cell-text"
                    style="font-size: 15px;color:#333"
                  >抬头类型</span
                  >
                </div>
                <div class="mint-cell-value">
                  <input
                    type="radio"
                    id="radio-1-1"
                    name="radio-1-set"
                    class="regular-radio big-radio"
                    value="企业"
                    checked
                    v-model="invoiceForm.type"
                    @click="SaveType('企业')"
                  />
                  <label for="radio-1-1" @click="SaveType('企业')">企业</label>
                  <input
                    type="radio"
                    id="radio-1-2"
                    name="radio-1-set"
                    class="regular-radio big-radio"
                    v-model="invoiceForm.type"
                    value="个人"
                    @click="SaveType('个人')"
                  />
                  <label for="radio-1-2" @click="SaveType('个人')">个人</label>
                </div>
              </div>
            </a>
            <a
              class="mint-cell mint-field"
              @click="toAddressManage"
              v-if="invoiceForm.type === '企业'"
            >
              <van-field label="发票抬头" readonly right-icon="arrow" placeholder="请选择发票抬头" v-model="company.name"/>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <van-field label="税号" value="" readonly v-model="company.taxNumber"/>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <van-field label="地址" value="" readonly v-model="company.address"/>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <van-field label="电话" value="" readonly v-model="company.phone"/>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <van-field label="开户行" value="" readonly v-model="company.bank"/>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <van-field label="银行账号" value="" readonly v-model="company.bankAccount"/>
            </a>
          </form>
        </div>
        <div class="invoice-contents">
          <p>发票内容</p>
          <div class="invoice-category">
            <div>
              <span>发票类别</span>
              <select
                name=""
                id=""
                @change="selectCustomCategoryId()"
                v-model="customCategory"
              >
                <option
                  :value="categoryName[index].invoiceCustomCategoryId"
                  v-for="(items, index) in categoryName"
                  :key="index"
                  v-text="items.name"
                ></option>
              </select>
            </div>
            <div>
              <span>开票金额</span>
              <input
                type="number"
                placeholder="请输入开票金额"
                v-model="price"
                style="color:#e4393c;"
              />元
            </div>
          </div>
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
          <van-cell-group title="接收方式">
            <van-field label="电子邮件" value="" v-model="email"/>
            <van-field label="手机号码" type="tel" value="" v-model="contactInformation"/>
          </van-cell-group>
          <div class="bottom">
            <mt-button
              class="submit"
              @click="goInvoiceSuccess"
              v-if="showDisabled"
            >提交
            </mt-button
            >
            <mt-button class="submit" v-else>开票中...</mt-button>
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
  </div>
</template>

<script>
  import Header from "../../components/header.vue";
  import {Navbar, TabItem} from "mint-ui";
  import {Toast} from "mint-ui";
  import {MessageBox} from "mint-ui";
  import Isemail from "isemail";
  import {getDefaultCompany} from "../../api/company";
  import {getCustomer} from "../../api/customer";
  import {getCustomCategoryList} from "../../api/custom-category";

  export default {
    name: "singleOrder",
    components: {
      Header
    },
    data() {
      return {
        loadingList: true,
        customCategory: "软件开发服务",
        price: 1,
        amountOfMoney: 0,
        productList: [],
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
        categoryName: "",
        sum: 0,
        item: {},
        mergeTax: 0,
        contentId: "",
        howMany: "",
        remark: "",
        returnUrl: "",
        priceSplicing: "",
        invoiceForm: {
          type: ""
        }
      };
    },

    methods: {
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
        getDefaultCompany().then(res => {
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
      getCustomCategories() {
        let params = {
          taxNumber: this.taxNumber
        };
        getCustomCategoryList(params).then(res => {
          this.categoryName = res.data.content;
          this.productList = res.data.content.invoiceItems;
          this.remark = this.scanContent.remark;
        }).catch(error => {
          console.log(error);
        });
      },
      getCustomer() {
        getCustomer({taxNumber: this.taxNumber}).then(res => {
          (this.loadingList = false), (this.email = res.data.content.email);
          this.contactInformation = res.data.content.mobile;
        }).catch(error => {
          console.log(error);
        });
      }
      ,
      goInvoiceSuccess() {
        this.showDisabled = false;
        //验证邮箱
        let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

        if (this.ifNeedEmail === true) {
          if (this.email === "") {
            this.showDisabled = true;
            return Toast("请输入邮箱");
          } else if (!regEmail.test(this.email)) {

            this.showDisabled = true;
            return Toast("邮箱格式不正确");
          }
        } else {
          if (this.email) {
            if (!regEmail.test(this.email)) {
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
        if (this.productList !== null) {
        }
        this.$ajax.post('/invoice/category/make', {
          data: {
            type: this.invoiceForm.type,
            companyId: this.company.companyId,
            category: "增值税电子普通发票",
            property: "电子",
            email: this.email,
            taxNumber: this.taxNumber,
            price: this.price,
            customCategoryId: this.customCategory,
            addrMobile: this.contactInformation,
            accessToken: this.accessToken
          }
        }).then(res => {
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
      }
      ,
      selectCustomCategoryId() {
      }
      ,
      //获取备注
      getSpecifications() {
        this.$ajax.get("/api/invoice/rule", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.remark = res.data.content.remark;
        }).catch(error => {
          console.log(error);
        });
      }
      ,
      getInvoicingService() {
        this.$ajax.get("/api/shop/0/support", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.ifNeedMobile = res.data.content.ifNeedMobile;
          this.ifNeedEmail = res.data.content.ifNeedEmail;
        }).catch(error => {
          console.log(error);
        });
      }
      ,
      //跳转添加内容
      addContent() {
        this.$router.push(`/product`);
      }
    },
    watch: {},
    created() {
      if (this.$route.query.accessToken) {
        localStorage.setItem("accessToken", this.$route.query.accessToken);
        this.accessToken = localStorage.getItem("accessToken");
      } else if (this.accessToken === "") {
        Toast("accessToken不能为空！");
      }

      if (this.$route.query.taxNumber) {
        localStorage.setItem("taxNumber", this.$route.query.taxNumber);
        this.taxNumber = localStorage.getItem("taxNumber");
      } else if (this.taxNumber === "") {
        Toast("taxNumber不能为空！");
      }

      this.accessToken = localStorage.getItem("accessToken");
      this.taxNumber = localStorage.getItem("taxNumber");
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
      this.getCustomCategories();
    }
  };
</script>

<style scoped>
  @import 'make.css';
</style>
