import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react'
import OwlLogo from '@/components/OwlLogo'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI, subjectsAPI, streamsAPI, collegesAPI } from '@/services/api'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    year: '',
    stream: '',
    selectedSubjects: []
  })
  const navigate = useNavigate()
  const { register } = useAuth()
  // Add dynamic streams state
  const [availableStreams, setAvailableStreams] = useState([])
  const [streamsLoading, setStreamsLoading] = useState(false)
  // Colleges state
  const [availableColleges, setAvailableColleges] = useState([])
  const [collegesLoading, setCollegesLoading] = useState(false)

  // Fetch streams from admin-managed streams list
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setStreamsLoading(true)
        const selectedUniversity = (formData.university || '').trim()
        const hasValidUniversity = selectedUniversity && availableColleges.includes(selectedUniversity)
        if (!hasValidUniversity) {
          setAvailableStreams([])
          return
        }
        const res = await streamsAPI.getAll({ college: selectedUniversity })
        const arr = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        const names = arr.map((s) => s?.name || s?.title || (typeof s === 'string' ? s : '')).filter(Boolean)
        setAvailableStreams(names)
      } catch (e) {
        console.error('Failed to fetch streams:', e)
        setAvailableStreams([])
      } finally {
        setStreamsLoading(false)
      }
    }
    fetchStreams()
  }, [formData.university, availableColleges])
  // Deprecated: streams are now fetched from streamsAPI above.
  // No subject fetching during signup; users can select subjects later in Profile

  // Fetch colleges for university dropdown
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setCollegesLoading(true)
        const res = await collegesAPI.getAll()
        const arr = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        const names = arr.map((c) => c?.name || (typeof c === 'string' ? c : '')).filter(Boolean)
        setAvailableColleges(names)
      } catch (e) {
        console.error('Failed to fetch colleges:', e)
        setAvailableColleges([])
      } finally {
        setCollegesLoading(false)
      }
    }
    fetchColleges()
  }, [])
  // Deprecated: streams are now fetched from streamsAPI above.
  // No subject fetching during signup; users can select subjects later in Profile
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    // Require stream selection
    if (!formData.stream) {
      setError('Please select a stream')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData
      
      const result = await register(userData)
      if (result.success) {
        try {
          // Ensure stream is persisted on the profile
          await authAPI.updateProfile({ stream: formData.stream })
        } catch (profileErr) {
          console.warn('Stream persistence failed; proceeding:', profileErr)
        }
        navigate('/dashboard')
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <OwlLogo className="h-8 w-8" color="#3b82f6" />
            <span className="text-2xl font-bold text-primary">Towsoth Edu</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
              Join thousands of students on their learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className={passwordsDontMatch ? "border-red-500" : passwordsMatch ? "border-green-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-8 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  {passwordsMatch && (
                    <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                  {passwordsDontMatch && (
                    <X className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                </div>
                {passwordsDontMatch && (
                  <p className="text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">College</Label>
                {/* Replace text input with admin-managed colleges dropdown */}
                <Select 
                  value={formData.university}
                  onValueChange={(value) => handleSelectChange('university', value)}
                  disabled={loading || collegesLoading || availableColleges.length === 0}
                >
                  <SelectTrigger disabled={loading || collegesLoading || availableColleges.length === 0}>
                    <SelectValue placeholder={collegesLoading ? 'Loading colleges...' : (availableColleges.length === 0 ? 'No colleges available yet' : 'Select your college')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColleges.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableColleges.length === 0 && !collegesLoading && (
                  <p className="text-xs text-muted-foreground">Colleges are managed by admins in the Admin Panel.</p>
                )}
              </div>
              {/* Stream selection */}
              <div className="space-y-2">
                <Label htmlFor="stream">Stream</Label>
                <Select 
                  value={formData.stream}
                  onValueChange={(value) => handleSelectChange('stream', value)}
                  disabled={loading || streamsLoading || availableStreams.length === 0 || !formData.university}
                >
                  <SelectTrigger disabled={loading || streamsLoading || availableStreams.length === 0 || !formData.university}>
                    <SelectValue placeholder={streamsLoading ? 'Loading streams...' : (!formData.university ? 'Select college first' : (availableStreams.length === 0 ? 'No streams available yet' : 'Select your stream'))} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStreams.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableStreams.length === 0 && !streamsLoading && (
                  <p className="text-xs text-muted-foreground">Streams appear when admins upload content tied to a stream.</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select 
                  value={formData.year}
                  onValueChange={(value) => handleSelectChange('year', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Subjects</Label>
                <p className="text-sm text-muted-foreground">
                  You can add or manage your subjects later from your Profile.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="rounded border-gray-300"
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Social auth options removed (Google/Facebook) */}

            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignupPage
