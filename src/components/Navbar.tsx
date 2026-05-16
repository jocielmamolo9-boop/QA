import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, ClipboardList, PlusCircle, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAppContext();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <ShieldAlert className="brand-icon" size={28} />
          <h1>QA System</h1>
        </div>
        
        <nav className="navbar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <ClipboardList size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          {user?.role === 'Tester' && (
            <NavLink to="/create" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <PlusCircle size={20} />
              <span>Create Case</span>
            </NavLink>
          )}
        </nav>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className={`user-role role-${user?.role?.toLowerCase()}`}>{user?.role}</span>
          </div>
          <button onClick={logout} className="btn-logout" title="Log out">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
