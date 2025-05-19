import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const hideButton = !email || !username || !firstName || !lastName || !password || !confirmPassword || username.length < 4 || password.length < 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });
    }
    setErrors({});
    try {
      await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      );
      await dispatch(sessionActions.restoreUser());
      closeModal();
    } catch (errorResponse) {
      const data = await errorResponse.json();
      if (data?.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <div className='signup-form'>
      <h1 className='signup-title'>Sign Up</h1>

      {errors && Object.values(errors).map((error, index) => (
      <div key={index} className="error">{error}</div>
      ))}

      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
          />
        </label>
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
          />
        </label>
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
          />
        </label>
        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />
        </label>
        <label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
          />
        </label>

        <button
          type="submit"
          className='signup-button'
          disabled={hideButton}
          >
            Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
