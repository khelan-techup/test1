import "react-app-polyfill/ie9"; // For IE 9-11 support
import "react-app-polyfill/stable";
// import 'react-app-polyfill/ie11'; // For IE 11 support
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import favicon from "./assets/img/brand/favicon.ico"
import Favicon from 'react-favicon'
import 'intro.js/introjs.css';

// window.$APIPath = 'https://localhost:44306'; //gkclobal variable
// window.$APIPath = "https://devapi.neo7logix.com"; // Development url/

// window.$APIPath = "http://api.neo7logix.com"; //global variablez
// window.$APIPath = "https://8003-122-170-53-238.in.ngrok.io"; //- stag url1
// window.$APIPath = "https://3dbd-122-170-47-151.in.ngrok.io";

window.$APIPath = "https://devapi.neo7logix.com";//DEV URL/
// window.$APIPath = "https://qaapi.neo7logix.com"; //- stag url1 qa URL
// window.$APIPath = "https://neoapi.neo7logix.com"; //Aws server neo global variable  - prod url

window.$FileUrl = "https://neo7qa.s3.us-east-2.amazonaws.com/"; //Global variable for s3 bucket file preview //staging
// window.$FileUrl = "https://patient-files-bucket.s3.us-east-2.amazonaws.com/"; //production

// window.$APIPath = 'https://neoapi.neo7logix.com'
window.$TotalRecord = 15;

ReactDOM.render(<>
    <Favicon url={favicon} />
    <App />
</>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
