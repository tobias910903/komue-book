<template>
    <div class="about-info">
        <el-alert title="使用说明" type="info" :closable="false"></el-alert>
        <p>保存：Ctrl+S</p>
        <br/>
        <el-alert title="更新日志" type="info" :closable="false"></el-alert>
        <el-timeline>
            <el-timeline-item timestamp="2020/03/16" placement="top">
                <el-card>
                    <h4>v1.0.1</h4>
                    <ol>
                        <li>完成打包</li>
                    </ol>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2020/03/07" placement="top">
                <el-card>
                    <p>搭环境 建项目</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>
    export default {
        name: 'aboutInfo'
    }
</script>

<style lang="less" scoped>
    .about-info {
        padding: 15px;
        background-color: #fefefe;
        line-height: 1.8;
        color: #999999;
        font-size: 14px;
        height: 100%;
        background: url("../assets/images/icon.png") center;

        /deep/ .box-card {
            & + .box-card {
                margin-top: 20px;
            }

            .el-card__header {
                font-size: 18px;
            }
        }


        /deep/ .el-alert{
            margin-bottom: 15px;
        }

        h4 {
            margin: 0 0 5px;
            font-size: 16px;
            font-weight: 500;
        }

        ol {
            padding-left: 15px;
            margin: 0;
            color: #999999;
            font-size: 14px;
        }

        p {
            margin: 0;
            color: #999999;
            font-size: 14px;
        }
    }
</style>