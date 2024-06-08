import axios from './axios';

export const getCasinosRequest = () => axios.get('/casinos');
export const getCasinoRequest = (id) => axios.get(`/casinos/${id}`);
export const createCasinoRequest = (FormData) => {
    return axios.post('/casinos', FormData, {
      headers: {
        'Content-Type':'multipart/form-data',
      },
    });
  };
  export const updateCasinoRequest = (casinos) => axios.put(`/casinos/${casinos._id}`, casinos)
  export const deleteCasinoRequest = (id) => axios.delete(`/casinos/${id}`)