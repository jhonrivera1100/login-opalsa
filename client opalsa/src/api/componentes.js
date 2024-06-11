import axios from './axios';

export const getComponentesRequest = () => axios.get('/componentes');
export const getComponenteRequest = (id) => axios.get(`/componentes/${id}`);
export const createComponentesRequest = (componente) => axios.post('/componentes', componente);
export const updateComponentesRequest = (componente) => axios.put(`/componentes/${componente._id}`, componente);
export const deleteComponentesRequest = (id) => axios.delete(`/componentes/${id}`);
