<template>
<div>
   <router-view />
   <Canvas></Canvas>
</div>
 
</template>

<script>
import { defineComponent } from 'vue'
import Canvas from '@/assets/js/canvas-nest.min.js'

export default defineComponent({
  components: {
    Canvas,
  },
  setup() {
    
  },
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 0.16rem;
  // text-align: center;
  color: #2c3e50;
}
canvas {
    background: #f5f4f4;
    opacity: 0.3;
}

</style>
