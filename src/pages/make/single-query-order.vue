<template>
  <div>
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
        <!--<mt-tab-item id="2">-->
        <!--<p style="font-size: 16px;">纸质发票</p>-->
        <!--<p style="font-size: 12px;">预计一周送达</p>-->
        <!--</mt-tab-item>-->
      </mt-navbar>
    </div>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="page-part invoice-con">
          <p>发票详情</p>
          <form action="" id="formBox" ref="invoiceForm" :model="invoiceForm">
            <a class="mint-cell mint-field"
            >
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
            <a
              class="mint-cell mint-field"
              @click="toAddressManage"
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
                  <span class="mint-field-state is-default"
                  ><i class="mintui mintui-field-default"></i
                  ></span>
                  <div class="mint-field-other"></div>
                </div>
                <i class="mint-cell-allow-right"></i>
              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                  ><font
                    style="vertical-align: inherit;font-size: 15px;color:#333"
                  >税号</font
                  ></font
                  ></span
                  >
                </div>
                <div class="mint-cell-value">
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

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                  ><font
                    style="vertical-align: inherit;font-size: 15px;color:#333"
                  >地址</font
                  ></font
                  ></span
                  >

                </div>
                <div class="mint-cell-value" style="display: block">
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

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                  ><font
                    style="vertical-align: inherit;font-size: 15px;color:#333"
                  >电话</font
                  ></font
                  ></span
                  >

                </div>
                <div class="mint-cell-value" style="display: block">
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

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                  ><font
                    style="vertical-align: inherit;font-size: 15px;color:#333"
                  >开户行</font
                  ></font
                  ></span
                  >

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

              </div>
              <div class="mint-cell-right"></div>
            </a>
            <a class="mint-cell mint-field" v-if="invoiceForm.type === '企业'"
            >
              <div class="mint-cell-left"></div>
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">

                  <span class="mint-cell-text"
                  ><font style="vertical-align: inherit;"
                  ><font
                    style="vertical-align: inherit;font-size: 15px;color:#333"
                  >开户行账号</font
                  ></font
                  ></span
                  >

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

              </div>
              <div class="mint-cell-right"></div>
            </a>
          </form>
        </div>
        <div class="invoice-contents">
          <p>发票内容</p>
          <a class="mint-cell mint-field" style=" border-bottom: 1px solid#ddd;"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text"
                ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;"
                >发票内容</font
                ></font
                ></span
                >
              </div>
              <div class="product">
                <span class="detail" v-for="item in list" :key="item.name" :class="{active:active==item.name}"
                      @click="showDetail(item.name)">{{item.name}}</span>
              </div>
              <div class="mint-cell-value">
                <div class="mint-field-clear" style="display: none;">
                  <i class="mintui mintui-field-error"></i>
                </div>
                <span class="mint-field-state is-default"
                ><i class="mintui mintui-field-default"></i
                ></span>
                <div class="mint-field-other"></div>
              </div>

            </div>
            <div class="mint-cell-right"></div>
          </a>
          <a class="mint-cell mint-field" style=" border-bottom: 1px solid#ddd;"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text"
                ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;"
                >发票金额</font
                ></font
                ></span
                >
              </div>
              <div class="mint-cell-value">
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

            </div>
            <div class="mint-cell-right"></div>
          </a>
          <a class="mint-cell mint-field"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text"
                ><font style="vertical-align: inherit;"
                ><font style="vertical-align: inherit;">备注</font></font
                ></span
                >

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

            </div>
            <div class="mint-cell-right"></div>
          </a>
        </div>
        <div class="page-part">
          <p>接收方式</p>
          <a class="mint-cell mint-field"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text"
                ><font style="vertical-align: inherit;"
                ><font
                  style="vertical-align: inherit;color:#333;font-size: 15px"
                >电子邮件</font
                ></font
                ></span
                >

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

            </div>
            <div class="mint-cell-right"></div>
          </a>
          <a class="mint-cell mint-field"
          >
            <div class="mint-cell-left"></div>
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title">

                <span class="mint-cell-text"
                ><font style="vertical-align: inherit;"
                ><font
                  style="vertical-align: inherit; color:#333;font-size: 15px"
                >联系方式</font
                ></font
                ></span
                >

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

            </div>
            <div class="mint-cell-right"></div>
          </a>
          <div class="bottom">
            <mt-button
              class="submit"
              @click="makeInvoice"
              v-if="showDisabled"
            >提交
            </mt-button
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
  </div>
</template>

<script>
  import {getDefaultCompany} from "../../api/company";
  import {queryShopOrder,getState} from "../../api/query";
  import {Navbar, TabItem} from "mint-ui";
  import {Toast} from "mint-ui";
  import {MessageBox} from "mint-ui";
  import Isemail from "isemail";

  export default {
    name: "singleOrder",
    data() {
      return {
        active: '商品明细',
        list: [
          {
            name: '商品明细'
          },
          {
            name: '商品类别'
          }
        ],
        loadingList: true,
        amountOfMoney: 0,
        outOrder: "",
        outOrderNo: "",
        order: "",
        accessToken: "",
        scanContent: "",
        showDisabled: true,
        selected: "1",
        headerTitle: "开具电子发票",
        contactInformation: "",
        ifNeedMobile: "",
        ifNeedEmail: "",
        company: {},
        email: "",
        sum: 0,
        item: {},
        remark: "",
        invoiceForm: {
          type: ""
        }
      };
    },
    methods: {
      showDetail(name) {
        this.active = name
      },
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
      getDefaultCompany() {
        let username = this.username;
        getDefaultCompany(username).then(res => {
          if (res.data.code === 0) {
            this.company = [];
          } else {
            this.company = res.data.content;
            if (localStorage.getItem("type") == "企业") {
              this.invoiceForm.purchaserName = this.company.name;
              this.invoiceForm.purchaserTaxpayerNumber = this.company.taxNumber;
              this.invoiceForm.address = this.company.address;
              this.invoiceForm.phone = this.company.phone;
              this.invoiceForm.purchaserBank = this.company.bank;
              this.invoiceForm.purchaserBankAccount = this.company.bankAccount;
              this.invoiceForm.companyId = this.company.companyId;
            }
          }
        });
      },
      toAddressManage() {
        if (this.company.length === 0) {
          this.$router.push({
            path: "/company/",
            name: "Company",
            params: {
              from: "make"
            }
          });
        } else {
          this.$router.push({
            path: "/company/",
            name: "Company",
            params: {
              id: this.company.companyId
            }
          });
        }
      },
      getShopOrder() {
        getState(this.outOrderNo, localStorage.getItem("username")).then(res=>{
          console.log(res)
          if (res.data.content!=null){
            this.$router.push({ path: "/invoice/detail", query: { id: res.data.content[0].invoiceId } });
          }
        })
        queryShopOrder(this.outOrderNo, localStorage.getItem("username")).then(res => {
          if (res.data.code == 1) {
            this.outOrder = res.data.content;
            this.amountOfMoney = res.data.content.price;
          }
        });
      },
      getEmailInfo() {
        let username = this.username;
        this.$ajax.get("/api/user/" + username + "/invoice/money", {
          params: {
            accessToken: this.accessToken,
            taxNumber: this.taxNumber
          }
        }).then(res => {
          this.loadingList = false;
          this.email = res.data.content.email ? res.data.content.email : "";
          this.contactInformation = res.data.content.mobile ? res.data.content.mobile : "";
        });
      },
      makeInvoice() {
        this.showDisabled = false;
        //验证邮箱
        if (this.ifNeedEmail === true) {
          if (this.email === "") {
            this.showDisabled = true;
            return Toast("请输入邮箱");
          } else if (!Isemail.validate(this.email)) {
            this.showDisabled = true;
            return Toast("邮箱格式不正确");
          }
        } else {
          if (this.email) {
            if (!Isemail.validate(this.email)) {
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
        this.invoiceForm.accessToken = this.accessToken;
        this.invoiceForm.addrMobile = this.contactInformation;
        this.invoiceForm.email = this.email;
        this.invoiceForm.username = this.username;
        this.invoiceForm.type = this.invoiceForm.type;
        this.invoiceForm.category = "增值税电子普通发票";
        this.invoiceForm.property = "电子";
        this.invoiceForm.price = this.amountOfMoney;
        this.invoiceForm.outOrderNo = this.outOrder.outOrderNo;
        this.invoiceForm.items = this.outOrder.items;
        this.$ajax({
          method: "POST",
          url: "https://fapiao-api.easyapi.com/invoice/make",
          data: this.invoiceForm
        }).then(res => {
          if (res.data.code === 1) {
            this.$messagebox.alert(res.data.message);
            this.$router.go(0)
          }
        }).catch(error => {
          this.showDisabled = false;
          Toast(error.response.data.message);
          this.showDisabled = true;
        });
      },
      //获取备注
      getSpecifications() {
        this.$ajax.get("/api/invoice/rule", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.remark = res.data.content.remark;
        });
      },
      getInvoicingService() {
        this.$ajax.get("/api/shop/0/support", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.ifNeedMobile = res.data.content.ifNeedMobile;
          this.ifNeedEmail = res.data.content.ifNeedEmail;
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
    },
    mounted() {
      this.getEmailInfo();
      this.getDefaultCompany();
      this.getSpecifications();
      this.getInvoicingService();
      this.getShopOrder()
    }
  };
</script>

<style scoped>
  @import 'make.css';
</style>
