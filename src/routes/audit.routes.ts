import express from 'express';
import { AuditLogController } from '../controllers/audit.controller';
import auth from '../middlewares/auth.middleware';
import checkPermission from '../middlewares/permission.middleware';

const router = express.Router();

router.get('/', auth(), checkPermission('view_audit_logs'), AuditLogController.getAllAuditLogs);

export const AuditLogRoutes = router;
