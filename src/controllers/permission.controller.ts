import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { PermissionService } from '../services/permission.service';

const assignPermission = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const result = await PermissionService.assignPermissionToUser(adminId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Permission assigned successfully',
    data: result
  });
});

const removePermission = catchAsync(async (req: Request, res: Response) => {
  const { userId, permissionId } = req.body;
  await PermissionService.removePermissionFromUser(userId, permissionId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Permission removed successfully'
  });
});

export const PermissionController = {
  assignPermission,
  removePermission
};
