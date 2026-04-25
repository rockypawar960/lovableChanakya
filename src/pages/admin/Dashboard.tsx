import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Users, Briefcase, CheckCircle, TrendingUp, AlertCircle, BookOpen } from 'lucide-react'
import { Loading } from '../../components/ui/Loading'
import { Alert } from '../../components/ui/Alert'

interface StatCardProps {
  icon: any
  label: string
  value: number
  subtext?: string
  color: string
  iconColor: string
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  iconColor,
}) => (
  <div className={`${color} p-6 rounded-lg border border-slate-200`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-slate-700">{label}</h3>
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
        <Icon size={20} className={iconColor} />
      </div>
    </div>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    {subtext && <p className="text-xs text-slate-600 mt-2">{subtext}</p>}
  </div>
)

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

  if (loading) {
    return <Loading message="Loading dashboard..." />
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

      {error && (
        <Alert type="error" title="Error" message={error} className="mb-6" />
      )}

      {stats && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              subtext={`${stats.activeUsers || 0} active`}
              color="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatCard
              icon={TrendingUp}
              label="New This Month"
              value={stats.userGrowth?.length || 0}
              color="bg-green-50"
              iconColor="text-green-600"
            />
            <StatCard
              icon={Briefcase}
              label="Careers"
              value={stats.totalCareers}
              color="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatCard
              icon={CheckCircle}
              label="Assessments"
              value={stats.completedAssessments}
              color="bg-orange-50"
              iconColor="text-orange-600"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">User Growth Trend</h3>
              <div className="space-y-3">
                {stats.userGrowth?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.date}</span>
                    <div className="flex-1 mx-4 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / Math.max(...stats.userGrowth.map((g: any) => g.count), 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Top Career Choices</h3>
              <div className="space-y-3">
                {stats.topCareers?.map((career: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700 font-medium">{career.title}</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 rounded-full h-2 w-24">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${(career.count / Math.max(...stats.topCareers.map((c: any) => c.count), 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 min-w-fit">{career.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Avg User Score</h3>
              <p className="text-3xl font-bold text-slate-900">
                {stats.averageUserScore?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Learning Paths</h3>
              <p className="text-3xl font-bold text-slate-900">{stats.enrolledLearningPaths || 0}</p>
              <p className="text-xs text-slate-600 mt-1">Total enrollments</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Platform Health</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-green-600">Healthy</span>
                <span className="w-2 h-2 bg-green-600 rounded-full mb-2"></span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard