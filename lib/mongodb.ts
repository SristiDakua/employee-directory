import { MongoClient, type Db, type Collection } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = process.env.MONGODB_DB || "employee_directory"

// Global declaration for connection tracking
declare global {
  var _mongoConnection: boolean | undefined
}

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToMongoDB(): Promise<Db> {
  if (db && client) {
    // Reuse existing connection
    return db
  }

  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,          // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000,   // Close sockets after 45 seconds of inactivity
        maxIdleTimeMS: 30000,     // Close connections after 30 seconds of inactivity
      })
      await client.connect()
      console.log("✅ Connected to MongoDB with connection pooling")
    }
    
    db = client.db(MONGODB_DB)

    // Only seed initial data once when first connecting
    if (!global._mongoConnection) {
      await seedInitialData()
      global._mongoConnection = true
    }

    return db
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    client = null
    db = null
    throw error
  }
}

async function createIndexes() {
  if (!db) {
    console.error("❌ Database not connected for index creation")
    return
  }

  try {
    const employeesCollection = db.collection("employees")
    const departmentsCollection = db.collection("departments")

    // Create indexes for better query performance
    await employeesCollection.createIndex({ id: 1 }, { unique: true, background: true })
    await employeesCollection.createIndex({ department: 1 }, { background: true })
    await employeesCollection.createIndex({ name: 1 }, { background: true })
    await employeesCollection.createIndex({ position: 1 }, { background: true })
    await employeesCollection.createIndex({ salary: 1 }, { background: true })
    
    await departmentsCollection.createIndex({ id: 1 }, { unique: true, background: true })
    await departmentsCollection.createIndex({ name: 1 }, { unique: true, background: true })
    
    console.log("📈 Database indexes created successfully")
  } catch (error) {
    // Indexes might already exist, which is fine
    console.log("📈 Database indexes already exist or were created")
  }
}

async function seedInitialData() {
  if (!db) {
    console.error("❌ Database not connected for seeding")
    return
  }

  try {
    // Create indexes first for better performance
    await createIndexes()

    const employeesCollection = db.collection("employees")
    const departmentsCollection = db.collection("departments")

    // Check if data already exists
    const employeeCount = await employeesCollection.countDocuments()
    const departmentCount = await departmentsCollection.countDocuments()

    console.log(`📊 Database status: ${employeeCount} employees, ${departmentCount} departments`)

    if (employeeCount === 0) {
      console.log("🌱 Seeding initial employee data...")
      // Seed employees
      const employees = [
        {
          id: "1",
          name: "John Doe",
          position: "Senior Software Engineer",
          department: "Engineering",
          salary: 95000,
        },
        {
          id: "2",
          name: "Jane Smith",
          position: "Marketing Manager",
          department: "Marketing",
          salary: 75000,
        },
        {
          id: "3",
          name: "Mike Johnson",
          position: "Sales Representative",
          department: "Sales",
          salary: 55000,
        },
        {
          id: "4",
          name: "Sarah Wilson",
          position: "HR Specialist",
          department: "HR",
          salary: 60000,
        },
        {
          id: "5",
          name: "David Brown",
          position: "DevOps Engineer",
          department: "Engineering",
          salary: 85000,
        },
        // Additional employees
        {
          id: "e1",
          name: "Alice",
          position: "Developer",
          department: "Engineering",
          salary: 75000,
        },
        {
          id: "e2",
          name: "Bob",
          position: "Manager",
          department: "Marketing",
          salary: 85000,
        },
        {
          id: "e3",
          name: "Charlie",
          position: "Recruiter",
          department: "HR",
          salary: 60000,
        },
        {
          id: "e4",
          name: "Diana",
          position: "UI Designer",
          department: "Engineering",
          salary: 70000,
        },
        {
          id: "e5",
          name: "Ethan",
          position: "Copywriter",
          department: "Marketing",
          salary: 62000,
        },
        {
          id: "e6",
          name: "Grace",
          position: "Financial Analyst",
          department: "Finance",
          salary: 68000,
        },
      ]

      await employeesCollection.insertMany(employees)
      console.log("✅ Seeded employees data")
    } else {
      console.log("✅ Employee data already exists, skipping seed")
    }

    if (departmentCount === 0) {
      console.log("🌱 Seeding initial department data...")
      // Seed departments
      const departments = [
        { id: "1", name: "Engineering", floor: 3 },
        { id: "2", name: "Marketing", floor: 2 },
        { id: "3", name: "Sales", floor: 1 },
        { id: "4", name: "HR", floor: 2 },
        { id: "5", name: "Finance", floor: 1 },
      ]

      await departmentsCollection.insertMany(departments)
      console.log("✅ Seeded departments data")
    } else {
      console.log("✅ Department data already exists, skipping seed")
    }
  } catch (error) {
    console.error("Error seeding data:", error)
  }
}

export function getEmployeesCollection(): Collection {
  if (!db) {
    throw new Error("Database not connected")
  }
  return db.collection("employees")
}

export function getDepartmentsCollection(): Collection {
  if (!db) {
    throw new Error("Database not connected")
  }
  return db.collection("departments")
}
