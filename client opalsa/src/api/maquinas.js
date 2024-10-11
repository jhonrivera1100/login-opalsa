import axios from './axios';

// Obtener todas las máquinas
export const getMaquinasRequest = (page, limit = 8, marca = "") => {
  return axios.get('/maquina', {
    params: { page, limit, marca }, // Se incluye el parámetro marca
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



// Nueva función: Buscar máquina por número de serie flexible (exacta o parcial)
export const buscarMaquinaPorSerieFlexibleRequest = async (nroSerieMaquina, exact = false) => {
  return axios.get(`/maquina/buscar/serie-flexible`, {
    params: { nroSerieMaquina, exact }, // Se pasa el número de serie y si es búsqueda exacta
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Incluir el token de autenticación
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
