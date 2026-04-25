import React, { useState, useEffect } from 'react'
import { userService } from '../../services/userService'
import { Library, Search, Bookmark, AlertCircle } from 'lucide-react'
import { Loading } from '../../components/ui/Loading'
import { Alert } from '../../components/ui/Alert'
import { ResourceCard } from '../../components/ResourceCard'
import { Input } from '../../components/ui/Input'

const Resources: React.FC = () => {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchResources()
  }, [searchQuery, selectedType])

  const fetchResources = async () => {
    try {
      const data = await userService.searchResources(
        searchQuery || undefined,
        selectedType || undefined
      )
      setResources(data.resources)
    } catch (err) {
      setError('Failed to load resources')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async (resourceId: string, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await userService.removeBookmark(resourceId)
        setBookmarkedIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(resourceId)
          return newSet
        })
      } else {
        await userService.bookmarkResource(resourceId)
        setBookmarkedIds((prev) => new Set([...prev, resourceId]))
      }
    } catch (err) {
      console.error('Failed to update bookmark:', err)
    }
  }

  const resourceTypes = ['video', 'article', 'course', 'book']

  if (loading) {
    return <Loading message="Loading resources..." />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Resources</h1>
      <p className="text-slate-600 mb-8">Curated content to support your career development</p>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="">All Types</option>
          {resourceTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {resources.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Library size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No Resources Found</h3>
          <p className="text-slate-600">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                    {resource.type}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {resource.level}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{resource.title}</h3>
                <p className="text-slate-600 mb-3">{resource.description}</p>
                <div className="flex gap-4 text-sm text-slate-600">
                  <span>Provider: {resource.provider}</span>
                  <span>Category: {resource.category}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 ml-6">
                <button
                  onClick={() => handleBookmark(resource.id, bookmarkedIds.has(resource.id))}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarkedIds.has(resource.id)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark size={20} fill={bookmarkedIds.has(resource.id) ? 'currentColor' : 'none'} />
                </button>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 text-sm"
                >
                  Visit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Resources
