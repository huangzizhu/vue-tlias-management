import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router/index";


const request = axios.create({
  baseURL: "/api",
  timeout: 50000,
});

request.interceptors.request.use(
  (config) => {
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    if (loginUser && loginUser.token) {
      config.headers.set("token", loginUser.token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  })


request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if(error.request.status === 401) {
      ElMessage.error("登陆失效，请重新登陆");
      localStorage.removeItem("loginUser");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default request;
