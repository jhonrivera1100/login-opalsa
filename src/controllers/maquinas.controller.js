import Maquinas from "../models/maquina.model.js";

export const traerMaquinas = async (req, res) => {
  try {
    const maquinas = await Maquinas.find();
    res.json(maquinas);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar las máquinas', error: error.message });
  }
};

export const traerMaquina = async (req, res) => {
  const maquina = await Maquinas.findById(req.params.id)
  if (!maquina) return res.status(404).json({message: 'No la maquina'})
  res.json(maquina)
};
export const crearMaquina = async (req, res) => {
  const {
    nroSerieMaquina,
    nombreMaquina,
    modeloMaquina,
    marcaMaquina,
    softwareMaquina,
    juegoMaquina,
    estadoMaquina,
    imgMaquina,
    descripcionMaquina,
    ubicacionMaquina,
    fechaInstalacionMaquina,
    proveedorMaquina,
  } = req.body

  const newMaquina = new Maquinas({
    nroSerieMaquina,
    nombreMaquina,
    modeloMaquina,
    marcaMaquina,
    softwareMaquina,
    juegoMaquina,
    estadoMaquina,
    imgMaquina,
    descripcionMaquina,
    ubicacionMaquina,
    fechaInstalacionMaquina,
    proveedorMaquina,
    user: req.user.id
  })
  const maquinaGuardada= await newMaquina.save()
  res.json(maquinaGuardada)
};
export const actualizarMaquina = async (req, res) => {
  const maquina = await Maquinas.findByIdAndUpdate(req.params.id, req.body, {
    new:true
  })
  if (!maquina) return res.status(404).json({message: 'No se encuentra la maquina'})
  res.json(maquina)
};
export const eliminarMaquina = async (req, res) => {
  const maquina = await Maquinas.findByIdAndDelete(req.params.id)
  if (!maquina) return res.status(404).json({message: 'No se encuentra la maquina'})
  res.json(maquina)
};

