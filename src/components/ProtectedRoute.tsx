import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'creator' | 'studio_owner'
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth()
  const [profileTimedOut, setProfileTimedOut] = useState(false)

  // If we have a user but profile hasn't loaded, wait max 4 seconds then give up
  useEffect(() => {
    if (user && !profile) {
      const t = setTimeout(() => setProfileTimedOut(true), 4000)
      return () => clearTimeout(t)
    }
  }, [user, profile])

  // Auth still initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center silver-shimmer-bg">
        <div className="w-8 h-8 border-4 border-[#702ae1] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/signin" replace />
  }

  // Waiting for profile but not timed out yet
  if (requiredRole && !profile && !profileTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center silver-shimmer-bg">
        <div className="w-8 h-8 border-4 border-[#702ae1] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Profile loaded but wrong role — redirect to correct dashboard
  if (requiredRole && profile && profile.role !== requiredRole) {
    const redirect = profile.role === 'studio_owner' ? '/dashboard/owner' : '/dashboard/creator'
    return <Navigate to={redirect} replace />
  }

  // Either profile matches role, or we timed out — just render the dashboard
  return <>{children}</>
}

export default ProtectedRoute
