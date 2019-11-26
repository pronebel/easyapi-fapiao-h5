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
          <form action="" id="formBox" ref="invoiceForm" :model="invoiceForm">
            <a class="mint-cell mint-field"
              ><!---->
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <!---->
                  <span
                    class="mint-cell-text"
                    style="font-size: 15px;color:#333"
                    >抬头类型</span
                  >
                  <!---->
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
                <!---->
              </div>
            </a>
            <a
              class="mint-cell mint-field"
              @click="toAddressManage"
              v-if="invoiceForm.type === '企业'"
              ><!---->
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <!---->
                  <span
                    class="mint-cell-text"
                    style="font-size: 15px;color:#333"
                    >发票抬头</span
                  >
                  <!---->
                </div>
                <div class="mint-cell-value">
                  <span style="font-size: 15px;color:#333">{{
                    company.name
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default"
                    ><i class="mintui mintui-field-default"></i
                  ></span>
                  <div class="mint-field-other"></div>
                </div>
                <!----><i class="mint-cell-allow-right"></i>
              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
              ><!---->
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <!---->
                  <span class="mint-cell-text"
                    ><font style="vertical-align: inherit;"
                      ><font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                        >税号</font
                      ></font
                    ></span
                  >
                  <!---->
                </div>
                <div class="mint-cell-value">
                  <!--<input placeholder="" type="tel" class="mint-field-core" v-model="invoiceForm.purchaserTaxpayerNumber" disabled>-->
                  <span style="font-size: 15px;color:#333">{{
                    company.taxNumber
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default"
                    ><i class="mintui mintui-field-default"></i
                  ></span>
                  <div class="mint-field-other"></div>
                </div>
                <!---->
              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
              ><!---->
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <!---->
                  <span class="mint-cell-text"
                    ><font style="vertical-align: inherit;"
                      ><font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                        >地址</font
                      ></font
                    ></span
                  >
                  <!---->
                </div>
                <div class="mint-cell-value" style="display: block">
                  <!--<input placeholder="非必填信息" type="tel" class="mint-field-core" v-model="invoiceForm.purchaserAddress" disabled>-->
                  <span style="font-size: 15px;color:#333">{{
                    company.address
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default"
                    ><i class="mintui mintui-field-default"></i
                  ></span>
                  <div class="mint-field-other"></div>
                </div>
                <!---->
              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
              ><!---->
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <!---->
                  <span class="mint-cell-text"
                    ><font style="vertical-align: inherit;"
                      ><font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                        >电话</font
                      ></font
                    ></span
                  >
                  <!---->
                </div>
                <div class="mint-cell-value" style="display: block">
                  <!--<input placeholder="非必填信息" type="tel" class="mint-field-core" v-model="invoiceForm.purchaserAddress" disabled>-->
                  <span style="font-size: 15px;color:#333">{{
                    company.phone
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default"
                    ><i class="mintui mintui-field-default"></i
                  ></span>
                  <div class="mint-field-other"></div>
                </div>
                <!---->
              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
              ><!---->
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <!---->
                  <span class="mint-cell-text"
                    ><font style="vertical-align: inherit;"
                      ><font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                        >开户行</font
                      ></font
                    ></span
                  >
                  <!---->
                </div>
                <div class="mint-cell-value">
                  <span style="font-size: 15px;color:#333">{{
                    company.bank
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default"
                    ><i class="mintui mintui-field-default"></i
                  ></span>
                  <div class="mint-field-other"></div>
                </div>
                <!---->
              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
              ><!---->
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <!---->
                  <span class="mint-cell-text"
                    ><font style="vertical-align: inherit;"
                      ><font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                        >开户行账号</font
                      ></font
                    ></span
                  >
                  <!---->
                </div>
                <div class="mint-cell-value">
                  <span style="font-size: 15px;color:#333">{{
                    company.bankAccount
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default"
                    ><i class="mintui mintui-field-default"></i
                  ></span>
                  <div class="mint-field-other"></div>
                </div>
                <!---->
              </div>
              <div class="mint-cell-right"></div>
            </a>
          </form>
        </div>
        <div class="invoice-contents">
          <p>发票内容</p>
          <ul class="contents-title">
            <li style="width: 24%">商品名称</li>
            <li style="width: 24%">规格型号</li>
            <li>单位</li>
            <li>数量</li>
            <li>单价</li>
          </ul>
          <ul class="contents-content" v-for="(content,index) in invoiceItemList" :key="index">
            <li style="width: 24%;line-height: 15px;padding-top:12px">
              {{ content.name }}
            </li>
            <li style="width: 24%">{{ content.model }}</li>
            <li>{{ content.unit }}</li>
            <li>{{ content.number }}</li>
            <li>{{ content.price }}</li>
          </ul>
          <a class="mint-cell mint-field" style=" border-bottom: 1px solid#ddd;"
            ><!---->
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">
                <!---->
                <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                    ><font style="vertical-align: inherit;"
                      >发票金额</font
                    ></font
                  ></span
                >
                <!---->
              </div>
              <div class="mint-cell-value">
                <!--<input placeholder="" type="tel" class="mint-field-core" v-model="invoiceForm.mergeSum" disabled>-->
                <span style="color:#ff4848 "
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
              <!---->
            </div>
            <div class="mint-cell-right"></div>
          </a>
          <a class="mint-cell mint-field"
            ><!---->
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">
                <!---->
                <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                    ><font style="vertical-align: inherit;">备注</font></font
                  ></span
                >
                <!---->
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
              <!---->
            </div>
            <div class="mint-cell-right"></div>
          </a>
        </div>
        <div class="page-part">
          <p>接收方式</p>
          <a class="mint-cell mint-field"
            ><!---->
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">
                <!---->
                <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                    ><font
                      style="vertical-align: inherit;color:#333;font-size: 15px"
                      >电子邮件</font
                    ></font
                  ></span
                >
                <!---->
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
              <!---->
            </div>
            <div class="mint-cell-right"></div>
          </a>
          <a class="mint-cell mint-field"
            ><!---->
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">
                <!---->
                <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                    ><font
                      style="vertical-align: inherit; color:#333;font-size: 15px"
                      >联系方式</font
                    ></font
                  ></span
                >
                <!---->
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
              <!---->
            </div>
            <div class="mint-cell-right"></div>
          </a>
          <div class="bottom">
            <mt-button
              class="submit"
              @click="goInvoiceSuccess"
              v-if="showDisabled"
              >提交</mt-button
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
import { Navbar, TabItem } from "mint-ui";
import { Toast } from "mint-ui";
import { MessageBox } from "mint-ui";

export default {
  name: "singleOrder",
  components: {
    Header
  },
  data() {
    return {
      loadingList: true,
      amountOfMoney: 0,
      invoiceItemList: [],
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
      seletedOrderList: [],
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
    getOrder() {
      if (this.order === "true") {
        this.invoiceForm.mergeSum = localStorage.getItem("tot");
        this.seletedOrderList = JSON.parse(localStorage.getItem("seleted"));
        for (var i = 0; i < this.seletedOrderList.length; i++) {
          this.itemIds += this.seletedOrderList[i].invoiceItemId + ",";
          this.invoiceForm.itemIds = this.itemIds;
          this.invoiceForm.category = "增值税电子普通发票";
          this.invoiceForm.property = "电子";
          this.invoiceForm.username = this.seletedOrderList[i].username;
        }
      }
    },

    getDefaultCompany() {
      let username = this.username;
      this.$ajax
        .get("/company/" + username + "/default", {
          params: {
            accessToken: this.accessToken
          }
        })
        .then(res => {
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
          name: "company",
          params: {
            id: ""
          }
        });
      } else {
        this.$router.push({
          path: "/company/",
          name: "company",
          params: {
            id: this.company.companyId
          }
        });
      }
    },
    getInvoiceItemList() {
      let outOrderNo = this.outOrderNo;
      this.$ajax
        .get("/api/item/" + outOrderNo, {
          params: {
            username: this.username,
            taxNumber: this.taxNumber,
            state: 0,
            accessToken: this.accessToken
          }
        })
        .then(res => {
          this.scanContent = res.data.content;
          if (res.data.code == 1) {
            this.$router.push({
              path: "/invoice/detail",
              query: { id: this.scanContent.invoiceId }
            });
          }
          this.invoiceItemList = res.data.content.invoiceItems;
          this.remark = this.scanContent.remark;
          this.calculatedAmount();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getEmailInfo() {
      let username = this.username;
      this.$ajax
        .get("/api/user/" + username + "/invoice/money", {
          params: {
            accessToken: this.accessToken,
            taxNumber: this.taxNumber
          }
        })
        .then(res => {
          (this.loadingList = false), (this.email = res.data.content.email);
          this.contactInformation = res.data.content.mobile;
        })
        .catch(error => {
          console.log(error);
        });
    },
    goInvoiceSuccess() {
      this.showDisabled = false;
      //验证邮箱
      let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      debugger;
      if (this.ifNeedEmail === true) {
        if (this.email === "") {
          debugger;
          this.showDisabled = true;
          return Toast("请输入邮箱");
        } else if (!regEmail.test(this.email)) {
          debugger;
          this.showDisabled = true;
          return Toast("邮箱格式不正确");
        }
      } else {
        debugger;
        if (this.email) {
          debugger;
          if (!regEmail.test(this.email)) {
            this.showDisabled = true;
            debugger;
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
      if (this.invoiceItemList !== null) {
        for (var i = 0; i < this.invoiceItemList.length; i++) {
          this.contentId += this.invoiceItemList[i].invoiceItemId + ",";
          this.howMany += this.invoiceItemList[i].number + ",";
          this.priceSplicing += this.invoiceItemList[i].price + ",";
        }
      }
      this.invoiceForm.accessToken = this.accessToken;
      this.invoiceForm.addrMobile = this.contactInformation;
      this.invoiceForm.email = this.email;
      this.invoiceForm.username = this.username;
      this.invoiceForm.type = this.invoiceForm.type;
      this.invoiceForm.category = "增值税电子普通发票";
      this.invoiceForm.property = "电子";
      this.invoiceForm.itemIds = this.contentId.substring(
        0,
        this.contentId.length - 1
      );
      this.$ajax({
        method: "POST",
        url: "/invoice/apply",
        params: {
          type: this.invoiceForm.type,
          companyId: this.company.companyId,
          category: "增值税电子普通发票",
          property: "电子",
          email: this.email,
          itemIds: this.contentId.substring(0, this.contentId.length - 1),
          addrMobile: this.contactInformation,
          username: this.username
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          if (res.data.code === "1") {
            this.$messagebox.alert(res.data.message);
            this.$router.push({
              path: "/single-order-success",
              query: { returnUrl: this.returnUrl }
            });
          }
        })
        .catch(error => {
          this.showDisabled = false;
          Toast("请检查信息并完善");
          this.showDisabled = true;
        });
    },
    //计算发票金额
    calculatedAmount() {
      let money = 0;
      if (this.invoiceItemList !== null) {
        for (var i = 0; i < this.invoiceItemList.length; i++) {
          money +=
            this.invoiceItemList[i].price * this.invoiceItemList[i].number;
        }
        this.amountOfMoney = money.toFixed(2);
      }
    },
    //获取备注
    getSpecifications() {
      this.$ajax
        .get("/api/invoice/rule", {
          params: {
            accessToken: this.accessToken
          }
        })
        .then(res => {
          this.remark = res.data.content.remark;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getInvoicingService() {
      this.$ajax
        .get("/api/shop/0/support", {
          params: {
            accessToken: this.accessToken
          }
        })
        .then(res => {
          this.ifNeedMobile = res.data.content.ifNeedMobile;
          this.ifNeedEmail = res.data.content.ifNeedEmail;
        })
        .catch(error => {
          console.log(error);
        });
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

    if (this.$route.query.username) {
      localStorage.setItem("username", this.$route.query.username);
      this.username = localStorage.getItem("username");
    } else if (this.username === "") {
      Toast("username不能为空！");
    }

    if (this.$route.query.outOrderNo) {
      localStorage.setItem("outOrderNo", this.$route.query.outOrderNo);
      this.outOrderNo = localStorage.getItem("outOrderNo");
    } else if (this.outOrderNo === "") {
      Toast("outOrderNo不能为空！");
    }
    if (this.$route.query.returnUrl) {
      localStorage.setItem("returnUrl", this.$route.query.returnUrl);
      this.accessToken = localStorage.getItem("returnUrl");
    } else if (this.returnUrl === "") {
      Toast("returnUrl不能为空！");
    }
    this.accessToken = localStorage.getItem("accessToken");
    this.taxNumber = localStorage.getItem("taxNumber");
    this.username = localStorage.getItem("username");
    this.outOrderNo = localStorage.getItem("outOrderNo");
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
    this.getEmailInfo();
    this.getDefaultCompany();
    this.getOrder();
    this.getSpecifications();
    this.getInvoicingService();
    this.getInvoiceItemList();
  }
};
</script>

<style scoped>
.mint-cell-value label {
  padding-left: 5px;
}

/*.body {*/
/*position: absolute;*/
/*top: 0;*/
/*bottom: 0;*/
/*left: 0;*/
/*right: 0;*/
/*overflow: auto;*/
/*z-index: 9;*/
/*}*/
.nav {
  margin-top: 53px;
}

.nav > p,
.page-part p {
  height: 30px;
  line-height: 30px;
  background-color: #f2f2f2;
  padding: 0px 10px;
  color: #666666;
  font-size: 14px;
}

.invoice-type {
  text-align: center;
  height: 70px;
  background: #fff;
  padding: 20px 10px;
}

.invoice-type p:last-of-type {
  margin-top: 10px;
}

.mint-navbar .mint-tab-item {
  border: 1px solid #dddddd;
  border-radius: 4px;
  color: #999;
}

.mint-navbar .mint-tab-item:last-of-type {
  margin-left: 10px;
  color: #999;
}

.mint-navbar .mint-tab-item.is-selected {
  border: 1px solid #52c9f5;
  border-radius: 4px;
  margin-bottom: 0 !important;
  color: #38b8e7 !important;
}

.page-part a {
  border-bottom: 1px solid #ddd;
}

.mint-cell-wrapper {
  background: none !important;
}

#radio-1-2 {
  margin-left: 30px;
}

.bottom {
  padding: 0 10px;
  margin-top: 20px;
}

.bottom .submit {
  width: 100%;
  background: #56cbf6;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: #fff;
  margin-bottom: 20px;
}

.paper-capacitor {
  text-align: center;
  padding: 40px 0;
  color: red;
  font-size: 18px;
}

.invoice-contents {
  width: 100%;
  height: auto;
}

.invoice-contents p {
  height: 30px;
  line-height: 30px;
  background-color: #f2f2f2;
  padding: 0px 10px;
  color: #666;
  font-size: 14px;
}

.contents-title {
  background-color: #fff;
  padding: 0px 10px;
  display: flex;
  list-style: none;
  border-bottom: 1px solid #ddd;
}

.contents-title li {
  width: 18%;
  line-height: 44px;
  color: #333;
  font-size: 12px;
  text-align: center;
  font-weight: 500;
}

.contents-content {
  background-color: #fff;
  padding: 0px 10px;
  display: flex;
  list-style: none;
  border-bottom: 1px solid #ddd;
}

.contents-content li {
  width: 18%;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
  color: #333;
}

.btn {
  width: 100%;
  height: 80px;
  background-color: #fff;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.btn .submit-btn {
  width: 143px;
  height: 33px;
  background-color: #fff;
  color: #52c9f5;
  font-size: 12px;
  margin-top: 20px;
  border: 1px solid #52c9f5;
}

#loading {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  z-index: 999;
}
</style>
