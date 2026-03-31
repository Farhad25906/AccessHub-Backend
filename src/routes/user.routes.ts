import express from 'express';
import { UserController } from '../controllers/user.controller';
import auth from '../middlewares/auth.middleware';
import checkPermission from '../middlewares/permission.middleware';

const router = express.Router();

router.post('/', auth(), checkPermission('create_users'), UserController.createUser);
router.get('/', auth(), checkPermission('view_users'), UserController.getAllUsers);
router.patch('/:id', auth(), checkPermission('edit_users'), UserController.updateUser);
router.delete('/:id', auth(), checkPermission('delete_users'), UserController.deleteUser);

export const UserRoutes = router;
