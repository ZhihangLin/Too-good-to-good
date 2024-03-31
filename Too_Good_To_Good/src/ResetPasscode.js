import React, { useState } from "react";
import './ResetPasscode.css';
import { useHistory } from "react-router-dom";
import { auth } from "./firebase";


function ResetPasscode() {
    const [email, setEmail] = useState('');
    const history = useHistory();

    const resetPassword = () => {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                // Email sent.
                alert("Password reset email sent. Check your inbox!");
                history.push('/login');
                window.location.reload();
            })
            .catch(error => {
                // An error happened.
                console.error(error);
                alert("Error occurred while sending password reset email.");
            });
    }

    return (
        <div className='reset'> 
            <img className ="reset_logo"  src={require('./Logo.png')} />
            <div className="login_container">
                <h2>Reset Password</h2>
                <br></br>
                <form>
                    <h4>E-mail</h4>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />
                </form>
                <button onClick={resetPassword} className='resetPasswordButton'>Reset Password</button>
            </div>
        </div>
    );
}

export default ResetPasscode;
