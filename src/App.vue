<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { filePath } from '@/utils/config'

export default {
  created() {
    // 创建数据文件夹
    window.ipc.existsSync(filePath)
  },
  mounted() {
    postMessage({ payload: 'removeLoading' }, '*')
  },
}
</script>
