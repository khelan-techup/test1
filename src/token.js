import axios from "axios";

const axiosInstance = axios.create({
    baseURl: "https://devapi.neo7logix.com",
})

axiosInstance.interceptors.request.use(config => {
    // console.log(config);
    var token = JSON.parse(localStorage.getItem("OnlyToken"));
    // const token = "token" //JSON.parse(localStorage.getItem("AUserToken"))
    if (token) {
        config.headers['Authorization'] = `Bearer ${""}`
    }
    return config;
})

axiosInstance.interceptors.response.use(function (response) {
    console.log("response", response);
    return response;
}, function (error) {
    if (error.response) {
        if (error.response.status == parseInt(401)) {
            console.log(error.response.status);
            this.props.history.push('/login')
        }

        // console.log(error.response.data);
        // console.log(error.response.headers);
    }
    else {
        // return Promise.reject(error);
    }
    // return Promise.reject(error);
});
export default axiosInstance