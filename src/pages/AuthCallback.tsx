import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    // Supabase handles the token exchange automatically via the URL hash
    // The auth state change listener in AuthContext will pick up the session
    const timer = setTimeout(() => {
      setStatus('success')
    }, 1500)

    const redirect = setTimeout(() => {
      navigate('/signin')
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(redirect)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07070E] px-6" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="max-w-md w-full text-center space-y-8">
        {status === 'verifying' ? (
          <>
            <div className="w-16 h-16 mx-auto border-4 border-[#702ae1] border-t-transparent rounded-full animate-spin" />
            <h1 className="font-newsreader italic text-3xl font-bold text-white">Verifying your email...</h1>
            <p className="text-gray-500">Please wait a moment.</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
            </div>
            <h1 className="font-newsreader italic text-4xl font-bold text-white">Email verified!</h1>
            <p className="text-gray-400 text-lg">Redirecting to sign in...</p>
            <div className="w-32 h-1 mx-auto rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#702ae1] to-[#006576] rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthCallback
