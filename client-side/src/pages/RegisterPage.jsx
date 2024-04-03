import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import myApi from '../api.config.js';
import GoogleButton from '../components/GoogleButton';
import NavBar from '../components/NavBar.jsx';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    try {
      await myApi.post('/users/register', { email, password, fullname });
      navigate('/auth/login');
      alert('Registered successfully');
    } catch (error) {
      console.error(error);
      alert(error.response.data)
    }
  }

  return (
    <>
      <NavBar >
        
      </NavBar>
      <div className="todoapp stack-large center">
        <h1>Register</h1>
        <form className='auth' onSubmit={handleSignup}>
          <input required placeholder='Full Name' type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
          <input required placeholder='Email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required placeholder='Password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className='btn auth-btn' type="submit" value="Register" />
        </form>
        <p>Or</p>
        <GoogleButton />
        <p>Already have an account? <Link to="/auth/login">Login</Link></p>
      </div>
    </>
  );
}