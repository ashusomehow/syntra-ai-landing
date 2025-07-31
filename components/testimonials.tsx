"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content:
      "Syntra.ai has completely transformed how I manage my daily tasks. The AI assistant is incredibly intuitive!",
    rating: 5,
  },
  {
    name: "John Davis",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "I love how it automatically schedules my meetings and reminds me of important deadlines. Game changer!",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    role: "Freelance Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "The restaurant booking feature saved me so much time planning dates. Highly recommend!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg sm:text-xl text-gray-700">
            Join thousands of satisfied users who've transformed their productivity
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
            >
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-base sm:text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-gray-200">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{testimonial.name}</h4>
                    <p className="text-sm sm:text-base text-gray-700">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
