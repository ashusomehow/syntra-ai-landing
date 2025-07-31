"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  CalendarIcon,
  Clock,
  Plus,
  MapPin,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

interface Task {
  id: string
  title: string
  date: string
  time: string
  note: string
  completed: boolean
  type: "ai-booked" | "manual"
  category: string
  location?: string
  priority: "low" | "medium" | "high"
}

export default function Activities() {
  const [activeTab, setActiveTab] = useState<"today" | "upcoming">("today")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sortBy, setSortBy] = useState<"time" | "priority">("time")

  const [todayTasks, setTodayTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Date with girlfriend at Toit Brewpub",
      date: "Today",
      time: "8:00 PM",
      note: "Table booked for 2. Romantic rooftop setting.",
      completed: false,
      type: "ai-booked",
      category: "Personal",
      location: "Toit Brewpub, Bangalore",
      priority: "high",
    },
    {
      id: "2",
      title: "Team meeting with marketing",
      date: "Today",
      time: "11:30 AM",
      note: "Discuss Q4 campaign strategies",
      completed: true,
      type: "ai-booked",
      category: "Work",
      priority: "medium",
    },
    {
      id: "3",
      title: "Gym workout",
      date: "Today",
      time: "6:00 AM",
      note: "Leg day - focus on squats and deadlifts",
      completed: true,
      type: "manual",
      category: "Health",
      priority: "low",
    },
  ])

  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([
    {
      id: "4",
      title: "Product launch meeting",
      date: "Dec 30, 2024",
      time: "10:00 AM",
      note: "Final review before launch",
      completed: false,
      type: "ai-booked",
      category: "Work",
      priority: "high",
    },
    {
      id: "5",
      title: "Doctor appointment",
      date: "Jan 2, 2025",
      time: "3:00 PM",
      note: "Annual health checkup",
      completed: false,
      type: "ai-booked",
      category: "Health",
      location: "Apollo Hospital",
      priority: "medium",
    },
    {
      id: "6",
      title: "Weekend trip planning",
      date: "Jan 5, 2025",
      time: "2:00 PM",
      note: "Research destinations and book hotels",
      completed: false,
      type: "manual",
      category: "Personal",
      priority: "low",
    },
  ])

  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    date: "",
    time: "",
    note: "",
    category: "",
    location: "",
    priority: "medium",
    assignedTo: "",
    reminder: "15min",
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const toggleTaskCompletion = (taskId: string, isToday: boolean) => {
    if (isToday) {
      setTodayTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
    } else {
      setUpcomingTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
      )
    }
  }

  const updateTaskNote = (taskId: string, note: string, isToday: boolean) => {
    if (isToday) {
      setTodayTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, note } : task)))
    } else {
      setUpcomingTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, note } : task)))
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setShowDeleteDialog(true)
  }

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTodayTasks((prev) => prev.filter((task) => task.id !== taskToDelete))
      setUpcomingTasks((prev) => prev.filter((task) => task.id !== taskToDelete))
    }
    setTaskToDelete(null)
    setShowDeleteDialog(false)
  }

  // Add this function to handle tasks from other components
  const addTaskFromInbox = (taskData: any) => {
    const task: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      date: taskData.date || "Today",
      time: taskData.time || "12:00 PM",
      note: taskData.note || "",
      completed: false,
      type: "ai-booked",
      category: taskData.category || "Personal",
      location: taskData.location,
      priority: taskData.priority || "medium",
    }

    if (task.date === "Today" || task.date === new Date().toDateString()) {
      setTodayTasks((prev) => [...prev, task])
    } else {
      setUpcomingTasks((prev) => [...prev, task])
    }
  }

  // Update the existing handleAddTask function to show success message:
  const handleAddTask = () => {
    if (!newTask.title || !newTask.date || !newTask.time) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      date: newTask.date,
      time: newTask.time,
      note: newTask.note,
      completed: false,
      type: "manual",
      category: newTask.category || "Personal",
      location: newTask.location,
      priority: newTask.priority as "low" | "medium" | "high",
    }

    if (newTask.date === new Date().toDateString() || newTask.date === "Today") {
      setTodayTasks((prev) => [...prev, task])
    } else {
      setUpcomingTasks((prev) => [...prev, task])
    }

    // Reset form
    setNewTask({
      title: "",
      date: "",
      time: "",
      note: "",
      category: "",
      location: "",
      priority: "medium",
      assignedTo: "",
      reminder: "15min",
    })
    setShowAddTaskDialog(false)

    // Show success notification (you can add a toast here)
    console.log("Task added successfully!")
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work":
        return "bg-blue-100 text-blue-800"
      case "Personal":
        return "bg-green-100 text-green-800"
      case "Health":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      if (sortBy === "time") {
        const timeA = new Date(`2000-01-01 ${a.time}`).getTime()
        const timeB = new Date(`2000-01-01 ${b.time}`).getTime()
        return timeA - timeB
      } else {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
    })
  }

  const TaskCard = ({ task, isToday }: { task: Task; isToday: boolean }) => (
    <Card
      className={`transition-all duration-200 shadow-lg border-0 rounded-2xl ${task.completed ? "opacity-75" : "hover:shadow-xl"}`}
    >
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <h3
                  className={`font-semibold text-lg sm:text-xl break-words ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                >
                  {task.title}
                </h3>
              </div>
              {task.type === "ai-booked" && (
                <Badge variant="secondary" className="text-xs w-fit rounded-full px-3 py-1 bg-blue-100 text-blue-800">
                  AI Booked
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 flex-shrink-0 text-blue-500" />
                <span className="font-medium">{task.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 flex-shrink-0 text-green-500" />
                <span className="font-medium">{task.time}</span>
              </div>
            </div>
            {task.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span className="break-words font-medium">{task.location}</span>
              </div>
            )}
            <Badge className={`${getCategoryColor(task.category)} rounded-full px-3 py-1 font-medium`}>
              {task.category}
            </Badge>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <Switch
              checked={task.completed}
              onCheckedChange={() => toggleTaskCompletion(task.id, isToday)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Note:</label>
          <Textarea
            value={task.note}
            onChange={(e) => updateTaskNote(task.id, e.target.value, isToday)}
            placeholder="Add a note..."
            className="min-h-[80px] text-sm resize-none rounded-xl border-2 focus:border-blue-500"
          />
        </div>

        {/* Delete button repositioned to bottom right */}
        <div className="flex justify-end mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteTask(task.id)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const CalendarView = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    const getTasksForDay = (day: number) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      return upcomingTasks.filter((task) => task.date.includes(String(day)))
    }

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 rounded-xl hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 rounded-xl hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((day) => (
            <div key={`empty-${day}`} className="p-2 h-20 sm:h-24"></div>
          ))}
          {days.map((day) => {
            const tasksForDay = getTasksForDay(day)
            return (
              <div
                key={day}
                className="p-2 h-20 sm:h-24 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-semibold text-gray-900">{day}</div>
                {tasksForDay.length > 0 && (
                  <div className="mt-1">
                    {tasksForDay.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs bg-blue-100 text-blue-800 rounded-lg px-2 py-1 mb-1 truncate font-medium"
                      >
                        {task.title}
                      </div>
                    ))}
                    {tasksForDay.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">+{tasksForDay.length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Activities</h1>
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-2 border-gray-200 hover:border-blue-500 rounded-xl px-4 py-2 font-semibold bg-transparent"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort by {sortBy === "time" ? "Time" : "Priority"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl shadow-xl border-0 bg-white">
              <DropdownMenuItem
                onClick={() => setSortBy("time")}
                className="px-4 py-3 hover:bg-blue-50 rounded-lg mx-2 my-1 cursor-pointer"
              >
                <Clock className="w-4 h-4 mr-3 text-blue-600" />
                Sort by Time
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("priority")}
                className="px-4 py-3 hover:bg-red-50 rounded-lg mx-2 my-1 cursor-pointer"
              >
                <div className="w-4 h-4 mr-3 bg-red-500 rounded-full"></div>
                Sort by Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setShowAddTaskDialog(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-2xl w-full sm:w-fit">
        <Button
          variant={activeTab === "today" ? "default" : "ghost"}
          onClick={() => setActiveTab("today")}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            activeTab === "today" ? "bg-white shadow-lg text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Today
        </Button>
        <Button
          variant={activeTab === "upcoming" ? "default" : "ghost"}
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            activeTab === "upcoming" ? "bg-white shadow-lg text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Upcoming
        </Button>
      </div>

      {/* Content */}
      {activeTab === "today" ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6 p-4 bg-green-50 rounded-2xl border border-green-200">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-base font-semibold text-green-800">
              {todayTasks.filter((task) => task.completed).length} of {todayTasks.length} tasks completed
            </span>
          </div>
          {sortTasks(todayTasks).map((task) => (
            <TaskCard key={task.id} task={task} isToday={true} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <CalendarView />
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Upcoming Tasks</h3>
            {sortTasks(upcomingTasks).map((task) => (
              <TaskCard key={task.id} task={task} isToday={false} />
            ))}
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <Button
        className="fixed bottom-8 right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-3xl z-50 transition-all duration-200 hover:scale-110"
        onClick={() => setShowAddTaskDialog(true)}
      >
        <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
      </Button>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Plus className="w-6 h-6 mr-3 text-blue-600" />
              Add New Task
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="task-title" className="text-sm font-semibold">
                Task Title *
              </Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="rounded-xl border-2 focus:border-blue-500"
              />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-date" className="text-sm font-semibold">
                  Date *
                </Label>
                <Input
                  id="task-date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  className="rounded-xl border-2 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-time" className="text-sm font-semibold">
                  Time *
                </Label>
                <Input
                  id="task-time"
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className="rounded-xl border-2 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category and Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-category" className="text-sm font-semibold">
                  Category
                </Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger className="rounded-xl border-2 focus:border-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Work" className="rounded-lg">
                      Work
                    </SelectItem>
                    <SelectItem value="Personal" className="rounded-lg">
                      Personal
                    </SelectItem>
                    <SelectItem value="Health" className="rounded-lg">
                      Health
                    </SelectItem>
                    <SelectItem value="Finance" className="rounded-lg">
                      Finance
                    </SelectItem>
                    <SelectItem value="Education" className="rounded-lg">
                      Education
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority" className="text-sm font-semibold">
                  Priority
                </Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger className="rounded-xl border-2 focus:border-blue-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low" className="rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium" className="rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high" className="rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        High
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="task-location" className="text-sm font-semibold">
                Location (Optional)
              </Label>
              <Input
                id="task-location"
                placeholder="Enter location"
                value={newTask.location}
                onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                className="rounded-xl border-2 focus:border-blue-500"
              />
            </div>

            {/* Assigned To and Reminder Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-assigned" className="text-sm font-semibold">
                  Assigned To (Optional)
                </Label>
                <Input
                  id="task-assigned"
                  placeholder="Enter person's name"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="rounded-xl border-2 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-reminder" className="text-sm font-semibold">
                  Reminder
                </Label>
                <Select value={newTask.reminder} onValueChange={(value) => setNewTask({ ...newTask, reminder: value })}>
                  <SelectTrigger className="rounded-xl border-2 focus:border-blue-500">
                    <SelectValue placeholder="Select reminder" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="none" className="rounded-lg">
                      No Reminder
                    </SelectItem>
                    <SelectItem value="5min" className="rounded-lg">
                      5 minutes before
                    </SelectItem>
                    <SelectItem value="15min" className="rounded-lg">
                      15 minutes before
                    </SelectItem>
                    <SelectItem value="30min" className="rounded-lg">
                      30 minutes before
                    </SelectItem>
                    <SelectItem value="1hour" className="rounded-lg">
                      1 hour before
                    </SelectItem>
                    <SelectItem value="1day" className="rounded-lg">
                      1 day before
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="task-note" className="text-sm font-semibold">
                Notes (Optional)
              </Label>
              <Textarea
                id="task-note"
                placeholder="Add any additional notes or details"
                value={newTask.note}
                onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
                className="rounded-xl border-2 focus:border-blue-500 min-h-[100px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddTaskDialog(false)}
                className="flex-1 rounded-xl border-2 py-3"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTask}
                disabled={!newTask.title || !newTask.date || !newTask.time}
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-gray-600 hover:bg-gray-700 rounded-xl">
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
