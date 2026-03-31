import httpStatus from 'http-status';
import prisma from '../utils/prisma';
import { AuditLogService } from './audit.service';

const getUserPermissions = async (userId: string): Promise<string[]> => {
  // 1. Get user with their role and its permissions
  const user = await prisma.user.findUnique({
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

  // Role permissions
  const rolePermissions = user?.role?.permissions.map(
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

  // 4. Admin bypass: If user is an Admin, they get ALL permissions regardless
  if (user?.role?.name === 'Admin') {
    const systemPermissions = await prisma.permission.findMany();
    return systemPermissions.map(p => p.name);
  }

  return allPermissions;
};

const getAllPermissions = async () => {
  return await prisma.permission.findMany();
};

const assignPermissionsToUser = async (
  assignerId: string, 
  payload: { targetUserId: string, permissions: string[] }
) => {
  const { targetUserId, permissions } = payload;
  
  // 1. Get Assigner permissions (Grant Ceiling)
  const assignerPermissions = await getUserPermissions(assignerId);
  
  // 2. Validate all permissions exist and assigner has them
  const permissionRecords = await prisma.permission.findMany({
    where: { name: { in: permissions } }
  });

  if (permissionRecords.length !== permissions.length) {
    throw { statusCode: httpStatus.NOT_FOUND, message: 'One or more permissions not found' };
  }

  for (const pName of permissions) {
    if (!assignerPermissions.includes(pName)) {
      throw { 
        statusCode: httpStatus.FORBIDDEN, 
        message: `Grant Ceiling: You cannot assign '${pName}' as you do not possess it.` 
      };
    }
  }

  // 3. Perform assignments (using transaction for safety)
  const result = await prisma.$transaction(
    permissionRecords.map(p => 
      prisma.userPermission.upsert({
        where: { userId_permissionId: { userId: targetUserId, permissionId: p.id } },
        update: {},
        create: { userId: targetUserId, permissionId: p.id }
      })
    )
  );

  // 4. Audit Log
  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  await AuditLogService.createAuditLog(
    assignerId, 
    `Assigned permissions [${permissions.join(', ')}] to user ${targetUser?.email}`
  );

  return result;
};

const removePermissionsFromUser = async (
  removerId: string,
  payload: { targetUserId: string, permissions: string[] }
) => {
  const { targetUserId, permissions } = payload;

  const permissionRecords = await prisma.permission.findMany({
    where: { name: { in: permissions } }
  });

  const result = await prisma.userPermission.deleteMany({
    where: {
      userId: targetUserId,
      permissionId: { in: permissionRecords.map(p => p.id) }
    }
  });

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  await AuditLogService.createAuditLog(
    removerId, 
    `Removed permissions [${permissions.join(', ')}] from user ${targetUser?.email}`
  );

  return result;
};

export const PermissionService = {
  getUserPermissions,
  getAllPermissions,
  assignPermissionsToUser,
  removePermissionsFromUser
};
