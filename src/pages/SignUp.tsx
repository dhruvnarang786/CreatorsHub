import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/Logo'

const SignUp = () => {
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'creator' | 'studio_owner' | ''>('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!fullName.trim()) return setError('Full name is required.')
    if (!email.trim()) return setError('Email is required.')
    if (!phone.trim()) return setError('Contact number is required.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    if (!role) return setError('Please select your role.')
    if (!agreedToTerms) return setError('You must agree to the Terms of Service.')

    setLoading(true)
    const { error: authError } = await signUp(email, password, fullName, role, phone)
    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center silver-shimmer-bg px-6 relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-4xl">mark_email_read</span>
          </div>
          <h1 className="font-newsreader italic text-4xl font-bold text-[#0A0A1A]">Check your email!</h1>
          <p className="text-[#6B7280] text-lg">
            We've sent a verification link to<br />
            <span className="text-[#7C3AED] font-bold">{email}</span>
          </p>
          <p className="text-[#9CA3AF] text-sm">Click the link in your email to activate your account, then sign in.</p>
          <Link
            to="/signin"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold hover:scale-105 transition-transform hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)]"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  const inputClass = "w-full px-5 py-4 rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] text-[#0A0A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center silver-shimmer-bg px-6 py-16 relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      {/* Background blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[520px] w-full bg-white border border-[rgba(124,58,237,0.12)] rounded-3xl p-12 shadow-[0_20px_60px_rgba(124,58,237,0.08),0_4px_20px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Create your account</h1>
          <p className="text-[#6B7280] text-sm">Join the creator marketplace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Dhruv Narang" className={inputClass} required />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} required />
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Contact Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className={inputClass} required />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className={`${inputClass} pr-14`} required minLength={8} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={`${inputClass} pr-14`} required />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                <span className="material-symbols-outlined text-xl">{showConfirm ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#374151]">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setRole('creator')}
                className={`p-5 rounded-2xl border-[1.5px] text-left transition-all duration-300 ${
                  role === 'creator' ? 'border-[#7C3AED] bg-[rgba(124,58,237,0.06)] shadow-[0_0_20px_rgba(124,58,237,0.1)]' : 'border-[#E5E7EB] bg-[#F8F8FC] hover:border-[#7C3AED]/30'
                }`}>
                <span className="material-symbols-outlined text-3xl mb-3 block text-[#7C3AED]">brush</span>
                <p className="text-[#0A0A1A] font-semibold text-sm">I'm a Creator</p>
                <p className="text-[#6B7280] text-xs mt-1">Find & book studios</p>
              </button>
              <button type="button" onClick={() => setRole('studio_owner')}
                className={`p-5 rounded-2xl border-[1.5px] text-left transition-all duration-300 ${
                  role === 'studio_owner' ? 'border-[#06B6D4] bg-[rgba(6,182,212,0.06)] shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-[#E5E7EB] bg-[#F8F8FC] hover:border-[#06B6D4]/30'
                }`}>
                <span className="material-symbols-outlined text-3xl mb-3 block text-[#06B6D4]">apartment</span>
                <p className="text-[#0A0A1A] font-semibold text-sm">I'm a Studio Owner</p>
                <p className="text-[#6B7280] text-xs mt-1">List my space</p>
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 rounded border-[#E5E7EB] bg-white text-[#7C3AED] focus:ring-[#7C3AED] focus:ring-offset-0 cursor-pointer accent-[#7C3AED]" />
            <span className="text-[#6B7280] text-sm group-hover:text-[#374151] transition-colors">
              I agree to CreatorsBNB's{' '}
              <a href="#" className="text-[#7C3AED] hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-[#7C3AED] hover:underline">Privacy Policy</a>
            </span>
          </label>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-lg hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3">
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating Account...</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#6B7280] text-sm mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-[#7C3AED] font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
