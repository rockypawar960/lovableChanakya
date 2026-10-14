import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'

export const ProfileDropdown: React.FC = () => {
  const { user, logout, updateUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const fetchedRef = useRef(false)

  // Bahar click karne pe dropdown band
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Login / refresh ke baad context me image nahi hoti, to ek baar profile API se le aao
  useEffect(() => {
    if (!user || fetchedRef.current || user.profilePictureUrl) return
    fetchedRef.current = true

    userService
      .getProfile()
      .then((p) => {
        const url = (p as { profilePictureUrl?: string | null } | null)?.profilePictureUrl
        if (url) updateUser({ ...user, profilePictureUrl: url })
      })
      .catch(() => {
        /* image na mile to initials dikhte rahenge */
      })
  }, [user, updateUser])

  // Nayi image aaye to error reset karo
  useEffect(() => {
    setImgError(false)
  }, [user?.profilePictureUrl])

  if (!user) return null

  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
    user.email[0].toUpperCase()

  // Image hai aur load ho rahi hai to image, warna initials
  const showImage = !!user.profilePictureUrl && !imgError

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
      >
        {showImage ? (
          <img
            src={user.profilePictureUrl as string}
            alt={user.firstName || 'Profile'}
            onError={() => setImgError(true)}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">
            {initials}
          </span>
        )}
        <span className="text-sm text-gray-700">{user.firstName || user.email}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          {user.role === 'USER' && (
            <Link
              to="/user/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UserIcon size={16} /> Profile
            </Link>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  )
}
