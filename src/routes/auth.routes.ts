import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import auth from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logoutUser);
router.get('/me', auth(), AuthController.getMe);

export const AuthRoutes = router;
