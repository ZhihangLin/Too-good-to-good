import React from 'react'
import "./Switch.css"
import CurrencyFormat from 'react-currency-format'
import { useStateValue} from "./StateProvider";
import { getBasketTotal } from './reducer';

function Switch() {
  const [{ basket }, dispatch] = useStateValue();

  return (
    <div className='Switch'>
      <CurrencyFormat renderText={(value) => (
        <>
            <p>
                Boxes ({basket.length}): <strong>{value}</strong>
            </p>
        </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />

      <button>Confirm to Switch</button>
    </div>
  )
}

export default Switch
