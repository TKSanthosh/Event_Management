import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Attendees from './pages/Attendees';
import Venues from './pages/Venues';
import Organizers from './pages/Organizers';

const Layout = ({ children }) => (
  <div className="flex flex-col h-screen">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  </div>
);

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Layout><Events /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendees"
        element={
          <ProtectedRoute>
            <Layout><Attendees /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/venues"
        element={
          <ProtectedRoute>
            <Layout><Venues /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizers"
        element={
          <ProtectedRoute>
            <Layout><Organizers /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;
