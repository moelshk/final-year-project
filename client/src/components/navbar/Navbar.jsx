import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { SearchOutlined, Logout } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useUserData } from "../../context/userDataContext";
import axios from "axios";

import { AuthContext } from "../../context/authContext";
import useClickOutside from '../../hooks/useClickOutside';

import "./navbar.scss";
import Logo from "../../assets/logo.png";
import noUser from "../../assets/defaultProfilePic.png";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { userData } = useUserData();

  const searchResultsRef = useRef();

  useClickOutside(searchResultsRef, () => {
    setSearchResults([]);
  });

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8800/api/searchs?query=${searchQuery}`
      );

      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout");
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={Logo} alt="Logo" className="logo-image" />
        </Link>
        <div className="search-container">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      </div>
      <div className="navbar-right">
        <IconButton onClick={handleLogout}>
          <Logout className="logout-icon" />
        </IconButton>
        <div className="user-info">
          <Link to={`/profile/${currentUser.id}`}>
            {currentUser && (
              <img
                src={
                  userData[currentUser.id]?.profilePic || currentUser.profilePic
                    ? `/upload/${
                        userData[currentUser.id]?.profilePic ||
                        currentUser.profilePic
                      }`
                    : noUser
                }
                alt="User Profile"
                className="user-image"
              />
            )}
          </Link>
        </div>
      </div>
      {searchResults.length > 0 && (
        <div className="search-results" ref={searchResultsRef}>
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="search-result"
              onClick={() => setSearchResults([])}
            >
              <Link to={`/profile/${result.id}`}>{result.username}</Link>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
