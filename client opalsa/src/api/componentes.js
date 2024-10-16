import axios from './axios';

export const getComponentesRequest = (maquinaId, page = 1, limit = 6) => {
    return axios.get(`/componentes`, {
      params: { maquinaId, page, limit },
    });
  };

  export const getComponenteBySerialRequest = (serial) => {
    return axios.get(`/componentes-serial`, {
      params: { serial },
    });
  };
export const getComponenteRequest = (id) => axios.get(`/componentes/${id}`);
export const createComponentesRequest = (componente) => axios.post('/componentes', componente);
export const uploadComponenteImageRequest = (id, formData) => {
  return axios.post(`/componentes/${id}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const updateComponentesRequest = (componente) => axios.put(`/componentes/${componente._id}`, componente);
export const deleteComponentesRequest = (id) => axios.delete(`/componentes/${id}`);
