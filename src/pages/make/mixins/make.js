/**
 * 开票页Mixin
 */

import {getRule} from "../../../api/info";
import {Toast} from "vant";

export default {
  name: 'makeMixins',
  props: {},

  data() {
    return {
      remarkPlaceholder: ""
    };
  },
  watch: {},
  computed: {

  },
  async mounted() {
    this.getInvoiceRemark();
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
  },
};
