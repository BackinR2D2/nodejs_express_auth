import {Router} from 'express';
import login from '../../controllers/auth/login.js';
const router = Router();

router.post('/auth/login', login);

export default router;