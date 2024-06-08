import Componente from "../models/componente.model.js";
import Maquinas from "../models/maquina.model.js";

// Obtener todos los componentes
export const getComponentes = async (req, res) => {
  try {
    const componentes = await Componente.find();
    res.json(componentes);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar los componentes', error: error.message });
  }
};

// Obtener un componente por ID
export const getComponenteById = async (req, res) => {
  try {
    const componente = await Componente.findById(req.params.id);
    if (!componente) return res.status(404).json({ message: 'Componente no encontrado' });
    res.json(componente);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar el componente', error: error.message });
  }
};

// Crear un componente
export const createComponente = async (req, res) => {
  const { serialComponente, nombreComponente, marcaComponente, documentoComponente, maquina } = req.body;

  try {
    const nuevoComponente = new Componente({
      serialComponente,
      nombreComponente,
      marcaComponente,
      documentoComponente,
      maquina,
    });

    const componenteGuardado = await nuevoComponente.save();

    // Actualizar la máquina para agregar el nuevo componente
    const maquinaRelacionada = await Maquinas.findById(maquina);
    if (maquinaRelacionada) {
      maquinaRelacionada.componentes.push(componenteGuardado._id);
      await maquinaRelacionada.save();
    }

    res.status(201).json(componenteGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el componente', error });
  }
};

// Actualizar un componente por ID
export const updateComponenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const { maquina: nuevaMaquina } = req.body;

    // Obtener el componente actual
    const componente = await Componente.findById(id);
    if (!componente) return res.status(404).json({ message: 'Componente no encontrado' });

    // Si la máquina está cambiando, actualizar las máquinas involucradas
    if (componente.maquina.toString() !== nuevaMaquina) {
      // Remover el componente de la máquina actual
      const maquinaActual = await Maquinas.findById(componente.maquina);
      if (maquinaActual) {
        maquinaActual.componentes.pull(componente._id);
        await maquinaActual.save();
      }

      // Agregar el componente a la nueva máquina
      const maquinaNueva = await Maquinas.findById(nuevaMaquina);
      if (maquinaNueva) {
        maquinaNueva.componentes.push(componente._id);
        await maquinaNueva.save();
      }
    }

    // Actualizar el componente con la nueva máquina
    componente.maquina = nuevaMaquina;
    const componenteActualizado = await componente.save();

    res.json(componenteActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el componente', error });
  }
};

// Eliminar un componente por ID
export const deleteComponenteById = async (req, res) => {
  try {
    const componenteEliminado = await Componente.findByIdAndDelete(req.params.id);
    if (!componenteEliminado) return res.status(404).json({ message: 'Componente no encontrado' });

    // Actualizar la máquina para eliminar la referencia del componente eliminado
    const maquinaRelacionada = await Maquinas.findById(componenteEliminado.maquina);
    if (maquinaRelacionada) {
      maquinaRelacionada.componentes.pull(componenteEliminado._id);
      await maquinaRelacionada.save();
    }

    res.json(componenteEliminado);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el componente', error });
  }
};
