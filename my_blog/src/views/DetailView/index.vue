<template>
  <div class="box" ref="box">
    <div class="detailBox" >
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>{{ article?.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="html" v-if="article">
        <div class="heard">
          <div class="articeTitle">{{ article.title }}</div>
          <div class="articeTime">{{ articleTime }}</div>
        </div>
        <div v-html="article.content"></div>
      </div>
      <!-- 评论 -->
      <div class="comment">
        <!-- 后续跟新 -->
      </div>
    </div>
    <!-- 删除 -->
    <div class="del" @click="del" v-if="online">
      <el-icon :size="20">
        <delete />
      </el-icon>
    </div>
    <!-- 编辑 -->
    <div class="edit" @click="edit" v-if="online">
      <el-icon :size="20" color="#666">
        <edit />
      </el-icon>
    </div>
    <!-- 回到顶部 -->
    <el-backtop :bottom="100" target=".box">
      <el-icon color="#666"><caret-top /></el-icon>
    </el-backtop>
  </div>
</template>
<script>
import Prismjs from "@/assets/js/prism";
import "@/assets/css/prism.css";
import { ArrowRight, Edit, CaretTop, Delete } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
import dayjs from "dayjs";
import {
  defineComponent,
  ref,
  getCurrentInstance,
  computed,
  onMounted,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    Edit,
    CaretTop,
    Delete,
  },
  setup() {
    const article = ref(null);
    //路由
    const route = useRoute();
    const router = useRouter();
    const id = route.query.id;

    const store = useStore();
    //全局方法
    const { proxy } = getCurrentInstance();

    const articleTime = computed(() => {
      if (article.value.updateDate) {
        return (
          "更新于 " +
          dayjs(article.value.updateDate).format("YYYY-MM-DD hh:mm:ss")
        );
      } else if (article.value.createDate) {
        return (
          "发布于 " +
          dayjs(article.value.createDate).format("YYYY-MM-DD hh:mm:ss")
        );
      }
      return "";
    });

    // 详情
    const getInfo = () => {
      proxy.$http.getUrl("info/articleId", { id }).then((res) => {
        article.value = res.result;
        setTimeout(() => {
          Prismjs.highlightAll();
        },0);
        // console.log(article.value);
      });
    };

    //编辑
    const edit = () => {
      router.push({
        path: "/edit",
        query: {
          id,
        },
      });
    };
    // 删除
    const del = () => {
      ElMessageBox.confirm(
        "该操作将删除此文章，请确认是否继续该操作？",
        "Warning",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          proxy.$http.postUrl("info/delArticle", { id }).then((res) => {
            article.value = res.result;
            // console.log(article.value);
            proxy.$success("删除成功！");
            router.go(-1);
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "您已取消删除！",
            duration: 1000,
            customClass: "blog_message",
          });
        });
    };

    //是否登录
    const online = computed(() => {
      return store.getters.token ? true : false;
    });

    getInfo();

    onMounted(() => {
      setTimeout(() => {}, 1000);
    });

    return {
      article,
      ArrowRight,
      articleTime,
      edit,
      del,
      online,
    };
  },
});
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  overflow: auto;
  .edit,
  .del {
    right: 40px;
    bottom: 180px;
    position: fixed;
    background-color: #ffffff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #666;
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
  .del {
    bottom: 260px;
    &:hover {
      color: #fff;
      background-color: red;
    }
  }
}
.detailBox {
  width: 14.4rem;
  min-height: 7.25rem;
  padding: 0.6rem;
  box-sizing: border-box;
  margin: 0.8rem auto;
  background: #fff;
  box-shadow: 6px 6px 14px 0px rgba(206, 206, 206, 0.5);

  .html {
    font-size: 16px;
    line-height: 28px;
    word-wrap: break-word;

    .heard {
      margin: 0.8rem;
      .articeTitle {
        font-size: 30px;
        font-weight: 700;
        text-align: center;
      }
      .articeTime {
        text-align: right;
        font-size: 14px;
      }
    }
  }
}
</style>
<style lang="scss">
.detailBox {
  img {
    max-width: 100%;
  }
}
</style>
