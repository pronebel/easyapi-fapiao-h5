<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="addContent">
      <van-field
        label="发票类型"
        value="商品明细"
        readonly
        label-width='8em'
        :border="false"
      />
      <van-field
        readonly
        clickable
        :value="name"
        label="商品名称"
        placeholder="点击选择商品"
        @click="showSearchPopup"
        label-width='8em'
        :border="false"
        right-icon="arrow"
      />
      <van-popup
        v-model="showPopup"
        position="bottom"
        style="height: 75%; padding-top: 4px;"
      >
        <van-search
          v-model="searchValue"
          placeholder="请输入搜索关键词"
          @input="onSearch"
        />
        <van-list
          v-model="loading"
          :finished="true"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-radio-group v-model="radio">
            <van-cell v-for="item in productList" :key="item.productId" @click="chooseRadio(item.productId)">
              <van-row type="flex" align="center">
                <van-col span="6">
                  <van-image width="60" height="60" :src="item.img" />
                </van-col>
                <van-col span="15">
                  <span style="display: block">商品名称：{{ item.name }}</span >
                  <span>商品价格：{{ item.price }} 元</span >
                </van-col>
                <van-col span="3">
                  <van-radio :name="item.productId"/>
                </van-col>
              </van-row>
            </van-cell>
          </van-radio-group>
        </van-list>
      </van-popup>
      <van-field
        label="规格类型"
        :value="specification"
        placeholder="规格类型"
        readonly
        label-width='8em'
        :border="false"
      />
      <van-field
        label="单位"
        :value="unit"
        placeholder="单位"
        readonly
        label-width='8em'
        :border="false"
      />
      <van-field
        label="数量"
        v-model="number"
        placeholder="需要手动输入数量"
        label-width='8em'
        :border="false"
      />
      <van-field
        label="单价"
        placeholder="可输入"
        label-width='8em'
        :border="false"
      >
        <template #input>
          <van-stepper v-model="price" step="0.01" :decimal-length="2" allow-empty min="0" id="redPrice"/>
        </template>
      </van-field>
      <div class="mint-btn">
        <div @click="addTo"> 添加</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getProductList} from "../../../api/product";
  import Header from "../../../components/header.vue";
  import {MessageBox} from "mint-ui";

  export default {
    name: "Product",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: "开具电子发票",
        productId: "",
        accessToken: "",
        specification: "",
        unit: "",
        price: "",
        number: "",
        productList: [],
        productListColumns: [],
        searchValue: '',
        showPopup: false,
        radio: null
      };
    },

    methods: {
      goBack() {
        history.go(-1);
      },
      getProductList(params) {
        getProductList(params).then(res => {
          this.productList = res.data.content;
          for(var i = 0; i < this.productList.length; i++){
            this.productListColumns[i] = this.productList[i].name + ' ' + this.productList[i].specification
          }
        });
      },
      addTo() {
        let obj = {};
        if (this.price !== "") {
          if (this.number !== "") {
            if (this.number !== "0" && this.price !== 0) {
              obj = {
                productId: this.productId,
                specification: this.specification,
                unit: this.unit,
                price: this.price,
                name: this.name,
                number: this.number
              };
              let oldList = JSON.parse(localStorage.getItem("productList")) || [];
              oldList.push(obj);
              localStorage.setItem("productList", JSON.stringify(oldList));
              this.$router.push({path: "/make/product"});
            } else {
              MessageBox("提示", "数量,单价不能为0");
            }
          } else {
            MessageBox("提示", "数量不能为空");
          }
        } else {
          MessageBox("提示", "单价不能为空");
        }
      },
      showSearchPopup(){
        this.showPopup = true
        this.searchValue = ''
        this.getProductList()
      },
      chooseRadio(id){
        this.radio = id
        for (var i = 0; i < this.productList.length; i++) {
          if (this.radio === this.productList[i].productId) {
            this.productId = this.productList[i].productId
            this.specification = this.productList[i].specification;
            this.unit = this.productList[i].unit;
            this.price = this.productList[i].price;
            this.name = this.productList[i].name;
          }
        }
        this.showPopup = false
      },
      onSearch() {
        var searchVal = {name: this.searchValue}
        this.getProductList(searchVal)
      },
    },
    mounted() {
      this.getProductList();
    },
    created() {
      this.accessToken = localStorage.getItem("accessToken");
    },
  };
</script>

<style scoped>
  .addContent {
    margin-top: 63px;
  }

  .btn {
    width: 100%;
    height: 80px;
    background-color: #fff;
    text-align: center;
  }

  .btn .submit-btn {
    width: 143px;
    height: 33px;
    background-color: #56cbf6;
    color: #fff;
    font-size: 12px;
    margin-top: 20px;
  }

  .Drop-down-box {
    width: 200px;
    height: 25px;
    border: 1px solid #ddd;
    border-radius: 50px;
    outline: none;
  }

  .Drop-down-box option {
    border: 1px solid #ddd;
  }

  input:disabled {
    background-color: #fff;
  }

  .classification-name {
    color: #333333;
    font-size: 15px;
  }

  .classification-input {
    color: #bbbbbb;
    font-size: 15px;
  }

  .mint-btn div {
    margin: 20px;
    height: 44px;
    background-color: #1989fa;
    border-radius: 8px;
    box-shadow: 0px 3px 15px 0px rgba(12, 143, 192, 0.23);
    color: #fff;
    text-align: center;
    line-height: 44px;
    font-size: 16px;
  }
</style>
