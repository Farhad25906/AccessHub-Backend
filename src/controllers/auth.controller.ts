import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { AuthService } from '../services/auth.service';
import config from '../config';
import prisma from '../utils/prisma';
import { PermissionService } from '../services/permission.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken, permissions } = result;

  // Set refresh token in cookie
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions: any = {
    secure: true, // Always true for Vercel/HTTPS
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax', // Must be 'none' for cross-site (+ secure: true)
    path: '/'
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken, permissions }
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully',
    data: result
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    secure: config.env === 'production',
    httpOnly: true,
    sameSite: config.env === 'production' ? 'none' : 'lax',
    path: '/'
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully'
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
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

export const AuthController = {
  loginUser,
  refreshToken,
  logoutUser,
  getMe
};
