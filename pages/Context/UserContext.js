// Context/UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Default state: no user

  // Function to update the user data
  const updateUser = (userData) => {
    if (userData) {
      setUser((prevUser) => {
        const updatedUser = { ...prevUser, ...userData };
        // Store updated user data in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } else {
      setUser(null); // If no user data is passed, clear user
      localStorage.removeItem('user'); // Remove user data from localStorage
    }
  };

  useEffect(() => {
    // On initial load, check if there is user data in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user from localStorage if available
    }
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use UserContext
export const useUser = () => useContext(UserContext);

export default UserProvider;
