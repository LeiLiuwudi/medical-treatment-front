import { getCookie } from "../pages/home/Home";

// const BaseUrl = "http://10.16.98.192:9090";
const BaseUrl = "http://localhost:8080";
const UrlMap = [
  {
    description: "用户登录", // 用到，成功
    method: "login",
    url: "/user/login",
    type: "POST",
  },
  {
    description: "用户注册", // 用到，成功
    method: "register",
    url: "/user/register",
    type: "POST",
  },
  {
    description: "获取用户具体信息", // 用到，成功
    method: "getUser",
    url: "/user/getUser",
    type: "POST",
  },
  {
    description: "获取医生列表", // 用到，成功
    method: "getDoctorList",
    url: "/doctor/getDoctorList",
    type: "POST",
  },
  {
    description: "添加患者病历信息", // 用到，成功
    method: "addPatient",
    url: "/patient/addPatient",
    type: "POST",
  },
  {
    description: "添加患者病历信息", // 用到，成功
    method: "queryPatient",
    url: "/patient/queryPatient",
    type: "POST",
  },
  {
    description: "更新患者病历信息", // 用到，成功
    method: "updatePatient",
    url: "/patient/updatePatient",
    type: "POST",
  },
  {
    description: "删除患者病历信息", // 用到，成功
    method: "deletePatient",
    url: "/patient/deletePatient",
    type: "GET",
  },
  {
    description: "获取患者历史红外热像记录信息", // 用到，成功
    method: "getRecognizeList",
    url: "/recognize/getRecognizeList",
    type: "GET",
  },
  {
    description: "上传患者新的红外热像记录", // 用到，成功
    method: "upload",
    url: "/recognize/upload",
    type: "POST",
  },
  {
    description: "获取相似电子病历id", // 用到，成功
    method: "similarRecord",
    url: "http://localhost:5000/similarRecord",
    type: "POST",
  },
  {
    description: "相似电子病历对比", // 用到，成功
    method: "textComparison",
    url: "/patient/textComparison",
    type: "POST",
  }
];
const API = {};
UrlMap.forEach((item) => {
  if (API[item.method]) {
    console.log(`存在相同方法：${item.method}`);
  }
  API[item.method] = function (data) {
    // data是请求参数
    let url = BaseUrl + item.url;
    let option = {
      method: item.type, // 请求方式
      mode: "cors",
      headers: {
         "Content-Type": "application/json",
        'Authorization': getCookie("token") ,
        "withCredentials": true,
      },
    };

    if (item.type !== "POST") {
      let body = Object.keys(data || {})
        .map((key) => key + "=" + data[key])
        .join("&");
      // 如果不是POST请求，则将参数拼接在url中，以?连接。
      url = `${url}?${body}`;
    } else {
      option.body = JSON.stringify(data);
    }

    if (item.url === "/recognize/uploa") {
      option = {
        method: "POST",
        // mode: "cors",
        headers: {
          // "Content-Type": "multipart/form-data; charset=utf-8;boundary=16f0f6d2c45",
          'Authorization': getCookie("token"),
          "withCredentials": true,
        },
        body: data,
      };
    }
    if (item.url === "http://localhost:5000/similarRecord") {
      url = item.url;
      option = {
        method: "POST",
        // mode: "no-cors",
        body: JSON.stringify(data),
      };
      return fetch(url, option).then((res) => res.json())
    }
    if (item.url === "/record/download"){
      return fetch(url,option).then((res) => res.json());
    }
    // 通过fetch发送请求，第一个参数是请求地址。
    // json()返回一个被解析为JSON格式的promise对象
    return fetch(url, option).then((res) => res.json());
  };
});
export default API;
