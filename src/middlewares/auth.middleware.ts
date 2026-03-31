import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../config';
import { jwtHelpers } from '../utils/jwtHelpers';

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get authorization token
      let token = req.headers.authorization;
      if (!token) {
        throw { statusCode: httpStatus.UNAUTHORIZED, message: 'You are not authorized' };
      }

      // Handle Bearer prefix
      if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }

      // Verify token
      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser; // userId, role

      // Role guard (optional, as we are permission-driven, but good to have)
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw { statusCode: httpStatus.FORBIDDEN, message: 'Forbidden' };
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
