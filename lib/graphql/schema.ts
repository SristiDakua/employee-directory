import { gql } from "apollo-server-micro"

export const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    position: String!
    department: String!
    salary: Int!
  }

  type CompanyDepartment {
    id: ID!
    name: String!
    floor: Int!
  }

  type CacheStats {
    size: Int!
    maxSize: Int!
    keys: [String!]!
  }

  type DeleteResult {
    success: Boolean!
    message: String!
  }

  type Query {
    getAllEmployees: [Employee!]!
    getEmployeeDetails(id: ID!): Employee
    getEmployeesByDepartment(department: String!): [Employee!]!
    getDepartments: [String!]!
    getAllCompanyDepartments: [CompanyDepartment!]!
    getCompanyDepartment(id: ID!): CompanyDepartment
    getCacheStats: CacheStats!
  }

  type Mutation {
    addEmployee(name: String!, position: String!, department: String!, salary: Int!): Employee!
    updateEmployee(id: ID!, name: String, position: String, department: String, salary: Int): Employee!
    deleteEmployee(id: ID!): DeleteResult!
    addCompanyDepartment(name: String!, floor: Int!): CompanyDepartment!
    updateCompanyDepartment(id: ID!, name: String, floor: Int): CompanyDepartment!
    deleteCompanyDepartment(id: ID!): DeleteResult!
  }
`
