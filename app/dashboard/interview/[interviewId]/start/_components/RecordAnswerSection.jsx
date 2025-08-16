"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import useSpeechToText from 'react-hook-speech-to-text'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Square, 
  Play,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useSearchParams } from 'next/navigation'

const Webcam = dynamic(() => import('react-webcam'), { ssr: false })


const RecordAnswerSection = ({ mockInterviewQuestion, activeQuestionIndex, interviewData }) => {
  const searchParams = useSearchParams()
const initialCameraState = searchParams.get("camera") === "true"
  const [userAnswer, setUserAnswer] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [webcamEnabled, setWebcamEnabled] = useState(initialCameraState)
  const [recordingStatus, setRecordingStatus] = useState('idle') 
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  })

  // Sync camera state when initialCameraState changes
  useEffect(() => {
    setWebcamEnabled(initialCameraState)
  }, [initialCameraState])

  // Timer effect for recording
  useEffect(() => {
    let interval = null
    if (isRecording) {
      setRecordingStatus('recording')
      interval = setInterval(() => {
        setRecordingTime(time => time + 1)
      }, 1000)
    } else {
      clearInterval(interval)
      if (recordingTime > 0) {
        setRecordingTime(0)
      }
    }
    return () => clearInterval(interval)
  }, [isRecording])

  useEffect(() => {
    const combined = results.map(r => r?.transcript || "").join(" ")
    if (combined.trim()) {
      setUserAnswer(prev => prev + combined)
    }
  }, [results])

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer()
    }
  }, [userAnswer])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText()
      setRecordingStatus('processing')
      const latestAnswer = results.map(r => r?.transcript || "").join(" ") || userAnswer
    } else {
      try {
        setRecordingTime(0)
        startSpeechToText()
        setRecordingStatus('recording')
      } catch (err) {
        console.error("Speech recognition error:", err)
        toast.error("Failed to start recording. Please try again.")
      }
    }
  }

  const cleanMarkdownText = (text) => {
    if (!text) return text
    
    return text
      .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_{3}(.*?)_{3}/g, '$1')
      .replace(/_{2}(.*?)_{2}/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .trim()
  }

  const UpdateUserAnswer = async () => {
    console.log(userAnswer)
    setLoading(true)
    setRecordingStatus('processing')

    try {
      const feedbackPrompt =
        "Questions:" + mockInterviewQuestion[activeQuestionIndex]?.Question +
        ", User Answer:" + userAnswer +
        ", Depends on question and user answer for given interview question " +
        "Please give us rating for answer and feedback as area of improvement if any " +
        "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field"

      const result = await chatSession.sendMessage(feedbackPrompt)

      const mockJsonResp = (result.response.text())
        .replace('```json', '')
        .replace('```', '')
      
      const JsonFeedbackResp = JSON.parse(mockJsonResp)

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.Question,
        correctAns: cleanMarkdownText(mockInterviewQuestion[activeQuestionIndex]?.Answer),
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      })

      if (resp) {
        toast.success('Answer recorded successfully! 🎉')
        setUserAnswer('')
        setResults([])
        setRecordingStatus('completed')
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          setRecordingStatus('idle')
        }, 2000)
      }
    } catch (error) {
      console.error('Error saving answer:', error)
      toast.error('Failed to save answer. Please try again.')
      setRecordingStatus('idle')
    }

    setLoading(false)
  }

  const getStatusColor = () => {
    switch (recordingStatus) {
      case 'recording': return 'text-red-500'
      case 'processing': return 'text-yellow-500'
      case 'completed': return 'text-green-500'
      default: return 'text-gray-500 dark:text-gray-400'
    }
  }

  const getStatusText = () => {
    switch (recordingStatus) {
      case 'recording': return 'Recording your answer...'
      case 'processing': return 'Processing and saving...'
      case 'completed': return 'Answer saved successfully!'
      default: return 'Ready to record your answer'
    }
  }

  return (
    <div className='space-y-6 mt-4'>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Record Your Answer
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Take your time and speak clearly. Your response will be automatically processed.
        </p>
      </div>

      {/* Video Section */}
      <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-red-600 dark:text-red-400 font-mono text-sm">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}
        </div>

        <div className='relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl'>
          {/* Webcam overlay image */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
           
          </div>

          {/* Recording indicator overlay */}
          {isRecording && (
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              REC
            </div>
          )}

          {/* Webcam controls overlay */}
          <div className="absolute bottom-4 right-4 z-30 flex gap-2">
            <button
              onClick={() => setWebcamEnabled(!webcamEnabled)}
              className="bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-gray-800/80 transition-colors"
              title={webcamEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {webcamEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 w-4" />}
            </button>
          </div>

          {/* Webcam component */}
          {webcamEnabled && (
            <Webcam
              mirrored={true}
              className="w-full h-80 object-cover"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user"
              }}
            />
          )}
          
          {!webcamEnabled && (
            <div className="w-full h-80 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Camera is turned off</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Transcript */}
      {(isRecording || userAnswer) && (
        <div className='bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800'>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
              {isRecording ? 'Live Transcript' : 'Your Answer'}
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 min-h-[60px] max-h-32 overflow-y-auto">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {interimResult || userAnswer || "Start speaking..."}
            </p>
          </div>
        </div>
      )}

      {/* Control Button */}
      <div className="text-center">
        <Button
          disabled={loading || recordingStatus === 'processing'}
          onClick={StartStopRecording}
          size="lg"
          className={`relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
              : recordingStatus === 'processing'
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/25'
              : recordingStatus === 'completed'
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
          }`}
        >
          <div className="flex items-center gap-3">
            {loading || recordingStatus === 'processing' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRecording ? (
              <Square className="w-5 h-5" />
            ) : recordingStatus === 'completed' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
            
            <span>
              {loading || recordingStatus === 'processing' ? 'Processing...' :
               isRecording ? 'Stop Recording' :
               recordingStatus === 'completed' ? 'Completed!' :
               'Start Recording'}
            </span>
          </div>
        </Button>

        {/* Recording tips */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Speak clearly and at a normal pace</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Your answer will be automatically saved</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecordAnswerSection