<template>
  <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="addContent">
      <ul class="classification">
        <li>
          <span class="classification-name">发票类型 </span>
          <span>商品明细</span>
        </li>
        <li>
          <span class="classification-name">商品名称</span>
          <span>
            <select v-model="productId" @change="choice" class="Drop-down-box">
              <option
                v-for="(item,index) in productList"
                :value="item.productId"
                :key="index">{{ item.name }} {{ item.specification }}</option>
            </select>
          </span>
        </li>
        <li>
          <span class="classification-name">规格类型</span>
          <span class="classification-input">
            <input
              type="text"
              disabled
              v-model="specifications"
              placeholder="规格类型"
              class="mint-field-core"
            />
          </span>
        </li>
        <li>
          <span class="classification-name">单位</span>
          <span class="classification-input">
            <input
              type="text"
              disabled
              v-model="unit"
              placeholder="单位"
              class="mint-field-core"
            />
          </span>
        </li>
        <li>
          <span class="classification-name">数量</span>
          <span class="classification-input">
            <input
              placeholder="需要手动输入数量"
              v-model="number"
              type="tel"
              class="mint-field-core"
            />
          </span>
        </li>
        <li>
          <span class="classification-name">单价</span>
          <span class="classification-input">
            <input
              type="number"
              step="0.01"
              v-model="price"
              placeholder="可输入"
              style="color:#ff4848;"
              class="mint-field-core"
            />
          </span>
        </li>
      </ul>
      <div class="btn">
        <mt-button class="submit-btn" @click="addTo"> 添加</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {getProductList} from "../api/product";
  import Header from "../components/header.vue";
  import {MessageBox} from "mint-ui";

  export default {
    name: "product",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: "开具电子发票",
        productId: "",
        accessToken: "",
        specifications: "",
        unit: "",
        price: "",
        number: "",
        productList: [],
      };
    },

    methods: {
      goBack() {
        history.go(-1);
      },
      getProductList() {
        getProductList().then(res => {
          this.productList = res.data.content;
        });
      },
      choice(name) {
        for (var i = 0; i < this.productList.length; i++) {
          if (this.productId === this.productList[i].productId) {
            this.specifications = this.productList[i].specification;
            this.unit = this.productList[i].unit;
            this.price = this.productList[i].price;
            this.name = this.productList[i].name;
          }
        }
      },
      addTo() {
        let obj = {};
        if (this.price !== "") {
          if (this.number !== "") {
            if (this.number !== "0" && this.price !== 0) {
              obj = {
                productId: this.productId,
                specifications: this.specifications,
                unit: this.unit,
                price: this.price,
                name: this.name,
                number: this.number
              };
              let oldList = JSON.parse(localStorage.getItem("productList")) || [];
              oldList.push(obj);
              localStorage.setItem("productList", JSON.stringify(oldList));
              this.$router.push({path: "/product"});
            } else {
              MessageBox("提示", "数量,单价不能为0");
            }
          } else {
            MessageBox("提示", "数量不能为空");
          }
        } else {
          MessageBox("提示", "单价不能为空");
        }
      }
    },
    mounted() {
      this.getProductList();
    },
    created() {
      this.accessToken = localStorage.getItem("accessToken");
    },
    activated() {
    },
    watch: {}
  };
</script>

<style scoped>
  .addContent {
    margin-top: 63px;
  }

  .classification {
    list-style: none;
    background-color: #fff;
  }

  .classification li {
    padding: 0px 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
    display: flex;
    color: #666;
  }

  .classification li span:first-child {
    display: block;
    width: 30%;
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
</style>
