import React from 'react'
import { AlertCircle } from 'lucide-react'

const AssessmentManagement: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Assessment Management</h1>

      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <AlertCircle size={48} className="text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Coming Soon</h3>
        <p className="text-slate-600">Assessment management features are under development.</p>
      </div>
    </div>
  )
}

export default AssessmentManagement
