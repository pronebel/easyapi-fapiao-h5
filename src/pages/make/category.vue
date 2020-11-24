<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <Header @head-back="goBack()" :headerTitle="headerTitle"></Header>
    <div class="nav" style="margin-top: 10px;">
      <div id="loading">
        <van-loading v-show="loadingList" type="spinner" color="#56cbf6"/>
      </div>
      <p>请选择发票类型</p>
      <van-row type="flex" justify="space-between" class="twoBox">
        <van-col span="12" v-show="showElectronic">
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
      <!--<div v-show="this.isEInvoice">-->
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
          <van-cell title="发票类型" center v-show="!this.isEInvoice || !this.showElectronic">
            <van-radio-group class="van-radio-group_type" v-model="paperForm.type" direction="horizontal"
            >
              <van-radio style="margin-bottom: 5px;" name="增值税普通发票" @click="getRadioVal">增值税普通发票</van-radio>
              <van-radio name="增值税专用发票" @click="getRadioVal">增值税专用发票</van-radio>
            </van-radio-group>
          </van-cell>
          <van-field label="发票抬头" v-if="invoiceForm.type === '个人'" placeholder="请输入姓名/事业单位"
                     v-model="invoiceForm.purchaserName"/>
          <van-field label="发票抬头" readonly v-if="invoiceForm.type === '企业'" @click="toAddressManage"
                     right-icon="arrow"
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
        <van-field
          readonly
          clickable
          label="发票类别"
          :value="customCategory"
          placeholder="选择发票类别"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="categoryNameArray"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
        <van-field class="merge-order_price" label="发票金额" v-model="price"></van-field>
        <van-field label="备注" placeholder="请输入备注信息" v-model="invoiceForm.inputValue"></van-field>
        <van-cell title="附件">
          <van-uploader v-model="fileList" multiple>
          </van-uploader>
        </van-cell>
      </div>
      <div class="page-part" style="margin-bottom: 60px" v-show="this.isEInvoice">
        <p>接收方式</p>
        <van-field label="电子邮箱" v-model="email"></van-field>
        <van-field label="联系方式" v-model="contactInformation"></van-field>
      </div>
      <div class="page-part" v-show="!this.isEInvoice">
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
      <div class="page-part" style="margin-bottom: 60px" v-show="!this.isEInvoice">
        <p>开票金额不足200元，需支付邮费</p>
        <van-field label="支付方式" readonly></van-field>
      </div>
      <div class="bottom">
        <van-button
          type="info"
          class="submit"
          @click="goInvoiceSuccess"
          v-if="showDisabled"
        >提交
        </van-button>
        <van-button type="info" class="submit" v-else>开票中</van-button>
      </div>
    </div>
    <div>
      <router-view @seletedOrder="seletedOrder"></router-view>
    </div>
  </div>
</template>

<script>
  import Header from "../../components/header.vue";
  import { getDefaultAddress } from "../../api/address";
  import { Navbar, TabItem } from "mint-ui";
  import { Toast } from "mint-ui";
  import { MessageBox } from "mint-ui";
  import { getDefaultCompany } from "../../api/company";
  import { getCustomer } from "../../api/customer";
  import { getCustomCategoryList } from "../../api/custom-category";
  import { getShopSupport } from "../../api/shop";
  import { getRule } from "../../api/info";
  import { categoryMakeInvoice } from "../../api/make";

  export default {
    name: "singleOrder",
    components: {
      Header
    },
    data() {
      return {
        showPaper: "",
        showElectronic: "",
        loadingList: true,
        customCategory: "软件开发服务",
        price: 1,
        amountOfMoney: 0,
        productList: [],
        contentList: "",
        outOrderNo: "",
        address: {},
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
        categoryNameArray: [],
        sum: 0,
        item: {},
        mergeTax: 0,
        contentId: "",
        howMany: "",
        remark: "",
        returnUrl: "",
        priceSplicing: "",
        invoiceForm: {
          isPaper: false,
          type: "",
          purchaserName: ""
        },
        isEInvoice: true,
        isPInvoice: false,
        paperForm: {
          type: "增值税普通发票"
        },
        isShow: false,
        isHide: true,
        value: "",
        showPicker: false,
        columns: ["杭州", "宁波", "温州", "绍兴", "湖州", "嘉兴", "金华", "衢州"],
        fileList: []
      };
    },

    methods: {
      //获取发票类型
      getRadioVal() {
        this.invoiceForm.category = this.paperForm.type;
      },
      selectType() {
        localStorage.setItem("type", this.invoiceForm.type);
        if (this.invoiceForm.type === "企业") {
          this.getDefaultCompany();
          this.getDefaultAddress();
        } else if (this.invoiceForm.type === "个人") {
          this.invoiceForm.purchaserName = "个人";
          this.invoiceForm.purchaserTaxpayerNumber = "";
          this.invoiceForm.address = "";
          this.invoiceForm.phone = "";
          this.invoiceForm.purchaserBank = "";
          this.invoiceForm.purchaserBankAccount = "";
          this.invoiceForm.companyId = "";
        }
        console.log(this.invoiceForm.type)
        console.log(this.invoiceForm.purchaserName)
      },
      goBack() {
        history.go(-1);
      },
      SaveType(type) {
        localStorage.setItem("type", type);
      },
      seletedOrder(item) {
        this.loadingList = false;
      },
      gotoAddress() {
        if (this.address) {
          this.$router.push({
            path: "/address/",
            name: "Address",
            params: {
              id: this.address.addressID,
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
      },
      getDefaultCompany() {
        getDefaultCompany().then((res) => {
          if (res.data.code === 1) {
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
      getDefaultAddress() {
        getDefaultAddress().then((res) => {
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
      getCustomCategories() {
        let params = {
          taxNumber: this.taxNumber
        };
        getCustomCategoryList(params).then(res => {
          this.categoryName = res.data.content;
          for (let i = 0; i < this.categoryName.length; i++) {
            this.categoryNameArray[i] = this.categoryName[i].name;
          }
          ;
          this.productList = res.data.content.invoiceItems;
          this.remark = this.scanContent.remark;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      },
      getCustomer() {
        getCustomer({ taxNumber: this.taxNumber }).then(res => {
          (this.loadingList = false), (this.email = res.data.content.email);
          this.contactInformation = res.data.content.mobile;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
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
        let data = {
          type: this.invoiceForm.type,
          companyId: this.company.companyId,
          category: "增值税电子普通发票",
          property: "电子",
          email: this.email,
          taxNumber: this.taxNumber,
          price: this.price,
          customCategoryId: this.customCategory,
          addrMobile: this.contactInformation
        };
        categoryMakeInvoice(data).then(res => {
          if (res.data.code === 1) {
            this.$messagebox.alert(res.data.message);
            this.$router.push({
              path: "/single-order-success",
              query: { returnUrl: this.returnUrl }
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
        getRule().then(res => {
          this.remark = res.data.content.remark;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      }
      ,
      getInvoicingService() {
        getShopSupport().then(res => {
          this.ifNeedMobile = res.data.content.ifNeedMobile;
          this.ifNeedEmail = res.data.content.ifNeedEmail;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      },
      //跳转添加内容
      addContent() {
        this.$router.push(`/product`);
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
      onConfirm(value) {
        this.customCategory = value;
        this.showPicker = false;
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
      this.showElectronic = JSON.parse(localStorage.getItem("ifElectronic"));
      this.showPaper = JSON.parse(localStorage.getItem("ifPaper"));
      if (this.showElectronic == false && this.showPaper == true) {
        this.isEInvoice = false;
        this.isPInvoice = true;
      }
    },
    activated() {
      this.seletedOrder();
      event.$on("select", function(data) {
        this.address = data;
        this.$forceUpdate();
      });
    },
    mounted() {
      this.getDefaultAddress();
      this.getDefaultCompany();
      this.getCustomer();
      this.getSpecifications();
      this.getInvoicingService();
      this.getCustomCategories();
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

  .page-part .van-cell__title {
    width: 6.2em;
    flex: none;
  }

  .page-part .van-cell__value {
    flex: 3;
    text-align: left;
  }

  .van-cell__value{
    min-width: 74%;
  }
</style>
