import { MongoClient, type Db, type Collection } from "mongodb"

// Environment configuration with fallbacks
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = process.env.MONGODB_DB || "employee_directory"

// Validate environment variables
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required")
}

console.log(`🔗 MongoDB Configuration: ${MONGODB_URI.includes('mongodb+srv://') ? 'Atlas Cloud' : 'Local'} -> ${MONGODB_DB}`)

// Global declaration for connection tracking
declare global {
  var _mongoConnection: boolean | undefined
}

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToMongoDB(): Promise<Db> {
  if (db && client) {
    // Check if connection is still alive
    try {
      await client.db(MONGODB_DB).admin().ping()
      return db
    } catch (error) {
      console.log("🔄 Existing connection lost, reconnecting...")
      client = null
      db = null
    }
  }

  const maxRetries = 3
  let retryCount = 0

  while (retryCount < maxRetries) {
    try {
      if (!client) {
        // Determine connection options based on URI
        const isAtlas = MONGODB_URI.includes('mongodb+srv://')
        const connectionOptions: any = {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          maxIdleTimeMS: 30000,
          retryWrites: true,
        }

        // Add Atlas-specific options
        if (isAtlas) {
          connectionOptions.ssl = true
          connectionOptions.tls = true
          connectionOptions.tlsAllowInvalidCertificates = false
          connectionOptions.tlsAllowInvalidHostnames = false
        }

        client = new MongoClient(MONGODB_URI, connectionOptions)
        await client.connect()
        
        // Test the connection
        await client.db(MONGODB_DB).admin().ping()
        console.log(`✅ Connected to MongoDB (${isAtlas ? 'Atlas' : 'Local'}) with connection pooling`)
      }
      
      db = client.db(MONGODB_DB)

      // Only seed initial data once when first connecting
      if (!global._mongoConnection) {
        await seedInitialData()
        global._mongoConnection = true
      }

      return db
    } catch (error) {
      retryCount++
      console.error(`❌ MongoDB connection attempt ${retryCount}/${maxRetries} failed:`, error instanceof Error ? error.message : error)
      
      if (client) {
        try {
          await client.close()
        } catch (closeError) {
          console.error("Error closing failed connection:", closeError)
        }
      }
      
      client = null
      db = null

      if (retryCount >= maxRetries) {
        console.error("❌ All MongoDB connection attempts failed")
        throw error
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000)
      console.log(`⏳ Retrying connection in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new Error("Failed to connect to MongoDB after all retry attempts")
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

// Connection health check
export async function checkMongoConnection(): Promise<boolean> {
  try {
    if (!client || !db) {
      return false
    }
    await client.db(MONGODB_DB).admin().ping()
    return true
  } catch (error) {
    console.error("MongoDB health check failed:", error)
    return false
  }
}

// Graceful shutdown
export async function closeMongoConnection(): Promise<void> {
  try {
    if (client) {
      await client.close()
      console.log("✅ MongoDB connection closed gracefully")
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error)
  } finally {
    client = null
    db = null
    global._mongoConnection = false
  }
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    console.log('🔄 Received SIGINT, closing MongoDB connection...')
    await closeMongoConnection()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('🔄 Received SIGTERM, closing MongoDB connection...')
    await closeMongoConnection()
    process.exit(0)
  })
}

export async function getEmployeesCollection(): Promise<Collection> {
  const database = await connectToMongoDB()
  return database.collection("employees")
}

export async function getDepartmentsCollection(): Promise<Collection> {
  const database = await connectToMongoDB()
  return database.collection("departments")
}
