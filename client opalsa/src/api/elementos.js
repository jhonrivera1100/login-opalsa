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
export const cambiarUbicacionElementoRequest = async (elementoId, nuevoCasinoId) => {
  try {
    const response = await axios.put(`/elementos/${elementoId}/cambiar-ubicacion`, {
      nuevoCasinoId,
    });
    console.log("Ubicación actualizada con éxito", response.data);
  } catch (error) {
    console.error("Error al cambiar la ubicación del elemento", error);
  }
};
export const deleteElementosRequest = (id) => axios.delete(`/elemento/${id}`);
export const getElementosByCasinoRequest = (casinoId) => axios.get(`/casinos/${casinoId}/elemento`);
