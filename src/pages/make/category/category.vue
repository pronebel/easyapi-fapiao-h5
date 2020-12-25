<template>
  <div>
    <div class="nav" style="margin-top: 10px;">
      <div id="loading">
        <van-loading v-show="loadingList" type="spinner" color="#56cbf6"/>
      </div>
      <Invoice :isShow="isShow" :isHide="isHide" :ifElectronic="ifElectronic" :invoiceForm="invoiceForm"
               :ifPaper="ifPaper" :company="company"
               @getcategorydata="receiveCategory" @getpropertydata="receiveProperty"></Invoice>
    </div>
    <div>
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
        <van-field label="发票备注" :placeholder="remarkPlaceholder" v-model="invoiceForm.remark"></van-field>
        <van-cell title="附件">
          <van-uploader
            v-model="invoiceForm.extends"
            multiple
            :max-count="1"
            :data="{ key: qnKey, token: qnToken }"
            :after-read="onRead"
          >
          </van-uploader>
        </van-cell>
      </div>
      <Receive :ifElectronic="ifElectronic" :invoiceForm="invoiceForm" :address="address"></Receive>
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
  import { getQiniuToken, getQiniuKey } from "../../../api/qiniu";
  import { getCustomCategoryList } from "../../../api/custom-category";
  import { categoryMakeInvoice } from "../../../api/make";
  import { Toast } from "vant";
  import { Dialog } from "vant";
  import axios from "axios";
  import Invoice from "../../../components/make/Invoice";
  import Receive from "../../../components/make/Receive";
  import makeMixins from "../mixins/make";

  export default {
    name: "MakeCategory",
    components: {
      Invoice,
      Receive
    },
    mixins: [makeMixins],
    data() {
      return {
        showCustomCategory: false,
        keyboardShow: false,
        loadingList: true,
        ifElectronic: localStorage.getItem("ifElectronic"),
        ifPaper: localStorage.getItem("ifPaper"),
        isShow: false,
        isHide: true,
        qnKey: "",
        qnToken: "",
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
          category: "增值税电子普通发票",
          property: localStorage.getItem("ifElectronic") === "true" ? "电子" : "纸质",
          type: "个人",
          purchaserName: "",
          purchaserTaxpayerNumber: "",
          purchaserAddress: "",
          purchaserPhone: "",
          purchaserBank: "",
          purchaserBankAccount: "",
          price: null,
          addrMobile: "",
          email: "",
          remark: "",
          extends: [{
            fieldKey: "attch",
            fieldName: "附件",
            fieldValue: ""
          }]
        }
      };
    },

    methods: {
      getToken() {
        getQiniuToken().then(res => {
          this.qnToken = res.data.content.uploadToken;
        });
      },
      getKey() {
        getQiniuKey().then(res => {
          this.qnKey = res.data.content.key;
        });
      },
      onRead(file) {
        this.uploadImgToQiniu(this.qnToken, this.qnKey, file);
      },
      uploadImgToQiniu(qnToken, qnKey, file) {
        let data = new FormData();
        data.append("token", qnToken);     //七牛需要的token，后台获取
        data.append("key", qnKey);
        data.append("file", file["file"]);
        axios({
          method: "POST",
          url: "https://upload.qiniup.com/",  //上传地址
          data: data,
          timeout: 30000      //超时时间，因为图片上传时间有可能比较长
        }).then(res => {
          this.invoiceForm.extends[0].fieldValue = "https://qiniu.easyapi.com/" + res.data.key;
        });
      },
      goBack() {
        history.go(-1);
      },
      getCustomCategories() {
        getCustomCategoryList({}).then(res => {
          if (res.data.content) {
            for (let i = 0; i < res.data.content.length; i++) {
              this.customCategoryList[i] = res.data.content[i];
            }
          }
        }).catch(error => {
          Toast(error.response.data.message);
        });
      },
      makeInvoice() {
        if (this.invoiceForm.type === "个人") {
          if (this.invoiceForm.purchaserName == "") {
            return Toast("请输入发票抬头");
          } else {
            if (this.customCategory == null || this.customCategory.customCategoryId == null) {
              return Toast("请选择发票类别");
            }
          }
        } else {
          if (this.customCategory == null || this.customCategory.customCategoryId == null) {
            return Toast("请选择发票类别");
          }
        }
        let regPrice = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if (this.invoiceForm.price == null || this.invoiceForm.price <= 0) {
          return Toast("请输入开票金额");
        } else if (!regPrice.test(this.invoiceForm.price)) {
          return Toast("请输入合法开票金额，最多2位小数");
        }
        if (this.invoiceForm.extends[0].fieldValue === "") {
          return Toast("附件一栏请上传付款记录凭证");
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
          title: "提示",
          message: "确认抬头和金额正确并申请开票吗？"
        }).then(() => {
          Toast.loading({
            message: "开票中...",
            forbidClick: true
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
      }
    },
    activated() {
    },
    mounted() {
      this.getToken();
      this.getKey()
      this.getCustomCategories();
    }
  };
</script>

<style scoped>
  @import '../make.css';

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
