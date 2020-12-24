<template>
  <div>
    <div class="add-con">
      <Header @head-back="goBack()" :headerTitle="headerTitle" v-if="show"></Header>
      <div style="margin-top: 10px;margin-bottom: 35px;">
        <div id="loading">
          <van-loading
            color="#56cbf6"
            v-show="loading"
          />
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
          <div class="address-bottom" v-on:click="select(item)">
            <van-cell-group :border="false">
              <van-cell title="联系电话" :value="item.mobile" :border="false"/>
              <van-cell title="收票地址" :value="item.province + item.city + item.district + item.addr" :border="false"/>
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
  import Header from "../../../components/Header.vue";
  import {getAddressList, defaultAddress} from "../../../api/address";
  import {Toast} from "vant";

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
        getAddressList({}).then(res => {
          if (res.data.code !== 0) {
            this.loading = false;
            this.addressList = res.data.content;
          } else {
            this.loading = false;
          }
        }).catch(error => {
          Toast(error.response.data.message);
          this.loading = false;
        });
      },
      select(item) {
        if (this.from != 'make') {
          return;
        }
        event.$emit('select', item)
        this.defaultAddress(item.addressId);
        this.$emit("select-address", item);
        this.$router.back(-1);
      },
      //设置默认值
      defaultAddress(addressId) {
        defaultAddress(addressId).then(res => {
        }).catch(error => {
          Toast(error.response.data.message);
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
      // console.log(to,from)
      // if (to.path == "/make/merge-order") {
      //   to.meta.keepAlive = true
      // } else {
      //   to.meta.keepAlive = false;
      // }
      // next();
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
  @import '../address.css';
</style>
