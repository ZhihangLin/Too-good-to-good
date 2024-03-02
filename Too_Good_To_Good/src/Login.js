import React, { useState } from "react";
import './Login.css';
import { Link, useHistory } from "react-router-dom";
import { auth } from "./firebase";
import Home from "./Home";
import Header from "./Header";
 

function Login(){
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = e => {
        e.preventDefault();
        auth
        .signInWithEmailAndPassword(email, password)
        .then(auth => {
            if(auth)
        {
            history.push('/')
            console.log('sign in uwadhw')
            window.location.reload();
            // const targetElement = document.getElementsByClassName('header__optionLineOne')[0];
            // targetElement.innerHtml="Welcome User";

            {/* testing if user sign in */}
        }
            
        })
        
        .catch(error => alert(error.message))

       
    }

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

                }
                
            })
            .catch(error => alert(error.message));

       
    }

    return(
        <div className='login'> 
        <Link to = '/'>
        <img className ="login_logo"
        src={require('./Toogoodtogo.png')} />
        </Link>
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
        </div>

        
    )
}

export default Login