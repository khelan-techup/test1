import React, { useRef, useEffect } from "react";
import { Steps } from "intro.js-react";
import axiosInstance from "./axiosInstance";
function updateTooltip(step, isSkip) {

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken) {


        // const url = apiroute + "/api/BE_Dashboard/GetAll";
        const apiroute = window.$APIPath;
        const url = apiroute + "/api/BE_OrganizationUser/UpdateTooltipSteps";
        let userId = userToken?.userId == null ? 0 : userToken?.userId;

        let data = JSON.stringify({
            userId: userId,
            step: step,
            isComplete: !isSkip,
            isSkip: isSkip
        });
        axiosInstance
            .post(url, data, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {
                // console.log("result", result);
                if (result.data.flag) {

                    // this.setState({

                    //     loading: false,
                    // });
                } else {
                    // this.setState({ loading: false });
                    // console.log(result.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                // this.setState({ loading: false });
            });
    } else {
        return;
    }

}

export default updateTooltip;