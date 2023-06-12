<template>
    <div class="about-info">
        <p>知识不用刻意学，要用的时候自然就会了</p>
    </div>
</template>

<script>
    export default {
        name: 'AboutInfo'
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

        p {
            margin: 0;
            color: #999999;
            font-size: 14px;
        }
    }
</style>
