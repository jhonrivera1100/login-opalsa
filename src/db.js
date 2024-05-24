import mongoose from "mongoose";

export const connectDB= async () =>{
    try{
await mongoose.connect("mongodb+srv://jsopalsa2024:opal54areasoft@opalsa.tvnbtja.mongodb.net/");
console.log("DB is conected");
    }
    catch (error){
        console.log(error);
    }
};