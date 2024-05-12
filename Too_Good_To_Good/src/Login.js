import React, { useState } from "react";
import './Login.css';
import {Link, useHistory } from "react-router-dom";
import { auth, provider } from "./firebase"; // Assuming you have defined provider in firebase.js
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClicktohome = () => {
        history.push('/');
        window.location.reload();
    };

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // The signed-in user info.
                // const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                history.push('/');
                window.location.reload();
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                // const email = error.customData.email;
                // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                alert(errorMessage);
            });
    };

    const signInWithEmailAndPassword = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                history.push('/');
                window.location.reload();
            })
            .catch(error => alert(error.message));
    };

    const register = () => {
        history.push('/createlogin');
        window.location.reload();
    };

    const resetPasswordPage = () => {
        history.push('/ResetPasscode');
        window.location.reload();
    };

    return (
        <div className='login'>
            <img className="login_logo" onClick={handleClicktohome} src={require('./newlogo_login.png')} alt="logo" />
            <div>
                <div className="login_container">
                    <h1>Sign-in</h1>
                    <form>
                        <h5>E-mail</h5>
                        <input type='text' value={email} onChange={e => setEmail(e.target.value)} />
                        <h5>Password</h5>
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                        <Link to="/ResetPasscode">
                        <p className='resetButton' onClick={resetPasswordPage} >Forgot Your Password?</p>
                        </Link >
                        <button type='submit' onClick={signInWithEmailAndPassword} className='login_signInButton'>Sign In</button>
                        <p className="login_or">or</p>
    
                        <button type='button' onClick={signInWithGoogle} className='login_signInButton'>Sign In with Google</button>
                    
                    </form>
                    
                    {/* <button onClick={register} className='login_registerButton'>Create your Too good to go Account</button> */}
                </div>
                
            </div>
        </div>
    );
}

export default Login;
