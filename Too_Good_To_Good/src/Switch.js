import React from 'react'
import "./Switch.css"
import CurrencyFormat from 'react-currency-format'
import { useStateValue} from "./StateProvider";
import { getBasketminTotal } from './reducer';
import { getBasketmaxTotal } from './reducer';


function Switch() {
  const [{ basket }, dispatch] = useStateValue();

  const minTotal = getBasketminTotal(basket);
  const maxTotal = getBasketmaxTotal(basket);

  return (
    <div className='Switch'>
      <p>
        Boxes ({basket.length}): <strong>
          <CurrencyFormat
            decimalScale={2}
            value={minTotal}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
          />
          {" --- "}
          <CurrencyFormat
            decimalScale={2}
            value={maxTotal}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
          />
        </strong>
      </p>
      <button>Confirm to Switch</button>

      <div className='ConfirmSwitch__right'>
        <h2 className='ConfirmSwitch__title1'>
          My Box List
        </h2>
        {/* upload box */}
      </div>
    </div>
  );
}

export default Switch;