import mongoose from "mongoose";

export const connectDB= async () =>{
    try{
await mongoose.connect('mongodb+srv://jsopalsa2024:opal54areasoft@opalsa.tvnbtja.mongodb.net/');
console.log("Conectado a la DB MongoAtlas");
    }
    catch (error){
        console.log(error);
    }
};