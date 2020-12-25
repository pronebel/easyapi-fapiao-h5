/**
 * 开票页Mixin
 */

import {getRule} from "../../../api/info";
import {getShopSupport} from "../../../api/shop";
import {Toast} from "vant";
import Isemail from "isemail";

export default {
  name: 'makeMixins',
  props: {},

  data() {
    return {
      remarkPlaceholder: "",//发票备注填写说明
      ifNeedMobile: false,//手机号码是否必填
      ifNeedEmail: false,//邮箱是否必填
      invoiceForm: {
        category: "",
        property: ""
      }
    };
  },
  watch: {},
  computed: {},
  async mounted() {
    this.getInvoiceRemark();
    this.getShopSupport()
  },
  methods: {
    /**
     * 获取发票备注填写说明
     */
    getInvoiceRemark() {
      if (localStorage.getItem("invoiceForm")) {
        this.invoiceForm.remark = JSON.parse(localStorage.getItem("invoiceForm")).remark;
      }
      else {
        getRule().then((res) => {
          this.remarkPlaceholder = res.data.content.remark;
        });
      }
    },
    /**
     * 获取手机和邮箱是否必填
     */
    getShopSupport() {
      getShopSupport().then(res => {
        this.ifNeedMobile = res.data.content.ifNeedMobile;
        this.ifNeedEmail = res.data.content.ifNeedEmail;
      }).catch(error => {
        Toast(error.response.data.message);
      });
    },
    /**
     * 检查邮箱和手机号码
     */
    checkEmailMobile() {
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
    },
    receiveCategory(val) {
      this.invoiceForm.category = val;
    },
    receiveProperty(val) {
      this.invoiceForm.property = val;
    },
  },
};
