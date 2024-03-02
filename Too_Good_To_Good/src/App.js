import React, { useEffect } from 'react';
import './App.css';
import Home from'./Home';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./Login";
import { auth } from "./firebase";
//import { useStateValue } from "./StateProvider";


function App() {
  //const[{}, dispatch] = useStateValue();


  useEffect(() =>{
    //only run once
    auth.onAuthStateChanged(authUser => {
      console.log('The USER IS >>> ', authUser);
      if(authUser)
      //user logged in
      {
        // dispatch({
        //   type: 'SET_USER',
        //   user: authUser
        // })

      }
      else{
        // user logged out
        // dispatch({
        //   type: 'SET_USER',
        //   user: null

        // })
      }
      
      
    })
  },[])
  return (
    // BEM
    <Router>
      <div className="App">
       <Switch>
        <Route path="/Login">
          <h1>Login page</h1>
          <Login />

         </Route>
      
      
      <Home />

      </Switch>
      </div>
    </Router>
  );
}

export default App;
