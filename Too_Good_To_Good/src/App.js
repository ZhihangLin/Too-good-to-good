import React, { useEffect } from 'react';
import './App.css';
import Home from'./Home';
import Upload from'./Upload';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./Login";
import { auth } from "./firebase";
import ConfirmSwitch from "./ConfirmSwitch"
import Header from './Header';
import { useStateValue } from "./StateProvider";



function App() {
  const[{}, dispatch] = useStateValue();


  useEffect(() =>{
    //only run once
    auth.onAuthStateChanged(authUser => {
      console.log('The USER IS >>> ', authUser);
      if(authUser)
      //user logged in
      {
        dispatch({
          type: 'SET_USER',
          user: authUser
        })

      }
      else{
        // user logged out
        dispatch({
          type: 'SET_USER',
          user: null

        })
      }
      
      
    })
  },[])
  return (
    // BEM

    <Router>
      <div className="App">
       <Switch>

        <Route path='/ConfirmSwitch'>
          <Header />
          <ConfirmSwitch />
        </Route>

        <Route path="/Login">
          {/* <h1>Login page</h1> */}
          <Login />
        </Route>

        <Route path="/Upload">
          <h1>Upload page</h1>
          <Upload />
         </Route>

        <Route path='/'>
          <Header />
          <Home />
        </Route>
        
        

      </Switch>
      </div>
    </Router>

  );
}

export default App;
