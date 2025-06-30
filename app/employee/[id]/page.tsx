"use client"

import { useQuery, useMutation } from "@apollo/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { GET_EMPLOYEE_DETAILS, DELETE_EMPLOYEE, UPDATE_EMPLOYEE } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, User, Briefcase, Building, DollarSign } from "lucide-react"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // State for edit form
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    position: '',
    department: '',
    salary: 0
  })

  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEE_DETAILS, {
    variables: { id: params.id },
    errorPolicy: "all",
  })

  const [deleteEmployee, { loading: deleteLoading }] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: (data) => {
      if (data.deleteEmployee.success) {
        toast({
          title: "Success",
          description: "Employee deleted successfully",
        })
        router.push('/')
      } else {
        toast({
          title: "Error",
          description: data.deleteEmployee.message,
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    }
  })

  const [updateEmployee, { loading: updateLoading }] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Employee updated successfully",
      })
      setIsEditDialogOpen(false)
      refetch()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      })
    }
  })

  // Initialize edit form when employee data is loaded
  const employee = data?.getEmployeeDetails
  if (employee && editForm.name === '') {
    setEditForm({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      salary: employee.salary
    })
  }

  const handleDelete = async () => {
    await deleteEmployee({
      variables: { id: params.id }
    })
  }

  const handleUpdate = async () => {
    await updateEmployee({
      variables: {
        id: params.id,
        name: editForm.name,
        position: editForm.position,
        department: editForm.department,
        salary: editForm.salary
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto p-4 md:p-8">
          <div className="animate-in space-y-8">
            <div className="h-12 bg-gradient-to-r from-white/40 to-white/20 rounded-lg w-1/4 animate-pulse backdrop-blur-sm"></div>
            <Card className="border-0 shadow-xl backdrop-blur-lg bg-white/90">
              <CardContent className="p-10">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-200/60 via-purple-200/60 to-pink-200/60 rounded-full animate-pulse backdrop-blur-sm"></div>
                  <div className="space-y-3">
                    <div className="h-10 bg-gradient-to-r from-gray-200/80 to-gray-100/80 rounded-lg w-64 animate-pulse"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-150/60 to-gray-100/60 rounded-lg w-40 animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-8 bg-gradient-to-br from-gray-100/80 to-gray-50/80 rounded-2xl animate-pulse backdrop-blur-sm">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-gradient-to-br from-gray-200/80 to-gray-300/80 rounded-2xl animate-pulse"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200/60 rounded w-20 animate-pulse"></div>
                          <div className="h-6 bg-gray-300/60 rounded w-32 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.getEmployeeDetails) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto p-4 md:p-8 space-y-6 animate-in">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Button>
          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/80">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center">
                <User className="h-10 w-10 text-red-500" />
              </div>
              <p className="text-red-600 text-lg font-medium">
                {error ? `Error: ${error.message}` : "Employee not found"}
              </p>
              <p className="text-gray-500 mt-2">The employee you're looking for doesn't exist or has been removed.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => router.push('/')}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-0"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
          </svg>
        </Button>
      </div>

      <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in">
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          className="flex items-center gap-3 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0 px-6 py-3"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Directory</span>
        </Button>

        <Card className="border-0 shadow-xl backdrop-blur-lg bg-white/95 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <CardHeader className="pb-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>
            <CardTitle className="flex items-center gap-6 relative z-10">
              <div className="relative">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl animate-pulse">
                  {employee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur opacity-30 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in">
                  {employee.name}
                </h1>
                <p className="text-gray-700 text-xl font-medium">{employee.position}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Active Employee</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-10 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative flex items-center gap-6 p-8 bg-gradient-to-br from-blue-50/80 to-blue-100/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-blue-200/50 backdrop-blur-sm">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-6">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-blue-700 uppercase tracking-wider">Position</p>
                      <p className="text-xl font-bold text-gray-800 leading-tight">{employee.position}</p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative flex items-center gap-6 p-8 bg-gradient-to-br from-purple-50/80 to-purple-100/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-purple-200/50 backdrop-blur-sm">
                    <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-6">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-purple-700 uppercase tracking-wider">Department</p>
                      <p className="text-xl font-bold text-gray-800 leading-tight">{employee.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative flex items-center gap-6 p-8 bg-gradient-to-br from-green-50/80 to-emerald-100/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-green-200/50 backdrop-blur-sm">
                    <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-6">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-green-700 uppercase tracking-wider">Annual Salary</p>
                      <p className="text-2xl font-bold text-gray-800 leading-tight">${employee.salary.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-slate-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative flex items-center gap-6 p-8 bg-gradient-to-br from-gray-50/80 to-slate-100/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-gray-200/50 backdrop-blur-sm">
                    <div className="h-16 w-16 bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-6">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Employee ID</p>
                      <p className="text-xl font-bold text-gray-800 leading-tight">#{employee.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Actions Section */}
            <div className="pt-8 border-t border-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl px-6 py-3"
                      >
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <User className="h-5 w-5 relative z-10" />
                        <span className="relative z-10 font-medium">Edit Employee</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>
                          Make changes to the employee information here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="position" className="text-right">
                            Position
                          </Label>
                          <Input
                            id="position"
                            value={editForm.position}
                            onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="department" className="text-right">
                            Department
                          </Label>
                          <Input
                            id="department"
                            value={editForm.department}
                            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="salary" className="text-right">
                            Salary
                          </Label>
                          <Input
                            id="salary"
                            type="number"
                            value={editForm.salary}
                            onChange={(e) => setEditForm({ ...editForm, salary: parseInt(e.target.value) || 0 })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleUpdate} disabled={updateLoading}>
                          {updateLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="group relative overflow-hidden flex items-center gap-3 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg px-6 py-3"
                      >
                        <div className="absolute inset-0 bg-red-100/50 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <svg className="h-5 w-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="relative z-10 font-medium">Delete Employee</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete {employee?.name}? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                          {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
