import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">Job Memo</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}