import React from 'react'
import './BoxesSelected.css'
import { useStateValue } from './StateProvider'

function BoxesSelected({id, type, image, minprice, maxprice, location }) {
  const [{ basket }, dispatch] = useStateValue();

  // Corrected removeFromList function
  const removeFromList = () => {
    dispatch({
      type: 'REMOVE_FROM_BASKET', // Correct action type
      id: id,
    });
  }

  return (
    <div className='BoxesSelected'>
      <img src='https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180' alt=''/>
      <div className='BoxesSelected__info'>
        <p className='BoxesSelected__type'>{type}</p>
        <div className='BoxesSelected__prices'>
          <p className='BoxesSelected__minprice'>
            <small>$</small>
            <strong>{minprice}</strong>
          </p>
          <span className='priceSeparator'>---</span>
          <p className='BoxesSelected__maxprice'>
            <small>$</small>
            <strong>{maxprice}</strong>
          </p>
        </div>
        <p className='BoxesSelected__location'>
          <strong>{location}</strong>
        </p>
        <button onClick={removeFromList}>Remove from WishList</button>
      </div>
    </div>
  )
}

export default BoxesSelected