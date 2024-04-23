import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({});
  const { closeModal } = useModal();

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

  useEffect(() => {
    const validationsObj = {};

    if(String(credential).length < 4) {
      validationsObj.credential = 'Please provide a username with at least 4 characters.'
    }

    if(String(password).length < 6) {
      validationsObj.password = 'Password must be 6 characters or more.'
    }

    setValidations(validationsObj)

  }, [credential, password])


  return (
    <div className='login-container'>
      <h2 className='login-header'>Log in</h2>
      <form className='login-form-container' onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            className='input-textbox'
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            className='input-textbox'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <div className='login-button-container'>
          <button className='login-button' type="submit" disabled={Object.values(validations).length}>Log in</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
