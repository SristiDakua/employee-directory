import { DepartmentManager } from '@/components/DepartmentManager'
import Link from 'next/link'
import { Users, Building } from 'lucide-react'

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 text-lg font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              <Users className="h-5 w-5" />
              <span>Employees</span>
            </Link>
            <Link href="/departments" className="flex items-center space-x-2 text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              <Building className="h-5 w-5" />
              <span>Departments</span>
            </Link>
          </div>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Department Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage company departments and their floor locations
          </p>
        </div>
        
        <DepartmentManager />
      </div>
    </div>
  )
}
