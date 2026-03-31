import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import prisma from '../utils/prisma';
import { PermissionService } from '../services/permission.service';

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw { statusCode: httpStatus.UNAUTHORIZED, message: 'Unauthorized' };
  }

  const result = await prisma.user.findUnique({
    where: { id: user.userId },
    include: { role: true }
  });

  const permissions = await PermissionService.getUserPermissions(user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: {
      ...result,
      permissions
    }
  });
});

// Update AuthController to include getMe
export const AuthControllerExtensions = {
  getMe
};
