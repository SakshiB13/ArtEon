// ForgotPassword.js
import React, { useState } from 'react';
import { auth } from './utils/firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import '../src/style.css';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [error, setError] = useState('');
  

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');
      setError('');
    } catch (error) {
      setResetMessage('');
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form class="forget-form"onSubmit={handleResetPassword}>
        <input class="email-input-type" type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
        <button type="submit" class="Reset-password">Reset Password</button>
      </form>
      {resetMessage && <p class="reset-msg">{resetMessage}</p>}
      {error && <p class="reset-msg">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
