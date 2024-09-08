import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupFormModal.css";

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

  const handleSubmit = (e) => {
    e.preventDefault();



    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field.",
    });
  };

  return (
    <div id="signup-modal-container">
      <h1 id="signup-header">Sign Up</h1>
      <form id="signup-form-container" onSubmit={handleSubmit}>
          {errors.email && <span className="error-message">{errors.email}</span>}
        <label>

          <input
            className="input-textbox"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

          />
        </label>
          {errors.username && <span className="error-message">{errors.username}</span>}
        <label>

          <input
            className="input-textbox"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}

          />
        </label>
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        <label>

          <input
            className="input-textbox"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}

          />
        </label>
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        <label>

          <input
            className="input-textbox"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}

          />
        </label>
          {errors.password && <span className="error-message">{errors.password}</span>}
        <label>

          <input
            className="input-textbox"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

          />
        </label>
        <label>

          <input
            className="input-textbox"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}

            />
        </label>
            {errors.confirmPassword && <span className="error-messages">{errors.confirmPassword}</span>}
        <div id="signup-button-container">
          <button id="signup-button" type="submit"  >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
