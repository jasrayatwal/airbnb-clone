import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { closeModal } = useModal();

  const hideButton = credential.length < 4 || password.length < 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLogin = (e) => {
        e.preventDefault();
        return dispatch(sessionActions.login(
          {
            credential: 'Demo-lition',
            password: 'password'
          }))
          .then(closeModal)
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
              console.log(data.errors);
            }
          });

  };

  return (
    <div className='login-box'>
      <h1 className='-login-box-title'>Log In</h1>
      {errors.credential && (
          <div className='error'>{errors.credential}</div>
        )}
      <form onSubmit={handleSubmit}>
        <label className='username-box'>
          <input
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
        </label>
        <label className='password-box'>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div className='login-demo-buttons'>
        <button
          type="submit"
          className='login-button'
          disabled={hideButton}
          >
            Log In
        </button>

        <button
          onClick={demoLogin}
          className='demo-login'
          >
            Login in as Demo User
        </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
