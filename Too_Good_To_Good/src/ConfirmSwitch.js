import React from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory from React Router
import './ConfirmSwitch.css';
import Switch from './Switch';
import { useStateValue } from './StateProvider';
import BoxesSelected from './BoxesSelected';

function ConfirmSwitch() {
    const [{ basket }, dispatch] = useStateValue();
    

  return (
    <div className='ConfirmSwitch'>
       
            
       

        
      
    </div>
  )
}

export default ConfirmSwitch
