# 🚀 Employee Directory Application

A full-stack **MERN + GraphQL** application to manage employee records across departments. Features include advanced filtering, a responsive UI, and a fully functional GraphQL API.

---

## 📌 Features

* 🔍 **Employee Listing** – View all employees with their name and position
* 🏢 **Department Filter** – Dynamically filter employees by department
* ➕ **Add Employee** – Add new employees via a validated form
* 📱 **Responsive UI** – Optimized for mobile and desktop with Tailwind CSS & shadcn/ui
* ⚡ **GraphQL API** – Efficient querying with Apollo Server
* 🛢 **MongoDB Integration** – Uses the native MongoDB driver (no Mongoose)

---

## 🛠️ Tech Stack

### 🧩 Backend

* **Node.js**
* **Apollo Server 4**
* **GraphQL**
* **MongoDB** (Native driver)

### 🌐 Frontend

* **Next.js 14** (App Router)
* **Apollo Client**
* **Tailwind CSS**
* **shadcn/ui**
* **TypeScript**

---

## 📦 Getting Started

### ✅ Prerequisites

Ensure you have the following installed:

* Node.js **v18+**
* MongoDB (local or Atlas)
* `pnpm` (preferred) or `npm`

---

### 📥 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/employee-directory.git
cd employee-directory
```

2. **Install dependencies**

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

3. **Set up environment variables**

Create a `.env.local` file:

```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=employee_directory
```

4. **Seed the database**

```bash
node scripts/seed-database.js
```

5. **Start the development server**

```bash
npm run dev
```

6. Open your browser at [http://localhost:3000](http://localhost:3000)

---

## 🧠 GraphQL API Overview

### 📘 Schema Types

* **Employee**: `id`, `name`, `position`, `department`, `salary`
* **CompanyDepartment**: `id`, `name`, `floor`

---

### 📚 Queries

| Query                                           | Description                                 |
| ----------------------------------------------- | ------------------------------------------- |
| `getAllEmployees`                               | Returns all employees (name + position)     |
| `getEmployeeDetails(id: ID!)`                   | Returns full details of a specific employee |
| `getEmployeesByDepartment(department: String!)` | Filters employees by department             |

---

### ✍️ Mutations

| Mutation             | Description                          |
| -------------------- | ------------------------------------ |
| `addEmployee(input)` | Adds a new employee with form inputs |

**GraphQL Playground:**
📍 [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)

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
│   ├── queries.ts               # GraphQL queries & mutations
│   └── graphql/
│       ├── schema.ts            # GraphQL type definitions
│       └── resolvers.ts         # GraphQL resolvers
├── scripts/
│   └── seed-database.js         # Initial data seeding
├── .env.example                 # Environment variable template
└── README.md
```

---

## ✅ Feature Checklist

* ✅ Fully functional GraphQL API
* ✅ Clean, modular component structure
* ✅ Apollo Client with caching
* ✅ MongoDB seeding script
* ✅ Department-based employee filtering
* ✅ Validated employee form
* ✅ Error handling (frontend & backend)
* ✅ Mobile-responsive design
* ✅ Modern UI with Tailwind + shadcn/ui
* ✅ Loading & empty states for better UX

---

## 🌍 Deployment

Deploy easily on **Vercel** with MongoDB Atlas:

1. Push your repo to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables on Vercel:

   * `MONGODB_URI`
   * `MONGODB_DB`
4. Deploy!

---

## 📄 License

This project is licensed under the **MIT License**.
Feel free to use and modify for personal or commercial projects.
