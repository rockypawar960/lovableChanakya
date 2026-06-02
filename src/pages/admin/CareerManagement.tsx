import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Trash2, Edit2, Plus, Search, AlertCircle } from 'lucide-react'
import { usePagination } from '../../hooks/usePagination'
import { Loading } from '../../components/ui/Loading'
import { Alert } from '../../components/ui/Alert'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'

const CareerManagement: React.FC = () => {
  const [careers, setCareers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    averageSalary: '',
    jobOutlook: '',
    requiredSkills: '',
    educationLevel: '',
  })
  const [deleting, setDeleting] = useState<string | null>(null)
  const pagination = usePagination(20)

  // ✅ Ye wala (API call)
  useEffect(() => {
    fetchCareers()
  }, [pagination.page, searchQuery])

  // ✅ Ye wala (page reset on search)
  useEffect(() => {
    pagination.goToPage(1)
  }, [searchQuery])
  const fetchCareers = async () => {
  try {
    setLoading(true)

    const response = await adminService.getAllCareers(
      pagination.page,
      pagination.limit,
      searchQuery || undefined
    )

    console.log(response.data[0]) // 👈 ye add karo

    setCareers(response.data)
    pagination.setTotal(response.total)

  } catch (err) {
    setError('Failed to load careers')
    console.error(err)
  } finally {
    setLoading(false)
  }
}

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // Backend ke JSON format ke hisaab se payload taiyar kiya
    const payload = {
      name: formData.title, // 'title' ko 'name' mein map kiya backend ke liye
      description: formData.description,
      popularityScore: 0, // Default value
      isActive: true,     // Naya career by default active
    };

    if (editingId) {
      await adminService.updateCareer(editingId, payload);
      setCareers((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
      );
    } else {
      // API call
      const newCareer = await adminService.createCareer(payload);
      setCareers((prev) => [newCareer, ...prev]);
    }

    // Form reset logic
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      averageSalary: '',
      jobOutlook: '',
      requiredSkills: '',
      educationLevel: '',
    });
  } catch (err) {
    setError('Failed to save career');
    console.error(err);
  }
};
  const handleEdit = (career: any) => {
    setFormData({
      ...career,
      requiredSkills: career.requiredSkills.join(', '),
    })
    setEditingId(career.id)
    setShowForm(true)
  }

  const handleDelete = async (careerId: string) => {
    if (!window.confirm('Are you sure you want to delete this career?')) return

    setDeleting(careerId)
    try {
      await adminService.deleteCareer(careerId)
      setCareers((prev) => prev.filter((c) => c.id !== careerId))
    } catch (err) {
      setError('Failed to delete career')
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading careers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Career Management</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({
              title: '',
              description: '',
              averageSalary: '',
              jobOutlook: '',
              requiredSkills: '',
              educationLevel: '',
            })
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800"
        >
          <Plus size={20} />
          Add Career
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
     {showForm && (
  <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 shadow-sm">
    <h2 className="text-xl font-bold text-slate-900 mb-6">
      {editingId ? 'Edit Career' : 'Add New Career'}
    </h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Career Name (Mapped to 'title' in formData) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Career Name</label>
          <input
            type="text"
            placeholder="e.g. Software Engineer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            placeholder="Describe the career responsibilities..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            rows={4}
            required
          ></textarea>
        </div>
      </div>

      {/* Note for UI: Extra fields hidden as they aren't in your current backend JSON */}
      <p className="text-xs text-slate-500 italic">
        * Popularity score and Status are managed automatically.
      </p>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          {editingId ? 'Update Career' : 'Save Career'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false)
            setEditingId(null)
            setFormData({
              title: '',
              description: '',
              averageSalary: '',
              jobOutlook: '',
              requiredSkills: '',
              educationLevel: '',
            })
          }}
          className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search careers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>

      {/* Careers List */}
      <div className="space-y-4">
        {careers.map((career) => (
          <div key={career.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{career.name}</h3>
                <p className="text-slate-600 mt-1">{career.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(career)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(career.id)}
                  disabled={deleting === career.id}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* <div>
                <p className="text-xs text-slate-600">Salary</p>
                <p className="font-semibold text-slate-900">{career.averageSalary}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Outlook</p>
                <p className="font-semibold text-slate-900">{career.jobOutlook}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Education</p>
                <p className="font-semibold text-slate-900">{career.educationLevel}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Skills</p>
                <p className="font-semibold text-slate-900">
                  {career.requiredSkills?.length || 0}
                </p>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={() => pagination.prevPage()}
          disabled={pagination.page === 1}
          className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-6 py-2 text-slate-700">Page {pagination.page}</span>
        <button
          onClick={() => pagination.nextPage()}
          disabled={careers.length < pagination.limit}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default CareerManagement
