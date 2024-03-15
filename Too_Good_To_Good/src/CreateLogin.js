import React, { useState } from "react";
import './CreateLogin.css';
import Login from "./Login";
import { Link, useHistory } from "react-router-dom";
import { auth } from "./firebase";

function CreateLogin(){
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const handleClicktohome = () => {

        // Use history.push to home page
        history.push('/');
        window.location.reload();
      };


    const register = e => {
        e.preventDefault();

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((auth) => {
                // it successfully create a new user with email and password
                console.log(auth);
                if(auth)
                {
                    history.push('/')
                    window.location.reload();

                }
                
            })
            .catch(error => alert(error.message));

       
    }
    return(
        <div className='login'> 
        
        <img className ="login_logo" onClick={handleClicktohome}
        src={require('./Toogoodtogo.png')} />
        
        <div className="login_container">
        
            <h1>Create-Login</h1>
            <form>
                    <h5>Username</h5>
                    <input type='text' value={username} onChange={e => setUsername(e.target.value)} />  
                    
                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />

                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

                    <button onClick={register} className='login_registerButton'>Create your Too good to go Account</button>
                </form>
               
        </div>
        </div>

        
    )




   
}

















export default CreateLogin