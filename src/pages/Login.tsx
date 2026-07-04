import { useState, type FormEvent } from 'react';
import { useAuth } from '../store/AuthContext';
import { Briefcase, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isRegister) {
      const result = await signUp(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setMessage('注册成功！请查看邮箱验证邮件，验证后即可登录。');
      }
    } else {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <Briefcase size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">投简历助手</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRegister ? '创建账号，开始记录投递' : '登录你的账号'}
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-2.5 rounded-lg">
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Mail size={14} className="inline mr-1.5" />
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Lock size={14} className="inline mr-1.5" />
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少6位"
              required
              minLength={6}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              '处理中...'
            ) : isRegister ? (
              <>
                <UserPlus size={16} />
                注册
              </>
            ) : (
              <>
                <LogIn size={16} />
                登录
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); setMessage(''); }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
