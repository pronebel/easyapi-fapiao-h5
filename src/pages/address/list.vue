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
        <div class="no-record-con" v-show="addressList.length ==0 && !loading">
          <van-empty image="search" description="暂无数据"/>
        </div>
        <div
          class="address-con header-d"
          v-for="(item, index) in addressList"
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
              <van-cell title="收件人" :value="item.name" :border="false"/>
              <van-cell title="联系电话" :value="item.mobile" :border="false"/>
              <van-cell title="收货地址" :value="item.province + item.city + item.district + item.addr" :border="false"/>
            </van-cell-group>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-button type="info" class="submit" @click="gotoEditAddress">新增地址</van-button>
    </div>
  </div>
</template>

<script>
  import Header from "../../components/header.vue";
  import {getDefaultAddress, getAddressList} from "../../api/address";

  export default {
    name: "Address",
    components: {
      Header
    },
    data() {
      return {
        loading: true,
        headerTitle: "地址管理",
        addressList: [],
        accessToken: "",
        from: "make",
        back: false//是否可以后退
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getAddressList() {
        getAddressList({username: localStorage.getItem("username")}).then(res => {
          if (res.data.code !== 0) {
            this.loading = false;
            this.addressList = res.data.content;
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
        this.defaultAddress(item.addressId);
        this.$emit("selectAddress", item);
        this.$router.back(-1);
      },
      //设置默认值
      defaultAddress(addressId) {
        defaultAddress(addressId).then(res => {
        }).catch(error => {
          console.log(error);
        });
      },
      gotoEditAddress() {
        this.back = true;
        this.$router.push({name: "EditAddress", path: "/address/edit"});
      },
      edit(index) {
        this.back = true;
        this.$router.push({
          name: "EditAddress",
          path: "/address/edit",
          params: {id: this.addressList[index].addressId}
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
      this.getAddressList();
    },
    mounted() {
      this.getAddressList();
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'EditAddress' && !this.back) {
        next({name: 'Index'});
      } else if (to.name === 'Address') {
        next({name: 'Index'});
      } else {
        next();
      }
    }
  };
</script>

<style scoped>
  @import 'address.css';
</style>
