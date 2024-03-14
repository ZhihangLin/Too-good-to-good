import React from 'react'
import './BoxesSelected.css'
import { useStateValue } from './StateProvider'

function BoxesSelected({ id, type, image, price, location }) {
  const [{basket}, dispatch] = useStateValue();
  const removeFromWishList = () => {
    //Remove the item from WishList
    dispatch({
      type: 'REMOVE_FROM_WISHLISH',
      id: id
    })
  }
  return (
    <div className='BoxesSelected'>
      <img
        src='https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180'
        alt=''
        />
        {/*
        <img className='<img
        src='BoxesSelected__image' src={image} />
        */}
        <div className='BoxesSelected__info'>
            <p className='BoxesSelected__type'>{type}</p>
            <p className='BoxesSelected__price'>
                <small>$</small>
                <strong>{price}</strong>
            </p>
            <p className='BoxesSelected__location'>
                <strong>{location}</strong>
            </p>
            <button onClick={removeFromWishList}>Remove from WishList</button>
        </div>
    </div>
  )
}

export default BoxesSelected