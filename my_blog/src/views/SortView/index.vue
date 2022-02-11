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
        {{ type.label }}
      </div>
    </div>
    <!-- top end -->
    <!-- list start-->
    <div
      class="sortView_list"
      v-loading="loading"
      element-loading-text="Loading..."
    >
      <!-- no data strat -->
      <el-empty v-if="!loading && articles.length <= 0" description="该博主很懒，没有更新内容！！！"></el-empty>
      <!-- no data end -->

      <div
        class="sortView_list_item"
        v-for="article in articles"
        :key="article.id"
        @click="gotoDetail(article.id)"
      >
        <div class="sortView_list_item_top">
          <div class="sortView_list_item_top_title">
            {{ article.title }}
          </div>
          <div class="sortView_list_item_top_time no_select">
            {{ article.time }}
            <span class="type">{{ article.typeName }}</span>
          </div>
        </div>
        <div class="sortView_list_item_info ellipsis_two">
          {{ article.subtitle }}
        </div>
      </div>
    </div>
    <!-- list end -->
    <!-- pagination start -->
    <div class="pagination">
      <el-pagination
        hide-on-single-page
        :page-size="10"
        :pager-count="11"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- pagination end -->
  </div>
</template>

<script>
import { defineComponent, ref, getCurrentInstance, computed } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
export default defineComponent({
  setup() {
    const articleList = ref([]);
    const total = ref(0);
    const nomore = ref(false);
    const pageNum = ref(1);
    const pageSize = ref(10);
    //路由
    const router = useRouter();
    //全局方法
    const { proxy } = getCurrentInstance();
    const typeList = ref([]);
    const selected = ref(0);

    //选择类型
    const selectType = (type) => {
      selected.value = type.id;
      pageNum.value = 1;
      pageSize.value = 10;
      if (type.id) {
        getList(type.id);
      } else {
        getList();
      }
    };
    //加载
    const loading = ref(true);

    const articles = computed(() => {
      let arr = [];
      if (articleList.value.length > 0) {
        arr = articleList.value.map((t) => {
          if (t.updateDate) {
            return {
              ...t,
              time:
                dayjs(t.updateDate).format("YYYY-MM-DD HH:mm:ss") + " 更新在",
            };
          } else {
            return {
              ...t,
              time:
                dayjs(t.createDate).format("YYYY-MM-DD HH:mm:ss") + " 发表在",
            };
          }
        });
      }
      return arr;
    });

    //获取类型
    const getType = () => {
      proxy.$http.getUrl("info/articleType").then((res) => {
        typeList.value = [
          {
            id: 0,
            label: "全部",
          },
          ...res.result,
        ];
      });
    };

    //获取列表
    const getList = (type) => {
      loading.value = true;
      let date = {
        type,
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      };
      proxy.$http.getUrl("info/articleAll", date).then((res) => {
        if (res.pageNum == pageNum.value) {
          articleList.value = res.result;
          total.value = res.total;
          nomore.value = res.result.length >= res.total;

          loading.value = false;
        }
      });
    };
    //下一页
    const handleCurrentChange = (val) => {
      if (!nomore.value) {
        pageNum.value = val;
        getList();
      }
    };
    //查看
    const gotoDetail = (id) => {
      router.push({
        path: "/detail",
        query: {
          id: id,
        },
      });
    };

    getList();
    getType();

    return {
      typeList,
      selected,
      selectType,
      gotoDetail,
      total,
      articles,
      handleCurrentChange,
      loading,
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
    min-height: 3.77rem;
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

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.2rem;
  }
}
</style>