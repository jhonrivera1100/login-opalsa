import axios from './axios';

export const getMaquinasRequest = () => axios.get('/maquina')
export const updateMaquinaRequest = (id) => axios.get(`/maquina/${id}`)
export const createMaquinasRequest = (maquinas) => axios.post('/maquina', maquinas)
export const updateMaquinasRequest = (maquinas) => axios.put(`/maquina/${maquinas._id}`, maquinas)
export const deleteMaquinasRequest = (id) => axios.delete(`/maquina/${id}`)
