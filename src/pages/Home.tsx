'use client'

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import Footer from "@/components/custom/Footer"
import Info from "@/components/custom/Info"
import SketchCanvas from "@/components/custom/SketchCanvas"
import Toolbar from "@/components/custom/Toolbar"
import { useStrokesStore } from "@/store/strokesStore"
import { ModeEnum } from "@/lib/utils"
import HomePage from './HomePage'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const SketchView = () => {
  const { mode, strokes } = useStrokesStore()
  const [pages, setPages] = useState([{ id: 1, name: 'Page 1' }])
  const [activePage, setActivePage] = useState(1)
  const navigate = useNavigate()

  const addPage = () => {
    const newPage = { id: pages.length + 1, name: `Page ${pages.length + 1}` }
    setPages([...pages, newPage])
    setActivePage(newPage.id)
  }

  return (
    
    <SidebarProvider>
      <div className="flex h-[100vh] overflow-hidden font-sans">
        <Sidebar>
          <SidebarHeader>
            <h2 className="px-4 py-2 text-lg font-semibold">Sidebar demo</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Pages</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {pages.map((page) => (
                    <SidebarMenuItem key={page.id}>
                      <SidebarMenuButton
                        onClick={() => setActivePage(page.id)}
                        isActive={activePage === page.id}
                      >
                        {page.name}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="p-4 space-y-2">
            <Button onClick={addPage} className="w-full">Add Page</Button>
            <Button onClick={() => navigate('/')} className="w-full">Back to Homepage</Button>
          </div>
        </Sidebar>
        
        <div className="flex-1 relative">
          <div className="h-[100%] relative">
            <SketchCanvas key={activePage} />
            {mode === ModeEnum.CURSOR && strokes.length === 0 && (
              <div className="h-[100%] flex items-center absolute top-0 left-0 w-full">
                <Info />
              </div>
            )}
          </div>
          
          <div className="absolute z-10 ">
            <SidebarTrigger></SidebarTrigger>
          </div>
          <div className="absolute flex justify-center w-full top-0">
            <Toolbar />
          </div>
          <div className="absolute flex justify-between w-full bottom-0">
          <Footer />
          </div>

        </div>
      </div>
    </SidebarProvider>
    
  )
}

const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sketch" element={<SketchView />} />
      </Routes>
    </Router>
  )
}

export default Home