import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import prisma from '../utils/prisma';

const getAllRoles = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
    }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Roles retrieved successfully',
    data: result
  });
});

export const RoleController = {
  getAllRoles
};
