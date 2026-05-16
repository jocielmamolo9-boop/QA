import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTestCase from './pages/CreateTestCase';
import './App.css';

function App() {
  const { user } = useAppContext();

  return (
    <div className="app-container">
      {user && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/create" 
            element={
              user?.role === 'Tester' ? <CreateTestCase /> : <Navigate to="/dashboard" replace />
            } 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
