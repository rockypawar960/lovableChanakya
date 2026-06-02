import React, { useEffect, useState } from "react"
import { adminService, LearningPath } from "../../services/adminService"
import { Trash2, Plus } from "lucide-react"
import { usePagination } from "../../hooks/usePagination"
import { Loading } from "../../components/ui/Loading"
import { Card, CardContent, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Alert } from "../../components/ui/Alert"

const LearningPathManagement = () => {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const pagination = usePagination(10)

  useEffect(() => {
    fetchPaths()
  }, [pagination.page])

  const fetchPaths = async () => {
    try {
      setLoading(true)

      const res = await adminService.getAllLearningPaths(
        pagination.page - 1,
        pagination.limit
      )

      setPaths(res.data)
      pagination.setTotal(res.total)

    } catch (err) {
      console.error(err)
      setError("Failed to load learning paths")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this learning path?")) return

    try {
      await adminService.deleteLearningPath(id.toString())
      fetchPaths()
    } catch (err) {
      console.error(err)
      setError("Delete failed")
    }
  }

  if (loading) return <Loading message="Loading paths..." />

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Learning Paths</h1>
        <Button>
          <Plus size={18}/> Create Path
        </Button>
      </div>

      {/* Error */}
      {error && <Alert type="error" message={error} />}

      {/* Grid */}
      {paths.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No learning paths found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <Card key={path.id}>
              <CardContent>

                {/* Title */}
                <CardTitle>{path.pathName}</CardTitle>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-2">
                  {path.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mt-4 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {path.durationMonths} Months
                  </span>

                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {path.stepsCount} Steps
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-4">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(path.id)}
                  >
                    <Trash2 size={14}/>
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={pagination.prevPage}
          disabled={pagination.page === 1}
        >
          Prev
        </Button>

        <span className="font-semibold">
          Page {pagination.page} / {pagination.totalPages || 1}
        </span>

        <Button
          variant="primary"
          onClick={pagination.nextPage}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default LearningPathManagement