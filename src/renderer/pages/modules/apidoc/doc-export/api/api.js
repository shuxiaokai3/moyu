import axios from "axios";
import jsCookie from "js-cookie";
import config from "@/../config";

const axiosInstance = axios.create();
axiosInstance.defaults.withCredentials = config.renderConfig.httpRequest.withCredentials;//允许携带cookie
axiosInstance.defaults.timeout = config.renderConfig.httpRequest.timeout;//超时时间
axiosInstance.defaults.baseURL = config.renderConfig.httpRequest.url;//请求地址

export default {
    install(Vue) {
        //===============================axiosInstance请求钩子==========================================//
        axiosInstance.interceptors.request.use((reqConfig) => {
            reqConfig.headers["x-csrf-token"] = jsCookie.get("csrfToken");
            return reqConfig;
        }, (err) => Promise.reject(err));
        //===============================axiosInstance响应钩子=======================================//
        axiosInstance.interceptors.response.use(
            async (res) => {
                const result = res.data;
                const headers = res.headers || {};
                const contentType = headers["content-type"];
                const contentDisposition = headers["content-disposition"];
                let fileName = contentDisposition ? contentDisposition.match(/filename=(.*)/) : "";
                if (fileName) {
                    fileName = decodeURIComponent(fileName[1]);
                }
                if (contentType.includes("application/json")) { //常规格式数据
                    let code = null;
                    if (res.data.constructor.name === "Blob") {
                        let jsonData = await res.data.text();
                        jsonData = JSON.parse(jsonData);
                        // eslint-disable-next-line prefer-destructuring
                        code = jsonData.code;
                    } else {
                        // eslint-disable-next-line prefer-destructuring
                        code = res.data.code; //自定义请求状态码
                    }
                    /*eslint-disable indent*/
                    switch (code) {
                        case 0: //正确请求
                            break;
                        case 2006: //输入验证码
                            break;
                        case 2003: //ip锁定
                            break;
                        case 4101: //登录有错
                            Vue.prototype.$message.warning("暂无权限");
                            return Promise.reject(new Error("暂无权限"));
                        case 4002: //暂无权限
                            Vue.prototype.$message.warning("暂无权限");
                            return Promise.reject(new Error("暂无权限"));
                        default:
                            Vue.prototype.$confirm(res.data.msg ? res.data.msg : "操作失败", "提示", {
                                confirmButtonText: "确定",
                                showCancelButton: false,
                                type: "warning",
                            });
                            return Promise.reject(new Error(res.data.msg));
                    }
                    return result;
                }
                return {
                    fileName,
                    data: result,
                };
            },
            (err) => {
                //=====================================取消错误不进行拦截====================================//
                if (err.constructor && err.constructor.name === "Cancel") {
                    return;
                }
                Vue.prototype.$message.error("系统开小差了!");
                Promise.reject(err);
            },
        );
        Vue.prototype.axios = axiosInstance;
    },
    axios: axiosInstance,
};
