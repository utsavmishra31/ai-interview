"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { use, useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  ChevronDown, 
  ChevronUp,
  Trophy,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Home,
  BarChart3,
  Target,
  BookOpen,
  Award,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const Feedback = ({ params }) => {
  const { interviewId } = use(params)
  const [feedbackList, setFeedbackList] = useState([])
  const [overallRating, setOverallRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState({})
  const router = useRouter()

  useEffect(() => {
    GetFeedback()
  }, [])

  const GetFeedback = async () => {
    setLoading(true)
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id)

      console.log(result)
      setFeedbackList(result)
      
      // Calculate overall rating
      if (result.length > 0) {
        const totalRating = result.reduce((sum, item) => sum + parseInt(item.rating || 0), 0)
        const avgRating = (totalRating / result.length).toFixed(1)
        setOverallRating(avgRating)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRatingColor = (rating) => {
    const numRating = parseInt(rating)
    if (numRating >= 8) return 'text-green-600 bg-green-50 border-green-200'
    if (numRating >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getRatingIcon = (rating) => {
    const numRating = parseInt(rating)
    if (numRating >= 8) return <CheckCircle className="w-4 h-4" />
    if (numRating >= 6) return <AlertCircle className="w-4 h-4" />
    return <AlertCircle className="w-4 h-4" />
  }

  const getPerformanceLevel = (rating) => {
    if (rating >= 8) return { label: 'Excellent', color: 'text-green-600' }
    if (rating >= 6) return { label: 'Good', color: 'text-yellow-600' }
    if (rating >= 4) return { label: 'Fair', color: 'text-orange-600' }
    return { label: 'Needs Improvement', color: 'text-red-600' }
  }

  const toggleExpanded = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading your feedback...</p>
        </div>
      </div>
    )
  }

  if (feedbackList?.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Interview Feedback Found</h2>
            <p className="text-gray-600 mb-8">It looks like you haven't completed any interviews yet. Start practicing to get personalized feedback!</p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const performance = getPerformanceLevel(overallRating)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Congratulations!
            </h1>
            <p className="text-xl text-gray-600">You've completed your AI interview session</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{overallRating}/10</div>
              <div className="text-sm text-blue-600">Overall Score</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-900">{feedbackList.length}</div>
              <div className="text-sm text-purple-600">Questions</div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className={`text-2xl font-bold ${performance.color}`}>
                {performance.label}
              </div>
              <div className="text-sm text-green-600">Performance</div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-yellow-900">
                {feedbackList.filter(item => parseInt(item.rating) >= 7).length}
              </div>
              <div className="text-sm text-yellow-600">Strong Answers</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
           
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Detailed Feedback</h2>
          </div>
          
          <p className="text-gray-600 mb-8">
            Review each question with the correct answer, your response, and personalized feedback for improvement.
          </p>

          <div className="space-y-4">
            {feedbackList.map((item, index) => (
              <Collapsible key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <CollapsibleTrigger 
                  className="w-full p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between text-left group"
                  onClick={() => toggleExpanded(index)}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getRatingColor(item.rating)}`}>
                      {getRatingIcon(item.rating)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">Question {index + 1}</h3>
                      <p className="text-gray-700 line-clamp-2">{item.question}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(item.rating)}`}>
                        {item.rating}/10
                      </div>
                      {expandedItems[index] ? 
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" /> : 
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      }
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="p-6 space-y-4 bg-white">
                    {/* Your Answer */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Your Answer</span>
                      </h4>
                      <p className="text-red-700 text-sm leading-relaxed">{item.userAns}</p>
                    </div>

                    {/* Correct Answer */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Ideal Answer</span>
                      </h4>
                      <p className="text-green-700 text-sm leading-relaxed">{item.correctAns}</p>
                    </div>

                    {/* Feedback */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>AI Feedback</span>
                      </h4>
                      <p className="text-blue-700 text-sm leading-relaxed">{item.feedback}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready for your next challenge?</h3>
            <p className="text-gray-600 mb-6">Keep practicing to improve your interview skills and boost your confidence.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3"
              >
                <Home className="w-4 h-4 mr-2" />
                Start New Interview
              </Button>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback