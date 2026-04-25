import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { userService, Recommendation } from '../../services/userService'
import { Briefcase, TrendingUp, Info } from 'lucide-react'
import { Loading } from '../../components/ui/Loading'
import { Alert } from '../../components/ui/Alert'
import { useNavigate } from "react-router-dom";


const Recommendations: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate();


  useEffect(() => {
    loadData()
  }, [assessmentId])

  const loadData = async () => {
    try {
      setLoading(true)
      let data;
      if (assessmentId) {
        data = await userService.getRecommendations(assessmentId)
      } else {
        data = await userService.getMyRecommendations()
      }
      // Backend se jo data aa raha hai use set karein
      setRecommendations(data || [])
    } catch (err) {
      setError('Failed to load recommendations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Analyzing your career matches..." />

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Recommendations</h1>
      <p className="text-slate-600 mb-8">
        {assessmentId ? `Based on Assessment #${assessmentId}` : 'Your latest career matches based on your profile'}
      </p>

      {error && <Alert type="error" title="Error" message={error} className="mb-6" />}

      {recommendations.length === 0 && !loading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Briefcase size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Recommendations Found</h3>
          <p className="text-slate-600">Please complete an assessment to see results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={18} className="text-blue-600" />
                    <h3 className="text-2xl font-bold text-slate-900">{rec.careerName}</h3>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600 mt-2">
                    <Info size={16} className="mt-1 flex-shrink-0" />
                    <p className="text-sm italic">{rec.reasoning}</p>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg ${
                    rec.matchScore > 70 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <TrendingUp size={20} />
                    <span className="text-lg font-bold">{Math.round(rec.matchScore)}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Match Score</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                <p className="text-sm text-slate-500">Career ID: {rec.careerId}</p>
                <button 
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                  onClick={() => navigate(`/user/learning-paths?careerId=${rec.careerId}`)}
                >
                  View Learning Path →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Recommendations