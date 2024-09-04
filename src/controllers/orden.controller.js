import User from '../models/user.model.js';
import Orden from '../models/orden.model.js';
import Maquina from '../models/maquina.model.js';
import Componente from '../models/componente.model.js';

export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find()
      .populate('usuario', 'username') // Popula el usuario con solo el campo 'username'
      .populate('componentes'); // Popula los componentes con todos los campos
      console.log("Ordenes:", ordenes);

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes', error });
  }
};

export const getOrdenesByUser = async (req, res) => {
  try {
    // Obtén el ID del usuario autenticado
    const userId = req.user._id;

    // Busca las órdenes que pertenezcan a ese usuario
    const ordenes = await Orden.find({ usuario: userId }).populate('usuario').populate('componentes');

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes', error });
  }
};


export const obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findById(id).populate('usuario').populate('componentes');
    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.status(200).json(orden);
  } catch (error) {
    console.error('Error al obtener la orden:', error.message);
    res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
  }
};



export const createOrden = async (req, res) => {
  try {
    const { fechaOrden, descripcionOrden, nroSerieMaquina, ubicacionMaquina, usuario } = req.body;

    const usuarioObj = await User.findOne({ username: usuario });
    if (!usuarioObj) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const maquina = await Maquina.findOne({ nroSerieMaquina });
    if (!maquina) {
      return res.status(404).json({ message: 'Máquina no encontrada' });
    }

    const nuevaOrden = new Orden({
      fechaOrden,
      descripcionOrden,
      nroSerieMaquina,
      ubicacionMaquina,
      usuario: usuarioObj._id,
    });

    await nuevaOrden.save();
    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error('Error en el servidor al crear la orden:', error.message, error.stack);
    res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
};

export const updateOrdenAsignados = async (req, res) => {
  try {
    const { id } = req.params;
    const { componentes, sobrantes, componentesAsignados, estadoOrden } = req.body;

    // Convertir los seriales de componentes en ObjectIds
    const componentesIds = await Promise.all(componentes.map(async (serial) => {
      const componente = await Componente.findOne({ serialComponente: serial });
      if (!componente) {
        throw new Error(`Componente con serial ${serial} no encontrado`);
      }
      return componente._id;
    }));

    const ordenActualizada = await Orden.findByIdAndUpdate(
      id,
      { 
        componentes: componentesIds,
        sobrantes,
        componentesAsignados,
        estadoOrden // Actualiza el campo estadoOrden
      },
      { new: true }
    ).populate('usuario').populate('componentes');

    if (!ordenActualizada) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar la orden:', error.message);
    res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
  }
};


export const deleteOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findByIdAndDelete(id);

    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.status(200).json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la Orden', error });
  }
};
 
export const updateAceptar = async (req, res) => {
  try {
    const { id } = req.params;
    const { aceptado } = req.body;

    // Verificar si la orden existe
    const orden = await Orden.findById(id);
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    // Actualizar el campo "aceptado"
    orden.aceptado = aceptado;
    await orden.save();

    // Enviar respuesta con la orden actualizada
    res.status(200).json(orden);
  } catch (error) {
    console.error("Error al actualizar el estado de aceptado:", error);
    res.status(500).json({ message: "Error al actualizar el estado de aceptado." });
  }
};

export const updateOrdenSobrantes = async (req, res) => {
  try {
    const { id } = req.params;
    const { componentesAsignados, sobrantes, componenteSobrantes } = req.body;

    const componentesIds = await Promise.all(componentesAsignados.map(async (serial) => {
      const componente = await Componente.findOne({ serialComponente: serial });
      if (!componente) {
        throw new Error(`Componente con serial ${serial} no encontrado`);
      }
      return componente._id;
    }));

    const ordenActualizada = await Orden.findByIdAndUpdate(
      id,
      { 
        componentes: componentesIds, 
        sobrantes, 
        componenteSobrantes // Asegúrate de que este campo sea el correcto
      },
      { new: true }
    ).populate('usuario').populate('componentes');

    if (!ordenActualizada) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error('Error al actualizar la orden:', error.message);
    res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
  }
};



