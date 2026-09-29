import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to create account.');
    }
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
            Create your account
          </h1>
          <p className="mt-1.5 text-xs text-[#706D66] dark:text-[#A6A197]">
            Start managing your personal tasks and deadlines with ease.
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
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-sm focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
                required
              />
            </div>

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
              <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-sm focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Login link */}
          <div className="mt-5 text-center text-xs text-[#706D66] dark:text-[#A6A197]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-[#8B7355] dark:text-[#A88F72] hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
