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
        </>
        )}
        decimalScale={2}
        value={0}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />

      <button>Confirm to Switch</button>
    </div>
  )
}

export default Switch
