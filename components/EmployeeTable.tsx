import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Users } from "lucide-react"

interface Employee {
  id: string
  name: string
  position: string
  department?: string
  salary?: number
}

interface EmployeeTableProps {
  employees?: Employee[]
  loading: boolean
}

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <div className="h-10 w-10 bg-muted rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-3 bg-muted rounded w-1/3"></div>
        </div>
        <div className="h-4 bg-muted rounded w-20"></div>
        <div className="h-8 w-20 bg-muted rounded"></div>
      </div>
    ))}
  </div>
)

export default function EmployeeTable({ employees, loading }: EmployeeTableProps) {
  if (loading) {
    return (
      <Card className="border-0 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Users className="h-6 w-6 text-blue-600 animate-pulse" />
            Loading Employees...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (!employees || employees.length === 0) {
    return (
      <Card className="border-0 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Users className="h-6 w-6 text-blue-600" />
            Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
              <Users className="h-10 w-10 text-blue-500" />
            </div>
            <p className="text-gray-600 text-xl font-medium mb-2">No employees found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters or add some employees to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Users className="h-6 w-6 text-blue-600" />
          Employees ({employees.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
                <TableHead className="font-bold text-gray-700 text-sm">Name</TableHead>
                <TableHead className="font-bold text-gray-700 text-sm">Position</TableHead>
                <TableHead className="hidden sm:table-cell font-bold text-gray-700 text-sm">Department</TableHead>
                <TableHead className="hidden md:table-cell font-bold text-gray-700 text-sm">Salary</TableHead>
                <TableHead className="text-right font-bold text-gray-700 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow 
                  key={employee.id} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group border-b border-gray-100 hover:border-blue-200"
                >
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="group-hover:text-blue-700 transition-colors duration-300 font-semibold">
                        {employee.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-muted-foreground group-hover:text-gray-700 transition-colors duration-300">
                      {employee.position}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 group-hover:bg-blue-200 transition-colors duration-300">
                      {employee.department}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-4">
                    <span className="font-medium text-green-700 group-hover:text-green-800 transition-colors duration-300">
                      {employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <Link href={`/employee/${employee.id}`}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
