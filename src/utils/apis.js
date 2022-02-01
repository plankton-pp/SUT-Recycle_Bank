import { httpClient } from './httpClient';
import * as helper from './helper'
// import axios from 'axios';

//=================== API: Login

export const login = async (formData) => {
  return await httpClient.post(`/api/v1/employee/auth`, formData);
}

//=================== API: Authenticate

export const userAuthenticated = async () => {
  let token = helper.sessionGet('token')
  token = token.slice(1,token.length-1)
  const data = {
    headers: {
      "x-access-token": token
    }
  }
  return await httpClient.get(`/api/v1/employee/auth/isUserAuth`, data);
}

//=================== API: Register

export const register = async (formData) => {
  console.log(formData);
  return await httpClient.post(`/api/v1/employee/register`, formData);
}

//=================== API: Check Duplicate Username

export const checkDuplicate = async (data) => {
  return await httpClient.post(`/api/v1/employee/checkDuplicate`, data);
}


// export const getProfile = async (token) => {
//   const getProfile = axios.create({
//     baseURL: process.env.REACT_APP_API_ENDPOINT,
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": token,
//       "OAuth": "DLD"
//     }
//   });
//   return await getProfile.get(`/user/profile`);
// }

//=================== Test Get API
export const getBooks = async () => {
  return await httpClient.get(`/api/v1/book/`);
}

export const getBookById = async (id) => {
  return await httpClient.get(`/api/v1/book/${id}`);
}

export const deleteBookById = async (id) => {
  return await httpClient.delete(`/api/v1/book/${id}`);
}

export const addBook = async (data) => {
  return await httpClient.post(`/api/v1/book/`, data);
}

export const updateBook = async (data) => {
  return await httpClient.put(`/api/v1/book/`, data);
}

//=================== API: Type
export const getTypes = async () => {
  return await httpClient.get(`/api/v1/type/`);
}

// export const getBookById = async (id) => {
//   return await httpClient.get(`/api/v1/book/${id}`);
// }

export const deleteTypeById = async (id) => {
  return await httpClient.delete(`/api/v1/type/${id}`);
}

export const addType = async (data) => {
  return await httpClient.post(`/api/v1/type/`, data);
}

export const updateType = async (data) => {
  return await httpClient.put(`/api/v1/type/`, data);
}

//=================== API: Product
export const getProducts = async () => {
  return await httpClient.get(`/api/v1/product/`);
}

// export const getBookById = async (id) => {
//   return await httpClient.get(`/api/v1/book/${id}`);
// }

export const deleteProductById = async (id) => {
  return await httpClient.delete(`/api/v1/product/${id}`);
}

export const addProduct = async (data) => {
  return await httpClient.post(`/api/v1/product/`, data);
}

export const updateProduct = async (data) => {
  return await httpClient.put(`/api/v1/product/`, data);
}

//=================== API: Deposit
export const addDeposit = async (data) => {
  return await httpClient.post(`/api/v1/deposit/`, data);
}

//=================== API: Search Member
export const searchMember = async (key) => {
  return await httpClient.get(`/api/v1/member/key/${key}`);
}

export const getMember = async () => {
  return await httpClient.get(`/api/v1/member`);
}