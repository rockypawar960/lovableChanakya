import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { userService } from '../../services/userService'
import { Clock, TrendingUp, BookOpen, Lightbulb, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/Card'
import { StatCard } from '../../components/StatCard' 

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userService.getDashboard()

        if (response && response.data) {
          setDashboard(response.data)

          // ✅ Save careerId globally
          if (response.data.careerId) {
            localStorage.setItem("careerId", response.data.careerId)
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  // ✅ Helper function (IMPORTANT)
  const goToLearningPath = (careerId: number) => {
    if (!careerId) return
    navigate(`/user/learning-paths?careerId=${careerId}`)
  }

  const quickActions = [
    {
      icon: Clock,
      title: 'Take Assessment',
      description: 'Discover your career aptitude',
      action: () => navigate('/user/assessment'),
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Lightbulb,
      title: 'View Recommendations',
      description: 'See personalized career paths',
      action: () => navigate('/user/recommendations'),
      color: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      icon: BookOpen,
      title: 'Learning Paths',
      description: 'Enroll in structured courses',
      action: () => {
        const id = dashboard?.careerId || localStorage.getItem("careerId")
        if (id) {
          navigate(`/user/learning-paths?careerId=${id}`)
        } else {
          alert("Career not found. Please complete assessment.")
        }
      },
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey',
      action: () => navigate('/user/progress'),
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto p-4">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {dashboard?.name || user?.firstName}!
        </h1>
        <p className="text-slate-600 mt-2">
          Continue your career exploration journey
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Stats */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Assessments" value={dashboard.assessmentsCompleted} icon={<Clock size={20} />} backgroundColor="bg-blue-50" />
          <StatCard title="Learning Paths" value={dashboard.learningPathsEnrolled} icon={<BookOpen size={20} />} backgroundColor="bg-green-50" />
          <StatCard title="Hours Spent" value={`${dashboard.totalLearningHours}h`} icon={<TrendingUp size={20} />} backgroundColor="bg-purple-50" />
          <StatCard title="Skills Tracked" value={dashboard.skillsTracked} icon={<Lightbulb size={20} />} backgroundColor="bg-yellow-50" />
        </div>
      )}

      {/* Recommendations */}
      {dashboard?.recommendations?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Recommended Careers</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {dashboard.recommendations.map((rec: any) => (
              <Card key={rec.id}>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg">{rec.careerName}</h3>
                  <p className="text-sm text-slate-600 mt-2">{rec.reasoning}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-blue-600 font-bold">{rec.matchScore}%</span>

                    {/* ✅ FIXED BUTTON */}
                    <button
                      onClick={() => goToLearningPath(rec.careerId)}
                      className="text-sm text-blue-600"
                    >
                      View Path →
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={action.action}
                className="p-6 bg-white border rounded-lg hover:shadow-md text-left"
              >
                <div className={`${action.color} w-12 h-12 flex items-center justify-center rounded mb-4`}>
                  <Icon className={action.iconColor} />
                </div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard