import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext'; // Asegúrate de tener el contexto de autenticación importado
import { getMaquinasRequest } from '../api/maquinas'; // Asegúrate de tener esta función en tu archivo api/maquinas.js

const GenerarOrden = () => {
    const { user } = useAuth(); // Obtén el usuario autenticado desde el contexto
    const [nroSerieMaquina, setNroSerieMaquina] = useState('');
    const [ubicacionMaquina, setUbicacionMaquina] = useState('');
    const [descripcionOrden, setDescripcionOrden] = useState('');
    const [fechaOrden, setFechaOrden] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
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
                usuario: user.username, // Envía el usuario actual
            });
            setSuccessMessage('Orden generada exitosamente');
            // Limpiar el formulario
            setNroSerieMaquina('');
            setUbicacionMaquina('');
            setDescripcionOrden('');
            setFechaOrden('');
            setError(null); // Limpiar el mensaje de error en caso de haberlo
        } catch (error) {
            console.error('Error al crear Orden:', error);
            setError('No se pudo crear la orden. Inténtalo de nuevo.');
            setSuccessMessage(''); // Limpiar el mensaje de éxito en caso de error
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
                        {error && <p className="text-red-500 text-xs italic">{error}</p>}
                        {successMessage && <p className="text-green-500 text-xs italic">{successMessage}</p>}
                        <button
                            type="submit"
                            className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-white p-3 rounded-lg w-full focus:outline-none focus:shadow-outline"
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
