import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Roles are 'ADMIN' | 'USER' (uppercase) per AuthContext
  const isAdmin = user?.role === 'ADMIN'
  const isUser = user?.role === 'USER'

  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={user ? (isAdmin ? '/admin' : '/user/dashboard') : '/'}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-bold text-blue-600">Chanakya</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {!user && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}

            {isUser && (
              <>
                <Link to="/user/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/user/assessment" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Assessment
                </Link>
                <Link to="/user/recommendations" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Recommendations
                </Link>
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <button onClick={logout} className="text-gray-700 hover:text-red-600 transition-colors">
                    Logout
                  </button>
                </div>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Users
                </Link>
                <Link to="/admin/careers" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Careers
                </Link>
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <button onClick={logout} className="text-gray-700 hover:text-red-600 transition-colors">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 pt-2">
            {!user && (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600" onClick={closeMobile}>
                  Login
                </Link>
                <Link to="/signup" className="block py-2 text-gray-700 hover:text-blue-600" onClick={closeMobile}>
                  Sign Up
                </Link>
              </>
            )}

            {isUser && (
              <>
                <Link to="/user/dashboard" className="block py-2 text-gray-700 hover:text-blue-600" onClick={closeMobile}>
                  Dashboard
                </Link>
                <Link to="/user/assessment" className="block py-2 text-gray-700 hover:text-blue-600" onClick={closeMobile}>
                  Assessment
                </Link>
                <Link to="/user/recommendations" className="block py-2 text-gray-700 hover:text-blue-600" onClick={closeMobile}>
                  Recommendations
                </Link>
                <button
                  onClick={() => { logout(); closeMobile() }}
                  className="block py-2 text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" className="block py-2 text-gray-700 hover:text-blue-600" onClick={closeMobile}>
                  Dashboard
                </Link>
                <Link to="/admin/users" className="block py-2 text-gray-700 hover:text-blue-600" onClick={closeMobile}>
                  Users
                </Link>
                <Link to="/admin/careers" className="block py-2 text-gray-700 hover:text-blue-600" onClick={closeMobile}>
                  Careers
                </Link>
                <button
                  onClick={() => { logout(); closeMobile() }}
                  className="block py-2 text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
