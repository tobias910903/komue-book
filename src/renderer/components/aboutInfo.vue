<template>
    <div class="about-info">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>使用说明</span>
            </div>
            <p>保存：Ctrl+S</p>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>更新日志</span>
            </div>

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
        </el-card>
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

        .box-card {
            & + .box-card {
                margin-top: 20px;
            }

            /deep/ .el-card__header {
                font-size: 18px;
            }

            h4 {
                margin: 0 0 10px;
                font-size: 16px;
                font-weight: 500;
            }

            ol {
                padding-left: 15px;
                margin: 0;
                color: #999999;
            }

            p {
                margin: 0;
                color: #999999;
            }
        }
    }
</style>