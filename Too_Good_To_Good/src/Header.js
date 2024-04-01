import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useHistory } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import SearchIcon from '@mui/icons-material/Search';
import RedeemIcon from '@mui/icons-material/Redeem';
import { auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function Header() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    setSearchResults([]); // Clear search results when searchQuery changes
  }, [searchQuery]);

  const handleClick = () => {
    // Use history.push to navigate to another page
    history.push('/login');
    window.location.reload();
  };

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
    } 
   
  };



  



const handleSearchInputChange = async (e) => {
  const queryText = e.target.value.trim().toLowerCase();
  setSearchQuery(queryText);

  if (!queryText) {
    setSearchResults([]);
    return;
  }

  try {
    const allDocsSnapshot = await getDocs(collection(db, 'boxes'));
    const results = allDocsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(data => 
        data.productName.toLowerCase().includes(queryText) ||
        data.location.toLowerCase().includes(queryText) ||
        data.type.toLowerCase().includes(queryText)
      );

    console.log(results); // Log the results to the console for debugging
    dispatch({
      type: 'SET_SEARCH_RESULTS',
      searchResults: results, // payload should contain the search results
    });
    
    setSearchResults(results);
  } catch (error) {
    console.error('Error searching for items:', error);
  }
};






const handleSearch  = (e) => {
  e.preventDefault(); 
  history.push('/search');
};






  const ConfirmSwitchPage = () => {
    history.push('/ConfirmSwitch');//go to ConfirmSwitchPage page
    window.location.reload();
}

  return (
    <div className='header'>
    <Link to='/'>
      <img className='header__logo' src={require('./Toogoodtogo.png')} alt='Too Good To Go Logo' />
    </Link>

    <form onSubmit={handleSearch}>
      <div className='header__search'>
        <input
          className='header__searchInPut'
          type='text'
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <SearchIcon className='header__searchIcon' />
      </div>
    </form>




    {searchQuery && (
  <div className='header__searchResults'>
    {searchResults.length > 0 ? (
      <ul>
        {searchResults.map((item, index) => (
          <li key={item.id || index} className="searchResultItem">
            <div className="searchResultProductName">{item.productName}</div>
            <div className="searchResultLocation">{item.location}</div>
            <div className="searchResultType">{item.type}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No results found</p>
    )}
  </div>
)}





      <div className='header__nav'>
      <Link to='/login'>
        <div onClick={handleAuthenticaton} className='header__option'>
          <span className='header__optionLineOne' onClick={handleClick}>Hello, {user ? user.displayName : 'Guest'}</span>
          <span className='header__optionLineTwo' onClick={handleClick}>{user ? 'Sign Out' : 'Sign In'}</span>
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
          <div className='header__optionBox' onClick={ConfirmSwitchPage}>
            <RedeemIcon />
            <span className='header__optionLineTwo header__boxCount'>{basket?.length}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
