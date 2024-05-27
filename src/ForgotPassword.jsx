// ForgotPassword.js
import React, { useState } from 'react';
import { auth } from './utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { checkIfEmailExists } from './utils/user'; // Import the new function
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
      const emailExists = await checkIfEmailExists(email);
      if (!emailExists) {
        setError('Email not found. Please enter a valid email.');
        setResetMessage('');
        return;
      }
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
      <form className="forget-form" onSubmit={handleResetPassword}>
        <input className="email-input-type" type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
        <button type="submit" className="Reset-password">Reset Password</button>
      </form>
      {resetMessage && <p className="reset-msg">{resetMessage}</p>}
      {error && <p className="reset-msg">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
