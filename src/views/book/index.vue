<template>
  <div class="box-content">
    <el-container @click.native.left="mouseMenuShow = false">
      <el-aside>
        <div class="header">
          <div class="btn-group">
            <el-button type="primary" size="small" @click="createFile">新增</el-button>
            <el-button type="default" size="small" @click="goTools">常用工具<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </div>

          <div class="search">
            <el-input placeholder="搜索..." v-model.trim="searchKey" clearable></el-input>
          </div>
        </div>

        <div class="card-box">
          <div v-if="fileList.length > 0">
            <el-card shadow="hover" v-for="(i, index) in fileList"
                     :key="index"
                     @click.native="readFile(i, index)"
                     :class="index === activeIndex && 'active'"
                     v-show="i.indexOf(searchKey) !== -1"
                     :title="dataObj[i]"> {{ dataObj[i] }}
            </el-card>
          </div>

          <div v-else style="text-align: center; width: 100%">
            <el-empty description="暂无数据" :image-size="100" />
          </div>
        </div>
      </el-aside>

      <el-container>
        <el-main>
          <wang-editor v-model="fileContent" :isClear="isEditorClear" @change="editorChange"
                       v-if="!!fileName && !createCard" @keyup.native.ctrl.83="saveContent"
                       @contextmenu.native.prevent="mouseMenu($event)"></wang-editor>
          <about-info v-else></about-info>
        </el-main>
      </el-container>
    </el-container>

    <div class="mouse-menu" :style="mouseMenuStyle" v-show="mouseMenuShow">
      <el-card>
        <el-button type="primary" size="small" @click="saveContent">保存</el-button>
        <br/>
        <el-button type="danger" size="small" @click="removeFile(fileName)">删除</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import WangEditor from '@/components/WangEditor'
import AboutInfo from '@/components/AboutInfo'

import {filePath} from "@/utils/config"

export default {
  name: 'book',
  data() {
    return {
      targetDir: filePath.dataBook, // 数据所在文件夹
      targetDirBak: filePath.dataBookBak, // 数据备份所在文件夹
      createCard: false, // 添加笔记弹窗
      searchKey: "", // 搜索框
      fileName: "", // 笔记名
      fileList: [], // 文件列表
      fileContent: "", // 文件内容
      fileSelect: "", // 当前选择的文件
      dataObj: {}, // 所有的数据
      isEditorClear: false,
      activeIndex: -1, // 左侧菜单激活项
      mouseMenuShow: false, // 是否显示右键菜单
      mouseMenuStyle: { // 右击菜单定位
        top: 0,
        left: 0
      }
    }
  },
  watch: {
    searchKey(n, o) {
      this.reset();
    }
  },
  components: {
    WangEditor,
    AboutInfo
  },
  methods: {
    readFile(fileName, index) { // 获取文件内容
      let fileNameTemp = this.targetDir + "/" + fileName + ".txt";
      window.ipc.readFile(fileNameTemp, (err, data)=>{
        if (err) {
          return this.$notify({
            title: '提示',
            message: "查询列表失败",
            type: 'fail',
            duration: 3000
          });
        }

        this.fileContent = data;
        this.fileName = fileName;
        this.activeIndex = index;

        this.$notify({
          title: '提示',
          message: "已切换至 " + fileName,
          type: 'success',
          duration: 1500
        });
      });
    },
    writeFile() { // 生成文件
      if (this.fileList.indexOf(this.fileName) !== -1) {
        this.fileName = "";
        this.createCard = false;

        return this.$notify({
          title: '提示',
          message: "文件名已存在",
          type: 'warning',
          duration: 3000
        });
      }

      let fileNameTemp = this.targetDir + "/" + this.fileName + ".txt";
      window.ipc.writeFile(fileNameTemp, "", (err)=>{
        if (err) {
          return this.$notify({
            title: '提示',
            message: '当前目录没有权限进行此操作，请检查系统权限',
            type: 'fail',
            duration: 1500
          });
        }

        this.getDataList();
        this.reset();
        this.createCard = false;

        this.$notify({
          title: '提示',
          message: this.fileName + " 创建成功",
          type: 'success',
          duration: 1500
        });
      })
    },
    removeFile(fileName) { // 删除文件
      this.$confirm('确认删除该笔记', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let tempPath = this.targetDir + "/" + fileName + ".txt";
        window.ipc.unlink(tempPath, (err)=>{
          if (err) {
            this.$notify({
              title: '提示',
              message: '当前目录没有权限进行此操作，请检查系统权限',
              type: 'fail',
              duration: 1500
            });

            throw err;
          }

          this.getDataList();
          this.reset();

          this.$notify({
            title: '提示',
            message: fileName + ' 删除成功',
            type: 'success',
            duration: 1500
          });
        })
      }).catch(() => {

      });
    },
    getDataList() { // 获取文件列表
      let dirList = window.ipc.readdirSync(this.targetDir);
      let fileObj;
      this.fileList = [];
      dirList.forEach((fileName) => {
        fileObj = fileName.slice(0, -4);
        this.$set(this.dataObj, fileObj, fileObj);
        this.fileList.push(fileObj);
      });
    },
    saveContent() { // 保存内容
      if (!this.fileName) {
        return;
      }

      let fileNameTemp = this.targetDir + "/" + this.fileName + ".txt";
      window.ipc.writeFile(fileNameTemp, this.fileContent, (err) => {
        if (err) {
          return this.$notify({
            title: '提示',
            message: '当前目录没有权限进行此操作，请检查系统权限',
            type: 'fail',
            duration: 1500
          });
        }

        this.mouseMenuShow = false;
        this.$notify({
          title: '提示',
          message: this.fileName + " 保存成功",
          type: 'success',
          duration: 1500
        });
      });
    },
    createFile() {
      this.$prompt('请输入名称', '新增笔记', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[^\s].{0,13}[^\s]$/,
        inputErrorMessage: '长度为2-15位，头尾不能有空格'
      }).then(({value}) => {
        this.fileName = value;
        this.createCard = true;
        this.writeFile();
      }).catch(() => {
        this.createCard = false;
        this.reset();
      });
    },
    reset() {
      this.activeIndex = -1;
      this.fileName = "";
      this.fileContent = "";
      this.mouseMenuShow = false;
    },
    editorChange(v) {

    },
    mouseMenu(e) {
      this.mouseMenuShow = true;
      this.mouseMenuStyle = {
        top: e.pageY + "px",
        left: e.pageX + "px"
      }
    },
    createZip() {
      window.ipc.compressDir(this.targetDir, `${this.targetDirBak}/book_${moment(new Date().getTime()).format('YYYYMMDD')}.zip`, ()=>{
        localStorage.setItem('lastSaveDate', new Date().getTime())
      })
    },
    dataBak() {
      let lastSaveDate = localStorage.getItem("lastSaveDate") || 0;
      // 大于 5小时 则备份
      if (new Date().getTime() - lastSaveDate > 5 * 60 * 60 * 1000) {
        this.createZip();
      }
    },
    init() {
      // 获取文件列表
      this.getDataList();

      // 数据自动备份
      this.dataBak()
    },
    goTools(){ // 常用工具
      this.$router.push({
        name: 'tools'
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.el-aside {
  position: fixed;
  top: 0;
  left: 0;
  width: 400px!important;
  border-right: 1px solid #f2f2f2;

  .header{
    position: fixed;
    top: 0;
    background-color: #ffffff;
    .btn-group {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #ffffff;
      width: 399px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .search {
      background-color: #ffffff;
      padding: 0 10px 10px;
      width: 375px;
    }
  }

  ::v-deep .card-box {
    position: fixed;
    top: 102px;
    bottom: 0;
    left: 0;
    width: 400px;
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;

    .el-card {
      width: 180px;
      display: inline-block;
      margin: 0 0 5px 10px;
      cursor: pointer;
      -webkit-border-radius: 4px;
      border-radius: 4px;
      -webkit-transition: .2s;
      transition: .2s;
      overflow: hidden;

      &:hover, &.active {
        background-color: #409EFF;
        .el-card__body {
          color: #ffffff;
        }
      }
    }

    .el-card__body {
      padding: 6px 12px;
      color: #101524;
      font-size: 12px;
      line-height: 1.8;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.el-container {
  > .el-container {
    margin-left: 400px;
  }

  ::v-deep .el-main {
    padding: 2px 0 0 0;
    height: 100%;
    overflow: hidden;
    font-family: Serif;

    img[data-w-e]{
      width: 22px;
    }
  }
}

.mouse-menu {
  position: fixed;
  ::v-deep .el-card__body{
    padding: 10px 10px 0;
  }

  ::v-deep .el-button{
    margin-bottom: 10px;
    padding: 8px 30px;
  }
}
</style>
