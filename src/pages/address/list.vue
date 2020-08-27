<template>
  <div
    class="add-con"
    style="position: fixed;top: 0;bottom: 0;left: 0;right: 0; overflow: auto;z-index: 99;"
  >
    <Header @headBack="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
    <div style="margin-top: 10px">
      <div id="loading">
        <mt-spinner
          color="#56cbf6"
          v-show="loadingList"
          type="fading-circle"
        ></mt-spinner>
      </div>
      <div class="no-record-con" v-show="isNull">
        <van-empty image="search" description="暂无数据"/>
      </div>
      <div
        class="address-con header-d"
        v-for="(item, index) in companyList"
        :key="index"
      >
        <div class="address-top">
          <p>
            <span class="rise-text">{{ item.name }}</span>
            <span class="edit" @click="edit(index)">编辑</span>
          </p>
        </div>
        <div class="address-bottom" @click="selectCompany(item)">
          <table>
            <tr class="address-bottom-title">
              <td class="">
                <div class="address-bottom-name">税号</div>
              </td>
              <td>
                <div class="address-bottom-con">{{ item.taxNumber }}</div>
              </td>
            </tr>
            <tr class="address-bottom-title">
              <td>
                <div class="address-bottom-name">地址</div>
              </td>
              <td>
                <div class="address-bottom-con">{{ item.address }}</div>
              </td>
            </tr>
            <tr class="address-bottom-title">
              <td style="padding-top:10px">
                <div class="address-bottom-name">电话</div>
              </td>
              <td style="padding-top:10px">
                <div class="address-bottom-con">{{ item.phone }}</div>
              </td>
            </tr>
            <tr class="address-bottom-title">
              <td style="padding-top:10px">
                <div class="address-bottom-name">开户行</div>
              </td>
              <td style="padding-top:10px">
                <div class="address-bottom-con">{{ item.bank }}</div>
              </td>
            </tr>
            <tr class="address-bottom-title">
              <td style="padding-top:10px">
                <div class="address-bottom-name">开户行账号</div>
              </td>
              <td style="padding-top:10px">
                <div class="address-bottom-con">{{ item.bankAccount }}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="bottom">
      <mt-button class="submit" @click="gotoEditCompany">新增抬头</mt-button>
    </div>
  </div>
</template>

<script>
  import Header from "../../components/header.vue";
  import {defaultCompany} from "../../api/company";
  import {setTimeout} from "timers";

  export default {
    name: "chooseCompany",
    components: {
      Header
    },
    data() {
      return {
        loadingList: true,
        headerTitle: "抬头管理",
        companyList: [],
        id: "",
        isNull: false,
        accessToken: "",
        companyId: "",
        from: "make"
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getCompanyList() {
        this.$ajax.get("/companies", {
          params: {
            accessToken: this.accessToken,
            username: localStorage.getItem("username")
          }
        }).then(res => {
          if (res.data.code !== 0) {
            this.loadingList = false;
            this.companyList = res.data.content;
          } else {
            this.isNull = true;
            this.loadingList = false;
          }
        }).catch(error => {
          console.log(error);
          this.loadingList = false;
        });
      },
      selectCompany(item) {
        if (this.from != 'make') {
          return;
        }
        this.defaultCompany(item.companyId);
        this.$emit("seletedOrder", item);
        setTimeout(() => {
          this.$router.back(-1);
        }, 500);
      },
      //设置默认值
      defaultCompany(companyId) {
        defaultCompany(companyId).then(res => {
        }).catch(error => {
          console.log(error);
        });
      },
      gotoEditCompany() {
        this.$router.push({name: "EditCompany", path: "/company/edit"});
      },
      edit(index) {
        this.id = this.companyList[index].companyId;
        this.$router.push({name: "EditCompany", path: "/company/edit", params: {id: this.id}});
      }
    },
    computed: {
      show() {
        return this.$store.state.ifShowH5NavBar
      },
    },
    created() {
      this.accessToken = localStorage.getItem("accessToken");
      this.from = this.$route.params.from;
      this.beforeRouteEnter;
    },
    activated() {
      this.getCompanyList();
    },
    mounted() {
      this.getCompanyList();
    }
  };
</script>

<style scoped>
  @import 'address.css';
</style>
