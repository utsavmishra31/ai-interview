"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { 
  Camera, 
  Lightbulb, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  RefreshCw,
  AlertTriangle,
  User,
  Briefcase,
  Code,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null)
  const [webCamEnabled, setWebCamEnabled] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    GetInterviewDetails()
  }, [params])

  const GetInterviewDetails = async () => {
    try {
      setLoading(true)
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
      
      if (result.length > 0) {
        setInterviewData(result[0])
      } else {
        setError("Interview not found. Please check the interview ID.")
      }
    } catch (err) {
      console.error("Error fetching interview:", err)
      setError("Failed to load interview details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleCamera = async () => {
    if (webCamEnabled) {
      setWebCamEnabled(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setWebCamEnabled(true)
        stream.getTracks().forEach(track => track.stop())
      } catch (err) {
        console.error("Camera error:", err)
        alert("Unable to access camera. Please check permissions.")
      }
    }
  }

  const toggleMicrophone = async () => {
    if (micEnabled) {
      setMicEnabled(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setMicEnabled(true)
        stream.getTracks().forEach(track => track.stop())
      } catch (err) {
        console.error("Microphone error:", err)
        alert("Unable to access microphone. Please check permissions.")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-lg">Loading interview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={GetInterviewDetails} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-8'>Let's Get Started</h1>
      
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Interview Details */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Interview Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Job Position</p>
                  <p className="text-lg font-semibold">{interviewData?.jobPosition}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Code className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Tech Stack</p>
                  <p className="text-gray-800">{interviewData?.jobDesc}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Experience Required</p>
                  <p className="text-lg font-semibold">{interviewData?.jobExperience} years</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="border-yellow-300 bg-yellow-50">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              <strong>Information:</strong><br />
              {process.env.NEXT_PUBLIC_INFORMATION || 
               "Please ensure you're in a quiet environment. Camera and microphone are optional but recommended."}
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Device Setup */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Device Setup </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center gap-4'>
                {/* Camera Preview */}
                {webCamEnabled ? (
                  <Webcam
                    audio={false}
                    mirrored={true}
                    className="rounded-lg border"
                    style={{ height: 200, width: 300 }}
                  />
                ) : (
                  <div className='h-48 w-72 flex flex-col justify-center items-center bg-gray-100 rounded-lg border-2 border-dashed'>
                    <Camera className='h-8 w-8 text-gray-400 mb-2' />
                    <p className="text-sm text-gray-500">Camera preview</p>
                  </div>
                )}

                {/* Device Controls */}
                <div className="flex gap-3">
                  <Button
                    variant={webCamEnabled ? "default" : "outline"}
                    onClick={toggleCamera}
                    className="flex items-center gap-2"
                  >
                    {webCamEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    {webCamEnabled ? "Camera On" : "Enable Camera"}
                  </Button>
                  
                  <Button
                    variant={micEnabled ? "default" : "outline"}
                    onClick={toggleMicrophone}
                    className="flex items-center gap-2"
                  >
                    {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    {micEnabled ? "Mic On" : "Enable Mic"}
                  </Button>
                </div>

                {/* Start Interview Button */}
                <div className="w-full pt-4 border-t">
                  <Link href={`/dashboard/interview/${params.interviewId}/start?camera=${webCamEnabled}`}>
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                Start Interview
                </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Interview