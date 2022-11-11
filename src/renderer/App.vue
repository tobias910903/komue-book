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

    html, body, .el-container, #app {
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

    .el-drawer {
        .btn-group {
            padding: 10px 10px 0;
            background-color: #ffffff;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .search {
                margin-top: 16px;
            }
        }

        .card-box {
            padding-top: 10px;
            .el-card {
                display: inline-block;
                margin: 0 0 16px 16px;
                cursor: pointer;
                -webkit-border-radius: 4px;
                border-radius: 4px;
                -webkit-transition: .2s;
                transition: .2s;
                overflow: hidden;

                &:hover, &.active {
                    background-color: #f8f8f8;
                    transform: scale(1.05);
                    -webkit-transition: .2s;
                    transition: .2s;
                }
            }

            .el-card__body {
                padding: 10px 16px;
                color: #101524;
                font-size: 14px;
            }
        }
    }

    .el-container {
        > .el-container {
            //margin-left: 0;
        }

        .el-main {
            padding: 2px 0 0 0;
            height: 100%;
            border-top: 1px solid #f2f2f2;
        }
    }

    .mouse-menu {
        position: fixed;
        /deep/ .el-card__body{
            padding: 10px 10px 0;
        }

        /deep/ .el-button{
            margin-bottom: 10px;
            padding: 8px 30px;
        }
    }

    .toggle-menu{
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 99999;
    }

    .water-mark{
        position: fixed;
        left: 10px;
        bottom: 10px;
        color: #aaaaaa;
        font-size: 14px;
        user-select: none;
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
