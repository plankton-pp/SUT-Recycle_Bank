import axios from 'axios';
// import { requestHandler, successHandler, errorHandler } from "./interceptors";

const connectInstance = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
    headers: {
        "Content-Type": "application/json"
    }
});

//------- get token OAuth

// connectInstance.interceptors.request.use(async (request)=> {
//     return requestHandler(request);
// });

// connectInstance.interceptors.response.use(
//     response => successHandler(response),
//     error => errorHandler(error)
// );


export const httpClient = connectInstance