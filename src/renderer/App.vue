<template>
    <div id="app">
        <el-container>
            <el-aside>
                <div class="btn-group">
                    <el-button type="success" size="small" icon="el-icon-edit" @click="createBook">添加</el-button>
                    <!--
                    <el-button type="primary" size="small" icon="el-icon-upload2">导入</el-button>
                    <el-button type="primary" size="small" icon="el-icon-download">导出</el-button>
                    -->
                </div>
                
                <div class="card-box">
                    <el-card shadow="hover" v-for="(i, index) in bookList" :key="index" @click.native="readFileSync(i)">
                        {{dataObj[i]}}
                    </el-card>
                </div>
            </el-aside>
            
            <el-container>
                <el-main>
                    <wang-editor v-model="bookContent" :isClear="isEditorClear" @change="editorChange" v-if="!!bookName && !createCard" @keyup.native.ctrl.83="saveContent"></wang-editor>
                    <el-input readonly type="textarea" placeholder="保存：Ctrl+S" v-else></el-input>
                </el-main>
                <el-footer v-if="!!bookName && !createCard">
                    <el-button type="primary" size="small" @click="saveContent">保存</el-button>
                    <el-button type="danger" size="small" @click="removeFile(bookName)">删除</el-button>
                </el-footer>
            </el-container>
        </el-container>
        
        <!-- 新增笔记 -->
        <el-dialog
                title="添加笔记"
                :visible.sync="createCard"
                @close="createCardClose"
                width="400px">
            <el-input
                    ref="bookName"
                    placeholder="笔记名称"
                    v-model="bookName"
                    autofocus
                    maxlength="15"
                    @keyup.native.enter="writeFile"
                    show-word-limit
                    clearable>
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createCard = false">取 消</el-button>
                <el-button type="primary" @click="writeFile">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import WangEditor from '@/components/wangEditor'

    const fs = require('fs');

    export default {
        name: 'komue-book',
        data() {
            return {
                targetDir: 'data', // 数据所在文件夹
                createCard: false, // 添加笔记弹窗
                bookName: "", // 笔记名
                bookList: [], // 文件列表
                bookContent: "", // 文件内容
                fileSelect: "", // 当前选择的文件
                dataObj: {}, // 所有的数据
                isEditorClear: false,
            }
        },
        components: {
            WangEditor
        },
        methods: {
            readFileSync(fileName) { // 获取文件内容
                let fileNameTemp = this.targetDir + "/" + fileName + ".txt";
                this.bookContent = fs.readFileSync(fileNameTemp, 'utf-8');
                this.bookName = fileName;
            },
            writeFile() { // 生成文件
                if (this.bookList.indexOf(this.bookName) !== -1) {
                    this.$notify({
                        title: '提示',
                        message: "文件已经存在",
                        type: 'warning'
                    });
                    return;
                }

                let fileNameTemp = this.targetDir + "/" + this.bookName + ".txt";
                fs.writeFile(fileNameTemp, "", (err) => {
                    if (err) {
                        return console.log(err);
                    }

                    this.readFileSync(this.bookName);
                    this.getDataList();
                    this.createCard = false;

                    this.$notify({
                        title: '提示',
                        message: this.bookName + " 创建成功",
                        type: 'success'
                    });
                });
            },
            removeFile(fileName) { // 删除文件
                let tempPath = this.targetDir + "/" + fileName + ".txt";
                fs.unlink(tempPath, (err) => {
                    if (err) {
                        throw err;
                    }

                    this.$notify({
                        title: '提示',
                        message: fileName + '删除成功！',
                        type: 'success'
                    });

                    this.getDataList();
                    this.bookName = "";
                    this.bookContent = "";
                })
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
                        type: 'success'
                    });
                });
            },
            createBook() {
                setTimeout(()=>{
                    this.$refs.bookName.focus();
                }, 300);
                
                this.bookName = "";
                this.createCard = true;
                this.bookContent = "";
            },
            createCardClose(){
                this.bookName = "";
                this.bookContent = "";
            },
            editorChange(val) {
                console.log(val)
            },
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
        }
        
        .card-box {
            padding: 52px 10px 10px;
            
            .el-card {
                margin-bottom: 10px;
                cursor: pointer;
            }
            
            .el-card__body {
                padding: 12px;
                color: #666;
            }
        }
    }
    
    .el-container {
        > .el-container {
            margin-left: 300px;
        }
        
        .el-main {
            padding: 0 0 60px 0;
            height: 100%;
        }
        
        .el-footer {
            position: fixed;
            bottom: 0;
            right: 0;
            left: 300px;
            line-height: 60px;
        }
        
        .el-textarea {
            height: 100%;
            
            /deep/ textarea {
                padding: 15px;
                resize: none;
                border: none;
                height: 100%;
                background-color: #fefefe;
                line-height: 1.8;
            }
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
