import React from 'react'
import './App.css';
import Home from'./Home';
import Header from './Header';
import Checkout from './Checkout';
import { Route, Routes } from 'react-router-dom'



function App() {
  return (
    // BEM
      <div className="App">
        <Header/>
        <Routes>
          <Route path='' element= {<Home/>} />
          <Route path='/checkout' element= {<Checkout/>} />
        </Routes>
      </div>
  );
}

export default App;
