import express from 'express';
import { PermissionController } from '../controllers/permission.controller';
import auth from '../middlewares/auth.middleware';
import checkPermission from '../middlewares/permission.middleware';

const router = express.Router();

router.get('/', auth(), checkPermission('view_users'), PermissionController.getAllPermissions);
router.get('/user/:userId', auth(), checkPermission('view_users'), PermissionController.getUserPermissions);
router.post('/assign', auth(), checkPermission('edit_users'), PermissionController.assignPermissions);
router.post('/remove', auth(), checkPermission('edit_users'), PermissionController.removePermissions);

export const PermissionRoutes = router;
