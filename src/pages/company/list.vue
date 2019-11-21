<template>
  <div class="add-con" style="position: fixed;top: 0;bottom: 0;left: 0;right: 0; overflow: auto;z-index: 99;">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div style="margin-top: 60px">
      <div id="loading">
        <mt-spinner color="#56cbf6" v-show="loadingList" type="fading-circle"></mt-spinner>
      </div>
      <div class="no-record-con" v-show="isNull">
      <p><img src="../../assets/images/no-reaord_03.png" alt=""></p>
      <p class="record-text">暂时还没有记录！</p>
    </div>
      <div class="address-con header-d" v-for="(item, index) in companyList" :key="index">
        <div class="address-top">
          <p>
            <span class="rise-title">发票抬头：</span><span class="rise-text">{{item.name}}</span>
            <!--<span class="delete" @click="deleteData(index)">删除</span>-->
            <span class="edit" @click="edit(index)">编辑</span>
          </p>
        </div>
        <div class="address-bottom" @click="seletedOrder(item)">
          <table>
            <tr class="address-bottom-title">
              <td class="">
                <div class="address-bottom-name">税号</div>
              </td>
              <td>
                <div class="address-bottom-con">{{item.taxNumber}}</div>
              </td>
            </tr>
            <tr class="address-bottom-title">
              <td>
                <div class="address-bottom-name">地址</div>
              </td>
              <td>
                <div class="address-bottom-con">{{item.address}}</div>
              </td>
            </tr>
            <tr class="address-bottom-title">
              <td style="padding-top:10px">
                <div class="address-bottom-name">电话</div>
              </td>
              <td style="padding-top:10px">
                <div class="address-bottom-con">{{item.phone}}</div>
              </td>
            </tr>
            <tr class="address-bottom-title">
              <td style="padding-top:10px">
                <div class="address-bottom-name">开户行</div>
              </td>
              <td style="padding-top:10px">
                <div class="address-bottom-con">{{item.bank}}</div>
              </td>
            </tr>
            <tr class="address-bottom-title">
              <td style="padding-top:10px">
                <div class="address-bottom-name">开户行账号</div>
              </td>
              <td style="padding-top:10px">
                <div class="address-bottom-con">{{item.bankAccount}}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="bottom">
      <mt-button class="submit" @click="goAddAddress">新增抬头</mt-button>
    </div>
  </div>
</template>

<script>
  import Header from '../../components/header.vue'
import { setTimeout } from 'timers';

  export default {
    name: "chooseCompany",
    components: {
      Header
    },
    data() {
      return {
        loadingList: true,
        headerTitle: '抬头管理',
        companyList: [],
        obj2: {},
        id: '',
        isNull:false,
        accessToken: '',
        companyId: '',
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getCompanyList() {
        this.$ajax.get('/companies',
          {
            params: {
              accessToken: this.accessToken,
              username: localStorage.getItem('username'),
            }
          }).then(res => {
          if (res.data.code !== 0) {
          this.loadingList = false;
          this.companyList = res.data.content;
          }else{
            this.isNull = true;
            this.loadingList = false;
          }
        }).catch(error => {
          console.log(error);
          this.loadingList = false;
        });
      },
      seletedOrder(item) {
        this.defaultCompany(item.companyId)
        this.$emit('seletedOrder', item);
        setTimeout(()=>{
          this.$router.back(-1);
        },500);
      },
      //设置默认值
      defaultCompany(companyId) {
        this.$ajax('/company/' + companyId,
          {
            method: 'PUT',
            data: {
              accessToken: this.accessToken,
              ifDefault: true,
            }
          }).then(res => {
        }).catch(error => {
          console.log(error)
        });
      },
      goAddAddress() {
        this.$router.push({name: 'address',})
      },

      deleteData(index) {
        let id = this.companyList[index].companyId;
        this.$ajax.delete('/company/' + id,
          {
            params: {
              accessToken: this.accessToken,
              username: localStorage.getItem('username'),
            }
          }).then(res => {
          if (res.data.code === 1) {
            this.$messagebox.alert(res.data.message);
            this.getCompanyList();
          }
        }).catch(error => {
          console.log(error)
        });
      },
      edit(index) {
        this.id = this.companyList[index].companyId;
        this.$router.push({name: 'address', params: {id: this.id}})
      }
    },
    created() {
      this.accessToken = localStorage.getItem('accessToken');
      this.beforeRouteEnter;
    },
    activated() {
      this.getCompanyList();
    },
    mounted() {
      this.getCompanyList();
    }
  }
</script>

<style scoped>
  .no-record-con {
    margin-top: 80px;
    padding: 60px;
    text-align: center;
  }

  .no-record-con img {
    width: 100%;
  }

  .record-text {
    margin-top: 20px;
    color: #ccc;
  }

  .add-con {
    background: #f4f4f4;
    padding: 0 10px 20px;
  }

  .address-con {
    background: #fff;
    background-size: 100% 100%;
    padding: 10px 15px 30px;
    border-bottom: 1px solid #f4f4f4;
    margin-top: 15px;
    border-radius: 8px;
    box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.11);
  }

  .address-top {
    border-bottom: 1px solid #f4f4f4;
    height: 40px;
    line-height: 40px;
  }

  .rise-title {
    display: block;
    width: 70px;
    float: left;
    font-size: 14px;
    color: #333333;
  }

  .rise-text {
    float: left;
    max-width: 170px;
    display: block;
    overflow: hidden; /*内容超出后隐藏*/
    text-overflow: ellipsis; /* 超出内容显示为省略号*/
    white-space: nowrap; /*文本不进行换行*/
    font-size: 14px;
    color: #333333;

  }

  .edit, .delete {
    float: right;
  }

  .edit {
    color: #52c9f5;
    margin-right: 10px;
  }

  .delete {
    color: red;
  }

  .address-bottom {
    margin-top: 10px;
  }

  .address-bottom div {
    font-size: 13px;
  }

  .address-bottom .address-bottom-title {
    height: 25px;
    /*margin-top: 25px;*/
    vertical-align: top;
  }

  .address-bottom .address-bottom-name {
    float: left;
    width: 90px;
    color: #999;
  }

  .address-bottom .address-bottom-con {
    float: left;
    margin-left: 10px;
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
  }

  #loading {
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    z-index: 999;
  }
</style>
