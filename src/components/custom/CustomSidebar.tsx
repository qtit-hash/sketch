// CustomSidebar.tsx
import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Undo2, Redo2, Settings2, ChevronDown, X } from 'lucide-react'
import { cn } from "@/lib/utils"

interface MathEquation {
  id: number
  equation: string
  type: 'linear' | 'quadratic'
}

interface CustomSidebarProps {
  equations: MathEquation[]
  selectedId: number
  setSelectedId: (id: number) => void
  handleRemove: (id: number) => void
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ equations, selectedId, setSelectedId, handleRemove }) => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center gap-1 border-b px-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add equation</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo2 className="h-4 w-4" />
            <span className="sr-only">Undo</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo2 className="h-4 w-4" />
            <span className="sr-only">Redo</span>
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings2 className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Collapse sidebar</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {equations.map((eq, index) => (
            <div
              key={eq.id}
              className={cn(
                "group relative flex h-14 cursor-pointer items-center border-b px-4 hover:bg-accent",
                selectedId === eq.id && "bg-blue-500/10"
              )}
              onClick={() => setSelectedId(eq.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{index + 1}</span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500" />
                  <span className="font-mono">{eq.equation || ' '}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 hidden h-8 w-8 group-hover:flex"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(eq.id)
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove equation</span>
              </Button>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

export default CustomSidebar
