<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <div class="nav" style="margin-top: 10px;">
      <div id="loading">
        <van-loading v-show="loadingList" type="spinner" color="#56cbf6"/>
      </div>
      <p>请选择发票类型</p>
      <van-row type="flex" justify="space-between" class="twoBox">
        <van-col span="12" v-show="showElectronic">
          <div :class="{'blueBox': ifElectronic, 'grayBox': ifPaper }" style="margin-right:5px" @click="getElectronic">
            <p style="font-size: 16px; margin-top: -6px">电子发票</p>
            <p style="font-size: 12px; margin-top: 6px">最快1分钟开具</p>
          </div>
        </van-col>
        <van-col span="12">
          <div :class="{'blueBox': !ifElectronic, 'grayBox': !ifPaper }" style="margin-left:5px" @click="getPaper">
            <p style="font-size: 16px; margin-top: -6px">纸质发票</p>
            <p style="font-size: 12px; margin-top: 6px">预计一周送达</p>
          </div>
        </van-col>
      </van-row>
    </div>
    <div>
      <div class="page-part invoice-con">
        <p>发票详情</p>
        <form action="" id="formBox" ref="invoiceForm" :model="invoiceForm">
          <van-cell title="抬头类型" center>
            <van-radio-group class="van-radio-group_type" v-model="invoiceForm.type" direction="horizontal"
                             @change="selectInvoiceType">
              <van-radio name="企业">企业</van-radio>
              <van-radio name="个人">个人/事业单位</van-radio>
            </van-radio-group>
          </van-cell>
          <van-cell title="发票类型" center v-show="!this.ifElectronic || !this.showElectronic">
            <van-radio-group class="van-radio-group_type" v-model="invoiceForm.category" direction="horizontal"
            >
              <van-radio style="margin-bottom: 5px;" name="增值税普通发票" @click="getRadioVal">增值税普通发票</van-radio>
              <van-radio name="增值税专用发票" @click="getRadioVal">增值税专用发票</van-radio>
            </van-radio-group>
          </van-cell>
          <van-field label="发票抬头" v-if="invoiceForm.type === '个人'" placeholder="请输入姓名/事业单位"
                     v-model="invoiceForm.purchaserName"/>
          <van-field label="发票抬头" readonly v-if="invoiceForm.type === '企业'" @click="toCompany"
                     right-icon="arrow"
                     placeholder="请选择发票抬头" v-model="company.name"/>
          <van-field label="税号" value="" readonly v-if="invoiceForm.type === '企业'" v-model="company.taxNumber"/>
          <van-field label="更多" right-icon="arrow-down" v-if="invoiceForm.type    === '企业'" @click="purchaserMore"
                     v-show="isHide"
                     readonly placeholder="地址、电话、开户行等"/>
          <div v-show="isShow">
            <van-field v-if="invoiceForm.type === '企业'" @click="purchaserMoreHide" label="地址" value="" readonly
                       v-model="company.address" right-icon="arrow-up"/>
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
          :value="customCategory.name"
          placeholder="选择发票类别"
          @click="showCustomCategory = true"
        />
        <van-popup v-model="showCustomCategory" round position="bottom">
          <van-picker
            show-toolbar
            :columns="customCategoryList"
            value-key="name"
            @cancel="showCustomCategory = false"
            @confirm="onConfirm"
          />
        </van-popup>

        <van-field class="merge-order_price" readonly
                   clickable label="发票金额" placeholder="请准确输入开票金额"
                   v-model="invoiceForm.price" @touchstart.native.stop="keyboardShow = true"></van-field>
        <van-number-keyboard
          :show="keyboardShow"
          v-model="invoiceForm.price"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          @blur="keyboardShow = false"
        />
        <van-field label="备注" placeholder="请输入备注信息" v-model="invoiceForm.remark"></van-field>
        <van-cell title="附件">
          <van-uploader v-model="fileList" multiple>
          </van-uploader>
        </van-cell>
      </div>
      <div class="page-part" style="margin-bottom: 60px" v-show="this.ifElectronic">
        <p>接收方式</p>
        <van-field label="电子邮箱" v-model="invoiceForm.email"></van-field>
        <van-field label="联系方式" v-model="invoiceForm.addrMobile"></van-field>
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
        >申请开票
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {getDefaultAddress} from "../../api/address";
  import {Toast} from "vant";
  import {Dialog} from 'vant';
  import {getDefaultCompany} from "../../api/company";
  import {getCustomer} from "../../api/customer";
  import {getCustomCategoryList} from "../../api/custom-category";
  import {getShopSupport} from "../../api/shop";
  import {getRule} from "../../api/info";
  import {categoryMakeInvoice} from "../../api/make";

  export default {
    name: "MakeCategory",
    data() {
      return {
        showCustomCategory: false,
        keyboardShow: false,
        showPaper: "",
        showElectronic: "",
        loadingList: true,
        ifElectronic: localStorage.getItem("ifElectronic"),
        ifPaper: localStorage.getItem("ifPaper"),
        isShow: false,
        isHide: true,
        ifNeedMobile: false,
        ifNeedEmail: false,
        company: {},
        address: {},
        //自定义分类列表
        customCategoryList: [],
        //选中的自定义分类
        customCategory: {
          customCategoryId: null,
          name: ""
        },
        invoiceForm: {
          ifPaper: false,
          category: '增值税电子普通发票',
          property: '电子',
          type: '个人',
          purchaserName: "",
          purchaserTaxpayerNumber: "",
          purchaserAddress: "",
          purchaserPhone: "",
          purchaserBank: "",
          purchaserBankAccount: "",
          price: null,
          addrMobile: "",
          email: "",
          remark: ""
        },
        fileList: []
      };
    },

    methods: {
      //获取发票类型
      getRadioVal() {
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
          this.invoiceForm.companyId = "";
        }
      },
      goBack() {
        history.go(-1);
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
            this.invoiceForm.purchaserAddress = this.company.address;
            this.invoiceForm.purchaserPhone = this.company.phone;
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
      toCompany() {
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
        getCustomCategoryList({}).then(res => {
          if (res.data.content) {
            for (let i = 0; i < res.data.content.length; i++) {
              this.customCategoryList[i] = res.data.content[i];
            }
          }
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      },
      getCustomer() {
        getCustomer({}).then(res => {
          (this.loadingList = false), (this.invoiceForm.email = res.data.content.email);
          this.invoiceForm.addrMobile = res.data.content.mobile;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      }
      ,
      makeInvoice() {
        if (this.customCategory == null || this.customCategory.customCategoryId == null) {
          return Toast("请选择发票类别");
        }
        let regPrice = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if (this.invoiceForm.price == null || this.invoiceForm.price <= 0) {
          return Toast("请输入开票金额");
        } else if (!regPrice.test(this.invoiceForm.price)) {
          return Toast("请输入合法开票金额，最多2位小数");
        }
        //验证邮箱
        let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

        if (this.ifNeedEmail === true) {
          if (this.invoiceForm.email === "") {
            return Toast("请输入邮箱");
          } else if (!regEmail.test(this.invoiceForm.email)) {
            return Toast("邮箱格式不正确");
          }
        } else {
          if (this.invoiceForm.email) {
            if (!regEmail.test(this.invoiceForm.email)) {
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
        Dialog.confirm({
          title: '提示',
          message: '确认抬头和金额正确并申请开票吗？',
        }).then(() => {
          Toast.loading({
            message: '开票中...',
            forbidClick: true,
          });
          this.invoiceForm.customCategoryId = this.customCategory.customCategoryId;
          this.invoiceForm.companyId = this.company.companyId;
          categoryMakeInvoice(this.invoiceForm).then(res => {
            if (res.data.code === 1) {
              Toast.clear();
              this.$router.push({
                path: "/make/category-success"
              });
            }
          }).catch(error => {
            Toast(error.response.data.message);
          });
        }).catch(() => {
        });
      },
      //获取备注
      getSpecifications() {
        getRule().then(res => {
          this.invoiceForm.remark = res.data.content.remark;
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
      getElectronic() {
        this.ifElectronic = true;
        this.ifPaper = false;
        localStorage.setItem("ifPaper", false);
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
        this.ifElectronic = false;
        this.ifPaper = true;
        localStorage.setItem("ifPaper", true);
        this.orderType = localStorage.getItem("orderType");
        this.invoiceForm.mergeSum = localStorage.getItem("tot");
        this.seletedOutOrderList = JSON.parse(localStorage.getItem("seleted"));
        for (let j = 0; j < this.seletedOutOrderList.length; j++) {
          this.outOrderIds += this.seletedOutOrderList[j].outOrderId + ",";
          this.invoiceForm.outOrderIds = this.outOrderIds;
          this.invoiceForm.property = "纸质";
        }
      },
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
      onConfirm(value) {
        this.customCategory.customCategoryId = value.customCategoryId;
        this.customCategory.name = value.name;
        this.showCustomCategory = false;
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
      this.showElectronic = localStorage.getItem("ifElectronic");
      this.showPaper = localStorage.getItem("ifPaper");
      if (this.showElectronic == false && this.showPaper == true) {
        this.ifElectronic = false;
        this.ifPaper = true;
      }
    },
    activated() {
    },
    mounted() {
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

  .van-cell__value {
    min-width: 74%;
  }
</style>
