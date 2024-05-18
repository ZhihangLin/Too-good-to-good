import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useHistory } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import SearchIcon from '@mui/icons-material/Search';
import RedeemIcon from '@mui/icons-material/Redeem';
import BackupIcon from '@mui/icons-material/Backup';
import InboxIcon from '@mui/icons-material/Inbox';
import { auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

function Header() {
  const [{ boxCounter, user }, dispatch] = useStateValue();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setSearchResults([]); // Clear search results when searchQuery changes
  }, [searchQuery]);

  useEffect(() => {
    const storedBoxCounter = parseInt(localStorage.getItem('boxCounter')) || 0;
    dispatch({
      type: 'UPDATE_BOX_COUNTER',
      count: storedBoxCounter,
    });
  }, [dispatch]);

  const handleClick = () => {
    history.push('/login');
    window.location.reload();
  };

  const handleLogo = () => {
    history.push('/');
    window.location.reload();
  };

  const handleUserboxes = () => {
    history.push('/userboxes');
    window.location.reload();
  };

  const handleCompare = () => {
    history.push('/Compare');
    window.location.reload();
  };

  const UserdbPage = () => {
    history.push('/userbd');
    window.location.reload();
  };

  const UploadPage = ()=> {
    history.push('/Upload');
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
        ).filter(data => data.EvaluationPrice !== 'not decide'); // Filter out items with EvaluationPrice as 'not decide'

      dispatch({
        type: 'SET_SEARCH_RESULTS',
        searchResults: results,
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for items:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    window.location.reload();
  };

  const handleResultClick = (id) => {
    history.push(`/result/${id}`);
    window.location.reload();
  };

  const ConfirmSwitchPage = () => {
    history.push('/confirm');
    window.location.reload();
  }

  return (
    <div className='header'>
      <Link to='/' onClick={handleLogo}>
        <img className='header__logo' src={require('./newlogo.png')} alt='Too Good To Go Logo' />
      </Link>

      <form onSubmit={handleSearch}>
        <div className='header__search'>
          <input
            className='header__searchInPut'
            type='text'
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <SearchIcon className='header__searchIcon' onClick={(e) => handleSearch(e)} />
        </div>
      </form>

      {searchQuery && (
        <div className='header__searchResults'>
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((item, index) => (
                <li key={item.id} className="searchResultItem" onClick={() => handleResultClick(item.id)} style={{ textDecoration: 'none' }}>
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

        <Link to='/userdb' onClick={UserdbPage}>
          <div className='header__option'>
            <span className='header__optionLineOne'>Look For</span>
            <span className='header__optionLineTwo'>Boxes</span>
          </div>
        </Link>

        <div className='header__option' onClick={UserdbPage}>
          <InboxIcon style={{ color: 'white', marginLeft: '-15px' }}/>
        </div>

        <Link to='/upload'>
          <div className='header__option' onClick={UploadPage}>
            <span className='header__optionLineOne'>Upload</span>
            <span className='header__optionLineTwo'>Boxes</span>
          </div>
        </Link>

        <div className='headder__option' onClick={UploadPage}>
          <BackupIcon style={{ color: 'white' }}/>
        </div>

        <Link to='/userboxes'>
          <div className='header__option' onClick={handleUserboxes}>
            <span className='header__optionLineOne'>Your</span>
            <span className='header__optionLineTwo'>Boxes</span>
          </div>
        </Link>

        <Link to='/userboxes'>
          <div className='header__optionBox' onClick={ConfirmSwitchPage}>
            <RedeemIcon />
            <span className='header__optionLineTwo header__boxCount'>{boxCounter}</span> {/* Updated to show boxCounter */}
          </div>
        </Link>

        <Link to='/Compare'>
          <div className='header__option' onClick={handleCompare}>
            <span className='header__optionLineOne'>Compare</span>
            <span className='header__optionLineTwo'>Box</span>
          </div>
        </Link>

        <Link to='/Compare'>
          <div className='header__optionBox' onClick={handleCompare}>
            <ChangeCircleIcon/>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;