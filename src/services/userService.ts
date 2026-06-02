import api from './api'

export interface AssessmentQuestion {
  id: string
  text: string
  type: "single" | "multiple"
  options?: Option[]
  minRating?: number
  maxRating?: number
}

export interface Option {
  id: string
  text: string
}

export interface Assessment {
  id: string
  title: string
  description: string
  totalQuestions: number
  estimatedTime: number
  questions: AssessmentQuestion[]
}

export interface AssessmentResult {
  id: string
  assessmentId: string
  userId: string
  answers: Record<string, string | number>
  score: number
  completedAt: string
}

export interface Recommendation {
  id: number
  careerId: number
  careerName: string
  matchScore: number
  reasoning: string
  isActive: boolean
}

export interface LearningPath {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  courses: {
    id: string
    title: string
    description: string
    duration: string
    provider: string
  }[]
  enrollmentId?: string
  enrollmentStatus?: 'enrolled' | 'completed'
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'video' | 'article' | 'course' | 'book'
  url: string
  provider: string
  category: string
  level: string
  isBookmarked?: boolean
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  bio: string
  skills: string[]
  interests: string[]
  educationLevel: string
  yearsOfExperience: number
  careerGoal: string
  profilePictureUrl: string
}

export interface ProgressData {
  totalAssessments: number
  completedAssessments: number
  enrolledLearningPaths: number
  completedLearningPaths: number
  totalResourcesViewed: number
  bookmarkedResources: number
  currentStreak: number
  totalLearningHours: number
  lastActivityDate: string
}

export const userService = {
  // Profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/user/profile')
    return response.data
  },

  getDashboard: async () => {
    const response = await api.get('/user/dashboard')
    return response.data
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/user/profile', data)
    return response.data
  },

  uploadProfilePicture: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/user/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // Assessments
  getAvailableAssessments: async (): Promise<Assessment[]> => {
    const response = await api.get('/user/assessments/questions')
    return response.data
  },

  getAssessmentDetails: async (assessmentId: string): Promise<Assessment> => {
    const response = await api.get(`/user/assessments/${assessmentId}`)
    return response.data
  },

  getAssessment: async (): Promise<Assessment> => {
    const response = await api.get('/user/assessments/questions')
    const questions = response.data.data

    return {
      id: 'global',
      title: 'Career Assessment',
      description: 'Answer these questions to get personalized career recommendations',
      totalQuestions: questions.length,
      estimatedTime: Math.ceil(questions.length * 0.5),

      questions: questions.map((q: any) => ({
        id: q.id.toString(),
        text: q.questionText,
        type: q.questionType === 'SINGLE_CHOICE' ? 'single' : 'multiple', 
        options: q.options?.map((opt: any) => ({
          id: opt.id.toString(),
          text: opt.optionText
        })) || []
      }))
    }
  },



  submitAssessment: async (answers: Record<string, string | number>) => {
    const response = await api.post('/user/assessments/submit', {
      answers: answers,
    })
    return response.data
  },

  getAssessmentResults: async (): Promise<AssessmentResult[]> => {
    const response = await api.get('/user/assessments/results')
    return response.data
  },

  // Recommendations
  // FIXED: Matches your Java Controller @GetMapping("/assessment/{assessmentId}")
  getRecommendations: async (assessmentId: string | number): Promise<Recommendation[]> => {
    const response = await api.get(`/user/recommendations/assessment/${assessmentId}`)
    return response.data.data
  },

  getMyRecommendations: async (): Promise<Recommendation[]> => {
  const response = await api.get('/user/recommendations/my')
  return response.data.data
},

  getRecommendationDetails: async (recommendationId: string): Promise<Recommendation> => {
    const response = await api.get(`/user/recommendations/${recommendationId}`)
    return response.data.data
  },

  // Learning Paths
  getAvailableLearningPaths: async (
    page?: number,
    limit?: number,
    level?: string
  ): Promise<{ paths: LearningPath[]; total: number }> => {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    if (level) params.append('level', level)

    const response = await api.get(`/user/learning-paths?${params.toString()}`)
    return response.data
  },

  // Current Active Learning Path
  getCurrentLearningPath: async () => {
    const response = await api.get('/user/learning-paths/current')
    return response.data.data
  },

  setCurrentLearningPath: async (pathId: number) => {
  const res = await api.post(
    `/user/learning-paths/${pathId}/set-current`
  )
  return res.data
  },

  getLearningPathByCareerId: async (careerId: number) => {
  if (!careerId) throw new Error("Career ID not found")

  const response = await api.post(`/user/learning-paths/generate?careerId=${careerId}`)
  
  return response.data.data   // ✅ IMPORTANT FIX
  },

  getLearningPathDetails: async (pathId: string): Promise<LearningPath> => {
    const response = await api.get(`/user/learning-paths/${pathId}`)
    return response.data
  },

  enrollLearningPath: async (pathId: string): Promise<{ enrollmentId: string }> => {
    const response = await api.post(`/user/learning-paths/${pathId}/enroll`)
    return response.data
  },

  getEnrolledLearningPaths: async (): Promise<LearningPath[]> => {
    const response = await api.get('/user/learning-paths/enrolled')
    return response.data
  },

    // 🔥 STEP TRACKING
updateStepStatus: async (stepId: number, status: string) => {
  return api.post(`/user/progress/update`, {
    stepId,
    status
  })
},

// 🔥 PROGRESS %
getProgressByPathId: async (pathId: number) => {
  const res = await api.get(`/user/progress/${pathId}`)
  return res.data.data   // 🔥 FIX
},

  // Resources
  searchResources: async (
    query?: string,
    type?: string,
    page?: number,
    limit?: number
  ): Promise<{ resources: Resource[]; total: number }> => {
    const params = new URLSearchParams()
    if (query) params.append('query', query)
    if (type) params.append('type', type)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())

    const response = await api.get(`/user/resources/search?${params.toString()}`)
    return response.data
  },

  generateResources: async (
  skill: string,
  level: string = 'BEGINNER',
  language: string = 'both'
) => {
  const response = await api.post(
    `/resources/search?skill=${encodeURIComponent(skill)}&level=${level}&language=${language}`
  )

  return response.data
},
  getResourceDetails: async (resourceId: string): Promise<Resource> => {
    const response = await api.get(`/user/resources/${resourceId}`)
    return response.data
  },

  bookmarkResource: async (resourceId: string): Promise<void> => {
    await api.post(`/user/resources/${resourceId}/bookmark`)
  },

  removeBookmark: async (resourceId: string): Promise<void> => {
    await api.delete(`/user/resources/${resourceId}/bookmark`)
  },

  getBookmarkedResources: async (page?: number, limit?: number): Promise<{ resources: Resource[]; total: number }> => {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())

    const response = await api.get(`/user/resources/bookmarked?${params.toString()}`)
    return response.data
  },

  // Progress
  getProgress: async (): Promise<ProgressData> => {
    const response = await api.get('/user/progress')
    return response.data
  },

  getProgressByMonth: async (
    year?: number,
    month?: number
  ): Promise<{ date: string; hours: number }[]> => {
    const params = new URLSearchParams()
    if (year) params.append('year', year.toString())
    if (month) params.append('month', month.toString())

    const response = await api.get(`/user/progress/monthly?${params.toString()}`)
    return response.data
  },
}