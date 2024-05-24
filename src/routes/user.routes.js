import { Router } from 'express';
import { deleteUsers, getUsers } from '../controllers/user.controller.js';

const router = Router();

router.get('/users', getUsers);
router.delete('/users/:id', deleteUsers);

export default router;