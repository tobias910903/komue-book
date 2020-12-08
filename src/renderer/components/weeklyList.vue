<template>
    <div class="weekly-list">
        <el-button type="primary" size="small" @click='exportFile'>导出周报</el-button>

        <table id="table1">
            <tbody>
                <tr>
                    <td>文字</td>
                    <td>咨询</td>
                    <td>测试</td>
                </tr>
                <tr>
                    <td>文字</td>
                    <td>咨询</td>
                    <td>测试</td>
                </tr>
                <tr>
                    <td>文字</td>
                    <td>咨询</td>
                    <td>测试</td>
                </tr>
                <tr>
                    <td>文字</td>
                    <td>咨询</td>
                    <td>测试</td>
                </tr>
                <tr>
                    <td>文字</td>
                    <td>咨询</td>
                    <td>测试</td>
                </tr>
                <tr>
                    <td>文字</td>
                    <td>咨询</td>
                    <td>测试</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'weeklyList',
        data() {
            return {}
        },
        methods: {
            exportFile(){
                tableExport('table1', 'test', 'xls');
            }
        },
        mounted() {

        }
    }
</script>

<style lang="less" scoped>
    .weekly-list {
        padding: 15px;
        background-color: #fefefe;
        line-height: 1.8;
        color: #999999;
        font-size: 14px;
        height: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;


        table{
            border: 1px solid #ff0000;
            td{
                padding: 10px;
                border: 1px solid #ff0000;
            }
        }
        /*p {
            margin: 0;
            color: #999999;
            font-size: 14px;
        }*/
    }
</style>