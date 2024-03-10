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
        <img className='ConfirmSwitch__img' src={require('./TGTG_Logo.png')} alt='TGTG image'/>
        <div>
          <h2 className='ConfirmSwitch__title'>
            Your Box Wish list
          </h2>
          {basket.map(item => (
            <BoxesSelected
              id={item.id}
              type={item.type}
              image={item.image}
              minprice={item.minprice}
              maxprice={item.maxprice}
              location={item.location}
            />
          ))}
        </div>
      </div>

    

       <Switch />
    </div>
  )
}

export default ConfirmSwitch;