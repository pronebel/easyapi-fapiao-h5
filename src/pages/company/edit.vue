<template>
  <div>
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="page-part">
      <form action ref="companyForm" :model="companyForm">
        <a class="mint-cell mint-field">
          <div class="mint-cell-left"></div>
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">
                <font style="vertical-align: inherit;">
                  <font style="vertical-align: inherit;font-size: 15px"
                    >发票抬头</font
                  >
                </font>
              </span>
            </div>
            <div class="mint-cell-value">
              <input
                v-model="name"
                placeholder="请输入发票抬头（必填）"
                type="text"
                class="mint-field-core s-search-text"
                @keyup="searchRiseList"
              />
            </div>
          </div>
          <div class="mint-cell-right"></div>
        </a>
        <div class="rise-list" v-if="searchList !== ''">
          <ul>
            <li
              v-for="(item, index) in searchList"
              :key="index"
              @click="chooseRise(index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <a class="mint-cell mint-field">
          <div class="mint-cell-left"></div>
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">
                <font style="vertical-align: inherit;">
                  <font style="vertical-align: inherit;font-size: 15px"
                    >税号</font
                  >
                </font>
              </span>
            </div>
            <div class="mint-cell-value">
              <input
                placeholder="请输入税号（必填）"
                type="text"
                class="mint-field-core"
                v-model="companyForm.taxNumber"
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
                  <font style="vertical-align: inherit;font-size: 15px"
                    >地址</font
                  >
                </font>
              </span>
            </div>
            <div class="mint-cell-value">
              <input
                placeholder="请输入地址（非必填信息）"
                type="text"
                class="mint-field-core"
                v-model="companyForm.address"
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
                  <font style="vertical-align: inherit;font-size: 15px"
                    >电话</font
                  >
                </font>
              </span>
            </div>
            <div class="mint-cell-value">
              <input
                placeholder="请输入电话（非必填信息）"
                type="tel"
                class="mint-field-core"
                v-model="companyForm.phone"
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
                  <font style="vertical-align: inherit;font-size: 15px"
                    >开户行</font
                  >
                </font>
              </span>
            </div>
            <div class="mint-cell-value">
              <input
                placeholder="请输入开户行（非必填信息）"
                type="text"
                class="mint-field-core"
                v-model="companyForm.bank"
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
                  <font style="vertical-align: inherit;font-size: 15px"
                    >开户行账号</font
                  >
                </font>
              </span>
            </div>
            <div class="mint-cell-value">
              <input
                placeholder="请输入开户行账号（非必填信息）"
                type="text"
                class="mint-field-core"
                v-model="companyForm.bankAccount"
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
      </form>
    </div>
    <div class="bottom">
      <mt-button class="submit" @click="confirm">保存</mt-button>
      <mt-button
        v-if="this.title === 'edit'"
        class="submit_btnDelet"
        @click="btnDelet"
        >删除</mt-button
      >
    </div>
  </div>
</template>
<script>
import Header from "../../components/header.vue";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  name: "addAddress",
  components: {
    Header
  },
  data() {
    return {
      headerTitle: "",
      companyForm: {},
      id: "",
      title: "",
      accessToken: "",
      searchList: [],
      name: ""
    };
  },

  methods: {
    goBack() {
      history.go(-1);
    },
    getId() {
      if (!this.$route.params.id) {
        this.toAdd();
      } else {
        this.toEdit();
      }
    },
    // 创建
    toAdd() {
      this.title = "add";
      this.headerTitle = "新增抬头";
    },
    toEdit() {
      this.title = "edit";
      this.headerTitle = "修改抬头";
      this.id = this.$route.params.id;
      if (this.title === "edit") {
        this.$ajax
          .get("/company/" + this.id, {
            params: {
              accessToken: this.accessToken
            }
          })
          .then(res => {
            this.companyForm = res.data.content;
            this.name = res.data.content.name;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //删除
    btnDelet() {
      this.$ajax
        .delete("/company/" + this.id, {
          params: {
            accessToken: this.accessToken,
            username: this.$store.state.username
          }
        })
        .then(res => {
          if (res.data.code === 1) {
            this.$messagebox.alert(res.data.message);
            this.$router.push({ path: "/company/" });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    searchRiseList() {
      if (this.name.length < 4) {
        return;
      }
      this.$ajax
        .get("/company/codes", {
          params: {
            accessToken: this.accessToken,
            name: this.name
          }
        })
        .then(res => {
          this.searchList = res.data.content;
        })
        .catch(error => {
          console.log(error);
          //MessageBox('提示', error.response.data.message);
        });
    },
    chooseRise(index) {
      this.name = this.searchList[index].name;
      this.companyForm.taxNumber = this.searchList[index].taxNumber;
      this.companyForm.bank = this.searchList[index].bank;
      this.companyForm.bankAccount = this.searchList[index].bankAccount;
      this.companyForm.address = this.searchList[index].address;
      this.companyForm.phone = this.searchList[index].phone;
      this.searchList = [];
    },
    confirm() {
      if (!this.name && !this.companyForm.taxNumber) {
        return Toast("发票抬头和税号不能为空！");
      }
      this.companyForm.name = this.name;
      this.$messagebox({
        title: "提示",
        message: "是否保存本次编辑结果",
        showCancelButton: true
      }).then(action => {
        if (action === "confirm") {
          this.companyForm.accessToken = this.accessToken;
          this.companyForm.username = this.$store.state.username;
          this.companyForm.ifDefault = true;
          this.id = this.$route.params.id;
          if (this.title === "edit") {
            this.$ajax({
              method: "PUT",
              url: "/company/" + this.id,
              data: this.companyForm
            })
              .then(res => {
                if (res.data.code === "1") {
                  this.$messagebox.alert(res.data.message);
                  if (this.$route.params.companyLists === "companyLists") {
                    this.$router.push(`/company/`);
                  } else {
                    this.$router.push({
                      path: "/company/",
                      name: "company",
                      params: {
                        id: this.id
                      }
                    });
                  }
                }
              })
              .catch(error => {
                this.$messagebox.alert(error.response.data.message);
              });
          } else {
            console.log(this.companyForm);
            this.$ajax({
              method: "POST",
              url: "/company",
              data: this.companyForm
            })
              .then(res => {
                if (res.data.code === "1") {
                  this.$messagebox.alert(res.data.message);
                  let id = res.data.content.companyId;
                  if (this.$route.params.companyLists) {
                    this.$router.push(`/company/`);
                  } else {
                    this.$router.push({
                      path: "/company/",
                      name: "company",
                      params: {
                        id: id
                      }
                    });
                  }
                }
              })
              .catch(error => {
                this.$messagebox.alert(error.response.data.message);
              });
          }
        }
      });
    }
  },
  created() {
    this.accessToken = localStorage.getItem("accessToken");
  },
  mounted() {
    this.getId();
  }
};
</script>

<style scoped>
.page-part {
  margin-top: 60px;
  position: relative;
}

.page-part a {
  border-bottom: 1px solid #f4f4f4;
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
  /* margin-top: 40px; */
}

.bottom .submit_btnDelet {
  width: 100%;
  background: #e5e5e5;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: #999;
  margin-top: 20px;
}

.confirm-dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.confirm-dialog-con {
  text-align: center;
  width: 200px;
  background: #fff;
  display: flex;
  height: 150px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.confirm-dialog-con p:last-child {
  margin-top: 20px;
}

.confirm-dialog-con button:active {
  color: #56cbf6;
}

.mint-cell-wrapper {
  background: none !important;
}

.rise-list {
  /*min-height: 220px;*/
  z-index: 99;
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  padding: 0 10px;
  background: #fff;
}

.rise-list li {
  border-bottom: 1px solid #f4f4f4;
  height: 30px;
  line-height: 30px;
}
</style>
