import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext'; 
import { getMaquinasRequest } from '../api/maquinas';

const GenerarOrden = () => {
    const { user } = useAuth(); 
    const [nroSerieMaquina, setNroSerieMaquina] = useState('');
    const [ubicacionMaquina, setUbicacionMaquina] = useState('');
    const [descripcionOrden, setDescripcionOrden] = useState('');
    const [fechaOrden, setFechaOrden] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // Estado para manejar el mensaje de éxito
    const [maquinas, setMaquinas] = useState([]);

    useEffect(() => {
        const fetchMaquinas = async () => {
            try {
                const response = await getMaquinasRequest();
                console.log('Maquinas recibidas:', response.data);
                setMaquinas(response.data);
            } catch (err) {
                console.error('Error al obtener las máquinas:', err);
            }
        };

        fetchMaquinas();
    }, []);

    const handleSerieChange = (selectedOption) => {
        if (selectedOption) {
            const selectedSerie = selectedOption.value;
            setNroSerieMaquina(selectedSerie);
            const selectedMaquina = maquinas.find(maquina => maquina.nroSerieMaquina === selectedSerie);
            if (selectedMaquina) {
                setUbicacionMaquina(selectedMaquina.ubicacionMaquina);
            } else {
                setUbicacionMaquina('');
            }
        } else {
            setNroSerieMaquina('');
            setUbicacionMaquina('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:4000/api/ordenes', {
                fechaOrden,
                descripcionOrden,
                nroSerieMaquina,
                ubicacionMaquina,
                usuario: user.username, 
            });
            setSuccessMessage('Orden creada exitosamente');
            setNroSerieMaquina('');
            setUbicacionMaquina('');
            setDescripcionOrden('');
            setFechaOrden('');
            setError(null); 

            setTimeout(() => {
                setSuccessMessage(null);
              }, 3000);

        } catch (error) {
            console.error('Error al crear Orden:', error);
            setError('No se pudo crear la orden. Inténtalo de nuevo.');
            setSuccessMessage(null);
        }
    };

    const maquinaOptions = maquinas.map(maquina => ({
        value: maquina.nroSerieMaquina,
        label: maquina.nroSerieMaquina,
    }));

    return (
        <div className="container mx-auto my-4 px-4 lg:px-20">
            <div className="w-full p-6 my-4 lg:w-8/12 lg:p-12 rounded-2xl shadow-2xl bg-white mx-auto">
                <div className="flex justify-center">
                    <h1 className="font-bold uppercase text-3xl md:text-4xl text-center">Solicitar una Orden</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <textarea
                            value={descripcionOrden}
                            onChange={(e) => setDescripcionOrden(e.target.value)}
                            className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                            placeholder="Solicita una orden aquí"
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
                        <Select
                            value={maquinaOptions.find(option => option.value === nroSerieMaquina)}
                            onChange={handleSerieChange}
                            options={maquinaOptions}
                            className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                            placeholder="Número de Serie"
                        />
                        <input
                            type="text"
                            value={ubicacionMaquina}
                            readOnly
                            className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                            placeholder="Ubicación de la Máquina"
                        />
                        <input
                            type="date"
                            value={fechaOrden}
                            onChange={(e) => setFechaOrden(e.target.value)}
                            className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mt-4">
                    <div className='mt-5'>
                {/* Mostrar la alerta de éxito si successMessage existe */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Mostrar la alerta de error si error existe */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
          </div>
                        <button
                            type="submit"
                            className=" mt-5 uppercase text-sm font-bold tracking-wide bg-blue-900 text-white p-3 rounded-lg w-full focus:outline-none focus:shadow-outline"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerarOrden;
