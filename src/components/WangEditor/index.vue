<template>
    <div class="editor">
        <div ref="toolbar" class="toolbar"></div>
        <div ref="editor" class="text"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    import {emoticon} from './emoticon'

    export default {
        name: 'wangeditor',
        data() {
            return {
                editor: null,
                info_: null,
                isChange: false
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                default: ''
            },
            isClear: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            isClear(val) {
                // 触发清除文本域内容
                if (val) {
                    this.editor.txt.clear()
                    this.info_ = null
                }
            },
            value: function (value) {
                // if (value !== this.editor.txt.html()) {
                //     this.editor.txt.html(this.value)
                // }

                if (!this.isChange) {
                    this.editor.txt.html(this.value);
                }
                this.isChange = false;
            }
        },
        mounted() {
            this.seteditor();
            this.editor.txt.html(this.value);
        },
        methods: {
            seteditor() {
                this.editor = new E(this.$refs.toolbar, this.$refs.editor)
                this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
                this.editor.customConfig.uploadImgServer = ''// 配置服务器端地址
                this.editor.customConfig.uploadImgHeaders = {}// 自定义 header
                this.editor.customConfig.uploadFileName = '' // 后端接受上传文件的参数名
                this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
                this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
                this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

                // 配置菜单
                this.editor.customConfig.menus = [
                    'head', // 标题
                    'bold', // 粗体
                    'fontSize', // 字号
                    // 'fontName', // 字体
                    // 'italic', // 斜体
                    'underline', // 下划线
                    'strikeThrough', // 删除线
                    'foreColor', // 文字颜色
                    'backColor', // 背景颜色
                    // 'link', // 插入链接
                    'list', // 列表
                    'justify', // 对齐方式
                    'quote', // 引用
                    'emoticon', // 表情
                    'image', // 插入图片
                    'table', // 表格
                    // 'video', // 插入视频
                    'code', // 插入代码
                    'undo', // 撤销
                    'redo', // 重复
                    // 'fullscreen' // 全屏
                ]

                this.editor.customConfig.emotions = emoticon

                this.editor.customConfig.uploadImgHooks = {
                    fail: (xhr, editor, result) => {
                        // 插入图片失败回调
                    },
                    success: (xhr, editor, result) => {
                        // 图片上传成功回调
                    },
                    timeout: (xhr, editor) => {
                        // 网络超时的回调
                    },
                    error: (xhr, editor) => {
                        // 图片上传错误的回调
                    },
                    customInsert: (insertImg, result, editor) => {
                        // 图片上传成功，插入图片的回调

                    }
                }
                this.editor.customConfig.onchange = (html) => {
                    this.isChange = true;
                    this.info_ = html // 绑定当前逐渐地值
                    this.$emit('change', this.info_) // 将内容同步到父组件中
                }
                // 创建富文本编辑器
                this.editor.create()
            }
        }
    }
</script>

<style lang="less" scoped>
    .editor {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        position: relative;
        z-index: 0;

        .toolbar {
            /*border-bottom: 1px solid #eeeeee;*/
        }

        .text {
            border-top: 1px solid #eeeeee;
            height: calc(100% - 30px);
        }

        /deep/ .w-e-text {
            padding: 15px;
            background-color: #fefefe;
            color: #666666;

            p {
                margin: 0;
            }
        }

        /deep/ .w-e-emoticon-container{
            .w-e-item{
                img{
                    width: 22px;
                }
            }
        }
    }
</style>
