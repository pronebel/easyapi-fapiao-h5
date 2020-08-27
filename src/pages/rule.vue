<template>
  <div>
    <div class="rule-con">
      <div v-html="content">{{ content }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Rule",
    data() {
      return {
        content: ""
      };
    },
    methods: {
      getInfo() {
        this.$ajax.get("/api/invoice/rule", {
          params: {
            accessToken: this.accessToken
          }
        }).then(res => {
          this.content = res.data.content.content;
        }).catch(error => {
          console.log(error);
        });
      }
    },
    mounted() {
      this.getInfo();
    },
    created() {
    }
  };
</script>

<style scoped>
  body {
    background: #fff !important;
  }

  .rule-con {
    margin-top: 10px;
    background: #fff;
    background-size: 100%;
    padding: 20px 10px;
  }

  .rule-con li {
    margin-top: 10px;
  }

  ul {
    list-style-type: demical;
    text-indent: 2em;
  }
</style>
