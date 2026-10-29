import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Email is required.')
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/signin`
    })
    setLoading(false)
    if (resetError) { setError(resetError.message) } else { setSuccess(true) }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center silver-shimmer-bg px-6 relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-4xl">mail</span>
          </div>
          <h1 className="font-newsreader italic text-4xl font-bold text-[#0A0A1A]">Check your email</h1>
          <p className="text-[#6B7280] text-lg">
            If an account exists for <span className="text-[#7C3AED] font-bold">{email}</span>, we've sent a password reset link.
          </p>
          <Link to="/signin" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold hover:scale-105 transition-transform hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)]">
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  const inputClass = "w-full px-5 py-4 rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] text-[#0A0A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center silver-shimmer-bg px-6 relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[520px] w-full bg-white border border-[rgba(124,58,237,0.12)] rounded-3xl p-12 shadow-[0_20px_60px_rgba(124,58,237,0.08),0_4px_20px_rgba(0,0,0,0.06)]">
        <div className="text-center space-y-3 mb-8">
          <Link to="/" className="font-newsreader italic text-3xl font-bold text-[#0A0A1A] logo-shimmer inline-block">CreatorsHub</Link>
          <h1 className="text-2xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Reset your password</h1>
          <p className="text-[#6B7280] text-sm">Enter your email and we'll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">error</span>{error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
            {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>) : ('Send Reset Link')}
          </button>
        </form>

        <p className="text-center text-[#6B7280] text-sm mt-6">
          Remember your password?{' '}
          <Link to="/signin" className="text-[#7C3AED] font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
