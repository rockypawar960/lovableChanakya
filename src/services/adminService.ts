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
  id: string
  title: string
  description: string
  averageSalary: string
  jobOutlook: string
  requiredSkills: string[]
  educationLevel: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCareers: number
  completedAssessments: number
  enrolledLearningPaths: number
  averageUserScore: number
  userGrowth: { date: string; count: number }[]
  topCareers: { title: string; count: number }[]
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
    return response.data
  },

  // User Management
  getAllUsers: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string
  ): Promise<AdminQueryResponse<AdminUser>> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (search) params.append('search', search)
    if (status) params.append('status', status)

    const response = await api.get(`/admin/users?${params.toString()}`)
    return response.data
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
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (search) params.append('search', search)

    const response = await api.get(`/admin/careers?${params.toString()}`)
    return response.data
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

    const response = await api.get(`/admin/assessments?${params.toString()}`)
    return response.data
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
    return response.data
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
