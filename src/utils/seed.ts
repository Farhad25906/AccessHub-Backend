import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('Checking database seed status...');
  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'admin@example.com' }
  });

  if (existingAdmin) {
    console.log('✅ Database already seeded. Skipping initial seed.');
    return;
  }

  console.log('Seeding database...');

  // 1. Create Permissions
  const permissions = [
    'view_users', 'create_users', 'edit_users', 'delete_users',
    'view_reports', 'manage_tasks', 'view_audit_logs'
  ];

  const createdPermissions = await Promise.all(
    permissions.map(p => prisma.permission.upsert({
      where: { name: p },
      update: {},
      create: { name: p }
    }))
  );

  console.log('Permissions created.');

  // 2. Create Roles
  const roles = ['Admin', 'Manager', 'Agent', 'Customer'];
  const createdRoles = await Promise.all(
    roles.map((r: string) => prisma.role.upsert({
      where: { name: r },
      update: {},
      create: { name: r }
    }))
  );

  console.log('Roles created.');

  // 3. Assign All Permissions to Admin Role
  const adminRole = createdRoles.find((r: any) => r.name === 'Admin');
  if (adminRole) {
    await Promise.all(
      createdPermissions.map((p: any) => prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: p.id
          }
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: p.id
        }
      }))
    );
  }

  console.log('Admin permissions assigned.');

  // 4. Create First Admin User
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole?.id
    }
  });

  console.log('First admin user created: admin@example.com / admin123');

  console.log('Seeding completed.');
}
