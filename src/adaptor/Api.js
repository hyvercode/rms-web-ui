import axios from "axios";

export default axios.create({
    // baseURL: "https://rmsv1.herokuapp.com/rms-service",
    baseURL: "http://localhost:8888/rms-service",
    responseType: "json"
})