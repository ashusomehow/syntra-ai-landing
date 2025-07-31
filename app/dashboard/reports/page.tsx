"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Download, Target, Clock, CheckCircle, PieChart, Activity } from "lucide-react"

export default function Reports() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("weekly")

  const dailyStats = {
    tasksCompleted: 8,
    tasksPlanned: 10,
    productivityScore: 85,
    timeSpent: 6.5,
    categories: [
      { name: "Work", completed: 5, planned: 6, color: "bg-blue-500" },
      { name: "Personal", completed: 2, planned: 3, color: "bg-green-500" },
      { name: "Health", completed: 1, planned: 1, color: "bg-red-500" },
    ],
  }

  const weeklyStats = [
    { day: "Mon", completed: 8, planned: 10, productivity: 80 },
    { day: "Tue", completed: 6, planned: 8, productivity: 75 },
    { day: "Wed", completed: 9, planned: 9, productivity: 100 },
    { day: "Thu", completed: 7, planned: 11, productivity: 64 },
    { day: "Fri", completed: 10, planned: 12, productivity: 83 },
    { day: "Sat", completed: 3, planned: 4, productivity: 75 },
    { day: "Sun", completed: 2, planned: 3, productivity: 67 },
  ]

  const monthlyGoals = [
    { goal: "Complete 100 tasks", current: 87, target: 100, status: "on-track" },
    { goal: "Attend 20 meetings", current: 18, target: 20, status: "on-track" },
    { goal: "Finish 5 projects", current: 3, target: 5, status: "behind" },
    { goal: "Health activities", current: 12, target: 10, status: "exceeded" },
  ]

  const aiInsights = [
    {
      type: "productivity",
      title: "Peak Productivity Hours",
      insight: "You are most productive between 9 AM - 11 AM with 95% task completion rate.",
      recommendation: "Schedule important tasks during this time window.",
    },
    {
      type: "pattern",
      title: "Weekly Pattern",
      insight: "Wednesdays show highest productivity (100% completion rate).",
      recommendation: "Consider scheduling challenging tasks on Wednesdays.",
    },
    {
      type: "improvement",
      title: "Improvement Area",
      insight: "Personal tasks have 67% completion rate vs 85% for work tasks.",
      recommendation: "Try breaking personal tasks into smaller, manageable chunks.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-blue-100 text-blue-800"
      case "behind":
        return "bg-red-100 text-red-800"
      case "exceeded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const BarChart = ({ data }: { data: typeof weeklyStats }) => (
    <div className="space-y-4 sm:space-y-5">
      {data.map((stat) => (
        <div key={stat.day} className="flex items-center space-x-4">
          <div className="w-10 sm:w-12 text-sm font-semibold text-gray-700">{stat.day}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                {stat.completed}/{stat.planned} tasks
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900">{stat.productivity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 sm:h-4 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${stat.productivity}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const PieChartComponent = ({ categories }: { categories: typeof dailyStats.categories }) => (
    <div className="space-y-6">
      <div className="relative w-40 h-40 sm:w-52 sm:h-52 mx-auto">
        {/* Simplified pie chart representation */}
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500 relative shadow-lg">
          <div className="absolute inset-4 sm:inset-6 bg-white rounded-full flex items-center justify-center shadow-inner">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.completed, 0)}
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">Tasks Done</div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${category.color} shadow-sm`}></div>
              <span className="text-sm sm:text-base font-semibold text-gray-900">{category.name}</span>
            </div>
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              {category.completed}/{category.planned}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600 text-base sm:text-lg">AI-powered insights into your productivity</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-2xl w-full sm:w-fit">
        {["daily", "weekly", "monthly"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab as "daily" | "weekly" | "monthly")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all duration-200 capitalize ${
              activeTab === tab ? "bg-white shadow-lg text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Tasks Completed",
            value:
              activeTab === "daily"
                ? dailyStats.tasksCompleted
                : activeTab === "weekly"
                  ? weeklyStats.reduce((sum, day) => sum + day.completed, 0)
                  : 87,
            subtitle: activeTab === "daily" ? "Today" : activeTab === "weekly" ? "This week" : "This month",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Productivity Score",
            value: `${activeTab === "daily" ? dailyStats.productivityScore : activeTab === "weekly" ? Math.round(weeklyStats.reduce((sum, day) => sum + day.productivity, 0) / weeklyStats.length) : 92}%`,
            subtitle: "↑ 5% from last period",
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Time Focused",
            value: activeTab === "daily" ? `${dailyStats.timeSpent}h` : activeTab === "weekly" ? "42h" : "168h",
            subtitle: "Deep work time",
            icon: Clock,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "AI Automations",
            value: activeTab === "daily" ? 12 : activeTab === "weekly" ? 84 : 320,
            subtitle: "Tasks automated",
            icon: Activity,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
        ].map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{metric.title}</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">{metric.subtitle}</p>
                </div>
                <div className={`p-3 rounded-2xl ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
              {activeTab === "daily"
                ? "Today's Progress"
                : activeTab === "weekly"
                  ? "Weekly Progress"
                  : "Monthly Overview"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {activeTab === "weekly" ? (
              <BarChart data={weeklyStats} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Chart data for {activeTab} view</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
              <PieChart className="w-6 h-6 mr-3 text-purple-600" />
              Task Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {activeTab === "daily" ? (
              <PieChartComponent categories={dailyStats.categories} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Category breakdown for {activeTab} view</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goals */}
      {activeTab === "monthly" && (
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
              <Target className="w-6 h-6 mr-3 text-green-600" />
              Monthly Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyGoals.map((goal, index) => (
                <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg">{goal.goal}</h3>
                    <Badge className={`${getStatusColor(goal.status)} rounded-full px-3 py-1 font-semibold`}>
                      {goal.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm sm:text-base text-gray-600 font-medium">
                    <span>
                      {goal.current} / {goal.target}
                    </span>
                    <span>{Math.round(getProgressPercentage(goal.current, goal.target))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                        goal.status === "exceeded"
                          ? "bg-green-600"
                          : goal.status === "on-track"
                            ? "bg-blue-600"
                            : "bg-red-600"
                      }`}
                      style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {aiInsights.map((insight, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-2xl">
                <h4 className="font-bold text-gray-900 mb-3 text-base sm:text-lg">{insight.title}</h4>
                <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">{insight.insight}</p>
                <p className="text-sm sm:text-base text-blue-600 font-semibold">💡 {insight.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
