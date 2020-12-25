/**
 * 开票页Mixin
 */

import {getRule} from "../../../api/info";
import { getShopSupport } from "../../../api/shop";
import {Toast} from "vant";

export default {
  name: 'makeMixins',
  props: {},

  data() {
    return {
      remarkPlaceholder: "",
      ifNeedMobile:"",
      ifNeedEmail:"",
      invoiceForm:{
        category:"",
        property:""
      }
    };
  },
  watch: {},
  computed: {

  },
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
    getShopSupport() {
      getShopSupport().then(res => {
        this.ifNeedMobile = res.data.content.ifNeedMobile;
        this.ifNeedEmail = res.data.content.ifNeedEmail;
      }).catch(error => {
        Toast(error.response.data.message);
      });
    },
    receiveCategory(val) {
      this.invoiceForm.category = val;
    },
    receiveProperty(val) {
      this.invoiceForm.property = val;
    },
  },
};
