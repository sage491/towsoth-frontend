import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI, subjectsAPI, setUserProfile } from '@/services/api'
import { Badge } from '@/components/ui/badge.jsx'
import { BookOpen, User, Loader2, Save, ArrowLeft, Trash2 } from 'lucide-react'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn, refreshProfile, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [subjects, setSubjects] = useState([])
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState([])
  const [confirmDeleteSubjectId, setConfirmDeleteSubjectId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    year: '',
    selectedSubjects: []
  })

  // Normalize IDs to strings to avoid type mismatches (e.g., UUID vs number)
  const normalizeSubjectId = (id) => {
    if (id === null || id === undefined) return ''
    return typeof id === 'string' ? id.trim() : String(id)
  }
  const normalizeIds = (ids) => {
    return Array.isArray(ids) ? ids.map(normalizeSubjectId).filter(Boolean) : []
  }

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    // Load user data (prefer latest from backend if available)
    const initProfile = async () => {
      try {
        let profile = user
        if (!profile) {
          profile = await refreshProfile()
        }
        if (profile) {
          setFormData({
            name: profile.name || '',
            email: profile.email || '',
            university: profile.university || '',
            year: profile.year || '',
            selectedSubjects: (profile.selectedSubjects || []).map(s => {
              if (typeof s === 'string') return s
              return s._id || s.id
            })
          })
        }
      } catch (e) {
        console.error('Failed to initialize profile:', e)
      }
    }
    initProfile()
  }, [user, isLoggedIn, navigate])
  
  // Fetch subjects by year when changed
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        let response
        if (!formData.year) {
          // Fallback: fetch all subjects so selected ones can still display
          response = await subjectsAPI.getAll({})
        } else {
          response = await subjectsAPI.getAll({ year: formData.year })
        }
        setSubjects(response.data || [])
      } catch (err) {
        console.error('Error fetching subjects:', err)
      }
    }
    fetchSubjects()
  }, [formData.year])

  // Fetch details for currently selected subjects so they always render
  useEffect(() => {
    const loadSelectedDetails = async () => {
      try {
        const ids = Array.isArray(formData.selectedSubjects) ? formData.selectedSubjects.filter(Boolean) : []
        if (ids.length === 0) {
          setSelectedSubjectDetails([])
          return
        }
        const uniqueIds = Array.from(new Set(ids))
        const results = await Promise.all(uniqueIds.map(async (id) => {
          try {
            const resp = await subjectsAPI.getById(id)
            return resp?.data || resp
          } catch (e) {
            return null
          }
        }))
        setSelectedSubjectDetails(results.filter(Boolean))
      } catch (e) {
        console.error('Failed to load selected subject details:', e)
      }
    }
    loadSelectedDetails()
  }, [formData.selectedSubjects])

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

  const toggleSubjectSelection = (subjectId) => {
    setFormData(prev => {
      const id = normalizeSubjectId(subjectId)
      const current = normalizeIds(prev.selectedSubjects)
      const exists = current.includes(id)
      return {
        ...prev,
        selectedSubjects: exists
          ? current.filter(x => x !== id)
          : [...current, id]
      }
    })
  }

  const handleConfirmDelete = () => {
    const id = confirmDeleteSubjectId
    setConfirmDeleteSubjectId(null)
    if (!id) return
    setFormData(prev => {
      const current = normalizeIds(prev.selectedSubjects)
      return {
        ...prev,
        selectedSubjects: current.filter(x => x !== normalizeSubjectId(id))
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = { year: formData.year, selectedSubjects: normalizeIds(formData.selectedSubjects) }
      const response = await authAPI.updateProfile(payload)
      if (response && response.success && response.user) {
        setSuccess('Profile updated successfully!')
        // Build next user with selected subject IDs from response.selectedSubjects
        const selectedIds = Array.isArray(response.selectedSubjects)
          ? response.selectedSubjects.map(s => (typeof s === 'string' ? normalizeSubjectId(s) : normalizeSubjectId(s.id))).filter(Boolean)
          : []
        const nextUser = { ...response.user, selectedSubjects: selectedIds }
        // Update context and localStorage cohesively
        updateUser(nextUser)
        setFormData(prev => ({
          ...prev,
          year: response.user.year || prev.year,
          selectedSubjects: selectedIds
        }))
      } else {
        throw new Error(response?.message || 'Update failed')
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.')
      console.error('Profile update error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 text-sm bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                  <span className="text-green-700">{success}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                    onClick={() => navigate('/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                  </Button>
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
                  disabled={saving}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true} // Email cannot be changed
                  required
                />
                <p className="text-xs text-gray-500">Email address cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  name="university"
                  type="text"
                  placeholder="Enter your university"
                  value={formData.university}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => setFormData({ ...formData, year: value })}
                  disabled={saving}
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
              
              <div className="space-y-3">
                {!formData.year && (
                  <p className="text-xs text-gray-500">Select your year to view available subjects.</p>
                )}
                {formData.year && subjects.length === 0 && (
                  <p className="text-sm text-gray-500">No subjects available for the selected year.</p>
                )}

                {subjects.length > 0 && (
                  <>
                    {/* Selected & Available Subjects */}
                    {(() => {
                      const selectedIds = Array.isArray(formData.selectedSubjects) ? formData.selectedSubjects : []
                      const selectedIdsNorm = selectedIds.map(normalizeSubjectId)
                      const withId = (s) => s?._id || s?.id
                      // Merge subjects and selected details to ensure names show
                      const subjectMap = new Map()
                      ;(subjects || []).forEach(s => subjectMap.set(withId(s), s))
                      ;(selectedSubjectDetails || []).forEach(s => subjectMap.set(withId(s), s))
                      const combinedSubjects = Array.from(subjectMap.values()).filter(Boolean)
                      const selectedList = combinedSubjects.filter(s => selectedIdsNorm.includes(normalizeSubjectId(withId(s))))
                      const availableList = (subjects || []).filter(s => !selectedIdsNorm.includes(normalizeSubjectId(withId(s))))
                      return (
                        <>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Selected Subjects</p>
                            {selectedList.length === 0 ? (
                              <p className="text-xs text-gray-500">No subjects selected yet.</p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {selectedList.map(subject => {
                                  const id = subject._id || subject.id
                                  return (
                                    <Badge key={id} variant="secondary" className="text-sm flex items-center gap-2">
                                      <span>
                                        {subject.name || id}
                                        {subject.subjectType ? (
                                          <span className="ml-2 text-xs text-gray-500">({subject.subjectType})</span>
                                        ) : null}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => setConfirmDeleteSubjectId(id)}
                                      >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Remove
                                      </Button>
                                    </Badge>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          {/* Subjects with dynamic selection state */}
                          <div className="space-y-2">
                            <Label>Choose Your Subjects</Label>
                            {subjects.length === 0 ? (
                              <p className="text-xs text-gray-500">No subjects available for the selected year.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {subjects.map(subject => {
                                  const id = subject._id || subject.id
                                  const isSelected = selectedIdsNorm.includes(normalizeSubjectId(id))
                                  return (
                                    <label key={id} className="flex items-center space-x-2 p-2 border rounded-md">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSubjectSelection(id)}
                                      />
                                      <span className="text-sm">
                                        {subject.name}
                                        {subject.subjectType ? (
                                          <span className="ml-2 text-xs text-gray-500">({subject.subjectType})</span>
                                        ) : null}
                                      </span>
                                    </label>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </>
                )}
              </div>

              <Button type="submit" className="w-full mt-6" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <div className="mt-3 flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* Confirmation Popup for Deleting Selected Subject */}
        {confirmDeleteSubjectId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-sm w-full">
              <CardHeader>
                <CardTitle>Remove subject?</CardTitle>
                <CardDescription>
                  Are you sure you want to remove this subject from your selections?
                  This will not delete any notes or videos.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmDeleteSubjectId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>Remove</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage