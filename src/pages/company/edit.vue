<template>
  <div class="">
    <Header @head-back="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
    <form action ref="companyForm" :model="companyForm" class="formClass">
      <div class="">
        <div class="address-bottom2" @click="select(item)">
          <van-cell-group>
            <van-field label="公司名称" v-model="name" placeholder="请输入公司名称" border required @keyup="searchRiseList"
                       @focus="listShow = true" @blur="inputBlur">
            </van-field>
            <div class="rise-list" v-if="listShow && searchList !== ''">
              <ul>
                <li
                  v-for="(item, index) in searchList"
                  :key="index"
                  @mousedown="chooseRise(index)"
                >
                  {{ item.name }}
                </li>
              </ul>
            </div>
            <van-field label="公司税号" v-model="companyForm.taxNumber" placeholder="请输入纳税人识别号（必填）" border required/>
            <van-field label="注册地址" v-model="companyForm.address" placeholder="请输入地址（非必填信息）" border/>
            <van-field label="注册电话" v-model="companyForm.phone" placeholder="请输入电话（非必填信息）" border/>
            <van-field label="开户银行" v-model="companyForm.bank" placeholder="请输入开户行（非必填信息）" border/>
            <van-field label="银行账号" v-model="companyForm.bankAccount" placeholder="请输入开户行账号（非必填信息）" border/>
          </van-cell-group>
        </div>
      </div>
      <div class="page-part address-con defaultBnt">
        <van-cell center title="设置为默认抬头">
          <van-switch v-model="companyForm.ifDefault" active-color="#FFC2A8" size="24px"/>
        </van-cell>
      </div>
    </form>
    <div class="bottom">
      <van-button type="info" class="submit" @click="confirm">保存</van-button>
      <van-button
        v-if="this.title === 'edit'"
        class="submit_delete"
        @click="deleteDate"
      >删除
      </van-button>
    </div>
  </div>
</template>
<script>
  import Header from "../../components/header.vue";
  import {MessageBox} from "mint-ui";
  import {Toast} from "mint-ui";
  import {createCompany, updateCompany, deleteCompany} from "../../api/company";


  export default {
    name: "EditCompany",
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
        name: "",
        listShow: false
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
          this.$ajax.get("/company/" + this.id, {
            params: {
              accessToken: this.accessToken
            }
          }).then(res => {
            this.companyForm = res.data.content;
            this.name = res.data.content.name;
          }).catch(error => {
            this.$messagebox.alert(error.response.data.message);
          });
        }
      },
      //删除
      deleteDate() {
        MessageBox({
          title: "提示",
          message: "确定删除?",
          showCancelButton: true
        }).then(action => {
          if (action === "confirm") {
            deleteCompany(this.id).then(res => {
              if (res.data.code === 1) {
                this.$router.go(-1)
              }
            }).catch(error => {
              this.$messagebox.alert(error.response.data.message);
            });
          }
        });
      },
      searchRiseList() {
        if (this.name.length < 4) {
          return;
        }
        this.$ajax.get("/company/codes", {
          params: {
            accessToken: this.accessToken,
            name: this.name
          }
        }).then(res => {
          this.searchList = res.data.content;
        }).catch(error => {
          this.$messagebox.alert(error.response.data.message);
        });
      },
      chooseRise(index) {
        this.name = this.searchList[index].name;
        this.companyForm.taxNumber = this.searchList[index].taxNumber;
        this.companyForm.bank = this.searchList[index].bank;
        this.companyForm.bankAccount = this.searchList[index].bankAccount;
        this.companyForm.address = this.searchList[index].address;
        this.companyForm.phone = this.searchList[index].phone;
        this.listShow = false
      },
      confirm() {
        if (!this.name && !this.companyForm.taxNumber) {
          return Toast("发票抬头和税号不能为空！");
        }
        this.companyForm.name = this.name;
        this.$messagebox({
          title: "提示",
          message: "确定提交吗？",
          showCancelButton: true
        }).then(action => {
          if (action === "confirm") {
            this.id = this.$route.params.id;
            if (this.title === "edit") {
              updateCompany(this.id, this.companyForm).then(res => {
                if (res.data.code === 1) {
                  this.$router.go(-1)
                }
              }).catch(error => {
                this.$messagebox.alert(error.response.data.message);
              });
            } else {
              createCompany(this.companyForm).then(res => {
                if (res.data.code === 1) {
                  this.$router.go(-1)
                }
              }).catch(error => {
                this.$messagebox.alert(error.response.data.message);
              });
            }
          }
        });
      },
      inputBlur() {
        this.listShow = false
        // var has;
        // has = false;
        // for(var i = 0; i < this.searchList.length; i++){
        //   if(this.searchList[i].name === this.name){
        //     has = true;
        //   }
        // };
        // if(!has){
        //   this.companyForm.taxNumber = '';
        //   this.companyForm.address = '';
        //   this.companyForm.phone = '';
        //   this.companyForm.bank = '';
        //   this.companyForm.bankAccount = '';
        // }
      }
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar;
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
  @import 'company.css';
</style>
