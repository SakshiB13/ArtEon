import React, { useState } from "react";
import * as Components from './Login';
import { auth } from './utils/firebase';
import { createNewCollector } from './utils/collector';
import { createNewArtist } from './utils/artist';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

function SignUp() {
    const [signIn, toggle] = React.useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedOption, setSelectedOption] = useState("artist");
    const [user, loading] = useAuthState(auth);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSignUp = async (e) => {
        e.preventDefault(); 
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            if (selectedOption === 'artist') {
                await createNewArtist(user, name, email);
            } else if (selectedOption === 'collector') {
                await createNewCollector(user, name, email);
            }
    
            console.log('Sign-up successful');
            console.log('User:', user);
            console.log('User type:', selectedOption);
            console.log('Name:', name);
            console.log('Email:', email);
        } catch (error) {
            console.error('Sign-up failed:', error.message);
        }
    };
    

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            console.log('Sign-in successful');
            console.log('User:', user);
            console.log('Email:', email);
        } catch (error) {
            console.error('Sign-in failed:', error.message);
        }
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
                        <Components.Title>Sign in</Components.Title>
                        <Components.Input type='email' placeholder='Email' value={email} onChange={handleEmailChange} />
                        <Components.Input type='password' placeholder='Password' value={password} onChange={handlePasswordChange} />
                        <Components.Anchor href=''>Forgot your password?</Components.Anchor>
                        <Components.Button onClick={handleSignIn}>Sign In</Components.Button>
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
                                Sign In
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
