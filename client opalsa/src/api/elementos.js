import axios from './axios';

export const getElementosRequest = () => axios.get('/elemento');
export const getElementoRequest = (id) => axios.get(`/elemento/${id}`);
export const createElementosRequest = (FormData) => {
  return axios.post('/elemento', FormData, {
    headers: {
      'Content-Type':'multipart/form-data',
    },
  });
};
export const updateElementosRequest = (elemento) => axios.put(`/elemento/${elemento._id}`, elemento);
export const deleteElementosRequest = (id) => axios.delete(`/elemento/${id}`);
export const getElementosByCasinoRequest = (casinoId) => axios.get(`/casinos/${casinoId}/elemento`);
