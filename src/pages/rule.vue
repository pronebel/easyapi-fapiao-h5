<template>
  <div>
    <Header @headBack="goBack()" :headerTitle="headerTitle"></Header>
    <div class="rule-con">
      <div v-html="content">{{content}}</div>
    </div>
  </div>
</template>

<script>
  import Header from '../components/header.vue'

  export default {
    name: "InvoiceRule",
    components: {
      Header
    },
    data() {
      return {
        headerTitle: '开票规则',
        accessToken: '',
        content: '',
      };
    },
    methods: {
      goBack() {
        history.go(-1);
      },
      getInfo() {
        this.$ajax.get('/api/invoice/rule',
          {
            params: {
              accessToken: this.accessToken,
            }
          }).then(res => {
          this.content = res.data.content.content
        }).catch(error => {
          console.log(error)
        });
      },
    },
    watch: {},
    mounted() {
      this.getInfo()
    },
    created() {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }
</script>

<style scoped>
  body {
    background: #fff !important;
  }

  .rule-con {
    margin-top: 60px;
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
