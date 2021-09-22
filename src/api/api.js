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

    if (item.url === "/record/uploadRecord") {
      option = {
        method: "POST",
        // mode: "cors",
        headers: {
          'Authorization': getCookie("token"),
          "withCredentials": true,
        },
        body: data,
      };
    }
    if (item.url === "http://10.16.98.192:5000/analysis") {
      url = item.url;
      option = {
        method: "POST",
        body: data,
      };
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
