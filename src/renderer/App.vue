<template>
    <div id="app">
        <el-container>
            <el-aside>
                <el-button type="success" size="small" icon="el-icon-edit" @click="createCard = true">添加</el-button>
                <el-button type="primary" size="small" icon="el-icon-upload2">导入</el-button>
                <el-button type="primary" size="small" icon="el-icon-download">导出</el-button>
                
                <el-card shadow="hover">
                    <el-input
                            placeholder="笔记名称"
                            v-model="input1"
                            maxlength="15"
                            show-word-limit>
                    </el-input>
                </el-card>
                <el-card shadow="hover">
                    <el-input
                            placeholder="笔记名称"
                            v-model="input2"
                            maxlength="15"
                            show-word-limit>
                    </el-input>
                </el-card>
            </el-aside>
            
            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
                <el-footer>笔记1123 自动保存成功：xxxxxx</el-footer>
            </el-container>
        </el-container>
        
        <el-dialog
            title="添加笔记"
            :visible.sync="createCard"
            width="400px">
            <el-input
                placeholder="笔记名称"
                v-model="input3"
                maxlength="15"
                show-word-limit
                clearable>
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createCard = false">取 消</el-button>
                <el-button type="primary" @click="createCard = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const fs = require('fs');
    let aa = fs.readFileSync('/git/komue-note/readme.md','utf-8');
    console.log("Nodejs获取本地文件...");
    console.log(aa);
    
    export default {
        name: 'komue-note',
        data() {
            return {
                input1: '',
                input2: '',
                input3: '',
                createCard: false
            }
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
        padding: 10px;
        border-right: 1px solid #f2f2f2;
        
        .el-card {
            margin-top: 10px;
        }
        
        .el-card__body {
            padding: 0;
            
            .el-input__inner {
                border: none;
            }
        }
    }
    
    .el-container {
        > .el-container {
            margin-left: 300px;
        }
        
        .el-main {
            padding: 0 0 40px 0;
            height: 100%;
        }
        
        .el-footer {
            position: fixed;
            bottom: 0;
            right: 0;
            left: 300px;
            color: #aaaaaa;
            height: 40px !important;
            line-height: 40px;
            font-size: 12px;
        }
    }
</style>
