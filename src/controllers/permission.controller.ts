import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { PermissionService } from '../services/permission.service';

const assignPermissions = catchAsync(async (req: Request, res: Response) => {
  const assignerId = req.user.userId;
  const result = await PermissionService.assignPermissionsToUser(assignerId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Permissions assigned successfully',
    data: result
  });
});

const removePermissions = catchAsync(async (req: Request, res: Response) => {
  const removerId = req.user.userId;
  await PermissionService.removePermissionsFromUser(removerId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Permissions removed successfully'
  });
});

const getAllPermissions = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.getAllPermissions();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Permissions retrieved successfully',
    data: result
  });
});

const getUserPermissions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const result = await PermissionService.getUserPermissions(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User permissions retrieved successfully',
    data: result
  });
});

export const PermissionController = {
  assignPermissions,
  removePermissions,
  getAllPermissions,
  getUserPermissions
};
