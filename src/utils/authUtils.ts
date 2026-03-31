import bcrypt from 'bcryptjs';
import config from '../config';

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.bcrypt_salt_rounds);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const authUtils = {
  hashPassword,
  comparePassword
};
