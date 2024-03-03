import React from 'react'
import "./Switch.css"
import CurrencyFormat from 'react-currency-format'

function Switch() {
  return (
    <div className='Switch'>
      <CurrencyFormat renderText={(value) => (
        <>
            <p>
                Boxes (0 items): <strong>0</strong>
            </p>
            <small className=' subtotal__gift'>
                <input type='checkbox' /> This Order Contains a Gift
            </small>
        </>
        )}
        decimalScale={2}
        value={0}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"f"}
      />
    </div>
  )
}

export default Switch
