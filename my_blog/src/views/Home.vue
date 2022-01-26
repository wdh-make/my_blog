<template>
  <div class="home">
    <div class="home_content">
      <div class="home_content_box">
        <div class="home_nav">
          <HeadView />
        </div>
        <div class="home_info">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <!-- 添加 -->
    <div class="add" @click="add" v-if="online">
      <el-icon color="#666"><plus /></el-icon>
    </div>
    <!-- 回到顶部 -->
    <el-backtop :bottom="100" target=".home">
        <el-icon color="#666"><caret-top /></el-icon>
    </el-backtop>
  </div>
</template>

<script>
// @ is an alias to /src
import { defineComponent, computed } from "vue";
import { Plus, CaretTop } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import HeadView from "./HeadView";
import { useStore } from "vuex";
export default defineComponent({
  name: "Home",
  components: {
    HeadView,
    Plus,
    CaretTop
  },
  setup() {
    //路由
    const router = useRouter()
    const store = useStore();

    //添加
    const add = () => {
      router.push({
          path:'/edit',
      })
    };
    //是否登录
    const online = computed(() => {
      return store.getters.token ? true : false;
    });
    return {
      add,
      online
    }
  },
});
</script>
<style lang="scss" scoped>
.home {
  position: relative;
  // width: 100%;
  height: 100vh;
  // background: #f5f4f4;
  // display: flex;
  overflow: auto;
  .add {
    right: 40px;
    bottom: 180px;
    position: fixed;
    background-color: #ffffff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    z-index: 5;
    &:hover {
      background-color: #f2f6fc;
    }
  }
  .home_content {
    position: absolute;
    left: 50%;
    top: 0.8rem;
    transform: translateX(-50%);
    width: 14.4rem;
    // height: calc(100% - 1.6rem);
    display: flex;
    
    .home_content_box {
      width: 100%;
      display: flex;
      background: #fff;
      margin-bottom: 0.8rem;
      box-shadow: 6px 6px 14px 0px rgba(206, 206, 206, 0.5);
      // 左边菜单
      .home_nav {
        width: 2.79rem;
        height: 7.25rem;
      }
      //右边内容
      .home_info {
        flex: 1;
        width: 1px;
      }
    }
  }
}
</style>
