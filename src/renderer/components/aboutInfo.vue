<template>
    <div class="about-info">
        <h2>Komue-book 使用说明</h2>
        <p>保存：Ctrl+S</p>
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

        h2 {
            margin: 0 0 10px;
        }

        p {
            margin: 0;
        }
    }
</style>