<template>
  <div class="blogView">
      <!-- no data strat -->
      <el-empty  description="该博主很懒，没有更新内容！！！"></el-empty>
      <!-- no data end -->
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const html = ref("<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p><img src=\"http://localhost:3001/static/upload/2022/01/19/1_16323028386911642583694858.jpg\" /></p>\n</body>\n</html>")
    return {
      html
    }
  },
})
</script>


<style lang="scss">
.blogView {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>