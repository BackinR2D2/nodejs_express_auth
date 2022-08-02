import {Router} from 'express';
import userController from '../../controllers/user/index.js';
import auth from '../../helpers/auth/verifyToken.js';
const router = Router();

router.get('/user', auth, userController.getUserData);
router.put('/user/username', auth, userController.updateUsername);
router.put('/user/password', auth, userController.updatePassword);
router.delete('/user', auth, userController.deleteUser);

export default router;