import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/service';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authService.logout(); // Clear token and redirect
    navigate('/auth');
  }, [navigate]);

  return null;
};

export default Logout;