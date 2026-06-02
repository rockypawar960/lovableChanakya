import React, { useEffect, useState } from "react"
import { adminService } from "../../services/adminService"
import { Trash2, Plus } from "lucide-react"
import { usePagination } from "../../hooks/usePagination"
import { Loading } from "../../components/ui/Loading"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Select } from "../../components/ui/Select"

const ResourceManagement = () => {
  const [resources, setResources] = useState<any[]>([])
  const [type, setType] = useState("")
  const [loading, setLoading] = useState(true)

  const pagination = usePagination(10)

  useEffect(() => {
    fetchResources()
  }, [pagination.page, type])

  const fetchResources = async () => {
    const res = await adminService.getAllResources(
      pagination.page - 1,
      pagination.limit,
      type || undefined
    )
    setResources(res.data)
    pagination.setTotal(res.total)
    setLoading(false)
  }

  if (loading) return <Loading message="Loading resources..." />

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resources</h1>
        <Button><Plus size={18}/> Add Resource</Button>
      </div>

      <div className="w-64">
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: "", label: "All" },
            { value: "video", label: "Video" },
            { value: "article", label: "Article" }
          ]}
        />
      </div>

      <div className="space-y-4">
        {resources.map((res) => (
          <Card key={res.id}>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{res.title}</p>
                <p className="text-sm text-gray-500">{res.type}</p>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => adminService.deleteResource(res.id)}
              >
                <Trash2 size={14}/>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ResourceManagement