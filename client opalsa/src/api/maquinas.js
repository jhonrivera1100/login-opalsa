import axios from './axios';

// Obtener todas las máquinas
export const getMaquinasRequest = (page, limit = 8) => {
  return axios.get('/maquina', {
    params: { page, limit },
  });
};

export const buscarMaquinaPorNumeroDeSerieRequest = async (nroSerieMaquina) => {
  return axios.get(`/maquina/serial`, {
    params: { nroSerieMaquina },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Asegúrate de incluir el token de autenticación
    },
  });
};


export const getAllMaquinasRequest = async () =>
  await axios.get("/maquina/all"); // Nueva ruta para obtener todas las máquinas


// Obtener una máquina por su ID
export const getMaquinaRequest = (id) => axios.get(`/maquina/${id}`);

export const getMaquinasByCasinoRequest = (nombreCasino) => {
  return axios.get(`/maquina/casino`, {
    params: { nombreCasino },
  });
};

// Crear una nueva máquina con datos en formato multipart (para enviar imágenes y otros archivos)
export const createMaquinasRequest = (formData) => {
    return axios.post('/maquina', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};

// Actualizar una máquina (el ID se pasa de manera correcta en la URL)
export const updateMaquinasRequest = (id, maquinaData) => {
  return axios.put(`/maquina/${id}`, maquinaData, {
    headers: {
      'Content-Type': 'multipart/form-data',  // Si estás enviando archivos, asegúrate de usar multipart/form-data
    },
  });
};

// Eliminar una máquina por su ID
export const deleteMaquinasRequest = (id) => axios.delete(`/maquina/${id}`);
