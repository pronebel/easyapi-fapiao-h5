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
                  <span style="font-size: 15px;color:#333">{{company.bank}}</span>
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
                  <span style="font-size: 15px;color:#333">{{ company.bankAccount }}</span>
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
            <a
              class="mint-cell mint-field"
              v-if="invoiceForm.type === '企业' && make === 'false'"
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
                <div class="mint-cell-value">
                  <!--<input placeholder="" type="tel" class="mint-field-core" v-model="invoiceForm.mergeName" disabled>-->
                  <span>{{ invoiceForm.mergeName }}</span>
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
        <div class="invoice-contents" v-if="make === 'true'">
          <p>发票内容</p>
          <ul class="contents-title">
            <li style="width: 24%">商品名称</li>
            <li style="width: 24%">规格型号</li>
            <li>单位</li>
            <li>数量</li>
            <li>单价</li>
            <li>操作</li>
          </ul>
          <ul
            class="contents-content"
            v-for="(product, index) in productList"
            :key="index"
          >
            <li style="width: 24%;line-height: 15px;padding-top:12px">
              {{ product.name }}
            </li>
            <li style="width: 24%">{{ product.specifications }}</li>
            <li>{{ product.unit }}</li>
            <li>{{ product.number }}</li>
            <li>{{ product.price }}</li>
            <li
              style="color: #56cbf6"
              @click="deleteContent(product.productId)"
            >
              删除
            </li>
          </ul>
          <div class="btn">
            <mt-button class="submit-btn" @click="addContent">
              +添加发票内容
            </mt-button
            >
          </div>
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
                <span v-if="make === 'true'" style="color:#ff4848 "
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
  import {Navbar, TabItem} from "mint-ui";
  import {Toast} from "mint-ui";
  import {MessageBox} from "mint-ui";
  import Isemail from "isemail";
  import axios from '../../api/request'
  import {getDefaultCompany} from "../../api/company";

  export default {
    name: "make",
    components: {
      Header
    },
    data() {
      return {
        loadingList: true,
        amountOfMoney: 0,
        productList: "",
        accessToken: "",
        make: "",
        order: "",
        showDisabled: true,
        selected: "1",
        headerTitle: "开具电子发票",
        active: "tab-container1",
        contactInformation: "",
        NeedMobile: "",
        NeedEmail: "",
        company: {},
        email: "",
        seletedOrderList: [],
        sum: 0,
        item: {},
        mergeTax: 0,
        remark: "",
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
      getDefaultCompany() {
        let username = this.$store.state.username;
        getDefaultCompany(username).then(res => {
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
            name: "Company",
            params: {
              id: ""
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
      getEmailInfo() {
        let username = this.$store.state.username;
        axios.get("/api/user/" + username + "/invoice/money", {
          params: {
            accessToken: this.accessToken,
            invoiceForm: this.invoiceForm
          }
        }).then(res => {
          this.loadingList = false;
          this.email = res.data.content.email;
          this.contactInformation = res.data.content.mobile;
        });
      },
      goInvoiceSuccess() {
        this.showDisabled = false;
        //验证邮箱
        if (this.NeedEmail === true) {
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
        if (this.productList === null) {
          this.showDisabled = true;
          return Toast("商品服务不能为空");
        }
        let username = this.$store.state.username;
        //验证手机号
        axios.post('/invoice/product/make', {
          products: this.productList,
          accessToken: this.accessToken,
          type: this.invoiceForm.type,
          category: "增值税电子普通发票",
          property: "电子",
          ifUseMergeVm: "false",
          remark: this.invoiceForm.inputValue,
          username: username,
          companyId: this.company.companyId,
          email: this.email,
          addrMobile: this.contactInformation
        }).then(res => {
          if (res.data.code === 1) {
            this.$messagebox.alert(res.data.message);
            this.$router.push(`/make/success`);
          }
        }).catch(error => {
          if (error.response.data.code === 1) {
            this.showDisabled = false;
            Toast(error.response.data.message);
            this.showDisabled = true;
          } else {
            this.showDisabled = false;
            Toast("请检查信息并完善");
            this.showDisabled = true;
          }
        });
        localStorage.removeItem("productList");
      },
      //计算发票金额
      calculatedAmount() {
        let money = 0;
        if (this.productList !== null) {
          for (var i = 0; i < this.productList.length; i++) {
            money += this.productList[i].price * this.productList[i].number;
          }
          this.amountOfMoney = money.toFixed(2);
        }
      },
      //获取备注
      getSpecifications() {
        axios.get("/api/invoice/rule", {
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
        for (var i = 0; i < this.productList.length; i++) {
          if (id === this.productList[i].productId) {
            this.productList.splice(i, 1);
          }
          localStorage.setItem("productList", JSON.stringify(this.productList));
          this.productList = JSON.parse(localStorage.getItem("productList"));
        }
        this.amountOfMoney = 0;
        this.calculatedAmount();
      },
      getInvoicingService() {
        axios.get("/api/shop/0/support", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.NeedMobile = res.data.content.ifNeedMobile;
          this.NeedEmail = res.data.content.ifNeedEmail;
        }).catch(error => {
          console.log(error);
        });
      },
      //跳转添加内容
      addContent() {
        this.$router.push(`/addProduct`);
      }
    },
    watch: {},
    created() {
      this.make = localStorage.getItem("make");
      this.order = localStorage.getItem("order");
      this.accessToken = localStorage.getItem("accessToken");
      this.productList = JSON.parse(localStorage.getItem("productList"));
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
      this.getEmailInfo();
      this.getSpecifications();
      this.getInvoicingService();
    }
  };
</script>

<style scoped>
  @import 'make.css';
</style>
