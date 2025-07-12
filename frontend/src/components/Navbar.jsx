// components/Navbar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const hasToken = Boolean(localStorage.getItem('token')); // ✅ Check token presence

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      ...styles.nav,
      ...(isScrolled ? styles.navScrolled : {})
    }}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>SkillSwap</span>
        </Link>
        
        <div style={styles.links}>
          {hasToken || user ? ( // ✅ Modified check here
            <>
              <Link to="/dashboard" style={styles.link}>
                <span style={styles.linkText}>Dashboard</span>
              </Link>
              <Link to="/users" style={styles.link}>
                <span style={styles.linkText}>Users</span>
              </Link>
              <Link to="/swaps/new" style={styles.link}>
                <span style={styles.linkText}>New Swap</span>
              </Link>
              <div style={styles.userSection}>
                <span style={styles.userWelcome}>Welcome, {user?.name || 'User'}!</span>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                <span style={styles.linkText}>Login</span>
              </Link>
              <Link to="/register" style={styles.primaryLink}>
                <span style={styles.primaryLinkText}>Get Started</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  navScrolled: {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '800',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  logoIcon: {
    fontSize: '28px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))',
  },
  logoText: {
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  linkText: {
    position: 'relative',
    zIndex: 1,
  },
  primaryLink: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
  },
  primaryLinkText: {
    position: 'relative',
    zIndex: 1,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  userWelcome: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
  },
};

// Add hover effects via CSS-in-JS (you can also move these to a separate CSS file)
const addHoverEffects = () => {
  const style = document.createElement('style');
  style.textContent = `
    nav a:hover {
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.1) !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    nav a:hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
      border-radius: 8px;
      z-index: 0;
    }
    
    nav .logo:hover {
      transform: scale(1.05);
    }
    
    nav .primaryLink:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }
    
    nav .logoutButton:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
    }
    
    @media (max-width: 768px) {
      nav .container {
        padding: 12px 20px;
      }
      
      nav .links {
        gap: 16px;
      }
      
      nav .userSection {
        flex-direction: column;
        gap: 8px;
        padding: 8px 12px;
      }
      
      nav .userWelcome {
        font-size: 12px;
      }
    }
  `;
  document.head.appendChild(style);
};

// Call this function when the component mounts
if (typeof window !== 'undefined') {
  addHoverEffects();
}

export default Navbar;