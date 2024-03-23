import React, { useState } from "react";
import './CreateLogin.css';
import { useHistory } from "react-router-dom";
import { auth } from "./firebase";

function CreateLogin(){
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    
    const handleClicktohome = () => {
        // Use history.push to home page
        history.push('/');
    };

    const register = e => {
        e.preventDefault();

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Successfully created a new user with email and password
                const user = userCredential.user;
                
                // Set username in user profile
                user.updateProfile({
                    displayName: username
                }).then(() => {
                    // Username set successfully, redirect to home
                    console.log("Username added successfully");
                    history.push('/');
                    window.location.reload();
                }).catch((error) => {
                    console.log(error.message);
                });
            })
            .catch(error => alert(error.message));
    };

    return(
        <div className='login'> 
            <img className="login_logo" onClick={handleClicktohome} src={require('./Toogoodtogo.png')} alt="" />
            <div className="login_container">
                <h1>Create Your Login</h1>
                <form>
                    <h5>Username</h5>
                    <input type='text' value={username} onChange={e => setUsername(e.target.value)} />  
                    
                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />

                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

                    <button onClick={register} className='login_registerButton'>Create Your Too Good To Good Account</button>
                </form>
            </div>
        </div>
    );
}

export default CreateLogin;
