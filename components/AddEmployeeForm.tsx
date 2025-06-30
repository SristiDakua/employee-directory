"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_EMPLOYEE } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, DollarSign, Briefcase, Building2, User } from "lucide-react"

interface AddEmployeeFormProps {
  onEmployeeAdded: () => void
  onCancel: () => void
}

const departments = [
  { value: "Engineering", label: "Engineering", icon: "💻" },
  { value: "Marketing", label: "Marketing", icon: "📢" },
  { value: "Sales", label: "Sales", icon: "💰" },
  { value: "HR", label: "Human Resources", icon: "👥" },
  { value: "Finance", label: "Finance", icon: "📊" },
]

export default function AddEmployeeForm({ onEmployeeAdded, onCancel }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [addEmployee, { loading }] = useMutation(ADD_EMPLOYEE, {
    onCompleted: () => {
      onEmployeeAdded()
    },
    onError: (error) => {
      setErrors({ submit: error.message })
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.position.trim()) {
      newErrors.position = "Position is required"
    }
    if (!formData.department) {
      newErrors.department = "Department is required"
    }
    if (!formData.salary || isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = "Valid salary is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await addEmployee({
        variables: {
          name: formData.name.trim(),
          position: formData.position.trim(),
          department: formData.department,
          salary: Number.parseInt(formData.salary),
        },
      })
    } catch (error) {
      console.error("Error adding employee:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <User className="h-4 w-4 text-blue-600" />
          Full Name *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter employee's full name"
          className={`transition-all duration-200 ${
            errors.name 
              ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
              : "focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400"
          }`}
        />
        {errors.name && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="position" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <Briefcase className="h-4 w-4 text-blue-600" />
          Position *
        </Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => handleInputChange("position", e.target.value)}
          placeholder="e.g., Software Engineer, Marketing Manager"
          className={`transition-all duration-200 ${
            errors.position 
              ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
              : "focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400"
          }`}
        />
        {errors.position && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            {errors.position}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <Building2 className="h-4 w-4 text-blue-600" />
          Department *
        </Label>
        <Select 
          value={formData.department} 
          onValueChange={(value) => handleInputChange("department", value)}
        >
          <SelectTrigger 
            className={`transition-all duration-200 ${
              errors.department 
                ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                : "focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400"
            }`}
          >
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent className="shadow-lg">
            {departments.map((dept) => (
              <SelectItem key={dept.value} value={dept.value}>
                <div className="flex items-center gap-2">
                  <span>{dept.icon}</span>
                  {dept.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            {errors.department}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <DollarSign className="h-4 w-4 text-blue-600" />
          Annual Salary *
        </Label>
        <Input
          id="salary"
          type="number"
          value={formData.salary}
          onChange={(e) => handleInputChange("salary", e.target.value)}
          placeholder="50000"
          min="0"
          step="1000"
          className={`transition-all duration-200 ${
            errors.salary 
              ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
              : "focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400"
          }`}
        />
        {errors.salary && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            {errors.salary}
          </p>
        )}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">{errors.submit}</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
          size="lg"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Adding...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="transition-all duration-200 hover:bg-gray-100 hover:scale-105 px-6"
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
