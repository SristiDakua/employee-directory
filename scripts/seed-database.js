const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = "employee_directory"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(MONGODB_DB)

    await db.collection("employees").deleteMany({})
    await db.collection("departments").deleteMany({})

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
      {
        id: "6",
        name: "Emily Davis",
        position: "UX Designer",
        department: "Engineering",
        salary: 70000,
      },
      {
        id: "7",
        name: "Robert Taylor",
        position: "Sales Manager",
        department: "Sales",
        salary: 80000,
      },
    ]

    await db.collection("employees").insertMany(employees)
    console.log("Seeded employees data")

    const departments = [
      { id: "1", name: "Engineering", floor: 3 },
      { id: "2", name: "Marketing", floor: 2 },
      { id: "3", name: "Sales", floor: 1 },
      { id: "4", name: "HR", floor: 2 },
      { id: "5", name: "Finance", floor: 1 },
    ]

    await db.collection("departments").insertMany(departments)
    console.log("Seeded departments data")

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
