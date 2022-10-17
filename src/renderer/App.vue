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

    .el-aside {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        border-top: 1px solid #f2f2f2;
        border-right: 1px solid #f2f2f2;

        .btn-group {
            position: fixed;
            z-index: 99;
            padding: 10px;
            background-color: #ffffff;
            width: 299px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            .search {
                margin-top: 10px;
            }

            &-bottom{
                bottom: 0;
            }
        }

        .card-box {
            padding: 105px 0 55px;
            /*border-bottom: 1px solid #f2f2f2;*/

            .el-card {
                border: none;
                border-top: 1px solid #f2f2f2;
                cursor: pointer;
                -webkit-border-radius: 0;
                border-radius: 0;
                -webkit-transition: .2s;
                transition: .2s;

                &:hover, &.active {
                    padding-left: 10px;
                    background-color: #f8f8f8;
                    -webkit-transition: .2s;
                    transition: .2s;
                }
            }

            .el-card__body {
                padding: 15px;
                color: #666;
            }
        }
    }

    .el-container {
        > .el-container {
            margin-left: 300px;
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
