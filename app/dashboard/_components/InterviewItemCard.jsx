import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import React from 'react'
import { 
  Clock, 
  User, 
  Calendar, 
  Play, 
  MessageSquare, 
  Briefcase,
  Star
} from 'lucide-react'

const InterviewItemCard = ({ interview }) => {
  const router = useRouter()
  
  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`)
  }
  
  const onFeedbackPress = () => {
    router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) return dateString
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  // Get experience level badge variant
  const getExperienceBadge = (years) => {
    if (years <= 2) return { variant: 'secondary', label: 'Entry Level' }
    if (years <= 5) return { variant: 'default', label: 'Mid Level' }
    return { variant: 'destructive', label: 'Senior Level' }
  }

  const experienceBadge = getExperienceBadge(interview?.jobExperience)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50 max-w-sm mx-auto">
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-primary text-lg leading-tight line-clamp-2">
              {interview?.jobPosition}
            </h3>
          </div>
          <Badge 
            variant={experienceBadge.variant} 
            className="text-xs font-medium"
          >
            {experienceBadge.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{interview?.jobExperience} {interview?.jobExperience === 1 ? 'Year' : 'Years'} Experience</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created {formatDate(interview?.createdAt)}</span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700">Ready to start</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 gap-2 hover:bg-gray-50 transition-colors group/btn" 
            onClick={onFeedbackPress}
          >
            <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            Feedback
          </Button>
          
          <Button 
            size="sm" 
            className="flex-1 gap-2 bg-primary hover:bg-primary/90 transition-all group/btn shadow-sm hover:shadow-md"
            onClick={onStart}
          >
            <Play className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
            Start
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default InterviewItemCard