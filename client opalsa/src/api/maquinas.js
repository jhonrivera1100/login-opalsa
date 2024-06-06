import axios from './axios';

export const getMaquinasRequest = () => axios.get('/maquina')
export const updateMaquinaRequest = (id) => axios.get(`/maquina/${id}`)
export const createMaquinasRequest = (formData) => {
    return axios.post('/maquina', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
export const updateMaquinasRequest = (maquinas) => axios.put(`/maquina/${maquinas._id}`, maquinas)
export const deleteMaquinasRequest = (id) => axios.delete(`/maquina/${id}`)
