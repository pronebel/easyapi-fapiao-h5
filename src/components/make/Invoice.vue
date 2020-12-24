<template>
  <div>
    <div class="nav" style="margin-top: 10px;">
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
      <form action="" id="formBox" ref="childForm" :model="childForm">
        <van-cell title="抬头类型" center>
          <van-radio-group class="van-radio-group_type" v-model="childForm.type" direction="horizontal"
                           @change="selectInvoiceType">
            <van-radio name="企业">企业</van-radio>
            <van-radio name="个人">个人/事业单位</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell title="发票类型" center v-show="invoiceForm.property == '纸质'">
          <van-radio-group class="van-radio-group_type" v-model="childForm.category" direction="horizontal"
          >
            <van-radio style="margin-bottom: 5px;" name="增值税普通发票">增值税普通发票</van-radio>
            <van-radio name="增值税专用发票" v-if="invoiceForm.type==='企业'">增值税专用发票</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field label="发票抬头" v-if="invoiceForm.type === '个人'" placeholder="请输入姓名/事业单位"
                   v-model="childForm.purchaserName"/>
        <van-field label="发票抬头" readonly v-if="invoiceForm.type === '企业'" @click="gotoCompany"
                   right-icon="arrow"
                   placeholder="请选择发票抬头" v-model="childCompany.name"/>
        <van-field label="税号" value="" readonly v-if="invoiceForm.type === '企业'" v-model="childCompany.taxNumber"/>
        <van-field label="更多" right-icon="arrow-down" v-if="invoiceForm.type    === '企业'" @click="purchaserMore"
                   v-show="hide"
                   readonly placeholder="地址、电话、开户行等"/>
        <div v-show="show">
        <van-field v-if="invoiceForm.type === '企业'" @click="purchaserMoreHide" label="地址" value="" readonly
        v-model="childCompany.address" right-icon="arrow-up"/>
        <van-field v-if="invoiceForm.type === '企业'" label="电话" value="" readonly v-model="childCompany.phone"/>
        <van-field v-if="invoiceForm.type === '企业'" label="开户行" value="" readonly v-model="childCompany.bank"/>
        <van-field v-if="invoiceForm.type === '企业'" label="银行账号" value="" readonly v-model="childCompany.bankAccount"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { getDefaultCompany } from "../../api/company";
  import { getDefaultAddress } from "../../api/address";
  export default {
    name: "Invoice",
    props: [
      "ifElectronic",
      "invoiceForm",
      "ifPaper",
      "company",
      "isHide",
      "isShow",
    ],
    data() {
      return {
        address:"",
        show:this.isShow,
        hide:this.isHide,
        childInvoiceForm: {
          category: "",
          property: ""
        },
        childForm: {
          type: "",
          category: "",
          purchaserName: "",
          purchaserTaxpayerNumber:"",
          purchaserAddress:"",
          purchaserPhone:"",
          purchaserBank:"",
          purchaserBankAccount:"",
          companyId:""
        },
        childCompany: {
          name: "",
          taxNumber: "",
          address:"",
          phone:"",
          bank:"",
          bankAccount:"",
          companyId:""
        }
      };
    },

    methods: {
      changeElectronic() {
        this.$emit("getcategorydata", this.childInvoiceForm.category = "增值税电子普通发票");
        this.$emit("getpropertydata", this.childInvoiceForm.property = "电子");
      },
      changePaper() {
        this.$emit("getcategorydata", this.childInvoiceForm.category = "增值税普通发票");
        this.$emit("getpropertydata", this.childInvoiceForm.property = "纸质");
      },
      selectInvoiceType() {
        localStorage.setItem("type", this.childForm.type);
        if (this.childForm.type === "企业") {
          this.getDefaultCompany();
          this.getDefaultAddress();
        } else if (this.childForm.type === "个人") {
          this.childForm.purchaserName = "";
          this.childForm.purchaserTaxpayerNumber = "";
          this.childForm.purchaserAddress = "";
          this.childForm.purchaserPhone = "";
          this.childForm.purchaserBank = "";
          this.childForm.purchaserBankAccount = "";
          this.childForm.companyId = "";
        }
      },
      gotoCompany() {

      },
      /** 购买方更多信息 */
      purchaserMore(){
        this.show = true;
        this.hide = false;
      },
      /** 隐藏购买方更多信息 */
      purchaserMoreHide(){
        this.show = false;
        this.hide = true;
      },
      getDefaultCompany() {
        getDefaultCompany().then((res) => {
          if (res.data.code === 1) {
            this.childCompany = res.data.content;
            this.childForm.purchaserName = this.childCompany.name;
            this.childForm.purchaserTaxpayerNumber = this.childCompany.taxNumber;
            this.childForm.purchaserAddress = this.childCompany.address;
            this.childForm.purchaserPhone = this.childCompany.phone;
            this.childForm.purchaserBank = this.childCompany.bank;
            this.childForm.purchaserBankAccount = this.childCompany.bankAccount;
            this.childForm.companyId = this.childCompany.companyId;
          }
        });
      },
      getDefaultAddress() {
        getDefaultAddress().then((res) => {
          if (res.data.code === 1) {
            this.address = res.data.content;
            this.childForm.addressId = this.address.addressId;
          }
        });
      },
    },
    mounted() {
      this.childForm = this.invoiceForm;
      this.childCompany = this.company;
    }
  };
</script>

<style scoped>
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
</style>
