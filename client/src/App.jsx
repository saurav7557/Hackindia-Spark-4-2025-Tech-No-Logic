import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthForm';
import Navbar from './components/Navbar';
import { authService } from './services/service';
import Logout from './components/Logout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const orgData = await authService.getCurrentOrganization();
        if (orgData) {
          setOrganization(orgData);
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
        setOrganization(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (orgData) => {
    setIsLoggedIn(true);
    setOrganization(orgData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setOrganization(null);
  };

  if (loading) return <div className="loading-container">Loading...</div>;

  return (
    <Router>
      <div className="app-container">
        <Navbar isLoggedIn={isLoggedIn} orgName={organization?.name} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} /> 
          <Route path="/dashboard" element={<Dashboard onLogin={handleLogin} />} /> 
          <Route path="/logout" element={<Logout onLogin={handleLogin} />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
