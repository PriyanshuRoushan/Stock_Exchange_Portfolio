import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface">
      {/* Left Side: Interactive Sign-in Form */}
      <section className="w-full md:w-1/2 flex flex-col min-h-screen relative p-container-padding lg:p-16">
        {/* Branding Header */}
        <header className="flex items-center mb-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <span className="text-headline-md font-headline-md font-bold text-on-surface">Apex Precision Finance.</span>
          </div>
        </header>

        {/* Form Content Canvas */}
        <div className="max-w-[440px] w-full mx-auto my-12">
          <div className="mb-8">
            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2 font-bold text-3xl">Sign in to your account</h1>
            <p className="text-body-md font-body-md text-on-surface-variant">Manage your investments in one high-performance dashboard.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Social Authentication Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200 shadow active:scale-95">
              <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4XOwK7Qk_exn_LpmKFf5XMYmkuQXmjyP5L1oOv0CkaKAtGm0L-1rOsJcOv25xi8SHGADxOV41OZKedJKZWMVN7mVGTEAKe_NQlng18EKs4iGW5s5jSQhGw26ywcbkvE_4rvgl_xo7mY39TMADbC2JYh3a-IjHgbHVKIfHbWGCjWNNT99IdSt5d_RDStO33e9i7SNroD7lJU6ClVRrRBnIL6s9aaCAGAW-Wco7kEitBAZOGhuvxbHZKFfT5BWjktTvW4t1GvWwcNk" />
              <span className="text-label-md font-label-md text-on-surface text-sm">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200 shadow active:scale-95">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                file_download
              </span>
              <span className="text-label-md font-label-md text-on-surface text-sm">Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-5 items-center mb-4">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="flex-shrink mx-4 text-label-md font-label-md text-outline text-sm">Or with email</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary transition-all duration-200 outline-none text-body-md" 
                id="email" 
                placeholder="john@example.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-label-md font-label-md text-on-surface-variant" htmlFor="password">Password</label>
                <a href="#" className="text-xs text-primary font-semibold hover:underline">Forgot password?</a>
              </div>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary transition-all duration-200 outline-none text-body-md pr-12" 
                id="password" 
                placeholder="••••••••" 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3 text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {/* CTA Action */}
            <button 
              className="w-full bg-primary-container text-white py-4 rounded-lg font-bold text-headline-md shadow hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex justify-center items-center" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-body-md text-on-surface-variant">
            Don't have an account? <Link className="text-primary font-bold hover:underline" to="/register">Create one</Link>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-auto flex justify-between items-center text-label-md text-on-surface-variant pt-8 text-xs">
          <span>Copyright 2022</span>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          </div>
        </footer>
      </section>

      {/* Right Side: Marketing Surface (Bento Layout) */}
      <section className="hidden md:flex w-1/2 bg-primary-container relative overflow-hidden flex-col items-center justify-center p-16">
        {/* Animated Atmosphere Layer */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-700 rounded-full blur-[150px]"></div>
        </div>
        
        {/* Decorative Floating Elements */}
        <div className="relative z-10 w-full max-w-lg space-y-12">
          {/* Card 1: Connected Brokers */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-2xl translate-x-[-20px] animate-bounce-slow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-label-md font-bold text-on-surface uppercase tracking-wider text-xs font-semibold">Connected Brokers</h3>
              <span className="text-secondary font-bold text-label-md flex items-center gap-1 text-xs">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                Live Syncing
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1b1c21] flex items-center justify-center p-2">
                    <img className="w-full h-full object-contain" alt="Upstox" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgGOHH83SWq6Km641JmnNC71-lm14dDyGKYj9WAee_m4lPvXLUIzoQ9mIEg1AEc6mf-2a33WN43BTA2BmFu61QDKH5Bhide0w4hHYignOwG3TP5YsMMBZp1n67xHcCr7sEtTQAGOO9H9xQYuGM4bdA9FQrBp1fj4s3DHcxYEHUtFlh6jszLiC0RyT5PeFLlsbTkkp0dEhvqCiE8rSjcR3XDE_kIsqf_94oPpgtLkxJ52WUEoQx790RC5a_Psq1S9D0bI5beyRrSwE" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Upstox</p>
                    <p className="text-label-md text-on-surface-variant text-xs">Last synced 2m ago</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary">check_circle</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#397dff] flex items-center justify-center p-2">
                    <img className="w-full h-full object-contain" alt="Zerodha" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATFeIjPzF9Rg73ZrU5CkjfveTThb0Q_GzPdFCIF4spu1u9BOdBsoCKVs4iLkcbWrs-D-MApw47VA_4nvzkqs9Z5XQF5fKJU8iTpKFz2mg7s4ePuavzpszmun7okBxyHvsf39JrlbX-6XFSIng9iT6lIa84N0LZYbQ6dOlWBd5VyNyXhOpGfA6zuCl2GoIWwlohNg2c6w56dbNqYV6GEDcEZHEngbg81wcmhdUttmS4Uq6wnenXkIlXqkCHWRd0Iyp7RDZPog4vyig" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Zerodha</p>
                    <p className="text-label-md text-on-surface-variant text-xs">Last synced 5m ago</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary">check_circle</span>
              </div>
            </div>
          </div>

          {/* Card 2: Top Movers */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl translate-x-[40px] w-64 absolute -top-8 -right-8 animate-pulse-slow">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">trending_up</span>
              <span className="text-label-md font-bold text-on-surface text-xs font-semibold">Portfolio Growth</span>
            </div>
            <div className="space-y-1">
              <p className="text-headline-md font-bold text-on-surface text-2xl font-bold">$56,476.00</p>
              <p className="text-label-md text-secondary font-bold text-xs text-green-700">+2.05% today</p>
            </div>
            <div className="mt-4 pt-4 border-t border-outline-variant">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high overflow-hidden">
                  <img className="w-full h-full object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByYOUm9vGzcqhi3LfpdNhlVgv3FjG_jvYUwTSeZxWBkBLt_rOAvhZAZmPAkBiC16kR9Z_7TkEUayfBFFisE9VfONYJxgDza2090tD95pu7sjKGoZA9EYsc0OMjiqGWW6upRHOfJ8_ttUAIcu9vbAnjqJl0QpVrGXYEmPhVwjYxyz3JvCvFxb1SQp1trGpoBUkuyGh32t2F9QVGknKCmP_J5V9aKysnT2TdZw3dJLNayyJ_1wrqnrz5FWEldgCx3wx32duB6yUXAv0" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high overflow-hidden">
                  <img className="w-full h-full object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2L06PsUMkluRKOu7uCvC2hdwggN5LUPkgn9xAH2RZUvMXrYIWMy3vVXHPsXgLCjpIndExz4GGt4257Rhsm-C6SjKX2T4bYbbbxEIARnvWDqlkBG1wv-uZkCfD7gbPxeen2cTHHzVlroverFxLB-dJedfiOEFSvY_BsZ417kULEp6AcDq5VkeJnN-jh1rX4S_Ycb0g-LXcG8AAiTZZerx2-JQ7VeLetFhwGbI3nA7VGJPbNJZx-Pl1kQ3o5q0t35oLDSo_nNpUy1M" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">+8</div>
              </div>
            </div>
          </div>

          {/* Marketing Copy Area */}
          <div className="text-center md:text-left space-y-6 pt-24 text-white">
            <h2 className="text-display-lg font-headline-lg leading-tight text-3xl font-extrabold">The future of portfolio management</h2>
            <p className="text-body-lg text-blue-100 max-w-md opacity-80 text-sm">
              Apex Precision Finance helps you consolidate all your brokerage accounts into one high-performance dashboard. Stop jumping between tabs and start investing with clarity.
            </p>
            {/* Pagination Indicators */}
            <div className="flex gap-2 justify-center md:justify-start pt-4">
              <div className="h-2 w-8 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white/40 rounded-full"></div>
              <div className="h-2 w-2 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute bottom-8 right-8 grid grid-cols-6 gap-2 opacity-20">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </section>
    </main>
  );
}
