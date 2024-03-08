import React from 'react'
import "./Box.css"

function Box({type, image, price, location}) {
  return (
    <div className='box'>
      <div className='box__info'>
        <strong>{type}</strong>
        <p className= 'box__location'>
            <strong>{location}</strong>
            </p>
        <p className='box__price'>
            <strong>$</strong>
            <strong>{price}</strong>
        </p>
        </div>
        <img
        src='https://tse4.explicit.bing.net/th?id=OIP.iqldYf72fpKKy0NYd9wVkAHaJH&pid=Api&P=0&h=180'
        alt=''
        />
        <button>Add to WishList</button>
    </div>
  )
}

export default Box
