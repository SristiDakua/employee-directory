# 🚀 Employee Directory Application

A full-stack **MERN + GraphQL** application to manage employee records across departments with advanced filtering, responsive UI, and a fully functional GraphQL API.

---

## 📌 Features

* 🔍 **Employee Listing** – View all employees with name & position
* 🏢 **Department Filter** – Dynamically filter employees by department
* ➕ **Add Employee** – Add new employees using a validated form
* 📱 **Responsive UI** – Built with Tailwind CSS & shadcn/ui
* ⚡ **GraphQL API** – Powered by Apollo Server for efficient querying
* 🛢 **MongoDB Integration** – Uses native driver (no Mongoose)

---

## 🛠️ Tech Stack

### 🧩 Backend

* **Node.js**
* **Apollo Server 4**
* **GraphQL**
* **MongoDB** (native driver – no Mongoose)

### 🌐 Frontend

* **Next.js 14** (App Router)
* **Apollo Client**
* **Tailwind CSS**
* **shadcn/ui**
* **TypeScript**

---

## 📦 Getting Started

### ✅ Prerequisites

* Node.js **v18+**
* MongoDB (local instance or Atlas)
* `pnpm` (preferred) or `npm`

---

### 📥 Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or with npm
npm install
```

---

### 🔌 MongoDB Setup & Connection

This application features **robust MongoDB connection handling** with automatic retries, health checks, and support for both local and cloud configurations.

#### Option 1: Local MongoDB (Recommended for Development)

```bash
# Using Docker (easiest)
docker run --name mongodb -p 27017:27017 -d mongo:latest

# Or install MongoDB locally
# Windows: Download from mongodb.com
# macOS: brew install mongodb/brew/mongodb-community
# Linux: Follow MongoDB installation guide
```

#### Option 2: MongoDB Atlas (Cloud)

1. Create account: [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and get your connection string
3. Whitelist your IP address
4. Create database user with read/write permissions

#### Connection Features

✅ **Automatic retry logic** (up to 3 attempts with exponential backoff)  
✅ **Connection health checks** and automatic reconnection  
✅ **Graceful shutdown** handling  
✅ **Support for both Atlas and local MongoDB**  
✅ **Connection pooling** for optimal performance  
✅ **Environment-based configuration** with fallbacks

#### Troubleshooting Connection Issues

**Node.js v22 + MongoDB Atlas SSL Issues:**
If you encounter SSL/TLS errors with Node.js v22, consider:
- Use Node.js v20 (LTS) or v18 for better compatibility
- Or use local MongoDB for development

**Connection Timeout:**
- Check firewall settings
- Verify MongoDB is running (local) or IP is whitelisted (Atlas)
- Ensure credentials are correct

---

### ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_DB=employee_directory

# For Local MongoDB (recommended for development)
MONGODB_URI=mongodb://localhost:27017

# For MongoDB Atlas (production/cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/

# Note: The connection will automatically detect Atlas vs Local
# and apply appropriate SSL/TLS settings
```

**Environment Variable Details:**
- `MONGODB_URI`: Connection string (defaults to `mongodb://localhost:27017`)
- `MONGODB_DB`: Database name (defaults to `employee_directory`)

**Auto-Configuration:**
- Detects Atlas (`mongodb+srv://`) vs Local (`mongodb://`) automatically
- Applies appropriate SSL/TLS settings based on connection type
- Includes retry logic and connection pooling out of the box

---

### 🌱 Database Seeding

The application **automatically seeds sample data** on first connection:

**Automatic Seeding:**
- Runs automatically when the app starts and connects to MongoDB
- Creates database indexes for optimal performance
- Seeds sample employees and departments if none exist
- Skips seeding if data already exists

**Manual Seeding (Optional):**
```bash
# Use the dedicated seeding script
npm run seed

# Or run directly
node scripts/seed-database.js
```

**Sample Data Includes:**
- 11 employees across 5 departments
- 5 departments (Engineering, Marketing, Sales, HR, Finance)
- Optimized database indexes for fast queries

---

## 🚀 Run the Application

### In Development

```bash
pnpm dev
```

### For Production

```bash
pnpm build
pnpm start
```

App will be available at:
📍 [http://localhost:3000](http://localhost:3000)

---

## 🧠 GraphQL API Overview

### 📘 Schema Types

* `Employee`: `id`, `name`, `position`, `department`, `salary`
* `CompanyDepartment`: `id`, `name`, `floor`

### 📚 Queries

| Name                                   | Description                                 |
| -------------------------------------- | ------------------------------------------- |
| `getAllEmployees`                      | Returns all employees (name + position)     |
| `getEmployeeDetails(id)`               | Returns full details of a specific employee |
| `getEmployeesByDepartment(department)` | Filter employees by department              |

### ✍️ Mutations

| Name               | Description                           |
| ------------------ | ------------------------------------- |
| `addEmployee(...)` | Adds a new employee with input fields |

GraphQL Playground URL (during dev):
📍 `http://localhost:3000/api/graphql`

---

## 🗂️ Project Structure

```
employee-directory/
├── app/
│   ├── page.tsx                 # Home page
│   ├── employee/[id]/page.tsx   # Employee detail page
│   ├── api/graphql/route.ts     # GraphQL API route
│   └── layout.tsx               # Root layout
├── components/
│   ├── EmployeeTable.tsx
│   ├── DepartmentFilter.tsx
│   └── AddEmployeeForm.tsx
├── lib/
│   ├── apollo-client.ts         # Apollo Client setup
│   ├── mongodb.ts               # DB connection logic
│   ├── queries.ts               # GraphQL operations
│   └── graphql/
│       ├── schema.ts            # GraphQL typeDefs
│       └── resolvers.ts         # GraphQL resolvers
├── scripts/
│   └── seed-database.js
├── .env.example
└── README.md
```

---

## ✅ Feature Checklist

* ✅ Fully functional GraphQL API
* ✅ Clean component structure
* ✅ Apollo Client with caching
* ✅ MongoDB data seeding
* ✅ Department-based filtering
* ✅ Client-side form validation
* ✅ Error handling (frontend + backend)
* ✅ Mobile-responsive layout
* ✅ Modern UI using Tailwind + shadcn
* ✅ Loading states for UX polish

---

## 🌍 Deployment

You can deploy the app on **Vercel** with MongoDB Atlas:

1. Push the project to **GitHub**
2. Connect repo to **[Vercel](https://vercel.com/)**
3. Set `MONGODB_URI` and `MONGODB_DB` in Vercel's environment settings
4. Deploy 🚀

---