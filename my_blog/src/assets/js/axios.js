import axios from "axios";
import qs from "qs";
import env from "@/assets/env";
// import router from "@/router"

// import res from '@/assets/result-model'
import store from "@/store/index";
import { errMessage, getItem } from "@/assets/js/utils";
// import { reject } from 'core-js/fn/promise'

let baseAxios = axios.create({
  baseURL: env.url,
  timeout: 15000, // 请求超时时间

  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // }
});

let __token = null;
let __http_one_only = false;

// 发送信息钩子
baseAxios.interceptors.request.use(
  function (config) {
    if (!config.headers.Authorization) {
      __token = getItem("token") || null;
      let tokenValue = __token;

      if (tokenValue) {
        config.headers["Authorization"] = `Bearer ${tokenValue}`;
        config.headers["X-Access-Token"] = __token;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 返回消息钩子
baseAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

baseAxios.getUrl = (url, params = {}, { showErrflag = true } = {}) => {
  return new Promise((resolve, reject) => {
    baseAxios
      .get(url, {
        params,
      })
      .then(
        (response) => {
          let retData = response.data;
          retData.isok = retData.status === 1;
          if (retData.status === 401 && retData.msg.includes("token失效")) {
            store.dispatch("logout");
            return;
          }

          if (!retData.isok) {
            console.warn(url, params, retData);
          }

          if (showErrflag) {
            ifErr(retData);
          }

          if (retData.isok) {
            resolve(retData);
          } else {
            reject(retData);
          }
        },
        (error) => {
          let res = error.response;

          console.warn(error, res);
          // debugger
          if (res && res.data) {
            if (
              res.data.status === 500 &&
              res.data.message.includes("token失效")
            ) {
              //   store.dispatch('logout')
              return;
            }
            if (res.status === 500 || res.status === 503) {
              return;
            }
          }
          errMessage(res.data.message || "服务器错误");
          reject(error);
        }
      );
  });
};

baseAxios.postUrl = (
  url,
  data = {},
  {
    showErrflag = true,
    postOne = true,
    contentType = "",
    responseType = "",
  } = {}
) => {
  let headers = {};
  let opts = data;
  // console.log(Object.prototype.toString.call(data))
  if (contentType) {
    headers["Content-Type"] = contentType;
  } else if (Object.prototype.toString.call(data) !== "[object FormData]") {
    headers["Content-Type"] =
      "application/x-www-form-urlencoded; charset=UTF-8";
    opts = qs.stringify(data);
  } else {
    // formData对象一律认为是要发送流文件
    headers["Content-Type"] = "multipart/form-data";
  }

  if (postOne) {
    // 已经有请求存在
    if (__http_one_only) {
      errMessage("请求中,请稍后...");
      return;
    }
    __http_one_only = true;
  }

  return new Promise((resolve, reject) => {
    baseAxios
      .post(url, opts, {
        headers,
        responseType,
      })
      .then(
        (response) => {
          if (postOne) {
            __http_one_only = false;
          }

          let retData = response.data;

          // console.log(retData);
          if (response.status == 200 && !retData.status) {
            resolve(retData);
            return;
          }
          retData.isok = retData.status === 1;

          if (retData.status === 401 && retData.msg.includes("token失效")) {
            store.dispatch("logout");
            return;
          }

          if (!retData.isok) {
            console.warn(url, data, retData);
          }

          if (showErrflag) {
            ifErr(retData);
          }
          if (retData.isok) {
            resolve(retData);
          } else {
            reject(retData);
          }
        },
        (error) => {
          if (postOne) {
            __http_one_only = false;
          }
          errMessage(error.msg || "请求失败");
          // let errData = res.error('服务器错误', -1, error)
          reject(error);
        }
      );
  });
};
/**
 * 文件上传 用于富文本上传图片
 * @param url
 * @param data
 * @returns {*}
 */
baseAxios.upload = (
  url,
  data = {},
  { showErrflag = true, postOne = true } = {}
) => {
  let headers = {
    "Content-Type": "multipart/form-data",
  };
  let opts = data;

  if (postOne) {
    // 已经有请求存在
    if (__http_one_only) {
      errMessage("请求中,请稍后...");
      return;
    }
    __http_one_only = true;
  }

  return new Promise((resolve, reject) => {
    baseAxios
      .post(url, opts, {
        headers,
      })
      .then(
        (response) => {
          if (postOne) {
            __http_one_only = false;
          }

          let retData = response.data;

          if (response.status == 200 && !retData.status) {
            resolve(retData);
            return;
          }
          retData.isok = retData.status === 1;

          if (retData.status === 401 && retData.msg.includes("token失效")) {
            store.dispatch("logout");
            return;
          }

          if (!retData.isok) {
            console.warn(url, data, retData);
          }

          if (showErrflag) {
            ifErr(retData);
          }
          if (retData.isok) {
            resolve(retData);
          } else {
            reject(retData);
          }
        },
        (error) => {
          if (postOne) {
            __http_one_only = false;
          }
          errMessage(error.msg || "请求失败");
          // let errData = res.error('服务器错误', -1, error)
          reject(error);
        }
      );
  });
};

function ifErr(retData) {
  if (!retData.isok) {
    errMessage(retData.msg);
  }
}

export default baseAxios;
