<template>
    <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="textarea">
    </el-input>
</template>

<script>
    export default {
        data() {
            return {
                textarea: ""
            }
        },
        methods: {}
    }
</script>

<style lang="less" scoped>
    .el-textarea{
        height: 100%;
        /deep/ textarea {
            padding: 15px;
            resize: none;
            border: none;
            height: 100%;
            background-color: #fefefe;
            line-height: 1.8;
        }
    }
</style>
