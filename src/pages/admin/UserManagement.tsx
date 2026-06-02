import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Trash2, Edit2, Search, AlertCircle } from 'lucide-react'
import { usePagination } from '../../hooks/usePagination'
import { Loading } from '../../components/ui/Loading'

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Spring Boot starts page from 0, change if your hook handles it differently
  const pagination = usePagination(10)

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, searchQuery, selectedStatus])

 const fetchUsers = async () => {
  try {
    setLoading(true)
    const response = await adminService.getAllUsers(
      pagination.page - 1, 
      pagination.limit,
      searchQuery || undefined,
      selectedStatus || undefined
    )
    
    // Ab interface ke hisaab se 'data' aur 'total' chalega
    setUsers(response.data) 
    
    if ((pagination as any).setTotal) {
      (pagination as any).setTotal(response.total)
    }
  } catch (err) {
    setError('Failed to load users.')
  } finally {
    setLoading(false)
  }
}

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    setDeleting(userId)
    try {
      await adminService.deleteUser(userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      setError('Failed to delete user')
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const handleStatusChange = async (userId: string, currentStatus: boolean) => {
    try {
      // Logic for toggling isActive based on your API
      await adminService.updateUserStatus(userId, !currentStatus ? 'active' : 'inactive')
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u))
      )
    } catch (err) {
      setError('Failed to update user status')
    }
  }

  if (loading && users.length === 0) {
    return <Loading message="Loading users from database..." />
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">User Management</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Roles</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Assessments</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{user.fullName || `${user.firstName} ${user.lastName}`}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roleNames?.map((role: string) => (
                          <span key={role} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-bold">
                            {role.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      <span className="font-semibold">{user.assessmentCount || 0}</span> completed
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStatusChange(user.id, user.isActive)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                          title="Toggle Status"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleting === user.id}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => pagination.prevPage()}
          disabled={pagination.page === 1}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40"
        >
          Previous
        </button>
        <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Page</span>
            <span className="font-bold text-slate-900">{pagination.page}</span>
        </div>
        <button
          onClick={() => pagination.nextPage()}
          disabled={users.length < pagination.limit}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default UserManagement