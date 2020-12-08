<template>
    <div class="weekly-list">
        周报
    </div>
</template>

<script>
    export default {
        name: 'weeklyList',
        data() {
            return {}
        },
        methods: {

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