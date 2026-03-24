import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setMessage(`Tautan reset sandi telah dikirim ke ${email}. Silakan cek kotak masuk Anda.`);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 pt-24 pb-12">
            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
                <div className="hidden md:flex flex-1 flex-col items-center text-center">
                    <img
                        src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg"
                        alt="Lupa Sandi"
                        className="w-3/4 max-w-sm mb-6 mix-blend-multiply"
                    />
                    <h2 className="text-2xl font-black text-gray-800">Lupa Kata Sandi?</h2>
                    <p className="text-gray-500 mt-2">Jangan panik, kami akan membantu Anda memulihkan akses ke akun MarketKu.</p>
                </div>

                <div className="w-full md:w-[400px] bg-white border border-gray-200 p-8 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-gray-800">Reset Sandi</h2>
                        <Link to="/login" className="text-green-500 font-bold text-sm hover:underline">Masuk</Link>
                    </div>

                    {message ? (
                        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium mb-6 text-center border border-green-100">
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">Email Terdaftar</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Contoh: email@marketku.com"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-gray-500 text-xs font-bold hover:text-green-500 transition-colors">
                            Kembali ke halaman Login
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}