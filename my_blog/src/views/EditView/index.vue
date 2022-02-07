<template>
  <div class="box">
    <div class="editBox" v-if="show">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>编辑文章</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="fromBox">
        <el-form
          ref="ruleFormRef"
          :model="form"
          :rules="rules"
          :inline="true"
          label-width="90px"
        >
          <el-form-item label="文章标题:" prop="title" style="width: 100%">
            <el-input v-model="form.title" placeholder="请输入标题" clearable />
          </el-form-item>
          <el-form-item label="摘要:" prop="subtitle" style="width: 100%">
            <el-input
              v-model="form.subtitle"
              :rows="2"
              type="textarea"
              placeholder="请输入摘要"
            />
          </el-form-item>
          <el-form-item label="分类:" prop="type" style="width: 45%">
            <el-select v-model="form.type" placeholder="请选择类型">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status" style="width: 45%">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="公开" :value="1"> </el-option>
              <el-option label="仅自己可见" :value="0"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章内容:" prop="content" style="width: 100%">
            <Tinymce v-model="form.content" v-if="show"></Tinymce>
          </el-form-item>
          <div class="bottom_btn">
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </el-form>
        <!-- <div class="fromBox_item">
        <span class="fromBox_item_labe">文章标题：</span>
        <el-input v-model="form.title" placeholder="请输入标题" clearable />
      </div>
      <div class="fromBox_item">
        <span class="fromBox_item_labe"> 摘要： </span>
        <el-input
          v-model="form.subtitle"
          :rows="2"
          type="textarea"
          placeholder="请输入文章摘要"
          clearable
        />
      </div>
      <div class="fromBox_item">
        <span class="fromBox_item_labe"> 分类： </span>
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="fromBox_item">
        <span class="fromBox_item_labe"> 状态： </span>
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="公开" :value="1"> </el-option>
          <el-option label="仅自己可见" :value="0"> </el-option>
        </el-select>
      </div> -->
      </div>
      <!-- <Tinymce v-model="form.content" v-if="show"></Tinymce> -->
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  getCurrentInstance,
} from "vue";
import Tinymce from "@/components/tinymce/index";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
export default defineComponent({
  components: { Tinymce },
  setup() {
    const show = ref(false);
    //表单
    const form = ref({});
    const ruleFormRef = ref(null);
    // 表单验证
    const rules = reactive({
      title: [
        { required: true, message: "请输入文章标题", trigger: "blur" },
        { max: 100, message: "最多只能输入100个字符", trigger: "blur" },
      ],
      subtitle: [
        { required: true, message: "请输入摘要", trigger: "blur" },
        { max: 200, message: "最多只能输入200个字符", trigger: "blur" },
      ],
      type: [{ required: true, message: "请选择类型", trigger: "blur" }],
      status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
    });
    //类型
    const typeList = ref([]);

    //路由
    const route = useRoute();
    const router = useRouter();
    const id = route.query.id;
    //全局方法
    const { proxy } = getCurrentInstance();

    const save = () => {
      // 表单预验证 valid是验证结果 布尔值
      ruleFormRef.value.validate(async (valid) => {
        // 如果是false直接返回
        if (!valid) return;
        proxy.$http.postUrl("info/saveArticle", form.value).then((res) => {
          proxy.$success(res.msg);
          router.go(-1);
        });
        // console.log(form.value);
      });
    };

    //获取类型
    const getType = () => {
      proxy.$http.getUrl("info/articleType").then((res) => {
        typeList.value = res.result;
      });
    };
    //获取信息
    const getInfo = () => {
      if (id) {
        proxy.$http.getUrl("info/articleId", { id }).then((res) => {
          form.value = res.result;
          show.value = true;
        });
      } else {
        show.value = true;
      }
    };

    getInfo();
    getType();

    return {
      ruleFormRef,
      rules,
      form,
      typeList,
      save,
      show,
      ArrowRight,
    };
  },
});
</script>


<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  overflow: auto;
}
.editBox {
  width: 14.4rem;
  // height: 100vh;
  box-sizing: border-box;
  padding: 0.4rem;
  margin: 0.8rem auto;
  background: #fff;
  box-shadow: 6px 6px 14px 0px rgba(206, 206, 206, 0.5);

  .fromBox {
    margin-top: 0.4rem;
    .bottom_btn {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>