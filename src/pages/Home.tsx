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
import { ChevronDown, MenuIcon, Plus, Redo2, Settings2, Undo2, X } from 'lucide-react'
import React from 'react'
interface MathEquation {
  id: number
  equation: string
  type: 'linear' | 'quadratic'
}
import { cn } from "@/lib/utils"
import CustomSidebar from '@/components/custom/CustomSidebar'

const SketchView = () => {
  const { mode, strokes } = useStrokesStore()
  const [pages, setPages] = useState([{ id: 1, name: 'Page 1' }])
  const [activePage, setActivePage] = useState(1)
  const navigate = useNavigate()

  const [equations, setEquations] = React.useState<MathEquation[]>([
    { id: 1, equation: '2x + y = 0', type: 'linear' },
    { id: 2, equation: '2x²', type: 'quadratic' },
  ])
  
  const [selectedId, setSelectedId] = React.useState(3)

  const handleRemove = (id: number) => {
    setEquations(equations.filter(eq => eq.id !== id))
  }

  return (

    <div className="flex h-[100vh] overflow-hidden font-sans">
          <SidebarProvider>

      <CustomSidebar 
        equations={equations}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        handleRemove={handleRemove}
      />
      <div className="flex-1 relative">
        <div className="h-[100%] relative">
          <SketchCanvas key={activePage} />
          {mode === ModeEnum.CURSOR && strokes.length === 0 && (
            <div className="h-[100%] flex items-center absolute top-0 left-0 w-full">
              <Info />
            </div>
          )}
        </div>

        <div className="absolute flex justify-center w-full top-0">
          <Toolbar />
        </div>
        <div className="absolute flex justify-between w-full bottom-0">
          <Footer />
        </div>
      </div>
      </SidebarProvider>

    </div>
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