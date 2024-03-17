import React from 'react'
import "./Box.css"
import { useStateValue } from './StateProvider'



function Box({id, type, image, minprice, maxprice, location }) {
  const [{ basket }, dispatch] = useStateValue();

  console.log("This is your Box >>")

  const addToWishList = () => {
    // add the item into data layer
    dispatch({
      type: 'ADD_TO_WISHLIST',
      item: {
        id: id,
        type: type,
        image: image,
        minprice: minprice,
        maxprice: maxprice,
        location: location,
      },
    });
  };

  return (
    <div className='box'>
      <div className='box__info'>
        <strong>{type}</strong>
        <p className= 'box__location'>
            <strong>{location}</strong>
            </p>
        <p className='box__minprice'>
            <strong>$</strong>
            <strong>{minprice}</strong>
            <strong>---</strong>
        </p>
        <p className='box__maxprice'>
            <strong>$</strong>
            <strong>{maxprice}</strong>
        </p>
      </div>
        <img
        src='https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180'
        alt=''
        />
        <button onClick={addToWishList}>Add to WishList</button>
    </div>
  )
}

export default Box
