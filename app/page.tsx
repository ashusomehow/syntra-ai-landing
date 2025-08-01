"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowRight,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3,
  MapPin,
  Link2,
  CheckCircle,
  Clock,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Star,
  Users,
  Shield,
  Sparkles,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Testimonials } from "@/components/testimonials"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// AnimatedWord component for hero text
function AnimatedWord() {
  const words = [
    "listening",
    "acting",
    "managing"
  ];
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setShow(true);
    timeoutRef.current = setTimeout(() => {
      setShow(false);
      const transitionTimeout = setTimeout(() => {
        setIndex((prev: number) => (prev + 1) % words.length);
        setShow(true);
      }, 300); // transition duration
      
      // Store the transition timeout for cleanup
      timeoutRef.current = transitionTimeout;
    }, 2500);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, words.length]);

  // Fix: Ensure no clipping, perfect alignment, and only animate translateY during transition
  return (
    <span
      className={`inline-block align-baseline transition-all duration-300 ease-in-out text-syntra-primary font-black`
        + (show ? ' opacity-100 translate-y-0' : ' opacity-0 translate-y-2')}
      style={{
        minWidth: '10ch',
        minHeight: '1em', // ensures enough height for all words
        lineHeight: '1.2', // matches heading line height
        overflow: 'visible',
        verticalAlign: 'baseline',
        padding: 0,
        margin: 0,
        display: 'inline-block',
      }}
    >
      {words[index]}
    </span>
  );
}

export default function LandingPage() {
  const { user, login, signup, googleAuth, isLoading } = useAuth()
  const router = useRouter()

  const [currentFeature, setCurrentFeature] = useState(0)
  const [currentBenefit, setCurrentBenefit] = useState(0)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSignupDialog, setShowSignupDialog] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [authError, setAuthError] = useState("")
  
  // Waitlist functionality
  const [showWaitlistInput, setShowWaitlistInput] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState("")
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false)

  // FAQ functionality
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  // Flowchart animation states
  const [animatedSteps, setAnimatedSteps] = useState<boolean[]>([false, false, false, false, false])
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      try {
      router.push("/dashboard")
      } catch (error) {
        console.error("Navigation error:", error)
      }
    }
  }, [user, router])

  // Intersection Observer for flowchart animations
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find the index of the current element
            const index = stepRefs.current.findIndex(ref => ref === entry.target)
            if (index !== -1) {
              // Stagger the animations with delays
              const timeout = setTimeout(() => {
                setAnimatedSteps(prev => {
                  const newSteps = [...prev]
                  newSteps[index] = true
                  return newSteps
                })
              }, index * 150) // Reduced delay to 150ms for faster animation
              timeouts.push(timeout)
            }
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible (more sensitive)
        rootMargin: '0px 0px -100px 0px' // Start animation earlier
      }
    )

    // Observe all step elements
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      observer.disconnect()
      // Clear all timeouts to prevent memory leaks
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!waitlistEmail) return
    
    setIsSubmittingWaitlist(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWaitlistSubmitted(true)
      setWaitlistEmail("")
    } catch (error) {
      console.error("Waitlist submission error:", error)
      // Handle error gracefully
    } finally {
      setIsSubmittingWaitlist(false)
    }
  }

  const handleJoinWaitlist = () => {
    setShowWaitlistInput(true)
    setWaitlistSubmitted(false)
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Smart AI Assistant",
      description: "Handle tasks via voice or text — from planning to booking.",
    },
    {
      icon: <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Real-Time Scheduling & Automation",
      description: "Syncs with tools to auto-schedule tasks and reminders.",
    },
    {
      icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Auto-Recorded Tasks",
      description: "Every instruction gets saved in Today or Upcoming view.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "AI-Powered Reports",
      description: "Track progress with daily, weekly, and monthly charts.",
    },
    {
      icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Integrated Smart Recommendations",
      description: "Suggests places, checks weather, and books for you.",
    },
    {
      icon: <Link2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Multi-Tool Connectivity",
      description: "Seamlessly integrates with your everyday apps.",
    },
  ]

  const benefits = [
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Plan Less, Achieve More",
      description: "Let Syntra handle your daily planning and task flow.",
    },
    {
      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Saves Time & Mental Energy",
      description: "No app-switching — everything in one smart space.",
    },
    {
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Personalized Daily Workflow",
      description: "Get clear steps based on your time and goals.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Never Miss a Deadline",
      description: "Smart reminders help you stay ahead.",
    },
    {
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Smart Help, Anytime You Ask",
      description: "Just ask — get quick help for work or life.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Visual Progress Tracking",
      description: "View your growth with clean, visual reports.",
    },
  ]

  const stats = [
    { number: "90%", label: "Automated", icon: <Users className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Shield className="w-5 h-5" /> },
    { number: "4.9/5", label: "User Rating", icon: <Star className="w-5 h-5" /> },
    { number: "24/7", label: "AI Support", icon: <Sparkles className="w-5 h-5" /> },
  ]

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    const benefitInterval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length)
    }, 3500)

    return () => {
      clearInterval(featureInterval)
      clearInterval(benefitInterval)
    }
  }, [features.length, benefits.length])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    try {
      await login(loginForm.email, loginForm.password)
      setShowLoginDialog(false)
    } catch (error) {
      console.error("Login error:", error)
      setAuthError("Login failed. Please check your credentials and try again.")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError("Passwords don't match!")
      return
    }

    if (signupForm.password.length < 6) {
      setAuthError("Password must be at least 6 characters long.")
      return
    }

    try {
      await signup(signupForm.name, signupForm.email, signupForm.password)
      setShowSignupDialog(false)
    } catch (error) {
      console.error("Signup error:", error)
      setAuthError("Signup failed. Please try again.")
    }
  }

  const handleGoogleAuth = async () => {
    setAuthError("")
    try {
      await googleAuth()
    } catch (error) {
      console.error("Google auth error:", error)
      setAuthError("Google authentication failed. Please try again.")
    }
  }

  // Don't render if user is logged in (will redirect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-syntra-light via-syntra-secondary to-syntra-primary">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto gap-4 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Thunder Logo */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-syntra-accent rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Zap className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
          </div>
          <div>
            <span className="text-lg sm:text-xl lg:text-3xl font-bold text-syntra-accent">
              Syntra.ai
            </span>
            <div className="text-xs sm:text-sm text-syntra-accent/80 font-medium">AI-Powered Productivity</div>
          </div>
        </div>
        <div className="flex items-center">
          {/* Coming Soon Tag */}
          <div className="bg-syntra-accent/10 text-syntra-accent text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold animate-pulse shadow-lg">
            🚀 Coming Soon
                  </div>
        </div>
      </header>

      {/* Hero Section - NeuralEdge Style */}
      <section className="relative pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-4 sm:pb-6 md:pb-8 lg:pb-12 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient with soft blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-syntra-light/30 via-syntra-secondary/20 to-syntra-primary/10 blur-3xl"></div>
        
        {/* Content container */}
        <div className="relative max-w-4xl lg:max-w-5xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-syntra-primary/10 text-syntra-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-lg backdrop-blur-sm">
            <span className="mr-2">🚀</span>
            New: AI-Powered Task Automation
          </div>
          
          {/* Main Headline - Cabinet Grotesk */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-syntra-accent mb-3 sm:mb-4 leading-tight tracking-tight max-w-4xl mx-auto">
            <div className="block">Let{" "}
            <span className="text-syntra-primary">Syntra</span>{" "}
            <span className="text-syntra-accent">boost</span></div>
            <div className="block">productivity by{" "}
            <AnimatedWord /> your day.</div>
          </h1>
          
          {/* Subheading - Inter Tight */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-syntra-accent/70 mb-4 sm:mb-6 max-w-3xl lg:max-w-4xl mx-auto leading-relaxed font-light px-4">
            The AI assistant that listens, acts, and manages your workflow automatically. 
            Transform how you work with intelligent automation that understands your context.
          </p>
          
          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-3 sm:mb-4 px-4">
            {!showWaitlistInput ? (
              <button
                onClick={handleJoinWaitlist}
                className="group relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full text-base sm:text-lg font-bold text-white transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-3xl overflow-hidden w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #3A60E7 0%, #C091E4 100%)',
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-syntra-primary/20 to-syntra-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button content */}
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2 sm:mr-3">✨</span>
                  Join the Waitlist
                  <span className="ml-2 sm:ml-3">→</span>
                </span>
              </button>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-lg">
                <input
                    type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 sm:px-8 py-4 sm:py-6 rounded-full border-2 border-syntra-primary/20 focus:border-syntra-primary focus:outline-none text-syntra-accent placeholder-syntra-accent/50 text-base sm:text-lg font-medium shadow-lg backdrop-blur-sm bg-white/80"
                    required
                />
                <button
                  type="submit"
                  disabled={isSubmittingWaitlist}
                  className="px-6 sm:px-8 py-4 sm:py-6 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:transform-none"
                  style={{
                    background: 'linear-gradient(135deg, #3A60E7 0%, #C091E4 100%)',
                  }}
                >
                  {isSubmittingWaitlist ? "Submitting..." : "Submit"}
                </button>
              </form>
            )}
                </div>
          
          {/* Success message */}
          {waitlistSubmitted && (
            <div className="inline-flex items-center px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-green-50 border border-green-200 text-green-800 font-semibold shadow-lg text-sm sm:text-base">
              <span className="mr-2">✅</span>
              Thanks! You're on the waitlist.
                </div>
          )}
          
          {/* Trust indicators */}
          <div className="mt-4 sm:mt-6 text-syntra-accent/60 text-xs sm:text-sm font-medium flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <span>🔒 Secure & Private</span>
            <span>⚡ AI-Powered</span>
            <span>🚀 Coming Soon</span>
          </div>
        </div>
      </section>

      {/* Benefits Section - Moved to first position */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-syntra-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-syntra-accent mb-3 sm:mb-4">Why Choose Syntra.ai?</h2>
            <p className="text-base sm:text-lg text-syntra-accent/80 max-w-2xl mx-auto px-4">
              Join thousands of professionals who've transformed their productivity
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className={`transition-all duration-500 transform hover:scale-105 hover:shadow-2xl border-0 bg-white rounded-xl sm:rounded-2xl ${
                  index === currentBenefit
                    ? "ring-2 ring-syntra-primary shadow-2xl bg-white"
                    : ""
                }`}
              >
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="text-syntra-primary mb-4 sm:mb-6 p-2 sm:p-3 bg-syntra-primary/10 rounded-xl sm:rounded-2xl w-fit">{benefit.icon}</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-syntra-accent mb-3 sm:mb-4">{benefit.title}</h3>
                  <p className="text-syntra-accent/80 leading-relaxed text-sm sm:text-base md:text-lg">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
                  </div>
                  </div>
      </section>

      {/* How Syntra Works Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-syntra-accent mb-3 sm:mb-4">
              How Syntra Works
            </h2>
            <p className="text-base sm:text-lg text-syntra-accent/80 max-w-2xl mx-auto px-4">
              A simple 5-step process to transform your productivity
            </p>
                </div>
          
          <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
            {/* Step 1: User Input */}
            <div 
              ref={(el) => { stepRefs.current[0] = el }}
              className={`flex items-center mb-8 transition-all duration-700 ease-out ${
                animatedSteps[0] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-syntra-primary w-16 h-16 rounded-full flex items-center justify-center mr-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-syntra-accent mb-1">User Input</h3>
                <p className="text-syntra-accent/80">Tell Syntra what you need</p>
              </div>
            </div>

            {/* Connecting Line 1 */}
            <div className={`relative w-full max-w-md flex justify-start mb-8 transition-all duration-700 ease-out delay-100 ${
              animatedSteps[0] ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-px h-12 bg-syntra-secondary ml-8"></div>
              <div className="absolute left-8 bottom-0 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-syntra-secondary"></div>
                  </div>

            {/* Step 2: Thinking / Listening */}
            <div 
              ref={(el) => { stepRefs.current[1] = el }}
              className={`flex items-center mb-8 transition-all duration-700 ease-out ${
                animatedSteps[1] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-syntra-secondary w-16 h-16 rounded-full flex items-center justify-center mr-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                </div>
              <div>
                <h3 className="text-xl font-bold text-syntra-accent mb-1">Thinking / Listening</h3>
                <p className="text-syntra-accent/80">AI understands your context</p>
                </div>
                </div>

            {/* Connecting Line 2 */}
            <div className={`relative w-full max-w-md flex justify-start mb-8 transition-all duration-700 ease-out delay-100 ${
              animatedSteps[1] ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-px h-12 bg-syntra-secondary ml-8"></div>
              <div className="absolute left-8 bottom-0 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-syntra-secondary"></div>
                </div>

            {/* Step 3: Executing */}
            <div 
              ref={(el) => { stepRefs.current[2] = el }}
              className={`flex items-center mb-8 transition-all duration-700 ease-out ${
                animatedSteps[2] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-syntra-primary w-16 h-16 rounded-full flex items-center justify-center mr-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                  </div>
              <div>
                <h3 className="text-xl font-bold text-syntra-accent mb-1">Executing</h3>
                <p className="text-syntra-accent/80">Takes action automatically</p>
                  </div>
                </div>

            {/* Connecting Line 3 */}
            <div className={`relative w-full max-w-md flex justify-start mb-8 transition-all duration-700 ease-out delay-100 ${
              animatedSteps[2] ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-px h-12 bg-syntra-secondary ml-8"></div>
              <div className="absolute left-8 bottom-0 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-syntra-secondary"></div>
            </div>

            {/* Step 4: Managing */}
            <div 
              ref={(el) => { stepRefs.current[3] = el }}
              className={`flex items-center mb-8 transition-all duration-700 ease-out ${
                animatedSteps[3] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-syntra-secondary w-16 h-16 rounded-full flex items-center justify-center mr-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
        </div>
              <div>
                <h3 className="text-xl font-bold text-syntra-accent mb-1">Managing</h3>
                <p className="text-syntra-accent/80">Keeps everything organized</p>
              </div>
            </div>

            {/* Connecting Line 4 */}
            <div className={`relative w-full max-w-md flex justify-start mb-8 transition-all duration-700 ease-out delay-100 ${
              animatedSteps[3] ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-px h-12 bg-syntra-secondary ml-8"></div>
              <div className="absolute left-8 bottom-0 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-syntra-secondary"></div>
          </div>

            {/* Step 5: Reminding */}
            <div 
              ref={(el) => { stepRefs.current[4] = el }}
              className={`flex items-center transition-all duration-700 ease-out ${
                animatedSteps[4] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-syntra-primary w-16 h-16 rounded-full flex items-center justify-center mr-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006 3h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-syntra-accent mb-1">Reminding</h3>
                <p className="text-syntra-accent/80">Stays on top of your tasks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-syntra-accent mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-syntra-accent/80 max-w-2xl mx-auto px-4">
              Everything you need to know about Syntra.ai
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-syntra-light rounded-xl sm:rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(0)}
                className="w-full p-4 sm:p-6 md:p-8 text-left flex items-center justify-between hover:bg-syntra-light/80 transition-colors duration-200"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-syntra-accent pr-4">
                  What is Syntra.ai?
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    expandedFAQ === 0 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === 0 && (
                <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-syntra-accent/80 leading-relaxed text-sm sm:text-base md:text-lg">
                    Syntra.ai is an AI-powered productivity assistant that listens to your needs, takes action automatically, 
                    manages your tasks, and keeps you on track. It transforms your workflow by understanding context and 
                    automating routine tasks so you can focus on what matters most.
                  </p>
                </div>
              )}
          </div>

            {/* FAQ Item 2 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(1)}
                className="w-full p-6 sm:p-8 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                  When will Syntra.ai be available?
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    expandedFAQ === 1 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === 1 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    We're currently in development and will be launching soon! Join our waitlist to be the first to know 
                    when Syntra.ai goes live. Early waitlist members will get priority access and exclusive early adopter benefits.
                  </p>
            </div>
              )}
              </div>

            {/* FAQ Item 3 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(2)}
                className="w-full p-6 sm:p-8 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                  How does Syntra.ai work?
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    expandedFAQ === 2 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === 2 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    Simply tell Syntra what you need - whether it's scheduling meetings, organizing tasks, or managing your day. 
                    Our AI understands your context, takes action automatically, and keeps everything organized. 
                    It's like having a personal assistant that never sleeps.
                  </p>
            </div>
              )}
          </div>

            {/* FAQ Item 4 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(3)}
                className="w-full p-6 sm:p-8 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                  What makes Syntra.ai different from other productivity tools?
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    expandedFAQ === 3 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
              </button>
              {expandedFAQ === 3 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    Unlike traditional productivity tools that require manual setup and management, Syntra.ai uses advanced AI 
                    to understand your workflow and automate tasks intelligently. It learns from your patterns, adapts to your 
                    needs, and works proactively to boost your productivity.
                  </p>
        </div>
              )}
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(4)}
                className="w-full p-6 sm:p-8 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                  Will Syntra.ai integrate with my existing tools?
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    expandedFAQ === 4 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === 4 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    Yes! Syntra.ai is designed to work seamlessly with your existing productivity tools and workflows. 
                    We're building integrations with popular platforms to ensure a smooth experience that enhances 
                    rather than replaces your current setup.
            </p>
          </div>
              )}
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(5)}
                className="w-full p-6 sm:p-8 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                  How much will Syntra.ai cost?
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    expandedFAQ === 5 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === 5 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    We're finalizing our pricing structure to ensure Syntra.ai is accessible to everyone. 
                    Join our waitlist to get early access and special pricing for early adopters. 
                    We'll announce our pricing plans closer to launch.
                  </p>
          </div>
              )}
        </div>

            {/* FAQ Item 7 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(6)}
                className="w-full p-6 sm:p-8 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                  Is my data secure with Syntra.ai?
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    expandedFAQ === 6 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === 6 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    Absolutely. Data security and privacy are our top priorities. We use enterprise-grade security measures 
                    to protect your information and ensure your data remains private and secure. 
                    We're committed to transparency about how we handle and protect your data.
            </p>
          </div>
              )}
            </div>

            {/* FAQ Item 8 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(7)}
                className="w-full p-6 sm:p-8 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                  Can I use Syntra.ai for team collaboration?
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    expandedFAQ === 7 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFAQ === 7 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    Yes! Syntra.ai will support both individual and team workflows. Our team features will help coordinate 
                    tasks, manage shared projects, and improve team productivity. We're building collaboration tools 
                    that make teamwork more efficient and enjoyable.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-black/50 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">Ready to Transform Your Productivity?</h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 leading-relaxed px-4">
            Join thousands of users who are already boosting their productivity with Syntra.ai
          </p>
          
          {/* Waitlist CTA */}
          {!showWaitlistInput ? (
          <Button
            size="lg"
              className="bg-white text-gray-900 hover:bg-gray-50 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-md mx-auto"
              onClick={handleJoinWaitlist}
            >
              <Clock className="w-6 h-6 mr-4" />
              Join the Waitlist
            </Button>
          ) : (
            <div className="w-full sm:w-auto max-w-md mx-auto">
              {!waitlistSubmitted ? (
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={waitlistEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaitlistEmail(e.target.value)}
                    required
                    className="h-14 text-lg rounded-2xl border-2 focus:border-gray-500"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-50 px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                    disabled={isSubmittingWaitlist}
                  >
                    {isSubmittingWaitlist ? "Submitting..." : "Submit"}
          </Button>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold">You're on the waitlist!</p>
                  <p className="text-sm">We'll notify you when Syntra launches.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-syntra-accent rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Syntra.ai</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                AI-powered productivity assistant that transforms how you work, plan, and achieve your goals.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 Syntra.ai. All rights reserved.</p>
            <p className="text-gray-400 text-sm">
              Made with ❤️ by <span className="text-white font-semibold">Swarnadeep Debnath</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}