import axios from './axios';

export const getMaquinasRequest = () => axios.get('/maquina')
export const getMaquinaRequest = (id) => axios.get(`/maquina/${id}`)
export const createMaquinasRequest = (formData) => {
    return axios.post('/maquina', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
// En tu archivo maquinas.js o donde tengas las llamadas API
export const updateMaquinasRequest = (id, maquinaData) => {
  return axios.put(`/maquina/${id}`, maquinaData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteMaquinasRequest = (id) => axios.delete(`/maquina/${id}`)
