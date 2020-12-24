<template>
  <div>
    <div class="page-part" style="margin-bottom: 60px" v-show="ifElectronic=='false'?false:true">
      <p>接收方式</p>
      <van-field label="电子邮箱" v-model="childForm.email"></van-field>
      <van-field label="联系方式" v-model="childForm.addrMobile"></van-field>
    </div>
    <div class="page-part" style="margin-bottom: 60px" v-show="!ifElectronic=='false'?false:true">
      <p>接收方式</p>
      <van-field
        right-icon="arrow"
        label="收件人"
        readonly
        @click="gotoAddress"
        v-model="childAddress.name"
      ></van-field>
      <van-field
        label="联系方式"
        v-model="childAddress.mobile"
        readonly
      ></van-field>
      <van-cell
        title="邮寄地址"
        :value="childAddress.province + childAddress.city + childAddress.district + childAddress.addr"
        readonly
      ></van-cell>
    </div>
  </div>
</template>

<script>
  import { getDefaultAddress } from "../../api/address";
  export default {
    name: "Receive",
    data() {
      return {
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
        childAddress: {
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
    props: [
      "ifElectronic",
      "invoiceForm",
    ],
    methods: {
      /** 前往地址管理页 */
      gotoAddress() {
        this.$router.push({
          path: "/address/",
          name: "Address",
          params: {
            id: this.childAddress ? this.childAddress.addressId : "",
            from: "make"
          }
        });
      },
      getDefaultAddress() {
        getDefaultAddress().then((res) => {
          if (res.data.code === 1) {
            this.childAddress = res.data.content;
            this.childForm.addressId = this.childAddress.addressId;
          }
        });
      },
    },
    mounted() {
      this.childForm = this.invoiceForm;
      this.getDefaultAddress()
    }
  };
</script>

<style scoped>
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
