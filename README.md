# AccessHub - Backend API 🛡️⚙️

Secure, permission-driven Role-Based Access Control (RBAC) system backend.

## 🔗 Repository & Deployment
- **GitHub Repository**: [https://github.com/Farhad25906/AccessHub-Backend](https://github.com/Farhad25906/AccessHub-Backend)
- **Base API URL**: [https://access-hub-backend.vercel.app/api](https://access-hub-backend.vercel.app/api)

## 🚀 Technologies
- **Core**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Neon.tech)
- **ORM**: Prisma
- **Authentication**: JWT (Access Token + HTTP-only Refresh Token)
- **Validation**: Role-agnostic permission atoms

## ✨ Key Features
- **Dynamic Permission System**: Granular "permission atoms" control all actions and data access.
- **Admin Privilege Bypass**: Users with the "Admin" role automatically inherent all system permissions.
- **Grant Ceiling Enforcement**: Security layer preventing users from assigning permissions they don't possess.
- **Refresh Token Rotation**: Secure session management using HTTP-only cookies in production.
- **Audit Logging**: Traceability for all security-sensitive operations.
- **Modular Architecture**: Layered service-controller pattern for scalability.

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Farhad25906/AccessHub-Backend.git
   cd AccessHub-Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="your-postgresql-url"
   JWT_SECRET="your-access-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Database Migration & Seeding**:
   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🔐 API Endpoints Summary

- **Auth**:
  - `POST /api/auth/login` (Login & get Refresh Cookie)
  - `POST /api/auth/refresh-token` (Rotate Access Token)
  - `GET /api/auth/me` (Get Current Profile)
  - `POST /api/auth/logout` (Clear Cookies)

- **Users**:
  - `GET /api/users` (List all users)
  - `POST /api/users` (Create new user - Admin/Manager only)
  - `PATCH /api/users/:id` (Update role/data)
  - `DELETE /api/users/:id` (Remove user)

- **Permissions**:
  - `GET /api/permissions` (List all system permission atoms)
  - `GET /api/permissions/user/:id` (Get specific user's permissions)
  - `POST /api/permissions/assign` (Dynamically assign permissions)
  - `GET /api/permissions/audit-logs` (View security history)

---
Developed by [Farhad](https://github.com/Farhad25906)
