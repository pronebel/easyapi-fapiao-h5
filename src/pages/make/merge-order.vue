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
          <form action id="formBox" ref="invoiceForm" :model="invoiceForm">
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
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '个人'">

              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text">
                    <font style="vertical-align: inherit;">
                      <font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                      >姓名/事业单位</font
                      >
                    </font>
                  </span>

                </div>
                <div class="mint-cell-value">
                  <input
                    placeholder=""
                    type="text"
                    class="mint-field-core"
                    v-model="invoiceForm.purchaserName"
                    value="个人"
                  />
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default">
                    <i class="mintui mintui-field-default"></i>
                  </span>
                  <div class="mint-field-other"></div>
                </div>

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a
              class="mint-cell mint-field"
              @click="toCompany"
              v-if="invoiceForm.type === '企业'"
            >
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <span
                    class="mint-cell-text"
                    style="font-size: 15px;color:#333"
                  >发票抬头</span
                  >
                </div>
                <div class="mint-cell-value">
                  <span style="font-size: 15px;color:#333">{{
                    company.name
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default">
                    <i class="mintui mintui-field-default"></i>
                  </span>
                  <div class="mint-field-other"></div>
                </div>

                <i class="mint-cell-allow-right"></i>
              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'">

              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text">
                    <font style="vertical-align: inherit;">
                      <font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                      >税号</font
                      >
                    </font>
                  </span>

                </div>
                <div class="mint-cell-value">
                  <!--<input placeholder="" type="tel" class="mint-field-core" v-model="invoiceForm.purchaserTaxpayerNumber" disabled>-->
                  <span style="font-size: 15px;color:#333">{{
                    company.taxNumber
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default">
                    <i class="mintui mintui-field-default"></i>
                  </span>
                  <div class="mint-field-other"></div>
                </div>

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'">

              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text">
                    <font style="vertical-align: inherit;">
                      <font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                      >地址</font
                      >
                    </font>
                  </span>

                </div>
                <div class="mint-cell-value" style="display: block">
                  <!--<input placeholder="非必填信息" type="tel" class="mint-field-core" v-model="invoiceForm.purchaserAddress" disabled>-->
                  <span style="font-size: 15px;color:#333">{{
                    company.address
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default">
                    <i class="mintui mintui-field-default"></i>
                  </span>
                  <div class="mint-field-other"></div>
                </div>

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'">

              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text">
                    <font style="vertical-align: inherit;">
                      <font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                      >电话</font
                      >
                    </font>
                  </span>

                </div>
                <div class="mint-cell-value" style="display: block">
                  <!--<input placeholder="非必填信息" type="tel" class="mint-field-core" v-model="invoiceForm.purchaserAddress" disabled>-->
                  <span style="font-size: 15px;color:#333">{{
                    company.phone
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default">
                    <i class="mintui mintui-field-default"></i>
                  </span>
                  <div class="mint-field-other"></div>
                </div>

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'">

              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text">
                    <font style="vertical-align: inherit;">
                      <font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                      >开户行</font
                      >
                    </font>
                  </span>

                </div>
                <div class="mint-cell-value">
                  <!--<input placeholder="非必填信息" type="tel" class="mint-field-core" v-model="invoiceForm.purchaserBank" disabled>-->
                  <span style="font-size: 15px;color:#333">{{
                    company.bank
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default">
                    <i class="mintui mintui-field-default"></i>
                  </span>
                  <div class="mint-field-other"></div>
                </div>

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'">

              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text">
                    <font style="vertical-align: inherit;">
                      <font
                        style="vertical-align: inherit;font-size: 15px;color:#333"
                      >开户行账号</font
                      >
                    </font>
                  </span>

                </div>
                <div class="mint-cell-value">
                  <span style="font-size: 15px;color:#333">{{
                    company.bankAccount
                  }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default">
                    <i class="mintui mintui-field-default"></i>
                  </span>
                  <div class="mint-field-other"></div>
                </div>

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a
              class="mint-cell mint-field"
              v-if="invoiceForm.type === '企业' && make === 'false'"
            >

              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text">
                    <font style="vertical-align: inherit;">
                      <font style="vertical-align: inherit;">发票内容</font>
                    </font>
                  </span>

                </div>
                <div class="mint-cell-value">
                  <!--<input placeholder="" type="tel" class="mint-field-core" v-model="invoiceForm.mergeName" disabled>-->
                  <span>{{ invoiceForm.mergeName }}</span>
                  <div class="mint-field-clear" style="display: none;">
                    <i class="mintui mintui-field-error"></i>
                  </div>
                  <span class="mint-field-state is-default">
                    <i class="mintui mintui-field-default"></i>
                  </span>
                  <div class="mint-field-other"></div>
                </div>

              </div>
              <div class="mint-cell-right"></div>
            </a>
          </form>
        </div>
        <div class="invoice-contents">
          <p>发票内容</p>
          <div>
            <span>发票内容</span>
            <span>{{ orderType }}</span>
          </div>
          <a
            class="mint-cell mint-field"
            style=" border-bottom: 1px solid #ddd;"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text">
                  <font style="vertical-align: inherit;">
                    <font style="vertical-align: inherit;">发票金额</font>
                  </font>
                </span>

              </div>
              <div class="mint-cell-value">
                <!--<input placeholder="" type="tel" class="mint-field-core" v-model="invoiceForm.mergeSum" disabled>-->
                <span v-if="order === 'true'" style="color:#ff4848 ">
                  {{ invoiceForm.mergeSum }}
                  <span style="color: #999">元</span>
                </span>
                <!-- <span v-if="make==='true'" style="color:#ff4848 ">{{amountOfMoney}} <span
                style="color: #999">元</span></span>-->
                <div class="mint-field-clear" style="display: none;">
                  <i class="mintui mintui-field-error"></i>
                </div>
                <span class="mint-field-state is-default">
                  <i class="mintui mintui-field-default"></i>
                </span>
                <div class="mint-field-other"></div>
              </div>

            </div>
            <div class="mint-cell-right"></div>
          </a>
          <a class="mint-cell mint-field">

            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text">
                  <font style="vertical-align: inherit;">
                    <font style="vertical-align: inherit;">备注</font>
                  </font>
                </span>

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
                <span class="mint-field-state is-default">
                  <i class="mintui mintui-field-default"></i>
                </span>
                <div class="mint-field-other"></div>
              </div>

            </div>
            <div class="mint-cell-right"></div>
          </a>
        </div>
        <div class="page-part">
          <p>接收方式</p>
          <a class="mint-cell mint-field">

            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text">
                  <font style="vertical-align: inherit;">
                    <font
                      style="vertical-align: inherit;color:#333;font-size: 15px"
                    >电子邮件</font
                    >
                  </font>
                </span>

              </div>
              <div class="mint-cell-value">
                <input
                  placeholder
                  type="email"
                  class="mint-field-core"
                  style="color:#333;font-size: 15px"
                  v-model="email"
                />
                <div class="mint-field-clear" style="display: none;">
                  <i class="mintui mintui-field-error"></i>
                </div>
                <span class="mint-field-state is-default">
                  <i class="mintui mintui-field-default"></i>
                </span>
                <div class="mint-field-other"></div>
              </div>

            </div>
            <div class="mint-cell-right"></div>
          </a>
          <a class="mint-cell mint-field">

            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text">
                  <font style="vertical-align: inherit;">
                    <font
                      style="vertical-align: inherit; color:#333;font-size: 15px"
                    >联系方式</font
                    >
                  </font>
                </span>

              </div>
              <div class="mint-cell-value">
                <input
                  placeholder
                  type="tal"
                  class="mint-field-core"
                  style="color:#333;font-size: 15px"
                  v-model="contactInformation"
                />
                <div class="mint-field-clear" style="display: none;">
                  <i class="mintui mintui-field-error"></i>
                </div>
                <span class="mint-field-state is-default">
                  <i class="mintui mintui-field-default"></i>
                </span>
                <div class="mint-field-other"></div>
              </div>

            </div>
            <div class="mint-cell-right"></div>
          </a>
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
        <div class="paper-capacitor">正在开发中...</div>
      </mt-tab-container-item>
    </mt-tab-container>
    <div>
      <router-view @seletedOrder="seletedOrder"></router-view>
    </div>
  </div>
</template>

<script>
  import {getDefaultCompany} from "../../api/company";
  import Header from "../../components/header.vue";
  import {Navbar, TabItem} from "mint-ui";
  import {Toast} from "mint-ui";
  import {MessageBox} from "mint-ui";

  export default {
    name: "make",
    components: {
      Header
    },
    data() {
      return {
        loadingList: true,
        amountOfMoney: 0,
        preservationDetails: "",
        accessToken: "",
        contentList: "",
        make: "",
        order: "",
        showDisabled: true,
        selected: "1",
        headerTitle: "开具电子发票",
        active: "tab-container1",
        contactInformation: "",
        NeedMobile: "",
        NeedEmail: "",
        orderType: "",
        company: {},
        outOrderIds: "",
        email: "",
        seletedOrderList: [],
        sum: 0,
        item: {},
        mergeTax: 0,
        contentId: "",
        howMany: "",
        remark: "",
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
        if (type == "企业") {
          this.getDefaultCompany();
        } else if (type == "个人") {
          this.invoiceForm.purchaserName = "个人";
          this.invoiceForm.purchaserTaxpayerNumber = "";
          this.invoiceForm.address = "";
          this.invoiceForm.phone = "";
          this.invoiceForm.purchaserBank = "";
          this.invoiceForm.purchaserBankAccount = "";
          this.invoiceForm.companyId = "";
        }
      },
      seletedOrder(item) {
        this.loadingList = false;
        this.company = order;
      },
      getOrder() {
        this.orderType = localStorage.getItem("orderType");
        this.invoiceForm.mergeSum = localStorage.getItem("tot");
        this.seletedOutOrderList = JSON.parse(localStorage.getItem("seleted"));
        for (var i = 0; i < this.seletedOutOrderList.length; i++) {
          this.outOrderIds += this.seletedOutOrderList[i].outOrderId + ",";
          this.invoiceForm.outOrderIds = this.outOrderIds;
          this.invoiceForm.category = "增值税电子普通发票";
          this.invoiceForm.property = "电子";
          this.invoiceForm.username = this.seletedOutOrderList[i].username;
        }
      },

      getDefaultCompany() {
        getDefaultCompany(this.$store.state.username).then(res => {
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
      toCompany() {
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
      getEmailInfo() {
        let username = this.$store.state.username;
        this.$ajax.get("/api/user/" + username + "/invoice/money", {
          params: {
            accessToken: this.accessToken,
            invoiceForm: this.invoiceForm
          }
        }).then(res => {
          (this.loadingList = false), console.log(res);
          this.email = res.data.content.email;
          this.contactInformation = res.data.content.mobile;
        });
      },
      goInvoiceSuccess() {
        this.showDisabled = false;
        //验证邮箱
        let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (this.NeedEmail === true) {
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
        if (this.NeedMobile === true) {
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
        if (this.order === "true") {
          this.invoiceForm.accessToken = this.accessToken;
          this.invoiceForm.addrMobile = this.contactInformation;
          this.invoiceForm.email = this.email;
          this.$ajax.post('/merge-make', {
            params: this.invoiceForm,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }).then(res => {
            if (res.data.code === "1") {
              this.$router.push(`/make/success`);
            }
          }).catch(error => {
            this.showDisabled = false;
            Toast("请检查信息并完善");
            this.showDisabled = true;
          });
        }
      },
      //计算发票金额
      calculatedAmount() {
        let money = 0;
        if (this.preservationDetails !== null) {
          for (var i = 0; i < this.preservationDetails.length; i++) {
            money +=
              this.preservationDetails[i].unitPrice *
              this.preservationDetails[i].amount;
          }
          this.amountOfMoney = money.toFixed(2);
        }
      },
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
      },
      //删除内容
      deleteContent(id) {
        for (var i = 0; i < this.preservationDetails.length; i++) {
          if (id === this.preservationDetails[i].invoiceProductId) {
            this.preservationDetails.splice(i, 1);
          }
          localStorage.setItem("preservationDetails", JSON.stringify(this.preservationDetails)
          );
          this.preservationDetails = JSON.parse(localStorage.getItem("preservationDetails"));
        }
        this.amountOfMoney = 0;
        this.calculatedAmount();
      },
      getInvoicingService() {
        this.$ajax.get("/api/shop/0/support", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.NeedMobile = res.data.content.ifNeedMobile;
          this.NeedEmail = res.data.content.ifNeedEmail;
        }).catch(error => {
          console.log(error);
        });
      }
    },
    watch: {},
    created() {
      this.make = localStorage.getItem("make");
      this.order = localStorage.getItem("order");
      this.accessToken = localStorage.getItem("accessToken");
      this.preservationDetails = JSON.parse(
        localStorage.getItem("preservationDetails")
      );
      this.invoiceForm.type = localStorage.getItem("type");
      if (this.invoiceForm.type) {
        this.invoiceForm.type = localStorage.getItem("type");
      } else {
        this.invoiceForm.type = "企业";
      }
    },
    activated() {
      this.seletedOrder();
    },
    mounted() {
      this.calculatedAmount();
      this.getDefaultCompany();
      this.getOrder();
      this.getEmailInfo();
      this.getSpecifications();
      this.getInvoicingService();
    }
  };
</script>

<style scoped>
  @import 'make.css';
</style>
