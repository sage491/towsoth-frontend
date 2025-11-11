import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/services/api'
import { validatePassword } from '@/utils/security'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    
    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0] || 'Password does not meet requirements')
      setLoading(false)
      return
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    try {
      const res = await authAPI.resetPassword(token, password)
      if (res && res.success) {
        setMessage('Password reset successful. Redirecting to login...')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        setError(res?.message || 'Failed to reset password.')
      }
    } catch (err) {
      setError('Invalid or expired reset link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter a new password to complete the reset.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword