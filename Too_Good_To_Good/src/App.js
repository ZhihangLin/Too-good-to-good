import React, { useEffect } from 'react';
import './App.css';
import Home from'./Home';
import Upload from'./Upload';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Login from "./Login";
import { auth } from "./firebase";
import ConfirmSwitch from "./ConfirmSwitch"
import Header from './Header';
import { useStateValue } from "./StateProvider";
import BoxesDisplay from './BoxesDisplay';
import ResetPasscode from './ResetPasscode';
import CreateLogin from './CreateLogin';
import UserBoxes from './UserBoxes';
import Userbd from './Userbd';
import SearchResult from './SearchResult';
import SingleResult from './SingleResult';
import CompareBoxes from './CompareBoxes';
import SavePlace from './SavePlace';
import SwitchDetail from './SwitchDetail';




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
         //user logged out
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

        <Route path='/Userbd'>
          <Header />
            <div>
            <h1 className='box_title'>Mystery</h1>
              <Userbd />
          </div>
         

        </Route>

        <Route path="/Login">
          {/* <h1>Login page</h1> */}
          <Login />
        </Route>

        <Route path="/Upload">
          <Header />
          {/* <h1>Upload page</h1> */}
          <Upload />
         </Route>

        <Route path="/boxes">
          <Header />
          <BoxesDisplay />
        </Route>
           <Route path="/confirm">
          <Header />
          <ConfirmSwitch />
         </Route>

    <Route path="/userboxes">
          <Header />
          <UserBoxes />
         </Route>

    
        <Route path="/ResetPasscode">
          {/* <h1> ResetPasscode</h1> */}
          <ResetPasscode />
         </Route>

         <Route path="/CreateLogin">
          {/* <h1>Create Login page</h1> */}
          <CreateLogin />
         </Route>

         <Route path='/search'>
            <Header />
            <SearchResult />
          </Route>

          <Route path='/ConfirmSwitch'>
            <ConfirmSwitch />
          </Route>


          <Route path="/result/:boxId">
            <Header />
           <SingleResult />
          </Route>

          <Route path="/save-place/:location/:currentBoxId/:switchBoxId">
            <Header />
            <SavePlace />
          </Route>


        <Route path="/Compare">
          <Header />
          <CompareBoxes />
         </Route>

         <Route path="/switch-detail/:currentBoxId/:subBoxId">
          <Header />
          <SwitchDetail />
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
