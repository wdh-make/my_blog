import { setItem } from "@/assets/js/utils";
import axios from "@/assets/js/axios";

const state = {
  token: "",
  userInfo: {},
};
const getters = {
  token: (state) => state.token,
  userInfo: (state) => state.userInfo,
};
const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
};
const actions = {
  logout(context) {
    setItem("token", null);
    setItem("user", null);
    context.commit("setUserInfo", null);
    context.commit("setToken", null);
    // router.push('/login')
    window.location.href = window.location.href.split("/")[0] + "/login";
  },
  //验证是否有token
  checkToken(context) {
    return new Promise((resolve) => {
      axios.postUrl("/user/check_token").then((res) => {
        if (!res.check_token) {
          setItem("token", null);
          setItem("user", null);
          context.commit("setUserInfo", null);
          context.commit("setToken", null);
        }
        resolve()
      });
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
