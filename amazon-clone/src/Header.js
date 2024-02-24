import React from 'react'
import './Header.css'
function Header() {
  return (
    <div className='header'>
      <img src='https://www.tripfiction.com/wp-content/uploads/2016/08/1920x1080-brands-amazon-logo.jpg' />
      <div className='header__search'>
        <input className='header__searchInPut' type='text' />
        {/* Logo */}
      </div>

      <div className='header__nav'>
        <div className='header__option'>
            <span className='header__optionLineOne'>Hello Guest</span>
            <span className='header__optionLineTwo'>Sign In</span>
        </div>

        <div className='header__option'>
            <span className='header__optionLineOne'>Return</span>
            <span className='header__optionLineTwo'>&Orders</span>
        </div>

        <div className='header__option'>
        <   span className='header__optionLineOne'>Your</span>
            <span className='header__optionLineTwo'>Prime</span>
        </div>

      </div>

    </div>
  )
}

export default Header
