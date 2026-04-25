import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService, Assessment as AssessmentType } from '../../services/userService'
import { AlertCircle, CheckCircle } from 'lucide-react'

const Assessment: React.FC = () => {
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState<AssessmentType | null>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchAssessment()
  }, [])

  const fetchAssessment = async () => {
    try {
      const data = await userService.getAssessment()
      setAssessment(data)
    } catch (err) {
      setError('Failed to load assessment')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const startAssessment = (assessment: AssessmentType) => {
    setSelectedAssessment(assessment)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSubmitted(false)
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    if (!selectedAssessment) return
    setSubmitting(true)
    setError('')
    try {
      const res = await userService.submitAssessment(answers)
      // Extract assessmentId from response (res.data or res.data.assessmentId)
      const assessmentId = res.data?.assessmentId || res.data

      if (assessmentId) {
        // ✅ Redirect to recommendations with the dynamic ID
        navigate(`/user/recommendations/assessment/${assessmentId}`)
      } else {
        throw new Error("Assessment ID not found in response")
      }
    } catch (err) {
      setError('Failed to process results. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const currentQuestion = selectedAssessment?.questions[currentQuestionIndex]
  const canProceedToNext = currentQuestionIndex < (selectedAssessment?.questions.length || 0) - 1
  const canSubmit = Object.keys(answers).length === (selectedAssessment?.questions.length || 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Career Assessment</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!selectedAssessment && assessment && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-md">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{assessment.title}</h3>
          <p className="text-slate-600 mb-4">{assessment.description}</p>
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between"><span>Questions:</span><span>{assessment.totalQuestions}</span></div>
            <div className="flex justify-between"><span>Est. Time:</span><span>{assessment.estimatedTime} min</span></div>
          </div>
          <button onClick={() => startAssessment(assessment)} className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors">
            Start Assessment
          </button>
        </div>
      )}

      {selectedAssessment && !submitted && currentQuestion && (
        <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4">{selectedAssessment.title}</h2>
          <div className="w-full bg-slate-200 h-2 rounded mb-4">
            <div className="bg-slate-900 h-2 rounded transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100}%` }}></div>
          </div>
          <p className="text-sm text-slate-500 mb-4">Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}</p>
          <h3 className="text-lg font-semibold mb-6">{currentQuestion.text}</h3>

          <div className="space-y-3">
            {currentQuestion.options?.map((opt: any) => (
              <label key={opt.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${answers[currentQuestion.id] === opt.id ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-400'}`}>
                <input type="radio" name={`q-${currentQuestion.id}`} checked={answers[currentQuestion.id] === opt.id} onChange={() => handleAnswer(currentQuestion.id, opt.id)} className="mr-3 w-4 h-4 accent-slate-900" />
                <span className="text-slate-700">{opt.text}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0} className="px-6 py-2 border rounded-lg disabled:opacity-50">Previous</button>
            {canProceedToNext ? (
              <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} disabled={!answers[currentQuestion.id]} className="px-6 py-2 bg-slate-900 text-white rounded-lg disabled:opacity-50">Next</button>
            ) : (
              <button onClick={handleSubmit} disabled={!canSubmit || submitting} className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Assessment