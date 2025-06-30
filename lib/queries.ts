import { gql } from "@apollo/client"

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      id
      name
      position
      department
      salary
    }
  }
`

export const GET_EMPLOYEE_DETAILS = gql`
  query GetEmployeeDetails($id: ID!) {
    getEmployeeDetails(id: $id) {
      id
      name
      position
      department
      salary
    }
  }
`

export const GET_EMPLOYEES_BY_DEPARTMENT = gql`
  query GetEmployeesByDepartment($department: String!) {
    getEmployeesByDepartment(department: $department) {
      id
      name
      position
      department
      salary
    }
  }
`

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($name: String!, $position: String!, $department: String!, $salary: Int!) {
    addEmployee(name: $name, position: $position, department: $department, salary: $salary) {
      id
      name
      position
      department
      salary
    }
  }
`

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      success
      message
    }
  }
`

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $name: String!, $position: String!, $department: String!, $salary: Int!) {
    updateEmployee(id: $id, name: $name, position: $position, department: $department, salary: $salary) {
      id
      name
      position
      department
      salary
    }
  }
`

export const GET_ALL_COMPANY_DEPARTMENTS = gql`
  query GetAllCompanyDepartments {
    getAllCompanyDepartments {
      id
      name
      floor
    }
  }
`

export const GET_COMPANY_DEPARTMENT = gql`
  query GetCompanyDepartment($id: ID!) {
    getCompanyDepartment(id: $id) {
      id
      name
      floor
    }
  }
`

export const ADD_COMPANY_DEPARTMENT = gql`
  mutation AddCompanyDepartment($name: String!, $floor: Int!) {
    addCompanyDepartment(name: $name, floor: $floor) {
      id
      name
      floor
    }
  }
`

export const UPDATE_COMPANY_DEPARTMENT = gql`
  mutation UpdateCompanyDepartment($id: ID!, $name: String, $floor: Int) {
    updateCompanyDepartment(id: $id, name: $name, floor: $floor) {
      id
      name
      floor
    }
  }
`

export const DELETE_COMPANY_DEPARTMENT = gql`
  mutation DeleteCompanyDepartment($id: ID!) {
    deleteCompanyDepartment(id: $id) {
      success
      message
    }
  }
`
