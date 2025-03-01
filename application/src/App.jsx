import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ParticipantDetails from './pages/ParticipantDetails';
import RegisterTrial from './pages/RegisterTrial';
import ClinicPage from './pages/ClinicPage';
import AccountSettings from './pages/AccountSettings';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/participant">Participant</Link>
          </li>
          <li>
            <Link to="/register-trial">Register Trial</Link>
          </li>
          <li>
            <Link to="/clinic">Clinic</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/participant" element={<ParticipantDetails />} />
        <Route path="/register-trial" element={<RegisterTrial />} />
        <Route path="/clinic" element={<ClinicPage />} />
        <Route path="/account" element={<AccountSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
