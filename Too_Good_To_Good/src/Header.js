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
    const queryText = e.target.value.trim().toLowerCase(); // Convert to lowercase for case-insensitive search
    setSearchQuery(queryText);
  
    if (!queryText) {
      setSearchResults([]);
      return;
    }
  
    try {
      // Fetch all the documents in the collection (only feasible for small collections)
      const allDocsSnapshot = await getDocs(collection(db, 'boxes'));
      const results = [];
      allDocsSnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if productName contains the queryText
        if (data.productName.toLowerCase().includes(queryText)) {
          results.push({ id: doc.id, ...data });
        }
      });
  
      console.log(results); // Log the results to the console for debugging
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for items:', error);
    }
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

    <div className='header__search'>
      <input
        className='header__searchInPut'
        type='text'
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <SearchIcon className='header__searchIcon' />
    </div>

    {searchQuery && (
  <div className='header__searchResults'>
    {searchResults.length > 0 ? (
      <ul>
        {searchResults.map((item, index) => (
          // Ensure that each item has a unique key; in this case, the index is used as a fallback
          <li key={item.id || index}>{item.productName}</li>
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
