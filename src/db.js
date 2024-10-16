import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://jsopalsa2024:opalsa2024@opalsa.tvnbtja.mongodb.net/");
        console.log("DB is connected - Conectado a la DB MongoAtlas");
    } catch (error) {
        console.log(error);
    }
};