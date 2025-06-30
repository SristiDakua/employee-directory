"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { GET_ALL_EMPLOYEES, GET_EMPLOYEES_BY_DEPARTMENT } from "@/lib/queries"
import EmployeeTable from "@/components/EmployeeTable"
import DepartmentFilter from "@/components/DepartmentFilter"
import AddEmployeeForm from "@/components/AddEmployeeForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X, Building, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [showAddForm, setShowAddForm] = useState(false)

  const { data, loading, error, refetch } = useQuery(
    selectedDepartment ? GET_EMPLOYEES_BY_DEPARTMENT : GET_ALL_EMPLOYEES,
    {
      variables: selectedDepartment ? { department: selectedDepartment } : {},
      errorPolicy: "all",
    },
  )

  const employees = selectedDepartment ? data?.getEmployeesByDepartment : data?.getAllEmployees

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department)
  }

  const handleEmployeeAdded = () => {
    setShowAddForm(false)
    refetch()
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-red-600">Error loading employees: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto p-4 md:p-8 space-y-6 animate-in">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              <Users className="h-5 w-5" />
              <span>Employees</span>
            </Link>
            <Link href="/departments" className="flex items-center space-x-2 text-lg font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              <Building className="h-5 w-5" />
              <span>Departments</span>
            </Link>
          </div>
        </nav>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Employee Directory
            </h1>
            <p className="text-muted-foreground text-lg">Manage your company employees with ease</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add New Employee
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift backdrop-blur-sm bg-white/80">
              <CardContent className="p-6">
                <DepartmentFilter 
                  selectedDepartment={selectedDepartment} 
                  onDepartmentChange={handleDepartmentChange} 
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-3/4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift backdrop-blur-sm bg-white/80">
              <CardContent className="p-0">
                <EmployeeTable employees={employees} loading={loading} />
              </CardContent>
            </Card>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Add New Employee
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowAddForm(false)}
                    className="rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <AddEmployeeForm 
                  onEmployeeAdded={handleEmployeeAdded} 
                  onCancel={() => setShowAddForm(false)} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
