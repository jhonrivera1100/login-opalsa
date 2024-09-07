import User from '../models/user.model.js';
import Orden from '../models/orden.model.js';
import Maquina from '../models/maquina.model.js';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Para generar números de orden únicos

// Obtener todas las órdenes
export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find()
      .populate('usuario', 'username') // Popula el usuario con solo el campo 'username'
      .populate('maquina') // Popula la máquina asociada
      .populate('elementoOrden') // Opcional: si necesitas poblar elementos de la orden
      .populate('elementoOrdenSobrantes'); // Opcional: si necesitas poblar elementos sobrantes

    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error.message);
    res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
  }
};

// Obtener las órdenes de un usuario
export const getOrdenesByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const ordenes = await Orden.find({ usuario: userId })
      .populate('usuario')
      .populate('maquina') // Popula la máquina asociada
      .populate('elementoOrden')
      .populate('elementoOrdenSobrantes');

    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener las órdenes del usuario:', error.message);
    res.status(500).json({ message: 'Error al obtener las órdenes del usuario', error: error.message });
  }
};

// Obtener una orden por ID
export const obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findById(id)
      .populate('usuario')
      .populate('maquina') // Popula la máquina asociada
      .populate('elementoOrden')
      .populate('elementoOrdenSobrantes');
    
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
    const { descripcionOrden, nroSerieMaquina, usuario, tipoDeMantenimiento } = req.body;

    // Obtener la fecha y generar el número de orden
    const fechaOrden = new Date(); // Fecha actual
    const numeroOrden = uuidv4(); // Genera un número único

    // Buscar el usuario
    const usuarioObj = await User.findOne({ username: usuario });
    if (!usuarioObj) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Buscar la máquina
    const maquina = await Maquina.findOne({ nroSerieMaquina });
    if (!maquina) {
      return res.status(404).json({ message: 'Máquina no encontrada' });
    }

    // Crear la nueva orden
    const nuevaOrden = new Orden({
      fechaOrden,
      descripcionOrden,
      maquina: maquina._id, // Usa el ID de la máquina
      usuario: usuarioObj._id,
      numeroOrden,
      tipoDeMantenimiento,
      elementoOrden: [],
      elementoOrdenSobrantes: [],
      fechaCumplimiento: null
    });

    await nuevaOrden.save();
    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error('Error en el servidor al crear la orden:', error.message);
    res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
};

// Actualizar una orden (tarea realizada y elementos)
export const updateOrdenAsignados = async (req, res) => {
  try {
    const { id } = req.params;
    const { estadoOrden = 'Orden en solicitud', elementoOrden = [], tareaRealizada = '' } = req.body;

    const ordenActualizada = await Orden.findByIdAndUpdate(
      id,
      { 
        estadoOrden,
        elementoOrden,
        tareaRealizada
      },
      { new: true }
    )
    .populate('usuario')
    .populate('maquina') // Popula la máquina asociada
    .populate('elementoOrden')
    .populate('elementoOrdenSobrantes');

    if (!ordenActualizada) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar la orden:', error.message);
    res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
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
export const updateOrdenSobrantes = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      estadoOrden = 'Orden en solicitud',
      elementoOrden = [], // Elementos asignados
      elementoOrdenSobrantes = [], // Elementos sobrantes
      tareaRealizada = '' // Actualizar la tarea realizada
    } = req.body;

    // Validar que las cantidades sobrantes no excedan las cantidades asignadas
    elementoOrden.forEach((elemento) => {
      const sobrante = elementoOrdenSobrantes.find(s => s.nombre === elemento.nombre);
      if (sobrante && sobrante.cantidadSobrante > elemento.cantidad) {
        throw new Error(`La cantidad sobrante para el elemento ${elemento.nombre} excede la cantidad asignada.`);
      }
    });

    // Actualizar la orden con los datos proporcionados
    const ordenActualizada = await Orden.findById(id);
    if (!ordenActualizada) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    ordenActualizada.estadoOrden = estadoOrden;
    ordenActualizada.elementoOrden = elementoOrden;
    ordenActualizada.elementoOrdenSobrantes = elementoOrdenSobrantes;
    ordenActualizada.tareaRealizada = tareaRealizada;

    await ordenActualizada.save();

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar la orden:', error.message);
    res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
  }
};
