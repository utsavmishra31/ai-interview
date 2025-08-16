import { Lightbulb, Volume2, VolumeX, Play, Pause } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const activeIndex = activeQuestionIndex ?? 0
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window)
    
    // Cleanup speech when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const textToSpeech = (text) => {
    if (!speechSupported) {
      alert('Sorry, your browser does not support text to speech')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const speech = new SpeechSynthesisUtterance(text)
    speech.rate = 0.9
    speech.pitch = 1
    speech.volume = 1
    
    speech.onstart = () => setIsSpeaking(true)
    speech.onend = () => setIsSpeaking(false)
    speech.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(speech)
  }

  const getProgressPercentage = () => {
    return ((activeIndex + 1) / mockInterviewQuestion.length) * 100
  }

  return mockInterviewQuestion && (
    <div className='space-y-6 mt-4' >
      
      

      {/* Questions Grid */}
      <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Questions Overview
        </h3>
        <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
          {mockInterviewQuestion.map((question, index) => (
            <div
              key={index}
              className={`relative p-3 rounded-xl text-xs font-medium text-center transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                activeIndex === index 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs opacity-75">Q</span>
                <span className="font-bold">{index + 1}</span>
              </div>
              {activeIndex === index && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700'>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg">
                {activeIndex + 1}
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Current Question
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                    Question {activeIndex + 1}
                  </span>
                </div>
              </div>
            </div>
            
            <h2 className='text-lg md:text-xl font-semibold text-gray-900 dark:text-white leading-relaxed mb-4'>
              {mockInterviewQuestion[activeIndex]?.Question}
            </h2>
          </div>
          
          {/* Speech Button */}
          <button
            onClick={() => textToSpeech(mockInterviewQuestion[activeIndex]?.Question)}
            disabled={!speechSupported}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 shadow-sm ${
              isSpeaking 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25' 
                : 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:shadow-lg'
            } ${!speechSupported ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            title={isSpeaking ? 'Stop reading' : 'Read question aloud'}
          >
            {isSpeaking ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Pro Tips */}
      <div className='bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800/50'>
        <div className='flex items-start gap-4'>
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className='font-semibold text-amber-800 dark:text-amber-200 mb-2'>
              💡 Pro Tips
            </h3>
            <p className='text-sm text-amber-700 dark:text-amber-300 leading-relaxed'>
              {process.env.NEXT_PUBLIC_QUESTION_NOTE || 
                "Take your time to think through your answer. Structure your response with specific examples and quantifiable results where possible."}
            </p>
          </div>
        </div>
        
        {/* Quick Tips */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            <span>Use the STAR method (Situation, Task, Action, Result)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
            <span>Click the speaker icon to hear the question</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionsSection