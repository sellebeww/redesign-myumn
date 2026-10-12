import { useState } from 'react';
import App from '../App';
import Login from './Login';

export default function PortalSession() {
  const [email, setEmail] = useState<string | null>(() => {
    try { return sessionStorage.getItem('myumn_session_email'); } catch { return null; }
  });
  const login = (value: string) => {
    try { sessionStorage.setItem('myumn_session_email', value); } catch { /* Keep the session in memory. */ }
    setEmail(value);
  };
  const logout = () => {
    try { sessionStorage.removeItem('myumn_session_email'); } catch { /* Clear the in-memory session too. */ }
    setEmail(null);
    history.replaceState(null, '', location.pathname + location.search);
  };
  return email ? <App sessionEmail={email} onLogout={logout}/> : <Login onLogin={login}/>;
}
