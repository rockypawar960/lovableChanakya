import React, { useState } from 'react'
import { userService } from '../../services/userService'
import {
  Search,
  Library,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

const popularSkills = [
  'Java',
  'Spring Boot',
  'React',
  'Python',
  'DSA',
  'SQL',
  'Docker',
  'AWS'
]

const Resources: React.FC = () => {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (skill?: string) => {
    const finalSkill = skill || searchQuery

    if (!finalSkill.trim()) return

    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await userService.generateResources(
        finalSkill,
        'BEGINNER',
        'both'
      )

      setResources(response.data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to generate resources')
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Learning Resources
      </h1>

      <p className="text-slate-600 mb-8">
        Search any skill and get AI-generated free courses,
        playlists, documentation, certifications and practice resources.
      </p>

      {/* Search Box */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search skills like Java, Spring Boot, React..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <button
          onClick={() => handleSearch()}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        >
          Search
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-slate-300 border-t-slate-900 rounded-full mx-auto mb-4"></div>

          <h3 className="font-semibold text-slate-800">
            Generating Resources...
          </h3>

          <p className="text-slate-600 mt-2">
            Finding the best free resources for you.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !hasSearched && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Search
            size={48}
            className="text-slate-300 mx-auto mb-4"
          />

          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Search for Resources
          </h3>

          <p className="text-slate-600 mb-8">
            Find free courses, YouTube playlists, documentation,
            certifications and practice platforms for any skill.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {popularSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  setSearchQuery(skill)
                  handleSearch(skill)
                }}
                className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && hasSearched && resources.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Library
            size={48}
            className="text-slate-300 mx-auto mb-4"
          />

          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No Resources Found
          </h3>

          <p className="text-slate-600">
            Try searching for another skill.
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && resources.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {resources.map((resource) => (
            <div
              key={resource.id || resource.title}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {resource.resourceType}
                    </span>

                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {resource.difficulty}
                    </span>

                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {resource.language}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {resource.title}
                  </h3>

                  <p className="text-slate-600 mb-3">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>Provider: {resource.provider}</span>

                    {resource.estimatedDuration && (
                      <span>
                        Duration: {resource.estimatedDuration}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  Visit
                  <ExternalLink size={16} />
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