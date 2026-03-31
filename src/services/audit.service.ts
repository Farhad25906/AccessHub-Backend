import prisma from '../utils/prisma';

const createAuditLog = async (userId: string | null, action: string) => {
  return await prisma.auditLog.create({
    data: {
      userId,
      action
    }
  });
};

const getAllAuditLogs = async () => {
  return await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          email: true
        }
      }
    },
    orderBy: {
      timestamp: 'desc'
    }
  });
};

export const AuditLogService = {
  createAuditLog,
  getAllAuditLogs
};
