"use client"

import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_ALL_COMPANY_DEPARTMENTS,
  ADD_COMPANY_DEPARTMENT,
  UPDATE_COMPANY_DEPARTMENT,
  DELETE_COMPANY_DEPARTMENT
} from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Building, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Department {
  id: string
  name: string
  floor: number
}

export function DepartmentManager() {
  const { toast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', floor: 0 })
  const [newDepartment, setNewDepartment] = useState({ name: '', floor: 1 })
  const [showAddForm, setShowAddForm] = useState(false)

  const { data, loading, error, refetch } = useQuery(GET_ALL_COMPANY_DEPARTMENTS)
  
  const [addDepartment] = useMutation(ADD_COMPANY_DEPARTMENT, {
    onCompleted: () => {
      toast({ title: "Success", description: "Department added successfully!" })
      setNewDepartment({ name: '', floor: 1 })
      setShowAddForm(false)
      refetch()
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  })

  const [updateDepartment] = useMutation(UPDATE_COMPANY_DEPARTMENT, {
    onCompleted: () => {
      toast({ title: "Success", description: "Department updated successfully!" })
      setEditingId(null)
      refetch()
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  })

  const [deleteDepartment] = useMutation(DELETE_COMPANY_DEPARTMENT, {
    onCompleted: (data) => {
      if (data.deleteCompanyDepartment.success) {
        toast({ title: "Success", description: data.deleteCompanyDepartment.message })
        refetch()
      } else {
        toast({ title: "Error", description: data.deleteCompanyDepartment.message, variant: "destructive" })
      }
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  })

  const handleAdd = () => {
    if (newDepartment.name.trim()) {
      addDepartment({
        variables: {
          name: newDepartment.name,
          floor: newDepartment.floor
        }
      })
    }
  }

  const handleEdit = (department: Department) => {
    setEditingId(department.id)
    setEditForm({ name: department.name, floor: department.floor })
  }

  const handleSave = () => {
    if (editForm.name.trim() && editingId) {
      updateDepartment({
        variables: {
          id: editingId,
          name: editForm.name,
          floor: editForm.floor
        }
      })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      deleteDepartment({ variables: { id } })
    }
  }

  if (loading) return <div className="flex justify-center p-8">Loading departments...</div>
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>

  const departments = data?.getAllCompanyDepartments || []

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Company Departments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Department */}
        <div className="border-b pb-4">
          {showAddForm ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="new-name">Department Name</Label>
                <Input
                  id="new-name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <Label htmlFor="new-floor">Floor</Label>
                <Input
                  id="new-floor"
                  type="number"
                  min="1"
                  value={newDepartment.floor}
                  onChange={(e) => setNewDepartment({ ...newDepartment, floor: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)} 
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Department
            </Button>
          )}
        </div>

        {/* Departments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department: Department) => (
            <Card key={department.id} className="relative">
              <CardContent className="p-4">
                {editingId === department.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`edit-name-${department.id}`}>Name</Label>
                      <Input
                        id={`edit-name-${department.id}`}
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-floor-${department.id}`}>Floor</Label>
                      <Input
                        id={`edit-floor-${department.id}`}
                        type="number"
                        min="1"
                        value={editForm.floor}
                        onChange={(e) => setEditForm({ ...editForm, floor: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingId(null)} 
                        size="sm"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{department.name}</h3>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(department)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(department.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      Floor {department.floor}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {departments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No departments found. Add your first department above.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
