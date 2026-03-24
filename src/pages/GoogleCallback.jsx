import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

export default function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateUser } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const image = searchParams.get('avatar') || searchParams.get('image');

        if (token) {
            updateUser({
                name: name || 'User',
                email: email || '',
                image: image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
            });
            localStorage.setItem('auth_token', token);

            navigate('/');
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, updateUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-gray-500">Memproses login Google...</p>
            </div>
        </div>
    );
}