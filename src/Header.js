import React, { useState } from 'react';
import { FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa'; // Import icons
import './Header.css';
const MAX_SEARCH_LENGTH = 50;
const searchHints = ['The Birds', 'Rear Window', 'Family Pot']; 

const Header = ({ onSearch }) => {
  const [searchMode, setSearchMode] = useState(false); // State to manage search mode
  const [searchInput, setSearchInput] = useState(''); // State to manage search input

  // Function to handle click on search icon
  const handleSearchIconClick = () => {
    setSearchMode(true); 
  };

  // Function to handle input change in search input box
  const handleInputChange = (event) => {
    setSearchInput(event.target.value); 
    onSearch(event.target.value)

  };

  const resetState =()=>{
    setSearchInput('');
    setSearchMode(false);
  }

  // Function to handle click on back icon
  const handleBackIconClick = () => {
    resetState();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchInput); 
      resetState()
    }
  };

  const clearSearch =()=>{
    setSearchInput('')
  }

  return (
    <div className="header">
      <div className="header-left">
        {/* Conditional rendering based on searchMode */}
        <div className="icon-container" onClick={handleBackIconClick} >
            <FaArrowLeft className="icon" />
        </div>
      </div>
      <div className="header-center">
        {searchMode ? (
          <div className="search-input-container">
            <FaSearch className="cross-icon" />
            <input
              type="text"
              placeholder={`Search movie ${searchHints.toString()}...`}
              value={searchInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress} 
              maxLength={MAX_SEARCH_LENGTH}
            />
            {searchInput && ( // Render cross icon if search input is not empty
              <div className="icon-container" onClick={clearSearch}>
                <FaTimes className="cross-icon" />
              </div>
            )}
          </div>
        ) : (
          <h2>Romantic Comedy</h2>
        )}
      </div>
      <div className="header-right">
        {/* Conditional rendering based on searchMode */}
        {!searchMode ? (
           <div className="icon-container" onClick={handleSearchIconClick}>
             <FaSearch className="icon" />
           </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Header;
