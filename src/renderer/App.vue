<template>
    <div id="app">
        <el-container>
            <el-aside>
                <div class="btn-group">
                    <el-button type="success" size="small" @click="createBook">新增</el-button>
                    <el-button type="text" size="small" @click="reset">文档</el-button>
                    <!--
                    <el-button type="primary" size="small" icon="el-icon-upload2">导入</el-button>
                    <el-button type="primary" size="small" icon="el-icon-download">导出</el-button>
                    -->
                    <div class="search">
                        <el-input
                            placeholder="搜索..."
                            v-model="searchKey"
                            clearable>
                        </el-input>
                    </div>
                </div>
                
                <div class="card-box">
                    <el-card shadow="never" v-for="(i, index) in bookList" :key="index" @click.native="readFile(i, index)" :class="index == activeIndex && 'active'" v-show="i.indexOf(searchKey) != -1">
                        {{dataObj[i]}}
                    </el-card>
                </div>
            </el-aside>
            
            <el-container>
                <el-main>
                    <wang-editor v-model="bookContent" :isClear="isEditorClear" @change="editorChange" v-if="!!bookName && !createCard" @keyup.native.ctrl.83="saveContent"></wang-editor>
                    <about-info v-else></about-info>
                </el-main>
                <el-footer v-if="!!bookName && !createCard">
                    <el-button type="primary" size="small" @click="saveContent">保存</el-button>
                    <el-button type="danger" size="small" @click="removeFile(bookName)">删除</el-button>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Vue from 'vue';
    import WangEditor from '@/components/wangEditor'
    import AboutInfo from '@/components/aboutInfo'

    const fs = require('fs');

    export default {
        name: 'komue-book',
        data() {
            return {
                targetDir: 'data', // 数据所在文件夹
                createCard: false, // 添加笔记弹窗
                searchKey: "", // 搜索框
                bookName: "", // 笔记名
                bookList: [], // 文件列表
                bookContent: "", // 文件内容
                fileSelect: "", // 当前选择的文件
                dataObj: {}, // 所有的数据
                isEditorClear: false,
                activeIndex: -1 // 左侧菜单激活项
            }
        },
        watch: {
            searchKey(n, o){
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
                fs.readFile(fileNameTemp, (err, data) => {
                    if (err) {
                        this.$notify({
                            title: '提示',
                            message: "查询列表失败",
                            type: 'fail',
                            duration: 1000
                        });
                        return;
                    }
                    
                    this.bookContent = data;
                    this.bookName = fileName;
                    this.activeIndex = index;

                    this.$notify({
                        title: '提示',
                        message: "已切换至【" + fileName + "】",
                        type: 'success',
                        duration: 1000
                    });
                });
            },
            writeFile() { // 生成文件
                if (this.bookList.indexOf(this.bookName) !== -1) {
                    this.$notify({
                        title: '提示',
                        message: "笔记已经存在",
                        type: 'warning',
                        duration: 1000
                    });

                    this.bookName = "";
                    this.createCard = false;
                    return;
                }

                let fileNameTemp = this.targetDir + "/" + this.bookName + ".txt";
                fs.writeFile(fileNameTemp, "", (err) => {
                    if (err) {
                        return console.log(err);
                    }

                    this.getDataList();
                    this.reset();
                    this.createCard = false;

                    this.$notify({
                        title: '提示',
                        message: this.bookName + " 创建成功",
                        type: 'success',
                        duration: 1000
                    });
                });
            },
            removeFile(fileName) { // 删除文件
                this.$confirm('确认删除该笔记', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tempPath = this.targetDir + "/" + fileName + ".txt";
                    fs.unlink(tempPath, (err) => {
                        if (err) {
                            throw err;
                        }

                        this.$notify({
                            title: '提示',
                            message: fileName + '删除成功！',
                            type: 'success',
                            duration: 1000
                        });

                        this.getDataList();
                        this.reset();
                    })
                }).catch(() => {

                });
            },
            getDataList() { // 获取文件列表
                let dirList = fs.readdirSync(this.targetDir);
                let fileObj;
                this.bookList = [];
                dirList.forEach((fileName) => {
                    fileObj = fileName.slice(0, -4);
                    Vue.set(this.dataObj, fileObj, fileObj);
                    this.bookList.push(fileObj);
                });
            },
            saveContent() { // 保存内容
                if (!this.bookName) {
                    return;
                }

                let fileNameTemp = this.targetDir + "/" + this.bookName + ".txt";
                fs.writeFile(fileNameTemp, this.bookContent, (err) => {
                    if (err) {
                        return console.log(err);
                    }

                    this.$notify({
                        title: '提示',
                        message: this.bookName + " 保存成功",
                        type: 'success',
                        duration: 1500
                    });
                });
            },
            createBook() {
                this.$prompt('请输入笔记名称', '新增笔记', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.{1,15}$/,
                    inputErrorMessage: '笔记名长度为1-15位'
                }).then(({value}) => {
                    this.bookName = value;
                    this.createCard = true;
                    this.writeFile();
                }).catch(() => {
                    this.createCard = false;
                    this.reset();
                });
            },
            reset(){
                this.activeIndex = -1;
                this.bookName = "";
                this.bookContent = "";
            },
            editorChange(val) {
                console.log(val)
            }
        },
        mounted() {
            // 创建数据文件夹
            if (!fs.existsSync(this.targetDir)) {
                fs.mkdirSync(this.targetDir);
            }

            // init
            this.getDataList();
        }
    }
</script>

<style lang="less">
    html, body {
        margin: 0;
    }
    
    html, body, .el-container, .el-aside, #app {
        height: 100%;
        overflow-y: auto;
    }
    
    .el-aside {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        border-top: 1px solid #f2f2f2;
        border-right: 1px solid #f2f2f2;

        .btn-group {
            position: fixed;
            z-index: 99;
            padding: 10px;
            background-color: #ffffff;
            width: 299px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .search{
                margin-top: 10px;
            }
        }
        
        .card-box {
            padding: 105px 0 0;
            border-bottom: 1px solid #f2f2f2;
            
            .el-card {
                border: none;
                border-top: 1px solid #f2f2f2;
                cursor: pointer;
                -webkit-border-radius: 0;
                border-radius: 0;
                -webkit-transition: .2s;
                transition: .2s;
                
                &:hover, &.active {
                    padding-left: 10px;
                    background-color: #f8f8f8;
                    -webkit-transition: .2s;
                    transition: .2s;
                }
            }
            
            .el-card__body {
                padding: 15px;
                color: #666;
            }
        }
    }
    
    .el-container {
        > .el-container {
            margin-left: 300px;
        }
        
        .el-main {
            padding: 2px 0 60px 0;
            height: 100%;
            border-top: 1px solid #f2f2f2;
        }
        
        .el-footer {
            position: fixed;
            bottom: 0;
            right: 0;
            left: 300px;
            line-height: 60px;
        }
    }
    
    ::-webkit-scrollbar {
        width: 6px;
        height: 1px;
    }
    
    ::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #999999;
    }
    
    ::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #ededed;
    }
</style>
