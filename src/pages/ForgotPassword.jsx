import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/services/api'
import { validateEmail } from '@/utils/security'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    
    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }
    
    try {
      const res = await authAPI.forgotPassword(emailValidation.sanitized)
      if (res && res.success) {
        setMessage('Check your email for a reset link.')
      } else {
        setMessage('If the account exists, a reset link has been sent.')
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword