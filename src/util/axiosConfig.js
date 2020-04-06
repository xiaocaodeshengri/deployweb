import axios from 'axios'
import router from "../router";
// http response 拦截器（所有接收到的请求都要从这儿过一次）

axios.interceptors.response.use(
    response => {
        if(response.data['msg'] === '登录超时，请重新登录'){router.push({path: '/login'});}
        return response
    },
    // error => {
    //     if(error.response.status === 401){
    //         router.go(-1)
    //         this.$notify({
    //             title: '警告',
    //             message: error.response.data['msg'],
    //             type: 'warning',
    //         });
    //     }
    //     return error
    // }
);

export default axios;
