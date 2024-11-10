import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FolderOpen, Plus, Clock } from 'lucide-react'

export default function HomePage() {
  const [recentProjects, setRecentProjects] = useState([
    { id: 1, name: "Sketch 1", lastOpened: "2 ngày trước" },
    { id: 2, name: "Logo Design", lastOpened: "1 tuần trước" },
    { id: 3, name: "Wireframe", lastOpened: "3 tuần trước" },
  ])

  const handleNewProject = () => {
    console.log("Tạo dự án mới")
    // Thêm logic để tạo dự án mới
  }

  const handleOpenProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("Mở dự án:", file.name)
      // Thêm logic để mở file dự án đã chọn
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">QTITPC</h1>
          <Button variant="outline" asChild>
            <Link to="/sketch">Đến Canvas</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Dự án mới</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleNewProject} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Tạo dự án mới
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mở dự án</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="file"
                accept=".qtitpc"
                onChange={handleOpenProject}
                className="hidden"
                id="open-project"
              />
              <Button asChild className="w-full">
                <label htmlFor="open-project">
                  <FolderOpen className="mr-2 h-4 w-4" /> Mở từ máy tính
                </label>
              </Button>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mt-12 mb-4">Dự án gần đây</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4" /> {project.lastOpened}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-white shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">QTITPC © 2023</p>
        </div>
      </footer>
    </div>
  )
}