<template>
    <div class="box-content">
        <el-container @click.native.left="mouseMenuShow = false">
            <el-aside>
                <div class="btn-group">
                    <el-button type="primary" size="small" @click="createFile">新增笔记</el-button>
                    <el-button type="text" size="small" @click="reset">文档</el-button>

                    <div class="search">
                        <el-input placeholder="搜索..." v-model="searchKey" clearable></el-input>
                    </div>
                </div>

                <div class="card-box">
                    <el-card shadow="hover" v-for="(i, index) in fileList" :key="index" @click.native="readFile(i, index)" :class="index == activeIndex && 'active'" v-show="i.indexOf(searchKey) != -1" :title="dataObj[i]">{{dataObj[i]}}</el-card>
                </div>
            </el-aside>

            <el-container>
                <el-main>
                    <wang-editor v-model="fileContent" :isClear="isEditorClear" @change="editorChange" v-if="!!fileName && !createCard" @keyup.native.ctrl.83="saveContent" @contextmenu.native.prevent="mouseMenu($event)"></wang-editor>
                    <about-info v-else></about-info>
                </el-main>
            </el-container>
        </el-container>

        <div class="mouse-menu" :style="mouseMenuStyle" v-show="mouseMenuShow">
            <el-card>
                <el-button type="primary" size="small" @click="saveContent">保存</el-button><br />
                <el-button type="danger" size="small" @click="removeFile(fileName)">删除</el-button>
            </el-card>
        </div>
    </div>
</template>

<script>
    import moment from "moment";
    import WangEditor from '@/components/wangEditor'
    import AboutInfo from '@/components/aboutInfo'

    const fs = require('fs');
    const compressing = require('compressing');

export default {
    name: 'indexBook',
    data() {
        return {
            targetDir: 'data/book', // 数据所在文件夹
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

                this.fileContent = data;
                this.fileName = fileName;
                this.activeIndex = index;

                this.$notify({
                    title: '提示',
                    message: "已切换至 " + fileName,
                    type: 'success',
                    duration: 1000
                });
            });
        },
        writeFile() { // 生成文件
            if (this.fileList.indexOf(this.fileName) !== -1) {
                this.$notify({
                    title: '提示',
                    message: "笔记已经存在",
                    type: 'warning',
                    duration: 1000
                });

                this.fileName = "";
                this.createCard = false;
                return;
            }

            let fileNameTemp = this.targetDir + "/" + this.fileName + ".txt";
            fs.writeFile(fileNameTemp, "", (err) => {
                if (err) {
                    this.$notify({
                        title: '提示',
                        message: '当前目录没有权限进行此操作，请检查系统权限',
                        type: 'fail',
                        duration: 1500
                    });

                    return console.log(err);
                }

                this.$notify({
                    title: '提示',
                    message: this.fileName + " 创建成功",
                    type: 'success',
                    duration: 1000
                });

                this.getDataList();
                this.reset();
                this.createCard = false;
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
                        this.$notify({
                            title: '提示',
                            message: '当前目录没有权限进行此操作，请检查系统权限',
                            type: 'fail',
                            duration: 1500
                        });

                        throw err;
                    }

                    this.$notify({
                        title: '提示',
                        message: fileName + ' 删除成功',
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
            fs.writeFile(fileNameTemp, this.fileContent, (err) => {
                if (err) {
                    this.$notify({
                        title: '提示',
                        message: '当前目录没有权限进行此操作，请检查系统权限',
                        type: 'fail',
                        duration: 1500
                    });

                    return console.log(err);
                }

                this.$notify({
                    title: '提示',
                    message: this.fileName + " 保存成功",
                    type: 'success',
                    duration: 1500
                });

                this.mouseMenuShow = false;
            });
        },
        createFile() {
            this.$prompt('请输入笔记名称', '新增笔记', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{1,15}$/,
                inputErrorMessage: '笔记名长度为1-15位'
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
        editorChange(val) {
            console.log(val);
        },
        mouseMenu(e) {
            this.mouseMenuShow = true;
            this.mouseMenuStyle = {
                top: e.pageY + "px",
                left: e.pageX + "px"
            }
        },
        createZip(){
            compressing.zip.compressDir(this.targetDir, 'data_bak/book'+ moment(new Date().getTime()).format('YYYYMMDD') +'.zip').then(()=>{
                console.log("compressDir success")
                localStorage.setItem('lastSaveDate', new Date().getTime())
            }).catch((err)=>{
                console.log("compressDir error", err)
            });
        },
        dataBak(){
            let lastSaveDate = localStorage.getItem("lastSaveDate") || 0;
            // 大于 5小时 则备份
            if(new Date().getTime() - lastSaveDate > 5 * 60 * 60 * 1000){
                this.createZip();
            }
        }
    },
    mounted() {
        // 创建数据文件夹
        if (!fs.existsSync(this.targetDir)) {
            fs.mkdirSync(this.targetDir);
        }

        // init
        this.getDataList();

        // 数据自动备份
        this.dataBak()
    }
}
</script>
