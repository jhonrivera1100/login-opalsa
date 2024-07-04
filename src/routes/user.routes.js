import { Router } from 'express';
import { deleteUsers, getUsers, updateProfile} from '../controllers/user.controller.js';

const router = Router();

router.get('/users', getUsers);
router.delete('/users/:id', deleteUsers);
router.put('/users/:id', updateProfile);

export default router;