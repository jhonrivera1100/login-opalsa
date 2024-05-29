import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/auth.routes.js';
import recordatorioRoutes from './routes/recordatorio.routes.js';
import userRoutes from './routes/user.routes.js';
import maquinaRoutes from './routes/maquinas.routes.js';
import componenteRoutes from './routes/componente.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './upload',
}))
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', recordatorioRoutes);
app.use('/api', userRoutes);
app.use('/api', maquinaRoutes);
app.use("/api", componenteRoutes);

export default app