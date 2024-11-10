import { Search, Plus, Command, Bell, Grid, List, MoreHorizontal, GitBranch, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProjectCardProps = {
  name: string;
  description: string;
  lastDeployed: string;
  status: "Production" | "Development";
};

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <div className="font-semibold">daqminh&apos;s projects</div>
            <div className="text-sm text-muted-foreground">Hobby</div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Feedback</Button>
            <Button variant="ghost">Changelog</Button>
            <Button variant="ghost">Help</Button>
            <Button variant="ghost">Docs</Button>
          </div>
        </div>
      </header>
      <nav className="border-b">
        <div className="container h-14 flex items-center gap-6 px-4">
          <Button variant="ghost" className="font-semibold">Overview</Button>
          <Button variant="ghost">Integrations</Button>
          <Button variant="ghost">Activity</Button>
          <Button variant="ghost">Domains</Button>
          <Button variant="ghost">Usage</Button>
          <Button variant="ghost">Monitoring</Button>
          <Button variant="ghost">Storage</Button>
          <Button variant="ghost">AI</Button>
          <Button variant="ghost">Support</Button>
          <Button variant="ghost">Settings</Button>
        </div>
      </nav>
      <main className="flex-1 container px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Repositories and Projects..." className="pl-10 pr-16" />
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>
          <Select defaultValue="activity">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activity">Sort by activity</SelectItem>
              <SelectItem value="name">Sort by name</SelectItem>
              <SelectItem value="created">Sort by created</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New...
          </Button>
        </div>
        <div className="space-y-4">
          <ProjectCard
            name="My Next.js App"
            description="A web application built with Next.js and React"
            lastDeployed="2 hours ago"
            status="Production"
          />
          <ProjectCard
            name="E-commerce Site"
            description="Online store using Shopify and Next.js"
            lastDeployed="1 day ago"
            status="Development"
          />
          <ProjectCard
            name="Personal Blog"
            description="Static blog generated with Next.js"
            lastDeployed="5 days ago"
            status="Production"
          />
        </div>
      </main>
    </div>
  );
}

function ProjectCard({ name, description, lastDeployed, status }: ProjectCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Command className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          <Clock className="inline mr-1 h-4 w-4" />
          {lastDeployed}
        </div>
        <div className="text-sm">
          <GitBranch className="inline mr-1 h-4 w-4" />
          main
        </div>
        <div className={`text-sm ${status === 'Production' ? 'text-green-500' : 'text-yellow-500'}`}>
          ● {status}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Project</DropdownMenuItem>
            <DropdownMenuItem>Deployments</DropdownMenuItem>
            <DropdownMenuItem>Analytics</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete Project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
