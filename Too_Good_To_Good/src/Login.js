import React, { useState } from "react";
// import './Login.css';
import { Link, useHistory } from "react-router-dom";
import { auth } from "./firebase";


function Login(){
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClicktohome = () => {
        history.push('/');
        window.location.reload();
    };

    const signIn = e => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .then(auth => {
                if(auth) {
                    history.push('/')
                    window.location.reload();
                }
            })
            .catch(error => alert(error.message))
    }

    const register = () => {
        history.push('/createlogin');
        window.location.reload();
      };
    

    const resetPasswordPage = () => {
        history.push('/ResetPasscode');//go to reset passcode page
        window.location.reload();
    }

    return(
        <div className='login'> 
            <img className ="login_logo" onClick={handleClicktohome} src={require('./Logo.png')} />
            <div className="login_container">
                <h1>Sign-in</h1>
                <form>
                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />
                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    <button type='submit' onClick={signIn} className='login_signInButton'>Sign In</button>
                </form>
                <button onClick={register} className='login_registerButton'>Create your Too good to go Account</button>
                
            </div>
            <br></br>
            <button onClick={resetPasswordPage} className='resetPasswordButton'>Click here If You Forgot Your Password</button>
        </div>
    )
}

export default Login;
