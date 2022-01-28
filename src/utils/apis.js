import { httpClient } from './httpClient';
// import axios from 'axios';

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