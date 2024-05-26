import React, { useState } from "react";
import * as Components from './Login';
import { auth } from './utils/firebase';
import { createNewCollector } from './utils/collector';
import { createNewArtist } from './utils/artist';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import '../src/style.css';

function SignUp() {
  const [signIn, toggle] = React.useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("artist");
  const [userInfo] = useAuthState(auth);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); 

    if (!isValidEmail(email)) {
      showAlert("Invalid email format", "error");
      return;
    }

    if (!isValidPassword(password)) {
      showAlert("Password must be greater than 6 characters and include at least one special character", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (selectedOption === 'artist') {
        await createNewArtist(user, name, email);
      } else if (selectedOption === 'collector') {
        await createNewCollector(user, name, email);
      }

      await sendEmailVerification(user);
      showAlert("Sign-up successful. Please verify your email.", "success");
      console.log('Sign-up successful');
      console.log('User:', user);
      console.log('User type:', selectedOption);
      console.log('Name:', name);
      console.log('Email:', email);
    } catch (error) {
      console.error('Sign-up failed:', error.message);
      showAlert("Sign-up Failed", "error");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      showAlert("Invalid email format", "error");
      return;
    }

    if (!isValidPassword(password)) {
      showAlert("Password must be greater than 6 characters and include at least one special character", "error");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        showAlert("Please verify your email before logging in.", "error");
        return;
      }

      showAlert("Log-in successful", "success");
      console.log('Log-in successful');
      console.log('User:', user);
      console.log('Email:', email);
      navigate('/home');
    } catch (error) {
      console.error('Log-in failed:', error.message);
      showAlert("Log-in failed", "error");
    }
  };

  const showAlert = (message, type) => {
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    alertBox.offsetHeight;

    alertBox.classList.add('show');

    setTimeout(() => {
      alertBox.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 500);
    }, 3000);
  };

  return (
    <div className="container-body-signup">
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
            <Components.Label>Select Role:</Components.Label>
            <Components.Select value={selectedOption} onChange={handleOptionChange}>
              <Components.Option value="artist">Artist</Components.Option>
              <Components.Option value="collector">Collector</Components.Option>
            </Components.Select>
            <Components.Input type='text' placeholder='Name' value={name} onChange={handleNameChange} />
            <Components.Input type='email' placeholder='Email' value={email} onChange={handleEmailChange} />
            <Components.Input type='password' placeholder='Password' value={password} onChange={handlePasswordChange} />
            <Components.Button onClick={handleSignUp}>Sign Up</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Log in</Components.Title>
            <Components.Input type='email' placeholder='Email' value={email} onChange={handleEmailChange} />
            <Components.Input type='password' placeholder='Password' value={password} onChange={handlePasswordChange} />
            <Components.Anchor href='/forgotpassword'>Forgot your password?</Components.Anchor>
            <Components.Button onClick={handleSignIn}>Log In</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Log In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Enter Your personal details and start the journey with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
}

export default SignUp;
