"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  LoaderCircle, 
  Plus, 
  Sparkles, 
  Brain, 
  Target, 
  Clock,
  Briefcase,
  User,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'

// Gemini AI imports
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { useRouter } from 'next/navigation'

// Setup Gemini client
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
}
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]
const chatSession = model.startChat({ generationConfig, safetySettings })

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState("")
  const [jobDesc, setJobDesc] = useState("")
  const [jobExperience, setJobExperience] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [jsonResponse, setJsonResponse] = useState([])
  const { user } = useUser()
  const router = useRouter()

  // Popular job positions for quick selection
  const popularPositions = [
    "Frontend Developer",
    "Backend Developer", 
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "DevOps Engineer",
    "Software Engineer"
  ]

  const onSubmit = async () => {
    if (!jobPosition || !jobDesc || !jobExperience) {
      return
    }
    
    setLoading(true)
    setCurrentStep(2)

    try {
      const prompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}.
      Based on this information, please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5} 
      interview questions with answers in JSON format, with "Question" and "Answer" fields. Make the questions relevant to the experience level and job requirements.`

   
      const result = await chatSession.sendMessage(prompt)
      const rawText = result.response.text().replace(/```json|```/g, "")
      const jsonOutput = JSON.parse(rawText)

      setJsonResponse(jsonOutput)
      console.log("Generated Interview Q&A:", jsonOutput)

      // Insert into DB
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: rawText,
        jobPosition,
        jobDesc,
        jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
        createdAt: moment().format("DD-MM-YYYY")
      }).returning({ mockId: MockInterview.mockId })

      console.log("Inserted ID:", resp)
      if(resp){
        setCurrentStep(3)
        setTimeout(() => {
          setOpenDialog(false)
          setCurrentStep(1)
          resetForm()
          router.push('/dashboard/interview/'+resp[0]?.mockId)
        }, 2000)
      }

    } catch (err) {
      console.error("Error generating AI response or inserting to DB:", err)
      setCurrentStep(1)
    }

    setLoading(false)
  }

  const resetForm = () => {
    setJobPosition("")
    setJobDesc("")
    setJobExperience("")
    setJsonResponse([])
  }

  const handleClose = () => {
    setOpenDialog(false)
    setCurrentStep(1)
    setLoading(false)
    resetForm()
  }

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Job Position */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Briefcase className="w-4 h-4" />
                <span>Job Role/Position</span>
              </label>
              <Input
                placeholder="e.g., Full Stack Developer"
                required
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              />
              
              {/* Quick Selection Pills */}
              <div className="flex flex-wrap gap-2">
                {popularPositions.map((position) => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => setJobPosition(position)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 hover:scale-105 ${
                      jobPosition === position 
                        ? 'bg-blue-100 border-blue-300 text-blue-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Job Description & Requirements</span>
              </label>
              <Textarea
                placeholder="e.g., React, Node.js, TypeScript, REST APIs, Database design..."
                required
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={4}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500">Include technologies, skills, and key requirements</p>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                <span>Years of Experience</span>
              </label>
              <div className="flex items-center space-x-3">
                <Input
                  placeholder="5"
                  type="number"
                  max="50"
                  min="0"
                  required
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                  className="w-24 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                />
                <span className="text-sm text-gray-500">years</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClose}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={onSubmit} 
                disabled={loading || !jobPosition || !jobDesc || !jobExperience}
                className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate Interview
              </Button>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LoaderCircle className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your Interview</h3>
            <p className="text-gray-600 mb-4">Our AI is crafting personalized questions for you...</p>
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>This may take a few moments</span>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Ready!</h3>
            <p className="text-gray-600 mb-4">Your personalized interview has been created successfully.</p>
            <p className="text-sm text-gray-500">Redirecting you to start your practice session...</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {/* Trigger Card */}
      <div
        className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 hover:border-blue-400 p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl'
        onClick={() => setOpenDialog(true)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-8 h-8 border border-blue-300 rounded rotate-12"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border border-purple-300 rounded -rotate-12"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-blue-200 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Interview</h3>
          <p className="text-sm text-gray-600">Generate AI-powered interview questions tailored to your role</p>
          
          {/* Features */}
          <div className="flex justify-center items-center space-x-6 mt-4 pt-4 border-t border-blue-100">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Brain className="w-3 h-3" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Target className="w-3 h-3" />
              <span>Personalized</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Quick Setup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={handleClose}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2'>
              <Brain className="w-6 h-6 text-blue-600" />
              <span>Create Your AI Interview</span>
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Tell us about your target role so we can create the perfect interview practice session for you.
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 my-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step === currentStep 
                    ? 'bg-blue-500 scale-125' 
                    : step < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {renderStep()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview