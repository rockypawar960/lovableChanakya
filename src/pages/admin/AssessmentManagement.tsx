import React, { useEffect, useState } from "react"
import { adminService, Assessment } from "../../services/adminService"
import { Trash2, Plus, Eye } from "lucide-react"
import { usePagination } from "../../hooks/usePagination"
import { Loading } from "../../components/ui/Loading"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Alert } from "../../components/ui/Alert"

const AssessmentManagement = () => {
  const [data, setData] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const pagination = usePagination(10)

  useEffect(() => {
    fetchData()
  }, [pagination.page])

  const fetchData = async () => {
    try {
      setLoading(true)

      const res = await adminService.getAllAssessments(
        pagination.page - 1,
        pagination.limit
      )

      setData(res.data)
      pagination.setTotal(res.total)

    } catch (err) {
      console.error(err)
      setError("Failed to load assessments")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this assessment?")) return

    try {
      await adminService.deleteAssessment(id.toString())
      fetchData()
    } catch (err) {
      console.error(err)
      setError("Delete failed")
    }
  }

  const handleView = (item: Assessment) => {
    console.log("View clicked:", item)
    // 👉 future: navigate(`/admin/assessments/${item.id}`)
  }

  if (loading) return <Loading message="Loading assessments..." />

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assessment Management</h1>
        <Button>
          <Plus size={18}/> Create Assessment
        </Button>
      </div>

      {/* Error */}
      {error && <Alert type="error" message={error} />}

      {/* List */}
      <Card>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No assessments found.
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  {/* LEFT DATA */}
                  <div>
                    <p className="font-semibold">{item.userFullName}</p>
                    <p className="text-sm text-gray-500">{item.userEmail}</p>
                    <p className="text-sm">Score: {item.totalScore}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.completedAt).toLocaleString()}
                    </p>

                    {/* Bucket Scores */}
                    <div className="text-xs mt-1 text-gray-600 flex flex-wrap gap-2">
                      {Object.entries(item.bucketScores || {}).map(([key, val]) => (
                        <span key={key}>
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(item)}
                    >
                      <Eye size={14} /> View
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
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

export default AssessmentManagement