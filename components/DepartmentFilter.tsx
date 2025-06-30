"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, X, Building2 } from "lucide-react"

interface DepartmentFilterProps {
  selectedDepartment: string
  onDepartmentChange: (department: string) => void
}

const departments = [
  { value: "Engineering", label: "Engineering", color: "bg-blue-500" },
  { value: "Marketing", label: "Marketing", color: "bg-green-500" },
  { value: "Sales", label: "Sales", color: "bg-yellow-500" },
  { value: "HR", label: "Human Resources", color: "bg-purple-500" },
  { value: "Finance", label: "Finance", color: "bg-red-500" },
]

export default function DepartmentFilter({ selectedDepartment, onDepartmentChange }: DepartmentFilterProps) {
  const handleDepartmentChange = (value: string) => {
    // Convert "all" back to empty string for the parent component
    onDepartmentChange(value === "all" ? "" : value)
  }

  const handleClearFilter = () => {
    onDepartmentChange("")
  }

  // Convert empty string to "all" for the Select component
  const selectValue = selectedDepartment === "" ? "all" : selectedDepartment

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-blue-600" />
        <h3 className="font-bold text-lg text-gray-800">Filter by Department</h3>
      </div>

      <Select value={selectValue} onValueChange={handleDepartmentChange}>
        <SelectTrigger className="w-full transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent className="shadow-lg">
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              All Departments
            </div>
          </SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.value} value={dept.value}>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${dept.color}`} />
                {dept.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedDepartment && (
        <Button 
          variant="outline" 
          onClick={handleClearFilter} 
          className="w-full transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 border-red-200 text-red-600 hover:scale-105"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filter
        </Button>
      )}

      <div className="space-y-3 pt-2">
        <p className="text-sm font-medium text-gray-700">Quick Filters</p>
        <div className="grid grid-cols-2 gap-2">
          {departments.map((dept) => (
            <Button
              key={dept.value}
              variant={selectedDepartment === dept.value ? "default" : "outline"}
              size="sm"
              onClick={() => onDepartmentChange(dept.value)}
              className={`text-xs px-3 py-2 h-auto transition-all duration-200 hover:scale-105 ${
                selectedDepartment === dept.value 
                  ? "bg-blue-600 hover:bg-blue-700 shadow-md" 
                  : "hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              <div className={`h-2 w-2 rounded-full ${dept.color} mr-2`} />
              {dept.value}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
