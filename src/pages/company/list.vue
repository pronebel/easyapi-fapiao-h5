<template>
  <div>
    <div class="add-con">
      <Header @headBack="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
      <div style="margin-top: 10px;margin-bottom: 35px;">
        <div id="loading">
          <mt-spinner
            color="#56cbf6"
            v-show="loading"
            type="fading-circle"
          ></mt-spinner>
        </div>
        <div class="no-record-con" v-show="companyList.length ==0 && !loading">
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
              <van-tag plain type="warning" v-if="item.ifDefault">默认</van-tag>
              <span class="edit" @click="edit(index)">编辑</span>
            </p>
          </div>
          <div class="address-bottom" @click="select(item)">
            <van-cell-group :border="false">
              <van-cell title="公司税号" :value="item.taxNumber" :border="false"/>
              <van-cell title="注册地址" :value="item.address" :border="false"/>
              <van-cell title="注册电话" :value="item.phone" :border="false"/>
              <van-cell title="开户银行" :value="item.bank" :border="false"/>
              <van-cell title="银行账号" :value="item.bankAccount" :border="false"/>
            </van-cell-group>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-button type="info" class="submit" @click="gotoEditCompany">新增抬头</van-button>
    </div>
  </div>
</template>

<script>
  import Header from "../../components/header.vue";
  import {defaultCompany, getCompanyList} from "../../api/company";

  export default {
    name: "Company",
    components: {
      Header
    },
    data() {
      return {
        loading: true,
        headerTitle: "抬头管理",
        companyList: [],
        accessToken: "",
        from: "make",
        back: false//是否可以后退
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getCompanyList() {
        getCompanyList({username: localStorage.getItem("username")}).then(res => {
          if (res.data.code !== 0) {
            this.loading = false;
            this.companyList = res.data.content;
          } else {
            this.isNull = true;
            this.loading = false;
          }
        }).catch(error => {
          console.log(error);
          this.loading = false;
        });
      },
      select(item) {
        if (this.from != 'make') {
          return;
        }
        this.defaultCompany(item.companyId);
        console.log(item.companyId)
        this.$emit("selectCompany", item);
        this.$router.back(-1);
      },
      //设置默认值
      defaultCompany(companyId) {
        defaultCompany(companyId).then(res => {
        }).catch(error => {
          console.log(error);
        });
      },
      gotoEditCompany() {
        this.back = true;
        this.$router.push({name: "EditCompany", path: "/company/edit"});
      },
      edit(index) {
        this.back = true;
        this.$router.push({
          name: "EditCompany",
          path: "/company/edit",
          params: {id: this.companyList[index].companyId}
        });
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
    },
    activated() {
      this.getCompanyList();
    },
    mounted() {
      this.getCompanyList();
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'EditCompany' && !this.back) {
        next({name: 'Index'});
      } else if (to.name === 'Company') {
        next({name: 'Index'});
      } else {
        next();
      }
    }
  };
</script>

<style scoped>
  @import 'company.css';
</style>
