import mongoose from "mongoose";
export const connectDB= async () =>{
    try{
await mongoose.connect('mongodb://localhost/opalsadb');
console.log("DB is conected");
    }
    catch (error){
        console.log(error);
    }
};