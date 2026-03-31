import jwt, { Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime as any // Force cast to avoid type issues with older declarations
  });
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as any;
};

export const jwtHelpers = {
  createToken,
  verifyToken
};
