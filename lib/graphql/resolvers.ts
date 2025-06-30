import { connectToMongoDB, getEmployeesCollection, getDepartmentsCollection } from "../mongodb"

export const resolvers = {
  Query: {
    getAllEmployees: async () => {
      try {
        await connectToMongoDB()
        const employeesCollection = getEmployeesCollection()
        const employees = await employeesCollection.find({}).toArray()
        
        return employees.map(employee => ({
          id: employee.id || employee._id.toString(),
          name: employee.name,
          position: employee.position,
          department: employee.department,
          salary: employee.salary
        }))
      } catch (error) {
        console.error('Error fetching employees:', error)
        return []
      }
    },

    getEmployeeDetails: async (_: any, { id }: { id: string }) => {
      try {
        await connectToMongoDB()
        const employeesCollection = getEmployeesCollection()
        const employee = await employeesCollection.findOne({ id })
        
        if (!employee) {
          return null
        }

        return {
          id: employee.id || employee._id.toString(),
          name: employee.name,
          position: employee.position,
          department: employee.department,
          salary: employee.salary
        }
      } catch (error) {
        console.error('Error fetching employee details:', error)
        return null
      }
    },

    getEmployeesByDepartment: async (_: any, { department }: { department: string }) => {
      try {
        await connectToMongoDB()
        const employeesCollection = getEmployeesCollection()
        const employees = await employeesCollection.find({ department }).toArray()
        
        return employees.map(employee => ({
          id: employee.id || employee._id.toString(),
          name: employee.name,
          position: employee.position,
          department: employee.department,
          salary: employee.salary
        }))
      } catch (error) {
        console.error('Error fetching employees by department:', error)
        return []
      }
    },

    getDepartments: async () => {
      try {
        await connectToMongoDB()
        const departmentsCollection = getDepartmentsCollection()
        const departments = await departmentsCollection.find({}).toArray()
        
        return departments.map(dept => dept.name)
      } catch (error) {
        console.error('Error fetching departments:', error)
        return []
      }
    },

    getAllCompanyDepartments: async () => {
      try {
        await connectToMongoDB()
        const departmentsCollection = getDepartmentsCollection()
        const departments = await departmentsCollection.find({}).toArray()
        
        return departments.map(dept => ({
          id: dept.id || dept._id.toString(),
          name: dept.name,
          floor: dept.floor
        }))
      } catch (error) {
        console.error('Error fetching company departments:', error)
        return []
      }
    },

    getCompanyDepartment: async (_: any, { id }: { id: string }) => {
      try {
        await connectToMongoDB()
        const departmentsCollection = getDepartmentsCollection()
        const department = await departmentsCollection.findOne({ id })
        
        if (!department) {
          return null
        }

        return {
          id: department.id || department._id.toString(),
          name: department.name,
          floor: department.floor
        }
      } catch (error) {
        console.error('Error fetching company department:', error)
        return null
      }
    },

    getCacheStats: async () => {
      return {
        size: 0,
        maxSize: 100,
        keys: []
      }
    }
  },

  Mutation: {
    addEmployee: async (_: any, { name, position, department, salary }: {
      name: string
      position: string
      department: string
      salary: number
    }) => {
      try {
        await connectToMongoDB()
        const employeesCollection = getEmployeesCollection()
        
        const id = Date.now().toString()
        const newEmployee = {
          id,
          name,
          position,
          department,
          salary
        }

        await employeesCollection.insertOne(newEmployee)
        return newEmployee
      } catch (error) {
        console.error('Error adding employee:', error)
        throw new Error('Failed to add employee')
      }
    },

    updateEmployee: async (_: any, { id, ...updateFields }: {
      id: string
      name?: string
      position?: string
      department?: string
      salary?: number
    }) => {
      try {
        await connectToMongoDB()
        const employeesCollection = getEmployeesCollection()
        
        const fieldsToUpdate = Object.entries(updateFields)
          .filter(([_, value]) => value !== undefined)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

        const result = await employeesCollection.findOneAndUpdate(
          { id },
          { $set: fieldsToUpdate },
          { returnDocument: 'after' }
        )

        if (!result) {
          throw new Error('Employee not found')
        }

        return {
          id: result.id || result._id.toString(),
          name: result.name,
          position: result.position,
          department: result.department,
          salary: result.salary
        }
      } catch (error) {
        console.error('Error updating employee:', error)
        throw new Error('Failed to update employee')
      }
    },

    deleteEmployee: async (_: any, { id }: { id: string }) => {
      try {
        await connectToMongoDB()
        const employeesCollection = getEmployeesCollection()
        
        const result = await employeesCollection.deleteOne({ id })
        
        if (result.deletedCount === 0) {
          return {
            success: false,
            message: 'Employee not found'
          }
        }

        return {
          success: true,
          message: 'Employee deleted successfully'
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        return {
          success: false,
          message: 'Failed to delete employee'
        }
      }
    },

    addCompanyDepartment: async (_: any, { name, floor }: {
      name: string
      floor: number
    }) => {
      try {
        await connectToMongoDB()
        const departmentsCollection = getDepartmentsCollection()
        
        const id = Date.now().toString()
        
        const newDepartment = {
          id,
          name,
          floor
        }

        await departmentsCollection.insertOne(newDepartment)
        return newDepartment
      } catch (error) {
        console.error('Error adding company department:', error)
        throw new Error('Failed to add company department')
      }
    },

    updateCompanyDepartment: async (_: any, { id, ...updateFields }: {
      id: string
      name?: string
      floor?: number
    }) => {
      try {
        await connectToMongoDB()
        const departmentsCollection = getDepartmentsCollection()
        
        const fieldsToUpdate = Object.entries(updateFields)
          .filter(([_, value]) => value !== undefined)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

        const result = await departmentsCollection.findOneAndUpdate(
          { id },
          { $set: fieldsToUpdate },
          { returnDocument: 'after' }
        )

        if (!result) {
          throw new Error('Company department not found')
        }

        return {
          id: result.id || result._id.toString(),
          name: result.name,
          floor: result.floor
        }
      } catch (error) {
        console.error('Error updating company department:', error)
        throw new Error('Failed to update company department')
      }
    },

    deleteCompanyDepartment: async (_: any, { id }: { id: string }) => {
      try {
        await connectToMongoDB()
        const departmentsCollection = getDepartmentsCollection()
        
        const result = await departmentsCollection.deleteOne({ id })
        
        if (result.deletedCount === 0) {
          return {
            success: false,
            message: 'Company department not found'
          }
        }

        return {
          success: true,
          message: 'Company department deleted successfully'
        }
      } catch (error) {
        console.error('Error deleting company department:', error)
        return {
          success: false,
          message: 'Failed to delete company department'
        }
      }
    }
  }
}
