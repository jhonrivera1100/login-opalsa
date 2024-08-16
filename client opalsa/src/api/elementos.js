// src/api/elementos.js
import axios from './axios';

export const getElementosRequest = () => axios.get('/elemento');

export const getElementoRequest = (id) => axios.get(`/elemento/${id}`);

export const createElementosRequest = (formData) => {
  return axios.post('/elemento', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateElementosRequest = (elemento) => axios.put(`/elemento/${elemento._id}`, elemento);

export const deleteElementosRequest = (id) => axios.delete(`/elemento/${id}`);
