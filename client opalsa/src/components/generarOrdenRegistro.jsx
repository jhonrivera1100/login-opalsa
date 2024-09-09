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
    const [tipoDeMantenimiento, setTipoDeMantenimiento] = useState(null); // Tipo de mantenimiento puede ser null inicialmente
    const [error, setError] = useState(null);
    const [maquinas, setMaquinas] = useState([]);

    const fechaOrden = new Date().toISOString().split('T')[0]; // Fecha actual en formato ISO

    useEffect(() => {
        const fetchMaquinas = async () => {
            try {
                const response = await getMaquinasRequest();
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
            const response = await axios.post('http://localhost:4000/api/ordenes', {
                descripcionOrden,
                nroSerieMaquina,
                usuario: user.username, // Envía el username del usuario actual
                tipoDeMantenimiento,
                fechaOrden
            });
            console.log('Orden creada:', response.data);
        } catch (error) {
            console.error('Error al crear la orden:', error);
            setError('No se pudo crear la orden. Inténtalo de nuevo.');
        }
    };

    const maquinaOptions = maquinas.map(maquina => ({
        value: maquina.nroSerieMaquina,
        label: maquina.nroSerieMaquina,
    }));

    const tipoMantenimientoOptions = [
        { value: 'preventivo', label: 'Preventivo' },
        { value: 'correctivo', label: 'Correctivo' },
        { value: 'predictivo', label: 'Predictivo' },
        { value: 'software', label: 'Software' },
        { value: 'estético', label: 'Estético' },
    ];

    return (
        <div className="container mx-auto my-4 px-4 lg:px-20">
            <div className="w-full p-6 my-4 lg:w-8/12 lg:p-12 rounded-2xl shadow-2xl bg-white mx-auto">
                <div className="flex justify-center">
                    <h1 className="font-bold uppercase text-3xl md:text-4xl text-center">Solicitar una Orden</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="block text-gray-700 font-bold mb-2">Descripción de la Orden</label>
                        <textarea
                            value={descripcionOrden}
                            onChange={(e) => setDescripcionOrden(e.target.value)}
                            className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                            placeholder="Solicita una orden aquí"
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2">Número de Serie de la Máquina</label>
                            <Select
                                value={maquinaOptions.find(option => option.value === nroSerieMaquina)}
                                onChange={handleSerieChange}
                                options={maquinaOptions}
                                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                placeholder="Número de Serie"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2">Ubicación de la Máquina</label>
                            <input
                                type="text"
                                value={ubicacionMaquina}
                                readOnly
                                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                placeholder="Ubicación de la Máquina"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2">Fecha de Orden</label>
                            <input
                                type="date"
                                value={fechaOrden}
                                readOnly // Hace que el campo de fecha no sea editable
                                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 font-bold mb-2">Tipo de Procedimiento</label>
                            <Select
                                value={tipoDeMantenimiento ? tipoMantenimientoOptions.find(option => option.value === tipoDeMantenimiento) : null}
                                onChange={(selectedOption) => setTipoDeMantenimiento(selectedOption ? selectedOption.value : null)}
                                options={tipoMantenimientoOptions}
                                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                placeholder="Tipo de procedimiento"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        {error && <p className="text-red-500 text-xs italic">{error}</p>}
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
