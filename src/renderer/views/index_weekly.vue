<template>
    <div class="box-content">
        <el-container @click.native.left="mouseMenuShow = false">
            <el-aside>
                <div class="btn-group">
                    <el-button type="success" size="small" @click="createFile">新增周报</el-button>
                    <el-button type="text" size="small" @click="reset">文档</el-button>

                    <div class="search">
                        <el-input placeholder="搜索..." v-model="searchKey" clearable></el-input>
                    </div>
                </div>

                <div class="card-box">
                    <el-card shadow="never" v-for="(i, index) in fileList" :key="index" @click.native="readFile(i, index)" :class="index == activeIndex && 'active'" v-show="i.indexOf(searchKey) != -1">{{dataObj[i]}}</el-card>
                </div>

                <div class="btn-group btn-group-bottom">
                    <el-button type="primary" size="small" @click="showFile">切换至【笔记】</el-button>
                </div>
            </el-aside>

            <el-container>
                <el-main>
                    <div class="weekly-wrapper" v-if="!!fileName && !createCard" @keyup.ctrl.83="saveContent" @contextmenu.prevent="mouseMenu($event)">
                        <el-row :gutter="10" class="weekly-item-box">
                            <el-col :span="8">
                                <el-input v-model="formWeekly.name" placeholder="姓名"></el-input>
                            </el-col>
                            <el-col :span="8">
                                <el-input v-model="formWeekly.department" placeholder="部门"></el-input>
                            </el-col>
                            <el-col :span="8">
                                <el-input v-model="formWeekly.job" placeholder="岗位"></el-input>
                            </el-col>
                            <el-col :span="8">
                                <el-input v-model="fileExportPath" placeholder="文件导出路径"></el-input>
                            </el-col>
                            <el-col :span="16">
                                <el-date-picker
                                        v-model="formWeekly.date"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-col>
                        </el-row>

                        <el-row :gutter="10" v-for="(item, index) in dList" :key="index" class="weekly-item-box">
                            <el-col :span="24">
                                <el-alert
                                        :title="'星期' + dateList[index]"
                                        :closable="false"
                                        type="success">
                                </el-alert>
                            </el-col>
                            <el-tag class="add-item" size="small" @click="addItem(item)">新增任务 <i class="el-icon-plus"></i></el-tag>

                            <div class="weekly-item-sub" v-for="(k, indexSub) in formWeekly[item]" :key="indexSub">
                                <el-col :span="24">
                                    <el-input
                                            placeholder="任务名称"
                                            v-model="k.task">
                                        <template slot="append">
                                            <span @click="delItem(item, indexSub)">删除</span>
                                        </template>
                                    </el-input>
                                </el-col>
                                <el-col :span="24">
                                    <el-input
                                            type="textarea"
                                            :rows="3"
                                            placeholder="工作内容"
                                            v-model="k.detail">
                                    </el-input>
                                </el-col>
                            </div>
                        </el-row>
                        <br />
                    </div>
                    <about-info v-else></about-info>
                </el-main>
            </el-container>
        </el-container>

        <div class="mouse-menu" :style="mouseMenuStyle" v-show="mouseMenuShow">
            <el-card>
                <el-button type="primary" size="small" @click="exportFile">导出</el-button><br />
                <el-button type="primary" size="small" @click="saveContent">保存</el-button><br />
                <el-button type="danger" size="small" @click="removeFile(fileName)">删除</el-button>
            </el-card>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import AboutInfo from '@/components/aboutInfo'

    const fs = require('fs');
    const ejsExcel = require("ejsExcel");

    export default {
        name: 'indexBook',
        data() {
            return {
                fileExportPath: 'D:\\', // 文件导出路径
                templatePath: 'static/template/zhoubao.xlsx', // 模板地址
                targetDir: 'data/weekly', // 数据所在文件夹
                createCard: false, // 添加周报弹窗
                searchKey: "", // 搜索框
                fileName: "", // 周报名
                fileList: [], // 文件列表
                fileSelect: "", // 当前选择的文件
                dataObj: {}, // 所有的数据
                activeIndex: -1, // 左侧菜单激活项
                mouseMenuShow: false, // 是否显示右键菜单
                mouseMenuStyle: { // 右击菜单定位
                    top: 0,
                    left: 0
                },

                formWeekly: {
                    date: [],
                    name: '',
                    department: "系统实验室",
                    job: "WEB前端开发",
                    d1: [{
                        task: '',
                        detail: ''
                    }],
                    d2: [{
                        task: '',
                        detail: ''
                    }],
                    d3: [{
                        task: '',
                        detail: ''
                    }],
                    d4: [{
                        task: '',
                        detail: ''
                    }],
                    d5: [{
                        task: '',
                        detail: ''
                    }],
                    d6: [],
                    d7: []
                },
                dList: ['d1','d2','d3','d4','d5','d6','d7'],
                dateList: ['一','二','三','四','五','六','日'],
            }
        },
        watch: {
            searchKey(n, o) {
                this.reset();
            },
            fileExportPath(n, o){
                if(!!n){
                    window.localStorage.setItem('fileExportPath', n);
                }
            }
        },
        components: {
            AboutInfo
        },
        methods: {
            showFile(){
                this.$router.push({name: 'index_book'});
            },
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

                    if(data.length == 0){
                        this.resetForm();
                    }else{
                        this.formWeekly = JSON.parse(data);
                    }

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
                        message: "周报已经存在",
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
                this.$confirm('确认删除该周报', '提示', {
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
                    Vue.set(this.dataObj, fileObj, fileObj);
                    this.fileList.push(fileObj);
                });
            },
            saveContent() { // 保存内容
                if (!this.fileName) {
                    return;
                }

                let fileNameTemp = this.targetDir + "/" + this.fileName + ".txt";
                fs.writeFile(fileNameTemp, JSON.stringify(this.formWeekly), (err) => {
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
                this.$prompt('请输入周报名称', '新增周报', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.{1,15}$/,
                    inputErrorMessage: '周报名长度为1-15位'
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
                this.resetForm();
                this.mouseMenuShow = false;
            },
            resetForm(){
                this.formWeekly = {
                    date: [],
                    name: '',
                    department: "系统实验室",
                    job: "WEB前端开发",
                    d1: [{
                        task: '',
                        detail: ''
                    }],
                    d2: [{
                        task: '',
                        detail: ''
                    }],
                    d3: [{
                        task: '',
                        detail: ''
                    }],
                    d4: [{
                        task: '',
                        detail: ''
                    }],
                    d5: [{
                        task: '',
                        detail: ''
                    }],
                    d6: [],
                    d7: []
                };
            },
            mouseMenu(e) {
                this.mouseMenuShow = true;
                this.mouseMenuStyle = {
                    top: e.pageY + "px",
                    left: e.pageX + "px"
                }
            },
            exportFile() {
                let _this = this;
                let stimeAll = _this.formWeekly.date[0] || "";
                let etimeAll = _this.formWeekly.date[1] || "";
                stimeAll = stimeAll.split('-');
                etimeAll = etimeAll.split('-');
                let stime = stimeAll[1] + stimeAll[2];
                let etime = etimeAll[1] + etimeAll[2];
                let excelname="周报("+ stime +"-"+ etime +")-"+ _this.formWeekly.name +".xlsx"; // 表名

                // 获得Excel模板的buffer对象
                let exlBuf = fs.readFileSync(_this.templatePath);

                // 数据
                let data = [];

                // 基础信息
                let dateStart = stimeAll[0] + "年" + stimeAll[1] + "月" + stimeAll[2] + "日";
                let dateEnd = etimeAll[0] + "年" + etimeAll[1] + "月" + etimeAll[2] + "日";
                let name = this.formWeekly.name || '';
                let department = this.formWeekly.department || '';
                let job = this.formWeekly.job || '';
                let title = `${dateStart} -- ${dateEnd}员工周报`;
                let subTitle = `姓名：${name}     部门：${department}     岗位：${job}`;
                
                // 工作内容
                let dataArr = [];
                for(let i=0; i<_this.dList.length; i++){
                    dataArr = dataArr.concat(_this.formWeekly[_this.dList[i]]);
                }
                let dataArrGrouped = _this.groupBy(dataArr, 'task');
                let dataArrRes = [], detailStr;
                for(let i=0; i<dataArrGrouped.length; i++){
                    detailStr = "";
                    for(let j=0; j<dataArrGrouped[i].length; j++){
                        detailStr += ((j+1) + '、' + dataArrGrouped[i][j].detail + '\n');
                    }
                    dataArrRes.push({
                        'task': dataArrGrouped[i][0].task,
                        'detail': detailStr
                    })
                }
                
                // 组装数据
                data.push({
                    'title': title,
                    'subTitle': subTitle,
                    'rowLength': dataArrGrouped.length
                });
                data.push(dataArrRes);
                
                console.log(data);
                
                //渲染Excel表格
                ejsExcel.renderExcel(exlBuf, data).then(function(exlBuf2){
                    fs.writeFile(_this.fileExportPath + excelname, exlBuf2, (err) => {
                        if (err) {
                            _this.$notify({
                                title: '提示',
                                message: '当前目录没有权限进行此操作，请检查系统权限',
                                type: 'fail',
                                duration: 1500
                            });

                            return console.log(err);
                        }

                        _this.$notify({
                            title: '提示',
                            message: "导出成功",
                            type: 'success',
                            duration: 1000
                        });

                        _this.mouseMenuShow = false;
                    });
                }).catch(function(err) {
                    console.error(err);
                });
            },
            addItem(item){ // 添加内容
                this.formWeekly[item].push({
                    task: '',
                    detail: ''
                });
                this.$notify({
                    title: '提示',
                    message: "新增成功",
                    type: 'success',
                    duration: 1500
                });
            },
            delItem(item, index){ // 删除内容
                this.$confirm('确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.formWeekly[item].splice(index, 1);
                    this.$notify({
                        title: '提示',
                        message: "删除成功",
                        type: 'success',
                        duration: 1500
                    });
                }).catch(() => {

                });
            },
            groupBy(array, keys){
                const newArray = [];
                array.map(item=>{
                    return [item]
                }).forEach(([{...item}])=>{
                    const flag = newArray.find(([{...o}])=>o[keys] === item[keys]);
                    if(!flag) {
                        newArray.push([{...item}])
                    } else {
                        newArray.forEach(([{...y}], index)=>{
                            if(y[keys] === item[keys]) {
                                newArray[index].push(item)
                            }
                        })
                    }
                });
                
                return newArray;
            }
        },
        mounted() {
            // 创建数据文件夹
            if (!fs.existsSync(this.targetDir)) {
                fs.mkdirSync(this.targetDir);
            }

            // init
            this.getDataList();

            // 设置文件导出路径
            let fileExportPath = window.localStorage.getItem('fileExportPath');
            if(!!fileExportPath){
                this.fileExportPath = fileExportPath;
            }
        }
    }
</script>

<style lang="less">
    .weekly-wrapper {
        padding: 15px;
        background-color: #fefefe;
        line-height: 1.8;
        color: #999999;
        font-size: 14px;
        height: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;


        /*p {
            margin: 0;
            color: #999999;
            font-size: 14px;
        }*/

        .weekly-item-box{
            position: relative;
            & + .weekly-item-box{
                padding-top: 20px;
            }
            .el-col{
                margin-bottom: 10px;
            }
            .add-item{
                position: absolute;
                right: 15px;
                top: 30px;
                cursor: pointer;
            }

            .el-input-group__append{
                cursor: pointer;
                &:hover{
                    color: #ff0000;
                }
            }

            .weekly-item-sub{
                position: relative;
                clear: both;
                overflow: hidden;
                & + .weekly-item-sub{
                    padding-top: 10px;
                    border-top: 1px dashed #cccccc;
                }
            }
        }
    }
</style>