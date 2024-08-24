import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import recordatorioRoutes from './routes/recordatorio.routes.js';
import userRoutes from './routes/user.routes.js';
import maquinaRoutes from './routes/maquinas.routes.js';
import casinosRoutes from './routes/casinos.routes.js';
import componenteRoutes from './routes/componente.routes.js';
import mantenimientoRoutes from './routes/mantenimiento.routes.js';
import movimientosCRoutes from './routes/movimientosC.routes.js';
import moviMaquinasRoutes from './routes/moviMaquinas.routes.js';
import ordenRoutes from './routes/orden.routes.js';
import elementosRoutes from './routes/elementos.routes.js'; // Importa las rutas de elementos

const app = express();

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './upload',
}));
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', recordatorioRoutes);
app.use('/api', userRoutes);
app.use('/api', maquinaRoutes);
app.use('/api', casinosRoutes);
app.use('/api', componenteRoutes);
app.use('/api', mantenimientoRoutes);
app.use('/api', movimientosCRoutes);
app.use('/api', moviMaquinasRoutes);
app.use('/api', ordenRoutes); 
app.use('/api', elementosRoutes); // Agrega las rutas de elementos
// Middleware para servir archivos estáticos
app.use('/upload', express.static(path.join(__dirname, 'upload')));

export default app;
