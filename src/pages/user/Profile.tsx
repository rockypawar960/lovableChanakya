import React, { useEffect, useRef, useState } from 'react'
import { Pencil, Save, X, AlertCircle, CheckCircle, Camera, User as UserIcon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { userService } from '../../services/userService'
import type { UserProfile } from '../../services/userService'
import { Card, CardContent } from '../../components/ui/Card'

type ProfileData = Record<string, string | null | undefined>

interface Field {
  key: string
  label: string
  type?: 'text' | 'date' | 'textarea' | 'select'
  options?: string[]
}

const sections: { title: string; fields: Field[] }[] = [
  {
    title: 'Personal Info',
    fields: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        options: ['Male', 'Female', 'Other', 'Prefer not to say'],
      },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'languagesKnown', label: 'Languages Known' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'country', label: 'Country' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
    ],
  },
  {
    title: 'Education',
    fields: [
      { key: 'classOrYear', label: 'Class / Year' },
      { key: 'stream', label: 'Stream' },
      { key: 'schoolOrCollegeName', label: 'School / College' },
      { key: 'board', label: 'Board' },
      { key: 'targetExam', label: 'Target Exam' },
    ],
  },
  {
    title: 'Career',
    fields: [
      { key: 'careerGoal', label: 'Career Goal' },
      { key: 'interests', label: 'Interests', type: 'textarea' },
      { key: 'strengths', label: 'Strengths', type: 'textarea' },
      { key: 'challenges', label: 'Challenges', type: 'textarea' },
    ],
  },
]

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState<ProfileData>({})
  const [form, setForm] = useState<ProfileData>({})
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // --- Profile picture state ---
  const [pictureFile, setPictureFile] = useState<File | null>(null)
  const [picturePreview, setPicturePreview] = useState<string | null>(null)
  const [pictureError, setPictureError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userService.getProfile()
        setProfile((data || {}) as ProfileData)
      } catch (err) {
        console.error('Failed to load profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Revoke the temporary object URL when it's replaced or component unmounts
  useEffect(() => {
    return () => {
      if (picturePreview) URL.revokeObjectURL(picturePreview)
    }
  }, [picturePreview])

  const startEdit = () => {
    setForm({ ...profile })
    setError('')
    setSuccess('')
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setPictureFile(null)
    setPictureError('')
    if (picturePreview) {
      URL.revokeObjectURL(picturePreview)
      setPicturePreview(null)
    }
  }

  const handlePictureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPictureError('')

    if (!file.type.startsWith('image/')) {
      setPictureError('Please select an image file')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setPictureError('Image must be under 5MB')
      return
    }

    if (picturePreview) URL.revokeObjectURL(picturePreview)
    setPictureFile(file)
    setPicturePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      let updatedPictureUrl: string | null = null

      // 1. Upload picture first, if a new one was picked
      if (pictureFile) {
        try {
          updatedPictureUrl = await userService.uploadProfilePicture(pictureFile)
        } catch (err) {
          console.error('Failed to upload picture:', err)
          setError('Failed to upload profile picture')
          setSaving(false)
          return
        }
      }

      // 2. Save the text fields (sirf editable fields bhej)
      const editableKeys = sections.flatMap((s) => s.fields.map((f) => f.key))
      const payload = Object.fromEntries(
        editableKeys.map((k) => {
          const v = form[k]
          return [k, k === 'dateOfBirth' && v === '' ? null : (v ?? null)]
        })
      ) as Partial<UserProfile>

      const updated = await userService.updateProfile(payload)
      const mergedProfile: ProfileData = {
        ...((updated || {}) as ProfileData),
        ...(updatedPictureUrl ? { profilePictureUrl: updatedPictureUrl } : {}),
      }
      setProfile(mergedProfile)

      // Navbar me naam + image sync rakhne ke liye
      if (user) {
        updateUser({
          ...user,
          firstName: updated?.firstName ?? user.firstName,
          lastName: updated?.lastName ?? user.lastName,
          profilePictureUrl:
            updatedPictureUrl ?? (mergedProfile.profilePictureUrl as string | null | undefined) ?? user.profilePictureUrl,
        })
      }

      setPictureFile(null)
      if (picturePreview) {
        URL.revokeObjectURL(picturePreview)
        setPicturePreview(null)
      }
      setEditing(false)
      setSuccess('Profile updated successfully')
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const renderField = (f: Field) => {
    const value = (editing ? form[f.key] : profile[f.key]) ?? ''

    if (!editing) {
      return (
        <p className="text-slate-900 text-sm whitespace-pre-wrap">
          {value || <span className="text-slate-400">Not added</span>}
        </p>
      )
    }

    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => setForm({ ...form, [f.key]: e.target.value })

    if (f.type === 'textarea') {
      return <textarea rows={3} value={value} onChange={onChange} className={inputClass} />
    }

    if (f.type === 'select') {
      return (
        <select value={value} onChange={onChange} className={inputClass}>
          <option value="">Select</option>
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input type={f.type || 'text'} value={value} onChange={onChange} className={inputClass} />
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
      </div>
    )
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : ''

  const avatarSrc = picturePreview || profile.profilePictureUrl || ''

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={28} className="text-slate-400" />
              )}
            </div>
            {editing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition-colors"
                title="Change photo"
              >
                <Camera size={14} />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureSelect}
              className="hidden"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-600 mt-1">
              {user?.email}
              {memberSince && <span className="text-slate-400"> · Member since {memberSince}</span>}
            </p>
            {editing && pictureError && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {pictureError}
              </p>
            )}
            {editing && pictureFile && !pictureError && (
              <p className="text-blue-600 text-xs mt-1">New photo selected — saved on Save</p>
            )}
          </div>
        </div>

        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Pencil size={16} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50"
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Error / Success */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <CheckCircle size={18} /> <span>{success}</span>
        </div>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <Card key={section.title} className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((f) => (
                <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    {f.label}
                  </label>
                  {renderField(f)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Profile