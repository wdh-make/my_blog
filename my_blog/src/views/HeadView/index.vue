<template>
  <div class="headView">
    <div class="headView_top">.WDH</div>
    <div class="headView_menu no_select">
      <div
        class="headView_menu_item"
        :class="{ active:  menu.active }"
        @click="selectMenu(menu)"
        v-for="menu in menus"
        :key="menu.path"
      >
        {{ menu.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance } from "vue";
import { useStore } from "vuex"
import { getMenuList } from "@/hooks/index.js";
import router from "@/router"
export default defineComponent({
  setup() {
    //通过getCurrentInstance来获取全局方法，这个只能在setup里使用
    //const {ctx,proxy} = getCurrentInstance();//ctx开发环境可以用，线上环境不能用，所以直接用proxy
    const { proxy } = getCurrentInstance();
    console.log('proxy',proxy);

    const { menuList } = getMenuList();
    const store = useStore()

    const routefullPath = computed(()=>{
       return store.getters.routefullPath
    })
    const menus = computed(()=>{
      let path = routefullPath.value;
      let list = menuList.value.map((t) => {
        return {
          ...t,
          active: path == '/' + t.path,
        };
      });
      return list
    })
    const selectMenu = (menu) => {
      if (menu.path !== routefullPath.value) {
        if (menu.path) {
          router.push({ name: menu.path });
        }
      }
    };
    // console.log(menuList);
    return {
      selectMenu,
      menuList,
      menus,
    };
  },
});
</script>

<style lang="scss" scoped>
.headView {
  width: 100%;
  height: 100%;
  .headView_top {
    height: 2.55rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.36rem;
    font-weight: 600;
    color: #282828;
  }
  .headView_menu {
    height: 3.77rem;
    border-right: 1px solid #eeeeee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .headView_menu_item {
      cursor: pointer;
      width: 0.9rem;
      // font-size: 0.16rem;
      font-size: 16px;
      line-height: 0.22rem;
      font-weight: 600;
      color: #282828;
      padding: 0.06rem;
      border-bottom: 1px solid rgba(39, 39, 39, 0);
      display: flex;
      align-items: center;

      &.active {
        border-bottom: 1px solid #272727;

        &::after {
          content: "";
          width: 0.25rem;
          height: 0.11rem;
          margin-left: 0.06rem;
          background: url("~@/assets/images/arrow.png");
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>