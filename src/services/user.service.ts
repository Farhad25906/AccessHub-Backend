
import httpStatus from 'http-status';
import prisma from '../utils/prisma';
import { authUtils } from '../utils/authUtils';

const createUser = async (data: any) => {
  const { password, ...userData } = data;
  const hashedPassword = await authUtils.hashPassword(password);
  
  const result = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    },
    include: { role: true }
  });
  
  return result;
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: { role: true }
  });
};

const updateUser = async (id: string, data: any) => {
  if (data.password) {
    data.password = await authUtils.hashPassword(data.password);
  }
  
  return await prisma.user.update({
    where: { id },
    data,
    include: { role: true }
  });
};

const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id }
  });
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};
