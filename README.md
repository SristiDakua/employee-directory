# Employee Directory Application

A full-stack MERN application with GraphQL for managing company employees.

## Features

- **Employee Management**: View, add, and filter employees
- **Department Filtering**: Filter employees by department
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **GraphQL API**: Efficient data fetching with Apollo Server
- **MongoDB Integration**: Native MongoDB driver for data persistence

## Tech Stack

### Backend
- Node.js
- Apollo Server 4
- GraphQL
- MongoDB (native driver)

### Frontend
- Next.js 14 (App Router)
- Apollo Client
- Tailwind CSS
- shadcn/ui components
- TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
# .env.local
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=employee_directory
\`\`\`

4. Seed the database:
\`\`\`bash
node scripts/seed-database.js
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## GraphQL Schema

### Types
- **Employee**: id, name, position, department, salary
- **CompanyDepartment**: id, name, floor

### Queries
- `getAllEmployees`: Returns all employees (name + position)
- `getEmployeeDetails(id)`: Returns full employee details
- `getEmployeesByDepartment(department)`: Returns filtered employees

### Mutations
- `addEmployee(name, position, department, salary)`: Creates new employee

## Project Structure

\`\`\`
employee-directory/
├── app/
│   ├── page.tsx                 # Home page with employee list
│   ├── employee/[id]/page.tsx   # Employee detail page
│   ├── api/graphql/route.ts     # GraphQL API endpoint
│   └── layout.tsx               # Root layout
├── components/
│   ├── EmployeeTable.tsx        # Employee list table
│   ├── DepartmentFilter.tsx     # Department filter component
│   └── AddEmployeeForm.tsx      # Add employee form
├── lib/
│   ├── apollo-client.tsx        # Apollo Client setup
│   ├── queries.ts               # GraphQL queries/mutations
│   ├── mongodb.ts               # MongoDB connection
│   └── graphql/
│       ├── schema.ts            # GraphQL schema
│       └── resolvers.ts         # GraphQL resolvers
└── scripts/
    └── seed-database.js         # Database seeding script
\`\`\`

## API Endpoints

- **GraphQL Playground**: `http://localhost:3000/api/graphql`

## Features Implemented

✅ Complete functional implementation
✅ Clean component structure  
✅ Efficient GraphQL queries
✅ Proper state management
✅ Error handling (frontend + backend)
✅ UI consistency
✅ Mobile-responsive design
✅ Form validation
✅ Loading states
✅ Department filtering
✅ Employee CRUD operations

## Deployment

The application can be deployed to Vercel with MongoDB Atlas:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## License

MIT License
