import express from 'express';
import { AuthRoutes } from './auth.routes';
import { UserRoutes } from './user.routes';
import { PermissionRoutes } from './permission.routes';
import { AuditLogRoutes } from './audit.routes';
import { RoleRoutes } from './role.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/users',
    route: UserRoutes
  },
  {
    path: '/permissions',
    route: PermissionRoutes
  },
  {
    path: '/audit-logs',
    route: AuditLogRoutes
  },
  {
    path: '/roles',
    route: RoleRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
