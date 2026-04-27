import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'creator' | 'studio_owner'
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6]">
        <div className="w-8 h-8 border-4 border-[#702ae1] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // Redirect to the correct dashboard if wrong role
    const redirect = profile?.role === 'studio_owner' ? '/dashboard/owner' : '/dashboard/creator'
    return <Navigate to={redirect} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
