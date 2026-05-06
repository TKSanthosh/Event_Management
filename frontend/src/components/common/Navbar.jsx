import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">Event Management System</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user?.name}</span>
        <button onClick={handleLogout} className="btn-secondary text-sm">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
