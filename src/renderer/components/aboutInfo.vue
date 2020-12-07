<template>
    <div class="about-info">
        <el-alert title="使用说明" type="info" :closable="false"></el-alert>
        <p>快速保存：Ctrl+S</p>
        <p>查看菜单：富文本区域鼠标右键</p>
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
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        /deep/ .el-alert{
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        p {
            margin: 0;
            color: #999999;
            font-size: 14px;
        }
    }
</style>