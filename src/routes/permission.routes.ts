import express from 'express';
import { PermissionController } from '../controllers/permission.controller';
import auth from '../middlewares/auth.middleware';
import checkPermission from '../middlewares/permission.middleware';

const router = express.Router();

router.post('/assign', auth(), checkPermission('edit_users'), PermissionController.assignPermission);
router.delete('/remove', auth(), checkPermission('edit_users'), PermissionController.removePermission);

export const PermissionRoutes = router;
