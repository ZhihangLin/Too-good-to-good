import React from 'react'
import './Header.css'
import Login from'./Login';
import SearchIcon from '@mui/icons-material/Search';
import RedeemIcon from '@mui/icons-material/Redeem';
import { Link, useHistory } from "react-router-dom";
import { useStateValue} from "./StateProvider";

function Header() {
  const [{ basket }, dispatch] = useStateValue();
  const history = useHistory();
  const handleClick = () => {
    // Use history.push to navigate to another page
    history.push('/login');
    window.location.reload();
  };

  return (
    <div className='header'>
      <Link to='/'>
        <img className='header__logo' src={require('./Toogoodtogo.png')} alt='Too Good To Go Logo' />
      </Link>

      <div className='header__search'>
        <input className='header__searchInPut' type='text' />
        <SearchIcon className='header__searchIcon' />
        {/* Logo */}
      </div>

      <div className='header__nav'>
        <Link to='/login'>
          <div className='header__option'>
            <span className='header__optionLineOne'>Hello Guest</span>
            <span className='header__optionLineTwo'>Sign In</span>
          </div>
        </Link>

        <div className='header__option'>
          <span className='header__optionLineOne'>Look For</span>
          <span className='header__optionLineTwo'>Boxes</span>
        </div>

        <div className='header__option'>
          <span className='header__optionLineOne'>Your</span>
          <span className='header__optionLineTwo'>Boxes</span>
        </div>

        <Link to='/ConfirmSwitch'>
          <div className='header__optionBox'>
            <RedeemIcon />
            <span className='header__optionLineTwo header__boxCount'>
              {basket?.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
