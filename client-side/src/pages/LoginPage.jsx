import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import myApi from '../api.config.js';
import GoogleButton from '../components/GoogleButton.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await myApi.post('/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.firstName);

      navigate('/');

    } catch (error) {
      console.error(error);
      alert(error.response.data)
    }
  };
  return (
    <>
      <div className="todoapp stack-large center">
        <h1>Login</h1>
        <form className='auth' onSubmit={handleLogin}>
          <input required placeholder='Email' type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input required placeholder='Password' type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
          <input className='btn auth-btn' type="submit" value="Login" />
        </form>
        <p>Or</p>
        <GoogleButton />
        <p>Don&apos;t have an account? <Link to="/auth/register">Register</Link></p>
      </div>
    </>
  );
}