<template>
  <div class="login_container">
    <div class="login_box" @keyup.enter="login">
      <!-- 头像区 -->
      <div class="avater_box">
        <!-- <img src="../assets/images/logo.jpg" alt="" /> -->
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFromRef"
        :model="loginForm"
        :rules="loginFromRules"
        label-width="80px"
        class="login_form"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-input
            v-model="loginForm.userName"
            :prefix-icon="Avatar"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            :prefix-icon="Lock"
            type="password"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { setItem } from "@/assets/js/utils";
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
} from "vue";
// import  { ElMessage } from 'element-plus'
import { Avatar, Lock } from "@element-plus/icons-vue";
import { useStore } from "vuex";

import router from "@/router";
export default defineComponent({
  setup() {
    const loginFromRef = ref(null);
    const loginForm = reactive({
      userName: "",
      passWord: "",
    });
    //全局方法
    const { proxy } = getCurrentInstance();
    // console.log('proxy',proxy);
    //vuex
    const store = useStore();

    // element-ui自带的方法，重置表单

    const resetLoginForm = () => {
      // 通过设置ref可以获取dom元素和组件
      loginFromRef.value.resetFields();
    };
    //登录
    const login = () => {
      // 表单预验证 valid是验证结果 布尔值
      loginFromRef.value.validate(async (valid) => {
        // 如果是false直接返回
        if (!valid) return;
        // 如果是true 就发起请求
        // 解构赋值 把结果中的data赋值给res
        let data = {
          ...loginForm,
        };
        // console.log(data);
        proxy.$http.postUrl("user/login", data).then((res) => {
          proxy.$success("登录成功");
          let info = res.result
          //这里使用的是sessionStorage（单个窗口共享，关闭窗口生命周期结束）不是localStorage（多页面共享，除非手动删除，不然一直存在）
          setItem("token", info.token);
          setItem("user", info);
          // setItem("userName", res.userName);
          store.commit('setToken', info.token)
          store.commit('setUserInfo', info)
          //编程式导航跳转
          router.push("/home");
        });
      });
    };

    const loginFromRules = reactive({
      //验证用户名是否合法
      userName: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
      ],
      // 验证密码
      passWord: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
      ],
    });
    onMounted(() => {
      console.log(loginFromRef.value);
    });
    return {
      loginFromRef,
      loginForm,
      resetLoginForm,
      loginFromRules,
      login,
      Lock,
      Avatar,
    };
  },
});
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avater_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px;
}

.van-swipe__indicator:not(:last-child) {
  position: relative;
  bottom: 10px;
}
.van-swipe__indicator {
  position: relative;
  bottom: 10px;
}
</style>
