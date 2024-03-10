import React, { useState } from "react";
import './Upload.css';
import { Link, useHistory } from "react-router-dom";
import { auth } from "./firebase";
import Home from "./Home";
import Header from "./Header";
import Login from "./Login";
 

function Upload(){
    // const history = useHistory();
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    // const signIn = e => {
    //     e.preventDefault();
    //     auth
    //     .signInWithEmailAndPassword(email, password)
    //     .then(auth => {
    //         if(auth)
    //     {
    //         history.push('/')
    //         console.log('sign in uwadhw')
    //         window.location.reload();
    //         // const targetElement = document.getElementsByClassName('header__optionLineOne')[0];
    //         // targetElement.innerHtml="Welcome User";

    //         {/* testing if user sign in */}
    //     }
            
    //     })
        
    //     .catch(error => alert(error.message))

       
    // }

    // const register = e => {
    //     e.preventDefault();

    //     auth
    //         .createUserWithEmailAndPassword(email, password)
    //         .then((auth) => {
    //             // it successfully create a new user with email and password
    //             console.log(auth);
    //             if(auth)
    //             {
    //                 history.push('/')

    //             }
                
    //         })
    //         .catch(error => alert(error.message));

       
    // }

    return(
        <div className='upload'> 
        <Link to = '/'>
        <img className ="upload_logo"
        src={require('./Toogoodtogo.png')} />
        </Link>
        <div className="login_container">
        
            <h1>Welcome, User</h1>
            <form>
                    <br></br>
                    <h3>Add your box by fill out the information below!</h3>
                    {/* <input type='text' value={email} onChange={e => setEmail(e.target.value)} /> */}
                    <br></br>

                    <h4>Upload Picture:</h4>
                    <input type="file" id="item" name="item" accept="image/png, image/jpeg" />

                    <h5>Type:</h5>
                    <input type='text'/>

                    <h5>Product Name:</h5>
                    <input type='text'/>
                    
                    <h5>Origin Price:</h5>
                    <input type='text'/>

                    <h5>Notes:</h5>
                    <input type='text'/>

                    <button type='submit'  className='login_signInButton'>Upload</button>


                    
                    {/* <input type='password' value={password} onChange={e => setPassword(e.target.value)} /> */}

                    {/* <button type='submit' onClick={signIn} className='login_signInButton'>Sign In</button> */}
                </form>
                {/* <button onClick={register} className='login_registerButton'>Create your Too good to go Account</button> */}
        </div>
        </div>

        
    )
}

export default Upload