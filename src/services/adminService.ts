import api from './api'

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin: string
}

export interface Career {
  id: number           // JSON mein number hai
  name: string         // title ki jagah name
  description: string
  popularityScore: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
export interface DashboardStats {
  totalUsers: number
  totalAssessments: number
  activeUsersDaily: number
  activeUsersWeekly: number
  assessmentCompletionRate: number
  topCareers: { 
    careerId: number; 
    careerName: string; 
    popularityScore: number; 
    recommendationCount: number 
  }[]
  careerPopularityDistribution: Record<string, number>
  userRegistrationTrend: { date: string; count: number }[]
  assessmentCompletionTrend: { date: string; count: number }[]
}

export interface Assessment {
      id: number
      userId: number
      userEmail: string
      userFullName: string
      totalScore: number
      completedAt: string
      isActive: boolean
      bucketScores: {
        SOCIAL: number
        BUSINESS: number
        CREATIVE: number
        TECHNICAL: number
        ANALYTICAL: number
      }
}

export interface LearningPath {
  id: number
  careerId: number
  pathName: string
  description: string
  durationMonths: number
  stepsCount: number
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminQueryResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats')
    return response.data.data
  },

  // User Management
  getAllUsers: async (
  page: number = 0, // Spring Boot starts from 0
  limit: number = 10,
  search?: string,
  status?: string
): Promise<AdminQueryResponse<AdminUser>> => {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('size', limit.toString()) // 'limit' ko 'size' kar diya backend ke liye
  if (search) params.append('search', search)
  if (status) params.append('status', status)

  const response = await api.get(`/admin/users?${params.toString()}`)
  
  // Backend ApiResponse wrapper se 'data' (PaginatedResponse) nikalna
  const backendData = response.data.data
    
    return {
        data: backendData.content || [],
        total: backendData.totalElements || 0,
        page: backendData.pageNumber,
        limit: backendData.pageSize
    }
},

  getUserDetails: async (userId: string): Promise<AdminUser> => {
    const response = await api.get(`/admin/users/${userId}`)
    return response.data
  },

  updateUserRole: async (userId: string, role: string): Promise<AdminUser> => {
    const response = await api.put(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  updateUserStatus: async (
    userId: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<AdminUser> => {
    const response = await api.put(`/admin/users/${userId}/status`, { status })
    return response.data
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`)
  },

  // Career Management
  getAllCareers: async (
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<AdminQueryResponse<Career>> => {
  const params = new URLSearchParams()
  // Spring Boot 0-indexed hota hai, isliye (page - 1)
  params.append('page', (page - 1).toString())
  params.append('limit', limit.toString())
  if (search) params.append('search', search)

  const response = await api.get(`/admin/careers?${params.toString()}`)
  
  // Aapka data 'response.data.data' ke andar hai
  const result = response.data.data 

  return {
      data: result.content || [],
      total: result.totalElements || 0,
      page: result.pageNumber + 1, // Frontend ke liye vapas 1-based kar rahe hain
      limit: result.pageSize
  }
},
  getCareerDetails: async (careerId: string): Promise<Career> => {
    const response = await api.get(`/admin/careers/${careerId}`)
    return response.data
  },

  createCareer: async (data: Omit<Career, 'id' | 'createdAt' | 'updatedAt'>): Promise<Career> => {
    const response = await api.post('/admin/careers', data)
    return response.data
  },

  updateCareer: async (careerId: string, data: Partial<Career>): Promise<Career> => {
    const response = await api.put(`/admin/careers/${careerId}`, data)
    return response.data
  },

  deleteCareer: async (careerId: string): Promise<void> => {
    await api.delete(`/admin/careers/${careerId}`)
  },

  // Assessment Management
  getAllAssessments: async (
    page: number = 1,
    limit: number = 20
  ): Promise<AdminQueryResponse<any>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await api.get(`/admin/assessments?...`)

      return {
    data: response.data.data.content,
    total: response.data.data.totalElements,
    page: response.data.data.pageNumber + 1, // backend 0-based hai
    limit: response.data.data.pageSize
  }
  },

  getAssessmentDetails: async (assessmentId: string): Promise<any> => {
    const response = await api.get(`/admin/assessments/${assessmentId}`)
    return response.data
  },

  createAssessment: async (data: any): Promise<any> => {
    const response = await api.post('/admin/assessments', data)
    return response.data
  },

  updateAssessment: async (assessmentId: string, data: any): Promise<any> => {
    const response = await api.put(`/admin/assessments/${assessmentId}`, data)
    return response.data
  },

  deleteAssessment: async (assessmentId: string): Promise<void> => {
    await api.delete(`/admin/assessments/${assessmentId}`)
  },

  getAssessmentResponses: async (
    assessmentId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<AdminQueryResponse<any>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await api.get(`/admin/assessments/${assessmentId}/responses?${params.toString()}`)
    return response.data
  },

  // Learning Path Management
  getAllLearningPaths: async (
    page: number = 1,
    limit: number = 20
  ): Promise<AdminQueryResponse<any>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await api.get(`/admin/learning-paths?${params.toString()}`)
    

      return {
    data: response.data.data.content,
    total: response.data.data.totalElements,
    page: response.data.data.pageNumber + 1, // backend 0-based hai
    limit: response.data.data.pageSize
  }
  },

  getLearningPathDetails: async (pathId: string): Promise<any> => {
    const response = await api.get(`/admin/learning-paths/${pathId}`)
    return response.data
  },

  createLearningPath: async (data: any): Promise<any> => {
    const response = await api.post('/admin/learning-paths', data)
    return response.data
  },

  updateLearningPath: async (pathId: string, data: any): Promise<any> => {
    const response = await api.put(`/admin/learning-paths/${pathId}`, data)
    return response.data
  },

  deleteLearningPath: async (pathId: string): Promise<void> => {
    await api.delete(`/admin/learning-paths/${pathId}`)
  },

  // Resource Management
  getAllResources: async (
    page: number = 1,
    limit: number = 20,
    type?: string
  ): Promise<AdminQueryResponse<any>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (type) params.append('type', type)

    const response = await api.get(`/admin/resources?${params.toString()}`)
    return response.data
  },

  getResourceDetails: async (resourceId: string): Promise<any> => {
    const response = await api.get(`/admin/resources/${resourceId}`)
    return response.data
  },

  createResource: async (data: any): Promise<any> => {
    const response = await api.post('/admin/resources', data)
    return response.data
  },

  updateResource: async (resourceId: string, data: any): Promise<any> => {
    const response = await api.put(`/admin/resources/${resourceId}`, data)
    return response.data
  },

  deleteResource: async (resourceId: string): Promise<void> => {
    await api.delete(`/admin/resources/${resourceId}`)
  },

  // Activity Logs
  getActivityLogs: async (
    page: number = 1,
    limit: number = 50
  ): Promise<AdminQueryResponse<any>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await api.get(`/admin/activity-logs?${params.toString()}`)
    return response.data
  },
}
