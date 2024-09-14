import User from '../models/user.model.js';
import Orden from '../models/orden.model.js';
import Maquina from '../models/maquina.model.js';
import Componente from "../models/componente.model.js";
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Para generar números de orden únicos

// Obtener todas las órdenes
export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find()
      .populate('elementoOrden')
      .populate('elementoOrdenSobrantes')
      .populate('componentesAsignados')
      .populate('componentesSobrantes');

    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error.message);
    res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
  }
};


export const getOrdenesByUser = async (req, res) => {
  try {
    // Obtén el ID del usuario autenticado
    const userId = req.idUsuario;

    // Busca las órdenes que pertenezcan a ese usuario
    const ordenes = await Orden.find({ usuario: userId }).populate('usuario').populate('componentes');

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes', error });
  }
};



// Obtener una orden por ID
export const obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findById(id)
      .populate('elementoOrden')
      .populate('elementoOrdenSobrantes')
      .populate('componentesAsignados')
      .populate('componentesSobrantes');
    
    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    
    res.status(200).json(orden);
  } catch (error) {
    console.error('Error al obtener la orden:', error.message);
    res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
  }
};

// Crear una nueva orden
export const createOrden = async (req, res) => {
  try {
    const { descripcionOrden, nroSerieMaquina, marcaMaquina, ubicacionMaquina, usuario, tipoDeMantenimiento, componentesAsignados = [], componentesSobrantes = [] } = req.body;

    const fechaOrden = new Date();
    const numeroOrden = uuidv4();

    // Verificar que el usuario exista
    const usuarioObj = await User.findOne({ username: usuario });
    if (!usuarioObj) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Guardar los detalles de la máquina directamente desde la solicitud
    const maquinaInfo = {
      nroSerieMaquina,
      marcaMaquina,
      ubicacionMaquina
    };

    const nuevaOrden = new Orden({
      fechaOrden,
      descripcionOrden,
      maquina: maquinaInfo, // Almacenamos directamente la información de la máquina
      usuario: {
        username: usuarioObj.username,
        email: usuarioObj.email,
        cargo: usuarioObj.cargo
      },
      idUsuario: usuarioObj._id, // Almacenar el ID del usuario en el campo idUsuario
      numeroOrden,
      tipoDeMantenimiento,
      componentesAsignados,
      componentesSobrantes,
      elementoOrden: [],
      elementoOrdenSobrantes: [],
      fechaCumplimiento: null
    });

    await nuevaOrden.save();
    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error('Error al crear la orden:', error.message);
    res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
};

// Actualizar una orden (tarea realizada y elementos)
export const updateOrdenAsignados = async (req, res) => {
  try {
    const { id } = req.params;
    const { estadoOrden = 'Orden en solicitud', elementoOrden = [], tareaRealizada = '', componentesAsignados = [], componentesSobrantes = [] } = req.body;

    // Actualiza la orden
    const ordenActualizada = await Orden.findByIdAndUpdate(
      id,
      { 
        estadoOrden,
        elementoOrden,
        tareaRealizada,
        componentesAsignados,
        componentesSobrantes
      },
      { new: true }
    )
    .populate('elementoOrden')
    .populate('elementoOrdenSobrantes')
    .populate('componentesAsignados')
    .populate('componentesSobrantes');

    if (!ordenActualizada) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Itera sobre los componentes asignados para actualizar el usuario encargado
    for (const componente of componentesAsignados) {
      const componenteActual = await Componente.findOne({ serialComponente: componente.serialComponente });

      if (componenteActual) {
        // Actualiza el campo usuarioEncargado con el idUsuario de la orden
        componenteActual.usuarioEncargado = ordenActualizada.idUsuario;
        await componenteActual.save();
      }
    }

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar la orden y los componentes:', error.message);
    res.status(500).json({ message: 'Error al actualizar la orden y los componentes', error: error.message });
  }
};

// Eliminar una orden
export const deleteOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findByIdAndDelete(id);

    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.status(200).json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la orden:', error.message);
    res.status(500).json({ message: 'Error al eliminar la orden', error: error.message });
  }
};

// Actualizar el estado de aceptación
export const updateAceptar = async (req, res) => {
  try {
    const { id } = req.params;
    const { aceptado } = req.body;

    const orden = await Orden.findById(id);
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    orden.estadoOrden = aceptado;
    await orden.save();

    res.status(200).json(orden);
  } catch (error) {
    console.error("Error al actualizar el estado de aceptado:", error.message);
    res.status(500).json({ message: "Error al actualizar el estado de aceptado.", error: error.message });
  }
};

// Actualizar la orden incluyendo sobrantes y tarea realizada
// Actualizar la orden incluyendo sobrantes, tarea realizada y fecha de cumplimiento
export const updateOrdenSobrantes = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      estadoOrden = 'Orden en solicitud',
      elementoOrden = [],
      elementoOrdenSobrantes = [],
      tareaRealizada = '',
      componentesAsignados = [],
      componentesSobrantes = [],
      fechaCumplimiento = null // Incluye fechaCumplimiento
    } = req.body;

    // Validar que las cantidades sobrantes no excedan las asignadas
    elementoOrden.forEach((elemento) => {
      const sobrante = elementoOrdenSobrantes.find(s => s.nombre === elemento.nombre);
      if (sobrante && sobrante.cantidadSobrante > elemento.cantidad) {
        throw new Error(`La cantidad sobrante para el elemento ${elemento.nombre} excede la cantidad asignada.`);
      }
    });

    const ordenActualizada = await Orden.findById(id);
    if (!ordenActualizada) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Actualiza la orden con los datos proporcionados
    ordenActualizada.estadoOrden = estadoOrden;
    ordenActualizada.elementoOrden = elementoOrden;
    ordenActualizada.elementoOrdenSobrantes = elementoOrdenSobrantes;
    ordenActualizada.tareaRealizada = tareaRealizada;
    ordenActualizada.componentesAsignados = componentesAsignados;
    ordenActualizada.componentesSobrantes = componentesSobrantes;
    ordenActualizada.fechaCumplimiento = fechaCumplimiento;

    // Guardar la orden antes de actualizar los componentes
    await ordenActualizada.save();

    // Eliminar el usuarioEncargado de los componentes asignados
    for (const componente of componentesAsignados) {
      const componenteActual = await Componente.findOne({ serialComponente: componente.serialComponente });
      if (componenteActual) {
        componenteActual.usuarioEncargado = null;
        await componenteActual.save();
      }
    }

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar la orden:', error.message);
    res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
  }
};
