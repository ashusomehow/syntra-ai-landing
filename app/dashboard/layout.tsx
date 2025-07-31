"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Inbox,
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Key,
  Plus,
  Trash2,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  Database,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ToolAccess {
  id: string
  name: string
  type: string
  credentials: string
  status: "connected" | "disconnected"
  icon: React.ReactNode
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [showAccessDialog, setShowAccessDialog] = useState(false)
  const [selectedTool, setSelectedTool] = useState("")
  const [toolCredentials, setToolCredentials] = useState("")
  const [connectedTools, setConnectedTools] = useState<ToolAccess[]>([
    {
      id: "1",
      name: "Gmail",
      type: "gmail",
      credentials: "john.doe@gmail.com",
      status: "connected",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: "2",
      name: "Google Calendar",
      type: "calendar",
      credentials: "john.doe@gmail.com",
      status: "connected",
      icon: <Calendar className="w-4 h-4" />,
    },
  ])

  // Add these state variables after the existing useState declarations
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkTheme, setDarkTheme] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = () => {
    logout()
    setShowLogoutDialog(false)
    router.push("/")
  }

  const navItems = [
    { name: "Inbox", href: "/dashboard", icon: Inbox },
    { name: "Activities", href: "/dashboard/activities", icon: Activity },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  ]

  const settingsOptions = ["Theme", "Notification", "Account", "Terms and Conditions", "Report"]
  const helpOptions = ["Terms and Conditions", "Report", "Data Privacy"]

  const availableTools = [
    { value: "gmail", label: "Gmail", icon: <Mail className="w-4 h-4" />, placeholder: "Enter your Gmail address" },
    {
      value: "calendar",
      label: "Google Calendar",
      icon: <Calendar className="w-4 h-4" />,
      placeholder: "Enter your Google account",
    },
    {
      value: "notion",
      label: "Notion",
      icon: <FileText className="w-4 h-4" />,
      placeholder: "Enter your Notion API token",
    },
    {
      value: "slack",
      label: "Slack",
      icon: <MessageSquare className="w-4 h-4" />,
      placeholder: "Enter your Slack webhook URL",
    },
    {
      value: "database",
      label: "Database",
      icon: <Database className="w-4 h-4" />,
      placeholder: "Enter your database connection string",
    },
    {
      value: "custom",
      label: "Custom API",
      icon: <Globe className="w-4 h-4" />,
      placeholder: "Enter your API endpoint",
    },
  ]

  const handleAddTool = () => {
    if (!selectedTool || !toolCredentials) return

    const tool = availableTools.find((t) => t.value === selectedTool)
    if (!tool) return

    const newTool: ToolAccess = {
      id: Date.now().toString(),
      name: tool.label,
      type: selectedTool,
      credentials: toolCredentials,
      status: "connected",
      icon: tool.icon,
    }

    setConnectedTools((prev) => [...prev, newTool])
    setSelectedTool("")
    setToolCredentials("")
  }

  const handleRemoveTool = (toolId: string) => {
    setConnectedTools((prev) => prev.filter((tool) => tool.id !== toolId))
  }

  const getPlaceholder = () => {
    const tool = availableTools.find((t) => t.value === selectedTool)
    return tool?.placeholder || "Enter access details"
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center justify-center max-w-7xl mx-auto relative">
            {/* Navigation Items - Center */}
            <nav className="flex items-center space-x-2 sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                        isActive
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      size="sm"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold">{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* Profile Dropdown - Absolute Right */}
            <div className="absolute right-0 flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100">
                    <Avatar className="h-10 w-10 border-2 border-gray-200">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                        {user?.name?.charAt(0) || "JD"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-xl shadow-xl border-0 bg-white" align="end" forceMount>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold truncate text-gray-900">{user?.name || "John Doe"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || "john.doe@example.com"}</p>
                  </div>

                  {/* Access Option */}
                  <DropdownMenuItem
                    className="cursor-pointer px-4 py-3 hover:bg-purple-50 rounded-lg mx-2 my-1 text-purple-700 hover:text-purple-900"
                    onClick={() => setShowAccessDialog(true)}
                  >
                    <Key className="mr-3 h-4 w-4" />
                    <span className="font-medium">Access</span>
                  </DropdownMenuItem>

                  {/* Settings Submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1">
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      <span className="font-medium">Settings</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-64 rounded-xl shadow-xl border-0 bg-white">
                      {/* Theme Toggle */}
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1">
                        <span className="font-medium text-gray-700">Dark Theme</span>
                        <Switch
                          checked={darkTheme}
                          onCheckedChange={setDarkTheme}
                          className="data-[state=checked]:bg-gray-600"
                        />
                      </div>

                      {/* Notification Toggle */}
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1">
                        <span className="font-medium text-gray-700">Notifications</span>
                        <Switch
                          checked={notificationsEnabled}
                          onCheckedChange={setNotificationsEnabled}
                          className="data-[state=checked]:bg-gray-600"
                        />
                      </div>

                      {/* Other settings options */}
                      {settingsOptions
                        .filter((option) => option !== "Theme" && option !== "Notification")
                        .map((option) => (
                          <DropdownMenuItem
                            key={option}
                            className="cursor-pointer px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1 text-gray-700 hover:text-gray-900"
                          >
                            <span className="font-medium">{option}</span>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {/* Help Submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1">
                      <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                      <span className="font-medium">Help</span>
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48 rounded-xl shadow-xl border-0 bg-white">
                      {helpOptions.map((option) => (
                        <DropdownMenuItem
                          key={option}
                          className="cursor-pointer px-4 py-3 hover:bg-gray-50 rounded-lg mx-2 my-1 text-gray-700 hover:text-gray-900"
                        >
                          <span className="font-medium">{option}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator className="my-2" />

                  {/* Logout */}
                  <DropdownMenuItem
                    className="cursor-pointer px-4 py-3 hover:bg-red-50 text-red-600 rounded-lg mx-2 my-1"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Access Management Dialog */}
        <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Key className="w-6 h-6 mr-3 text-purple-600" />
                Tool Access Management
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Connect and manage access to your favorite tools and services
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Add New Tool */}
              <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-purple-600" />
                    Add New Tool
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tool-select" className="text-sm font-semibold">
                      Select Tool
                    </Label>
                    <Select value={selectedTool} onValueChange={setSelectedTool}>
                      <SelectTrigger className="rounded-xl border-2 focus:border-purple-500">
                        <SelectValue placeholder="Choose a tool to connect" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {availableTools.map((tool) => (
                          <SelectItem key={tool.value} value={tool.value} className="rounded-lg">
                            <div className="flex items-center space-x-2">
                              {tool.icon}
                              <span>{tool.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTool && (
                    <div className="space-y-2">
                      <Label htmlFor="credentials" className="text-sm font-semibold">
                        Access Details
                      </Label>
                      {selectedTool === "custom" ? (
                        <Textarea
                          id="credentials"
                          placeholder={getPlaceholder()}
                          value={toolCredentials}
                          onChange={(e) => setToolCredentials(e.target.value)}
                          className="rounded-xl border-2 focus:border-purple-500 min-h-[100px]"
                        />
                      ) : (
                        <Input
                          id="credentials"
                          placeholder={getPlaceholder()}
                          value={toolCredentials}
                          onChange={(e) => setToolCredentials(e.target.value)}
                          className="rounded-xl border-2 focus:border-purple-500"
                        />
                      )}
                    </div>
                  )}

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone-number" className="text-sm font-semibold">
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="rounded-xl border-2 focus:border-purple-500"
                    />
                  </div>

                  <Button
                    onClick={handleAddTool}
                    disabled={!selectedTool || !toolCredentials}
                    className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Tool
                  </Button>
                </CardContent>
              </Card>

              {/* Connected Tools */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Connected Tools</h3>
                {connectedTools.length === 0 ? (
                  <Card className="border border-gray-200">
                    <CardContent className="p-8 text-center">
                      <Key className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No tools connected yet</p>
                      <p className="text-sm text-gray-400">Add your first tool above to get started</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {connectedTools.map((tool) => (
                      <Card key={tool.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-100 rounded-lg">{tool.icon}</div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                                <p className="text-sm text-gray-500 truncate max-w-[200px]">{tool.credentials}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`${
                                  tool.status === "connected"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                } rounded-full`}
                              >
                                {tool.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTool(tool.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
      </div>
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to logout? You'll need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-red-600 hover:bg-red-700 rounded-xl">
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  )
}
