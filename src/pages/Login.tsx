import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { Eye, EyeOff } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log("1. Starting Login Request...");
      const response = await authService.login({ email, password })
      
      // Axios wraps backend data in .data
      // Java backend wraps its data in another .data field
      const apiResponse = (response as any).data;
      const data = apiResponse.data || apiResponse;
      
      console.log("2. Backend Data Received:", data);

      // Mapping Java Backend fields to Frontend User Interface
      const token = data.accessToken || data.token;
      const role = data.role ? data.role.toUpperCase() : null;

      if (!token || !role) {
        throw new Error(`Invalid response: Missing ${!token ? 'Token' : 'Role'}`);
      }

      const user = {
        id: String(data.userId || data.id),
        email: data.email,
        firstName: data.fullName ? data.fullName.split(' ')[0] : 'User',
        lastName: data.fullName?.includes(' ') ? data.fullName.split(' ')[1] : '',
        role: role,
        createdAt: new Date().toISOString()
      };

      console.log("3. Mapping Success, logging in context...");
      login(token, user)

      // 4. Hard redirect to prevent ProtectedRoute sync loops
      console.log("4. Redirecting to dashboard...");
      if (role === 'ADMIN') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/user/dashboard'
      }

    } catch (err: any) {
      console.error("🔥 Detailed Login Error:", err)
      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Chanakya</h1>
          <p className="text-slate-600 mt-2">Career Guidance Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Don't have an account? <Link to="/signup" className="text-slate-900 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login