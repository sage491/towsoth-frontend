import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Shield, Loader2 } from 'lucide-react'
import OwlLogo from '@/components/OwlLogo'
import { validateEmail } from '@/utils/security'

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
  const { loginAdmin, login } = useAuth()

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
      const sanitizedEmail = emailValidation.sanitized
      
      // Try general login first (supports admin in many backends)
      const generalResult = await login(sanitizedEmail, formData.password)
      if (generalResult.success) {
        if (generalResult.user?.role === 'admin') {
          navigate('/admin')
          return
        } else {
          setError('Access denied. Admin privileges required.')
          return
        }
      }

      // Fallback to dedicated admin login endpoint
      const result = await loginAdmin(sanitizedEmail, formData.password)
      if (result.success && result.user.role === 'admin') {
        navigate('/admin')
      } else if (result.success && result.user.role !== 'admin') {
        setError('Access denied. Admin privileges required.')
      } else {
        setError(result.error || 'Invalid admin credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <OwlLogo className="h-8 w-8" color="#3b82f6" />
            <span className="text-2xl font-bold text-primary">Towsoth Edu</span>
          </Link>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5 text-red-600" />
            <span className="text-red-600 font-medium">Admin Portal</span>
          </div>
        </div>

        <Card className="shadow-lg border-red-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-red-800">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your administrator credentials to access the admin panel
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
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@towsoth.edu"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
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

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Login as Admin
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials removed */}

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                ← Back to Student Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminLoginPage
