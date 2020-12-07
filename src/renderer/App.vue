<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'komue-book'
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

    .box-content{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
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
