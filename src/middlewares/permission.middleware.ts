import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { PermissionService } from '../services/permission.service';

const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw { statusCode: httpStatus.UNAUTHORIZED, message: 'Unauthorized' };
      }

      const permissions = await PermissionService.getUserPermissions(user.userId);
      
      if (!permissions.includes(permission)) {
        throw { statusCode: httpStatus.FORBIDDEN, message: 'You do not have permission to perform this action' };
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkPermission;
