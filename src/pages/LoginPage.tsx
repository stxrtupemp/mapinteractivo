import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { ADMIN_PATH } from '../lib/constants';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <MapPin size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Acceso admin</h1>
          <p className="text-sm text-gray-500 text-center">
            Mapa San Pedro del Pinatar
          </p>
        </div>

        <LoginForm onSuccess={() => navigate(`/${ADMIN_PATH}`, { replace: true })} />
      </div>
    </div>
  );
}
