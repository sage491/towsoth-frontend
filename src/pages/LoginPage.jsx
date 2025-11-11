import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import OwlLogo from '@/components/OwlLogo'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authAPI, setUserProfile } from '@/services/api'
import { validateEmail } from '@/utils/security'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    year: ''
  })
  const navigate = useNavigate()
  const { login, loginAdmin, updateUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Validate email format
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }
    
    try {
      // Use sanitized email
      const sanitizedEmail = emailValidation.sanitized
      
      // Attempt student login first
      const studentResult = await login(sanitizedEmail, formData.password)
      if (studentResult.success && studentResult.user?.role !== 'admin') {
        // If user selected a year during sign in, persist it immediately
        if (formData.year) {
          try {
            const response = await authAPI.updateProfile({ year: formData.year })
            if (response && response.success && response.user) {
              // Preserve selectedSubjects from login while updating year
              const nextUser = { ...studentResult.user, year: response.user.year || formData.year }
              setUserProfile(nextUser)
              updateUser(nextUser)
            }
          } catch (profileErr) {
            console.error('Failed to update year on login:', profileErr)
          }
        }
        navigate('/dashboard')
      } else if (!studentResult.success) {
        // Fallback: try admin login using the same credentials
        const adminResult = await loginAdmin(sanitizedEmail, formData.password)
        if (adminResult.success && adminResult.user?.role === 'admin') {
          navigate('/admin')
        } else {
          setError(adminResult.error || studentResult.error || 'Invalid credentials')
        }
      } else if (studentResult.success && studentResult.user?.role === 'admin') {
        // Rare case: student endpoint returned admin role; route accordingly
        navigate('/admin')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Login error:', err)
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
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
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
                <Label htmlFor="email">Email or Username</Label>
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
                    placeholder="Enter your password"
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

              {/* Optional Year selection during sign in */}
              <div className="space-y-2">
                <Label htmlFor="year">Year (optional)</Label>
                <Select 
                  value={formData.year}
                  onValueChange={(value) => setFormData({ ...formData, year: value })}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Social auth options removed (Google/Facebook) */}

            <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
