import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PerformanceChart from '@/components/charts/PerformanceChart'
import AnimatedCounter from '@/components/animations/AnimatedCounter'
import FloatingElements from '@/components/animations/FloatingElements'
import VideoBackground from '@/components/graphics/VideoBackground'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ThemeContext } from '@/contexts/ThemeContext'
import { 
  Trophy, 
  TrendingUp, 
  Play, 
  Target,
  Users,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Award,
  Lightbulb,
  User,
  // Shield icon removed with admin login option
} from 'lucide-react'
import OwlLogo from '@/components/OwlLogo'

const ModernLandingPage = () => {
  const { theme } = useContext(ThemeContext)
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Floating Background Elements */}
      <FloatingElements />
      
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto responsive-padding">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <OwlLogo size="small" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground truncate">TOWSOTH</span>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-end">
              <a 
                href="#about-us" 
                onClick={(e) => { e.preventDefault(); scrollToSection('about-us'); }}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer zoom-text"
              >
                About Us
              </a>
              <a 
                href="#resources" 
                onClick={(e) => { e.preventDefault(); scrollToSection('resources'); }}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer zoom-text"
              >
                Resources
              </a>
              <a 
                href="#features" 
                onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer zoom-text"
              >
                Features
              </a>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white touch-target text-sm sm:text-base">
                  Sign In
                </Button>
              </Link>
              <ThemeToggle />
              {/* Admin login option removed from landing page */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="responsive-padding py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-xs sm:text-sm mb-6 sm:mb-8">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Master Your College Exams With TOWSOTH
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent zoom-text">
              Save Your Scholarship With
              <br />
              TOWSOTH
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto zoom-text">
              A simple yet innovative system built to help students  
              retain their scholarhsip and 
              master their college exams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 touch-target text-sm sm:text-base">
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                GET STARTED
              </Button>
              <Button size="lg" variant="outline" className="border-border text-muted-foreground hover:bg-accent px-6 sm:px-8 py-3 touch-target text-sm sm:text-base">
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
      </section>
      


      {/* The Struggle Is Real Section */}
      <section className="responsive-padding py-12 sm:py-16 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground zoom-text">The Struggle Is Real</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base zoom-text">
              We've all been there: trying to learn something new, feeling overwhelmed by the amount of content, 
              and struggling to track our progress and stay motivated.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-red-400" />
                </div>
                <CardTitle className="text-card-foreground">Last-minute Cramming</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  That last-minute fire when you realize the exam is tomorrow and you haven't 
                  done any of the syllabus feels like a black hole.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <CardTitle className="text-card-foreground">Motivation Monday, Burnout Tuesday</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Set big goals on your planner. Studied some. 
                  Then you call lazy—you're just human.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-card-foreground">Procrastination Lifestyle</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  "I'll start studying tomorrow" becomes your daily mantra. 
                  We've all been there.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  "Real plan" planning to do it?
                  <br />
                  Start actually doing it
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>See TOWSOTH in Action</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Get your TOWSOTH free trial</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>See how TOWSOTH can help you</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Start improving your productivity</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Make learning more structured</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 dark:bg-white/10 bg-black/5 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 text-white">Your progress</h4>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">
                      <AnimatedCounter end={78} />%
                    </div>
                    <div className="text-sm text-blue-200">Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">
                      <AnimatedCounter end={42} />
                    </div>
                    <div className="text-sm text-green-200">Hours</div>
                  </div>
                </div>
                <PerformanceChart />
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">See TOWSOTH in Action</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-foreground">Get your TOWSOTH free trial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-foreground">See how TOWSOTH can help you</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-foreground">Start improving your productivity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-foreground">Make learning more structured</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center">
              <VideoBackground className="w-full h-48 mb-4" />
              <p className="text-muted-foreground">Watch how students are transforming their learning experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">The TOWSOTH Breakdown</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-blue-600 border-0 text-white">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">T - Target</h3>
              </CardContent>
            </Card>

            <Card className="bg-purple-600 border-0 text-white">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">O - Organize</h3>
              </CardContent>
            </Card>

            <Card className="bg-green-600 border-0 text-white">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">W - Work</h3>
              </CardContent>
            </Card>

            <Card className="bg-orange-600 border-0 text-white">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">S - Solve</h3>
              </CardContent>
            </Card>

            <Card className="bg-pink-600 border-0 text-white">
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">O - Optimize</h3>
              </CardContent>
            </Card>

            <Card className="bg-indigo-600 border-0 text-white">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-2">T - Track</h3>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">H - Hype</h3>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Start from Today</h4>
                    <p className="text-sm text-slate-400">Student Success & Growth</p>
                  </div>
                </div>
                <p className="text-slate-300">
                  "TOWSOTH completely transformed how I approach learning. The structured approach 
                  and progress tracking kept me motivated throughout my journey."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Start from Today</h4>
                    <p className="text-sm text-muted-foreground">Developer Experience & Growth</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The gamification aspect and clear progress visualization made studying 
                  addictive in the best way possible. Highly recommend!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">About Us</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              TOWSOTH is more than just a learning platform - it's a comprehensive system designed to help students 
              excel in their college exams and maintain their scholarships. Our innovative approach combines structured 
              learning with gamification to make studying engaging and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-card-foreground">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  To empower students with the tools and structure they need to succeed academically 
                  and retain their scholarships through effective learning strategies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-card-foreground">Our Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Join thousands of students who have transformed their learning experience 
                  and achieved academic success with TOWSOTH's proven methodology.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-card-foreground">Our Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  We combine cutting-edge technology with proven educational principles 
                  to create a learning experience that's both effective and enjoyable.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Resources</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access a comprehensive library of study materials, tools, and guides 
              designed to support your academic journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <OwlLogo className="h-6 w-6" color="#60a5fa" />
                </div>
                <CardTitle className="text-card-foreground">Study Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Comprehensive study guides for all major subjects and exam types.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-card-foreground">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Advanced analytics to monitor your learning progress and identify areas for improvement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-card-foreground">Time Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Tools and techniques to help you manage your study time effectively.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-card-foreground">Achievement System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Gamified learning with badges, achievements, and progress milestones.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful features that make TOWSOTH the ultimate learning companion 
              for college students.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Smart Learning System</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Adaptive Learning Paths</h4>
                    <p className="text-muted-foreground">Personalized study plans that adapt to your learning pace and style.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Real-time Progress Tracking</h4>
                    <p className="text-muted-foreground">Monitor your progress with detailed analytics and insights.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Interactive Study Materials</h4>
                    <p className="text-muted-foreground">Engaging content with videos, quizzes, and interactive exercises.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">Boost Your Performance</h4>
                <p className="text-blue-100 mb-4">
                  Students using TOWSOTH see an average improvement of 35% in their exam scores.
                </p>
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      <AnimatedCounter end={95} />%
                    </div>
                    <div className="text-sm text-blue-200">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      <AnimatedCounter end={10000} />+
                    </div>
                    <div className="text-sm text-blue-200">Students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-bold mb-2 text-card-foreground">Gamification</h3>
                <p className="text-muted-foreground">
                  Earn points, unlock achievements, and compete with friends to stay motivated.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-bold mb-2 text-card-foreground">Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Detailed insights into your learning patterns and performance trends.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2 text-card-foreground">Study Groups</h3>
                <p className="text-muted-foreground">
                  Connect with peers, form study groups, and learn together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join a moment to save your scholarship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <OwlLogo className="h-5 w-5" color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">TOWSOTH</span>
            </div>
            <div className="flex space-x-6">
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TOWSOTH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ModernLandingPage
