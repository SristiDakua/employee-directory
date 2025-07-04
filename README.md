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

### 🔌 MongoDB Setup

#### Option 1: Local MongoDB

```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

#### Option 2: MongoDB Atlas

* Create an account: [MongoDB Atlas](https://www.mongodb.com/atlas)
* Create a cluster and get your connection string

---

### ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=employee_directory

# Or for Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
```

---

### 🌱 Seed the Database

```bash
# Automatically populate sample employees and departments
npm run seed

# Or run directly
node scripts/seed-database.js
```

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