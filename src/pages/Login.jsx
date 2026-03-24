import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../stores/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      loginStore(response.data.user, response.data.access_token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Email atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google/redirect';
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-16 px-4">
      <div className="w-full max-w-[900px] flex items-center justify-between gap-12">
        <div className="hidden md:flex flex-col items-center text-center w-1/2">
          <img
            src="https://illustrations.popsy.co/green/surreal-hourglass.svg"
            alt="Ilustrasi Tokopedia"
            className="w-72 mb-8 drop-shadow-sm"
          />
          <h2 className="text-2xl font-black text-gray-800 mb-2">
            Jual Beli Mudah Hanya di MarketKu
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Gabung dan rasakan kemudahan bertransaksi di MarketKu
          </p>
        </div>

        <div className="w-full md:w-1/2 max-w-[400px] mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-100">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Masuk</h2>
              <Link to="/register" className="text-sm text-green-500 font-bold hover:underline">
                Daftar
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-xs mb-6 border border-red-100 font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Nomor HP atau Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                  placeholder="Contoh: email@marketmvp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-right mt-1.5">
                  <a href="/forgot-password" className="text-xs text-green-500 font-medium hover:underline">Lupa kata sandi?</a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg mt-2 hover:bg-green-600 transition-colors text-sm disabled:opacity-70"
              >
                {loading ? 'Sabar ya...' : 'Masuk'}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">atau</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 text-gray-600 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-3 mt-6"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
              Google
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}