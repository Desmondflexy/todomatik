import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import myApi from '../api.config';
import { useNavigate } from 'react-router-dom';
import react from 'react';

function GoogleButton() {
  const [loading, setloading] = react.useState(false);
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({ onSuccess, onError });
  function onSuccess(codeResponse) {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`)
      .then(res => {
        const { id, name, email } = res.data;
        myApi.post('/users/google', { id, name, email })
          .then(res => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', res.data.firstName);
            setloading(false);
            navigate('/');
          }).catch(error => {
            console.error(error);
            setloading(false);
          });
      }).catch(error => {
        console.error(error);
      })
  }

  function onError(error) {
    console.error(error);
  }

  function handleGoogleLogin() {
    setloading(true);
    googleLogin();
  }

  return (
    <input
      className='btn auth-btn'
      type='submit'
      onClick={handleGoogleLogin}
      value={!loading ? "Continue with Google" : "Please wait..."}
      disabled={loading}
    />
  );
}

export default GoogleButton;