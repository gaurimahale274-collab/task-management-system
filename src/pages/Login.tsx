import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, loginWithDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to login.');
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    await loginWithDemo();
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#181715] flex flex-col justify-center items-center p-6 selection:bg-[#F1EBDD]">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#8B7355] text-white mb-3 shadow-xs">
            <Layers className="w-5 h-5 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#292824] dark:text-[#EDE9E3] tracking-tight">
            TaskFlow
          </h1>
          <p className="mt-1.5 text-xs text-[#706D66] dark:text-[#A6A197]">
            Simple task management for your everyday work.
          </p>
          <p className="mt-1 text-xs text-[#96928A] dark:text-[#7E7970] max-w-xs mx-auto">
            Create tasks, manage deadlines, track progress, and stay organized.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] p-7 shadow-xs">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#B56B67]/15 border border-[#B56B67]/30 text-[#B56B67] dark:text-[#E89E9A] text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-sm focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#706D66] dark:text-[#A6A197]">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-sm focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-[#8B7355] hover:bg-[#756044] dark:bg-[#A88F72] dark:hover:bg-[#BFAB91] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{loading ? 'Signing in...' : 'Login'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-5 text-center text-xs text-[#706D66] dark:text-[#A6A197]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-[#8B7355] dark:text-[#A88F72] hover:underline"
            >
              Register
            </Link>
          </div>

          {/* Visually secondary Demo login */}
          <div className="mt-6 pt-5 border-t border-[#EEEAE1] dark:border-[#38352F] text-center">
            <p className="text-[11px] text-[#96928A] dark:text-[#7E7970] mb-2">
              For testing / demo purposes
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] hover:bg-[#F5F1E8] dark:hover:bg-[#272521] transition-colors"
            >
              Login with Demo Account (Alex Morgan)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
