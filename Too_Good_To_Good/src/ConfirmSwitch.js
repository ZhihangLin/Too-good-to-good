import React from 'react'
import './ConfirmSwitch.css'
import Switch from './Switch'

function ConfirmSwitch() {
  return (
    <div className='ConfirmSwitch'>
        <div className='ConfirmSwitch__left'>
            <div>
                <h2 className='ConfirmSwitch__title'>
                    Your Box Basket

                    {/* Boxes */}
                    {/* Boxes */}
                </h2>
            </div>
        </div>

        <div className='ConfirmSwitch__right'>
            <Switch />
        </div>
      
    </div>
  )
}

export default ConfirmSwitch
