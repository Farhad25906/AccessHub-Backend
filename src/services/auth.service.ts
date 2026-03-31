
import httpStatus from 'http-status';
import config from '../config';
import { jwtHelpers } from '../utils/jwtHelpers';
import prisma from '../utils/prisma';
import { authUtils } from '../utils/authUtils';
import { PermissionService } from './permission.service';

const loginUser = async (payload: any) => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!isUserExist) {
    throw { statusCode: httpStatus.NOT_FOUND, message: 'User does not exist' };
  }

  const isPasswordMatched = await authUtils.comparePassword(password, isUserExist.password);
  if (!isPasswordMatched) {
    throw { statusCode: httpStatus.UNAUTHORIZED, message: 'Invalid password' };
  }

  const { id: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role: role?.name },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role: role?.name },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  const permissions = await PermissionService.getUserPermissions(userId);

  return {
    accessToken,
    refreshToken,
    permissions
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.refresh_secret as string);
  } catch (err) {
    throw { statusCode: httpStatus.FORBIDDEN, message: 'Invalid Refresh Token' };
  }

  const { userId } = verifiedToken;

  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true }
  });

  if (!isUserExist) {
    throw { statusCode: httpStatus.NOT_FOUND, message: 'User does not exist' };
  }

  const newAccessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role?.name },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken
  };
};

export const AuthService = {
  loginUser,
  refreshToken
};
