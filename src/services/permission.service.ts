import httpStatus from 'http-status';
import prisma from '../utils/prisma';

const getUserPermissions = async (userId: string): Promise<string[]> => {
  // 1. Get permissions from roles
  const userWithRolePermissions = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      }
    }
  });

  const rolePermissions = userWithRolePermissions?.role?.permissions.map(
    (rp) => rp.permission.name
  ) || [];

  // 2. Get direct permissions
  const directPermissions = await prisma.userPermission.findMany({
    where: { userId },
    include: {
      permission: true
    }
  });

  const directPermissionNames = directPermissions.map((dp) => dp.permission.name);

  // 3. Merge and remove duplicates
  const allPermissions = Array.from(new Set([...rolePermissions, ...directPermissionNames]));

  return allPermissions;
};

const assignPermissionToUser = async (adminId: string, payload: { userId: string, permissionId: string }) => {
  const { userId, permissionId } = payload;
  
  // 1. Get Permission Name
  const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
  if (!permission) throw { statusCode: httpStatus.NOT_FOUND, message: 'Permission not found' };

  // 2. Grant Ceiling Check
  const adminPermissions = await getUserPermissions(adminId);
  if (!adminPermissions.includes(permission.name)) {
    throw { statusCode: httpStatus.FORBIDDEN, message: 'Grant Ceiling: You cannot assign a permission you do not possess' };
  }

  // 3. Assign
  return await prisma.userPermission.create({
    data: { userId, permissionId }
  });
};

const removePermissionFromUser = async (userId: string, permissionId: string) => {
  return await prisma.userPermission.delete({
    where: {
      userId_permissionId: { userId, permissionId }
    }
  });
};

export const PermissionService = {
  getUserPermissions,
  assignPermissionToUser,
  removePermissionFromUser
};
