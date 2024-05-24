import express from "express";
import morgan from "morgan";
import authRoutes from './routes/auth.routes.js';
import recordatorioRoutes from './routes/recordatorio.routes.js';
import userRoutes from './routes/user.routes.js';
import maquinaRoutes from './routes/maquinas.routes.js';
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();  

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", recordatorioRoutes); 
app.use("/api", userRoutes);
app.use("/api", maquinaRoutes);

export default app;