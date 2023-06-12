<template>
  <div class="box-content">
    <div class="wrapper-header">
      <el-button type="default" size="small" @click="goBook" icon="el-icon-arrow-left">笔记</el-button>

      <div class="action">
        <span>当前页面：{{this.commandSelect.label || "请选择"}}</span>

        <el-dropdown @command="handleCommand" size="small">
          <el-button type="primary" size="small">打开webview <i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item" v-for="(item, index) in options" :key="index">{{index + 1}}.{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="content">
      <webview :src="webviewUrl" style="width: 100%; height: 100%;" :preload="preloadjs"></webview>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tools',
  data() {
    return {
      preloadjs: null,
      webviewUrl: "",
      commandSelect: {},
      options: [
        {
          command: "aj_report",
          label: "AJ-Report(内网查询用户信息)"
        },
        {
          command: "project_work",
          label: "工时系统"
        }
      ]
    }
  },
  methods: {
    goBook(){ // 笔记
      this.$router.push({
        name: 'book'
      })
    },
    handleCommand(command) {
      this.commandSelect = command;

      if(this.commandSelect.command === 'aj_report'){
        this.preloadjs = null
        this.webviewUrl = 'http://172.20.96.39:9095/index.html#/el/txW79gtC'
      }

      if(this.commandSelect.command === 'project_work'){
        this.getPreloadjs(()=>{
          this.webviewUrl = 'https://gsh5.jiarui.net.cn/'
        })
      }
    },
    getPreloadjs(callback){
      // todo 打包之后获取不到 preload.js，解决一下？参考文档：https://www.jianshu.com/p/43e8a2f04422
      let pat = window.ipc.dirname();
      this.preloadjs = `file://${pat}/preload.js`

      // 根目录为：\dist_electron\win-unpacked\resources
      // this.preloadjs = `file://preload.js`
      if(callback){
        callback()
      }
    }
  },
  mounted() {

  }
}
</script>

<style lang="less" scoped>
.box-content{
  display: flex;
  flex-direction: column;

  .wrapper-header{
    display: flex;
    justify-content: space-between;
    padding: 10px;
    span{
      margin-right: 20px;
      color: #101524;
      font-size: 12px;
    }
  }

  .content{
    position: relative;
    z-index: 2;
    flex: 1;
  }
}

</style>
