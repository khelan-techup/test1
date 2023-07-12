import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURl: "https://devapi.neo7logix.com",
})

axiosInstance.interceptors.request.use(config => {
    // console.log(config);
    // var token = JSON.parse(localStorage.getItem("AUserToken"));
    let token = JSON.parse(localStorage.getItem("OnlyToken"))
    if (token) {
        // config.headers['NeoAuthKey'] = token
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error?.response?.status == 401) {
            // if (localStorage.getItem("AUserToken")) {
            try {
                delete localStorage['AUserToken']
                delete localStorage['isLoggedIn']
                delete localStorage['expiry']
                delete localStorage['isFirstLogin']
                delete localStorage['OnlyToken']



            } catch (error) {
                toast.error(error)

            }

            toast.error("Session expired.")
            // }
            // localStorage.clear();
        }
    });
export default axiosInstance