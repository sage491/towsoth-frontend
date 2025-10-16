import React, { useState, useMemo } from 'react'

const DashboardCalendar = React.memo(({ events = [] }) => {
  const [currentDate] = useState(new Date())
  
  // Memoize calendar calculations
  const calendarData = useMemo(() => {
    // Get current month and year
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    
    // Create array of day names
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    
    // Create array of month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    // Use provided events or fallback to empty array
    const calendarEvents = events.length > 0 
      ? events.map(event => ({
          date: new Date(event.date),
          type: event.type
        }))
      : []

    return {
      currentMonth,
      currentYear,
      daysInMonth,
      firstDayOfMonth,
      dayNames,
      monthNames,
      calendarEvents
    }
  }, [currentDate, events])

  const {
    currentMonth,
    currentYear,
    daysInMonth,
    firstDayOfMonth,
    dayNames,
    monthNames,
    calendarEvents
  } = calendarData
  
  // Check if a date has an event
  const hasEvent = (day) => {
    return calendarEvents.some(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === currentMonth && 
      event.date.getFullYear() === currentYear
    )
  }
  
  // Get event type for a date
  const getEventType = (day) => {
    const event = calendarEvents.find(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === currentMonth && 
      event.date.getFullYear() === currentYear
    )
    return event ? event.type : null
  }
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-6 w-6"></div>)
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === currentDate.getDate()
      const hasEventToday = hasEvent(day)
      const eventType = getEventType(day)
      
      let eventColor = ''
      if (eventType === 'assignment') eventColor = 'bg-primary'
      else if (eventType === 'exam') eventColor = 'bg-destructive'
      else if (eventType === 'meeting') eventColor = 'bg-green-500'
      
      days.push(
        <div 
          key={day} 
          className={`
            h-6 w-6 flex items-center justify-center text-xs rounded-full
            ${isToday ? 'bg-primary text-primary-foreground' : ''}
          `}
        >
          {day}
          {hasEventToday && (
            <div className={`absolute -bottom-1 w-1.5 h-1.5 ${eventColor} rounded-full`}></div>
          )}
        </div>
      )
    }
    
    return days
  }

  return (
    <div className="w-full">
      {/* Month and Year */}
      <div className="text-sm font-medium mb-2">
        {monthNames[currentMonth]} {currentYear}
      </div>
      
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div key={day} className="h-6 flex items-center justify-center text-xs text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays()}
      </div>
      
      {/* Legend */}
      <div className="mt-3 text-xs text-muted-foreground flex flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-1"></div>
          <span>Assignment</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-destructive rounded-full mr-1"></div>
          <span>Exam</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          <span>Meeting</span>
        </div>
      </div>
    </div>
  )
})

DashboardCalendar.displayName = 'DashboardCalendar'

export default DashboardCalendar