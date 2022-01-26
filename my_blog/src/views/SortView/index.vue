<template>
  <div class="sortView">
    <!-- top start -->
    <div class="sortView_top">
      <div
        class="sortView_top_box no_select"
        :class="{ selected: selected == type.id }"
        v-for="type in typeList"
        :key="type.id"
        @click="selectType(type)"
      >
        {{ type.name }}
      </div>
    </div>
    <!-- top end -->
    <!-- list start-->
    <div class="sortView_list">
      <div class="sortView_list_item" v-for="i in 5" :key="i">
        <div class="sortView_list_item_top">
          <div class="sortView_list_item_top_title">
            UIN-APP IOS打包上架指南
          </div>
          <div class="sortView_list_item_top_time no_select">
            2020-11-17 发表在 <span class="type">技术类</span>
          </div>
        </div>
        <div class="sortView_list_item_info ellipsis_two">
          0x001 前言 号称跨平台终极解决方案的UNI
          APP教程它来了；uni-app在开发者数量、案例、跨端抹平度、扩展灵活性、性能体验、周边生态、学习成本、开
          发成本等
        </div>
      </div>
    </div>
    <!-- list end -->
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
export default defineComponent({
  setup() {
    const typeList = reactive([
      {
        id: 0,
        name: "全部",
      },
      {
        id: 1,
        name: "前端",
      },
      {
        id: 2,
        name: "后端",
      },
    ]);
    const selected = ref(0);

    const selectType = (type) => {
      selected.value = type.id;
    };

    return {
      typeList,
      selected,
      selectType,
    };
  },
});
</script>

<style lang="scss" scoped>
.sortView {
  // width: 100%;
  padding: 0 0.6rem;
  // height: 100%;
  display: flex;
  flex-direction: column;

  .sortView_top {
    height: 2.55rem;
    width: 100%;
    font-size: 0.21rem;
    font-weight: 600;
    color: #282828;
    // line-height: 0.29rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .sortView_top_box {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 1.1rem;
      height: 0.37rem;
      background: #ffffff;
      box-sizing: border-box;
      padding: 0 0.1rem;
      border: 1px solid #282828;
      font-size: 0.18rem;
      font-weight: 600;
      color: #282828;
      margin-right: 0.4rem;
      &.selected {
        background: #282828;
        color: #fff;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .sortView_list {
    height: 1px;
    flex: 1;
    width: 100%;

    .sortView_list_item {
      height: 1.32rem;
      padding: 0.24rem 0.36rem;
      margin-bottom: 0.03rem;
      border-bottom: 1px solid #e2e2e2;
      box-sizing: border-box;

      &:hover {
        box-shadow: 6px 6px 14px 0px rgba(206, 206, 206, 0.5);
        border-bottom: none;
      }

      .sortView_list_item_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.21rem;
        font-weight: 600;
        color: #282828;
        margin-bottom: 0.15rem;
        .sortView_list_item_top_time {
          font-size: 0.14rem;
          font-weight: 400;
          color: #282828;
          .type {
            font-weight: 600;
          }
        }
      }
      .sortView_list_item_info {
        font-size: 0.14rem;
        font-weight: 400;
        color: #666666;
      }
    }
  }
}
</style>