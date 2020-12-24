<template>
  <div class="content" v-html="content">{{ content }}</div>
</template>

<script>
  import {Toast} from "vant";
  import {getRule} from "../api/info";

  export default {
    name: "Rule",
    data() {
      return {
        content: ""
      };
    },
    mounted() {
      /**  获取开票规则 */
      getRule().then(res => {
        this.content = res.data.content.content ? res.data.content.content : "请管理员设置开票规则";
      }).catch(error => {
        Toast(error.response.data.message);
      });
    }
  };
</script>

<style scoped>

  .content {
    padding: 20px 10px;
  }

  .content ul {
    list-style-type: demical;
    text-indent: 2em;
  }

  .content li {
    margin-top: 10px;
  }
</style>
