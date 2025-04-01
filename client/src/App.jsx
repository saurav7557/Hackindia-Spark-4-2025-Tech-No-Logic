import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthForm';
import Navbar from './components/Navbar';
import { authService } from './services/service';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const orgData = await authService.getCurrentOrganization();
        setOrganization(orgData);  // Store the organization info
        setIsLoggedIn(true);
      } catch (error) {
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
    setOrganization(orgData);  // Store organization data on login
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setOrganization(null);  // Clear organization data on logout
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar isLoggedIn={isLoggedIn} orgName={organization?.name} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route
            path="/auth"
            element={<AuthPage onLogin={handleLogin} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
