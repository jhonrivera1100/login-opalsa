import axios from "./axios";

export const getCasinosRequest = () => axios.get("/casinos");
export const getCasinoRequest = (id) => axios.get(`/casinos/${id}`);
export const createCasinoRequest = (FormData) => {
  return axios.post("/casinos", FormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// Este método ahora recibe casinoId como primer parámetro y formData como segundo.
export const updateCasinoRequest = (casinoId, formData) => {
  return axios.put(`/casinos/${casinoId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCasinoRequest = (id) => axios.delete(`/casinos/${id}`);

export const deleteCasinoDocumentRequest = (casinoId, publicId, category) => {
  return axios.delete(`/casinos/${casinoId}/document`, {
    data: { publicId, category }, // Los datos que enviamos en la solicitud DELETE
  });
};



