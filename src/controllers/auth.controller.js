import  User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';


export const register = async (req, res) => {
  const { email, password, username, cedula, cargo, ciudad } = req.body;
  try {
    const emailFound = await User.findOne({ email });
    const usernameFound = await User.findOne({ username });

    if (emailFound) {
      return res.status(400).json(["El email ya está en uso"]);
    }

    if (usernameFound) {
      return res.status(400).json(["El nombre de usuario ya está en uso"]);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      cedula,
      cargo,
      ciudad,
    });
    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      cedula: userSaved.cedula,
      cargo: userSaved.cargo,
      ciudad: userSaved.ciudad,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
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


export const verifyToken = async (req,res) =>{
  const {token} = req.cookies 
  if (!token) return res.status(401).json({ message: "Unauthorized"});
  
  jwt.verify(token,TOKEN_SECRET, async (err, user)=>{
  if (err) return res.status(401).json({ message: "Unauthorized"});
const userFound = await User.findById(user.id)
if(!userFound) return res.status(401).json({ message:"Unauthorized"});

return res.json({
  id: userFound._id,
  username: userFound.username,
  email: userFound.email,
  cedula: userFound.cedula,
  cargo: userFound.cargo,
  ciudad: userFound.ciudad,
  createdAt: userFound.createdAt,
  updateAt: userFound.updatedAt,
});
});
}

