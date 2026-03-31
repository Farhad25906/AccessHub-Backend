import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { UserService } from '../services/user.service';

import { AuditLogService } from '../services/audit.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  // Log action
  await AuditLogService.createAuditLog(req.user?.userId || null, `Created user: ${result.email}`);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: result
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await UserService.updateUser(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await UserService.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully'
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};
