<template>
  <div v-html="html">
      
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


<style>

</style>