import  User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';


export const register = async (req, res) => {
  const { email, password, username, cedula, cargo, ciudad, role = 'user' } = req.body;
  try {
    console.log('Datos recibidos:', { email, password, username, cedula, cargo, ciudad, role });

    const emailFound = await User.findOne({ email });
    const usernameFound = await User.findOne({ username });

    if (emailFound) {
      console.log('El email ya está en uso');
      return res.status(400).json(["El email ya está en uso"]);
    }

    if (usernameFound) {
      console.log('El nombre de usuario ya está en uso');
      return res.status(400).json(["El nombre de usuario ya está en uso"]);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Password hash generado:', passwordHash);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      cedula,
      cargo,
      ciudad,
      role,
    });

    const userSaved = await newUser.save();
    console.log('Usuario guardado:', userSaved);

    const token = await createAccessToken({ id: userSaved._id });
    console.log('Token creado:', token);

    res.cookie("token", token);

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      cedula: userSaved.cedula,
      cargo: userSaved.cargo,
      ciudad: userSaved.ciudad,
      role: userSaved.role,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req,res) =>  {
  const{email,password} = req.body;
try {
const userFound = await User.findOne({email})
if(!userFound) return res.status(400).json({message: "user not found "});

const isMatch = await bcrypt.compare(password,userFound.password) 
if (!isMatch) return res.status(400).json({message:"incorrect password"});
    const token = await createAccessToken({id:userFound._id})
    res.cookie("token",token)
    res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        role: userFound.role,
        createdAt: userFound.createdAt,
        updateAt: userFound.updatedAt,
})   
} catch (error) {
    res.status(500).json({message: error.message});
}
};

export const logout = (req,res) =>{
  res.cookie('token',"",{
    expires: new Date(0)
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) =>{
 const userFound = await User.findById(req.user.id)
 if(!userFound) return res.status(400).json({message:"user not found"});
 return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        cedula: userFound.cedula,
        cargo: userFound.cargo,
        ciudad: userFound.ciudad,
        role:userFound.role,
        createdAt: userFound.createdAt,
        updateAt: userFound.updatedAt,
 })
};
export const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ count: userCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};