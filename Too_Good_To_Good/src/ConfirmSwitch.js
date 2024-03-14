import React from 'react'
import './ConfirmSwitch.css'
import Switch from './Switch'
import { useStateValue } from './StateProvider'
import BoxesSelected from './BoxesSelected';


function ConfirmSwitch() {
    const [{ basket }, dispatch] = useStateValue();

  return (
    <div className='ConfirmSwitch'>
        <div className='ConfirmSwitch__left'>
            <img className='ConfirmSwitch__img' 
            src={require('./TGTG_Logo.png')} alt='TGTG image'/>
            <div>
                <h2 className='ConfirmSwitch__title'>
                    Your Box Wish list
                </h2>
                {basket.map(item =>(
                    <BoxesSelected
                    type= {item.type}
                    image= {item.image}
                    price= {item.price}
                    location= {item.location}
                    />
                ))}
                {/* BoxesSelected */}
                {/* BoxesSelected */}
            </div>
        </div>

        <div className='ConfirmSwitch__right'>
            <Switch />
        </div>
      
    </div>
  )
}

export default ConfirmSwitch
