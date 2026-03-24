import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore'; // Sesuaikan path jika berbeda

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuthStore(); // Ambil fungsi update dari store

  useEffect(() => {
    // 1. Tangkap parameter dari URL (token, name, email, dll)
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const image = searchParams.get('avatar') || searchParams.get('image'); // Sesuaikan dengan key dari Laravel

    // 2. Jika token ada, berarti login berhasil
    if (token) {
      // Simpan data ke Zustand Store (Local Storage)
      updateUser({
        name: name || 'User',
        email: email || '',
        image: image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        // Token biasanya disimpan di localStorage/cookie untuk request API selanjutnya
      });
      
      // Simpan token ke localStorage untuk keperluan Axios/Fetch nanti
      localStorage.setItem('auth_token', token);

      // 3. Redirect ke halaman utama secara instan
      navigate('/');
    } else {
      // Jika gagal/tidak ada token, kembalikan ke halaman login
      navigate('/login');
    }
  }, [searchParams, navigate, updateUser]);

  // UI Loading (Tampil sepersekian detik sebelum di-redirect)
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Animasi Loading Muter */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-500">Memproses login Google...</p>
      </div>
    </div>
  );
}