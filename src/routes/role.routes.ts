import express from 'express';
import { RoleController } from '../controllers/role.controller';
import auth from '../middlewares/auth.middleware';

const router = express.Router();

// We allow any authenticated user to fetch roles (or specifically users with create_users permission).
// To keep it simple, just auth() is enough for dropdown population.
router.get('/', auth(), RoleController.getAllRoles);

export const RoleRoutes = router;
