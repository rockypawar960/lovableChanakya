import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react'
import { Loading } from '../../components/ui/Loading'
import { Alert } from '../../components/ui/Alert'
import { StatCard } from '../../components/StatCard'

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (err) {
      setError('Failed to load dashboard statistics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading dashboard..." />

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

      {error && <Alert type="error" title="Error" message={error} className="mb-6" />}

      {stats && (
        <>
          {/* 1. Key Metrics - StatCard Props fixed according to your component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users size={20} className="text-blue-600" />}
              title="Total Users"
              value={stats.totalUsers}
              backgroundColor="bg-blue-50"
              trend={{ value: stats.activeUsersWeekly || 0, isPositive: true }}
            />
            <StatCard
              icon={<TrendingUp size={20} className="text-green-600" />}
              title="Completion Rate"
              value={`${Math.round(stats.assessmentCompletionRate || 0)}%`}
              backgroundColor="bg-green-50"
            />
            <StatCard
              icon={<Briefcase size={20} className="text-purple-600" />}
              title="Total Careers"
              value={Object.keys(stats.careerPopularityDistribution || {}).length}
              backgroundColor="bg-purple-50"
            />
            <StatCard
              icon={<CheckCircle size={20} className="text-orange-600" />}
              title="Assessments"
              value={stats.totalAssessments}
              backgroundColor="bg-orange-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 2. Assessment Activity Trend */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Assessment Activity</h3>
              <div className="space-y-4">
                {stats.assessmentCompletionTrend?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 w-24">{item.date}</span>
                    <div className="flex-1 mx-4 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.count / (Math.max(...stats.assessmentCompletionTrend.map((g: any) => g.count)) || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Popular Recommendations */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Popular Recommendations</h3>
              <div className="space-y-4">
                {stats.topCareers?.map((career: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between pb-2 border-b border-slate-50 last:border-0">
                    <span className="text-slate-700 font-medium">{career.careerName}</span>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 rounded-full h-2 w-24 hidden sm:block">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${(career.recommendationCount / (Math.max(...stats.topCareers.map((c: any) => c.recommendationCount)) || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 bg-purple-50 px-2 py-1 rounded">
                        {career.recommendationCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Market Demand Grid */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Market Demand (Popularity Score)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.careerPopularityDistribution || {})
                .sort(([, a]: any, [, b]: any) => b - a) // Sort by score
                .slice(0, 10)
                .map(([name, score]: any) => (
                  <div key={name} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 truncate mb-1" title={name}>{name}</p>
                    <p className="text-xl font-bold text-slate-800">{score}</p>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard