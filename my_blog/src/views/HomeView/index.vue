<template>
  <div class="homeView">
    <!-- top start -->
    <div class="homeView_top">
      <div
        class="homeView_top_info no_select"
        :class="{ selected: selected }"
        @click="like"
      >
        Like {{ count }}
      </div>
    </div>
    <!-- top end -->
    <!-- list start-->
    <div class="homeView_list" v-loading="loading" element-loading-text="Loading..." >
      <div
        class="homeView_list_item"
        v-for="article in articles"
        :key="article.id"
        @click="gotoDetail(article.id)"
      >
        <!-- edit start-->
        <!-- <div class="homeView_list_item_mask" v-if="online">
          <span class="edit_btn">编辑</span>
          <span class="del_btn">删除</span>
        </div> -->
        <!-- edit end-->
        <div class="homeView_list_item_top">
          <div class="homeView_list_item_top_title">
            {{ article.title }}
          </div>
          <div class="homeView_list_item_top_time no_select">
            {{ article.createDate }} 发表在
            <span class="type">{{ article.typeName }}</span>
          </div>
        </div>
        <div class="homeView_list_item_info ellipsis_two">
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
import { defineComponent, ref, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
export default defineComponent({
  setup() {
    const count = ref(0);
    const selected = ref(false);
    const articleList = ref([]);
    const total = ref(0);
    const nomore = ref(false);
    const pageNum = ref(1);
    const pageSize = ref(10);
    const store = useStore();
    //加载
    const loading = ref(true);
    //路由
    const router = useRouter();
    //全局方法
    const { proxy } = getCurrentInstance();
    const like = () => {
      selected.value = !selected.value;
      if (selected.value) {
        count.value++;
      } else {
        count.value--;
      }
    };

    const articles = computed(() => {
      let arr = [];
      if (articleList.value.length > 0) {
        arr = articleList.value.map((t) => {
          return {
            ...t,
            createDate: dayjs(t.createDate).format("YYYY-MM-DD HH:mm:ss"),
            updateDate: dayjs(t.updateDate).format("YYYY-MM-DD HH:mm:ss"),
          };
        });
      }
      return arr;
    });

    //获取列表
    const getList = () => {
      loading.value = true;
      let date = {
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

    //是否登录
    const online = computed(() => {
      return store.getters.token ? true : false;
    });

    getList();

    return {
      count,
      selected,
      like,
      online,
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
.homeView {
  // width: 100%;
  padding: 0 0.6rem;
  // height: 100%;
  display: flex;
  flex-direction: column;

  .homeView_top {
    height: 2.55rem;
    width: 100%;
    font-size: 0.21rem;
    font-weight: 600;
    color: #282828;
    // line-height: 0.29rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .homeView_top_info {
      cursor: pointer;
      display: flex;
      align-items: center;
      &::after {
        content: "";
        width: 00.29rem;
        height: 0.26rem;
        margin-left: 0.13rem;
        background: url("~@/assets/images/heart.png");
        background-size: 100% 100%;
      }
      &.selected {
        &::after {
          content: "";
          background: url("~@/assets/images/heart_active.png");
          background-size: 100% 100%;
        }
      }
    }
  }
  .homeView_list {
    min-height: 3.77rem;
    height: 1px;
    flex: 1;
    width: 100%;

    .homeView_list_item {
      height: 1.32rem;
      padding: 0.24rem 0.36rem;
      margin-bottom: 0.03rem;
      border-bottom: 1px solid #e2e2e2;
      box-sizing: border-box;
      position: relative;

      // &:last-of-type {
      //   border-bottom: 1px solid rgba(206, 206, 206, 0);
      // }
      &:hover {
        box-shadow: 6px 6px 14px 0px rgba(206, 206, 206, 0.5);
        border-bottom: none;
      }

      // 遮罩层
      // .homeView_list_item_mask {
      //   height: 100%;
      //   width: 100%;
      //   display: flex;
      //   align-items: center;
      //   justify-content: space-between;
      //   position: absolute;
      //   top: 0;
      //   left: 0;

      //   .edit_btn,
      //   .del_btn {
      //     width: 0;
      //     height: 100%;
      //     overflow: hidden;
      //     backdrop-filter:blur(2px);
      //   }

      //   .edit_btn {
      //     background: linear-gradient(
      //       90deg,
      //       rgba(0, 75, 200, 0.8),
      //       rgba(0, 75, 200, 0)
      //     );
      //   }
      //   .del_btn {
      //     background: linear-gradient(
      //       -90deg,
      //       rgba(255, 86, 86, 0.8),
      //       rgba(255, 86, 86, 0)
      //     );
      //   }
      //   &:hover {
      //     .edit_btn,
      //     .del_btn {
      //       width: 50%;
      //       transition: width 1.5s;
      //     }
      //   }
      // }

      .homeView_list_item_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.21rem;
        font-weight: 600;
        color: #282828;
        margin-bottom: 0.15rem;
        .homeView_list_item_top_time {
          font-size: 0.14rem;
          font-weight: 400;
          color: #282828;
          .type {
            font-weight: 600;
          }
        }
      }
      .homeView_list_item_info {
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
<style lang="scss">
// .homeView  /deep/ .el-pager li.active {
//     color: var(--el-pagination-hover-color);
//     cursor: default;
//   }

</style>