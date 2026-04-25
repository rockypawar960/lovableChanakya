import React, { useState, useEffect } from 'react'
import { userService } from '../../services/userService'
import { TrendingUp, Target, Award, Flame, AlertCircle } from 'lucide-react'

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<any>(null)
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const data = await userService.getProgress()
      setProgress(data)

      const now = new Date()
      const monthlyStats = await userService.getProgressByMonth(
        now.getFullYear(),
        now.getMonth() + 1
      )
      setMonthlyData(monthlyStats)
    } catch (err) {
      setError('Failed to load progress data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading progress data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Progress</h1>
      <p className="text-slate-600 mb-8">Track your learning journey and achievements</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {progress && (
        <>
          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ProgressCard
              icon={Award}
              label="Assessments"
              value={`${progress.completedAssessments}/${progress.totalAssessments}`}
              color="bg-blue-50"
              iconColor="text-blue-600"
            />
            <ProgressCard
              icon={Target}
              label="Learning Paths"
              value={`${progress.completedLearningPaths}/${progress.enrolledLearningPaths}`}
              color="bg-green-50"
              iconColor="text-green-600"
            />
            <ProgressCard
              icon={TrendingUp}
              label="Learning Hours"
              value={progress.totalLearningHours}
              suffix="h"
              color="bg-purple-50"
              iconColor="text-purple-600"
            />
            <ProgressCard
              icon={Flame}
              label="Current Streak"
              value={progress.currentStreak}
              suffix="d"
              color="bg-orange-50"
              iconColor="text-orange-600"
            />
          </div>

          {/* Main Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assessment Progress */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Assessment Progress</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-600">Completed</span>
                <span className="font-semibold text-slate-900">
                  {progress.completedAssessments}/{progress.totalAssessments}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(progress.completedAssessments / progress.totalAssessments) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {Math.round((progress.completedAssessments / progress.totalAssessments) * 100) || 0}% Complete
              </p>
            </div>

            {/* Learning Path Progress */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Learning Paths</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-600">Completed</span>
                <span className="font-semibold text-slate-900">
                  {progress.completedLearningPaths}/{progress.enrolledLearningPaths}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(progress.completedLearningPaths / progress.enrolledLearningPaths) * 100 || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {Math.round((progress.completedLearningPaths / progress.enrolledLearningPaths) * 100) || 0}% Complete
              </p>
            </div>

            {/* Resources Viewed */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Resources</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Viewed</p>
                  <p className="text-2xl font-bold text-slate-900">{progress.totalResourcesViewed}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Bookmarked</p>
                  <p className="text-2xl font-bold text-slate-900">{progress.bookmarkedResources}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Activity */}
          {monthlyData.length > 0 && (
            <div className="mt-8 bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Monthly Activity</h3>
              <div className="space-y-3">
                {monthlyData.map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{day.date}</span>
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(day.hours / Math.max(...monthlyData.map((d) => d.hours))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 min-w-fit">{day.hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Activity */}
          {progress.lastActivityDate && (
            <div className="mt-8 bg-slate-50 rounded-lg border border-slate-200 p-6 text-center">
              <p className="text-slate-600 text-sm mb-1">Last Activity</p>
              <p className="text-xl font-semibold text-slate-900">
                {new Date(progress.lastActivityDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface ProgressCardProps {
  icon: React.ElementType; // React.ReactType ki jagah ye likhein
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
  iconColor: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  icon: Icon,
  label,
  value,
  suffix = '',
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
    <p className="text-3xl font-bold text-slate-900">
      {value}
      {suffix}
    </p>
  </div>
)

export default Progress
