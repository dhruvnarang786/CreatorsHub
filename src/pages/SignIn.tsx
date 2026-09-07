import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/Logo'

const SignIn = () => {
  const { signIn, profile } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) return setError('Email is required.')
    if (!password.trim()) return setError('Password is required.')

    setLoading(true)
    const { error: authError } = await signIn(email, password)
    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      navigate('/')
    }
  }

  const inputClass = "w-full px-5 py-4 rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] text-[#0A0A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center silver-shimmer-bg px-6 relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      {/* Background blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[520px] w-full bg-white border border-[rgba(124,58,237,0.12)] rounded-3xl p-12 shadow-[0_20px_60px_rgba(124,58,237,0.08),0_4px_20px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Welcome back</h1>
          <p className="text-[#6B7280] text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} required />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#374151]">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#7C3AED] hover:underline font-medium">Forgot Password?</Link>
            </div>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={`${inputClass} pr-14`} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3">
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing In...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-[#6B7280] text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#7C3AED] font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
