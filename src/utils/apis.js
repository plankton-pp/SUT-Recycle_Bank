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