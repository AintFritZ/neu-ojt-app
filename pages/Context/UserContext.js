import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../../Lib/supabase';

// Create the context for user
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // State to track loading status

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setLoading(false); // Not authenticated
        return;
      }
      setUser({
        name: session.user.user_metadata.name,
        email: session.user.email,
        profilePicture: session.user.user_metadata.avatar_url,
      });
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          name: session.user.user_metadata.name,
          email: session.user.email,
          profilePicture: session.user.user_metadata.avatar_url,
        });
      } else {
        setUser(null); // Reset user on logout
      }
    });

    // Cleanup the listener
    return () => {
      if (subscription) {
        subscription.unsubscribe(); // Correctly call unsubscribe on the subscription object
      }
    };
  }, []);

  // Log out function to sign out the user
  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setUser(null);  // Reset user state on logout
    }
  };

  // Function to update user data
  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData, // Merge previous user data with new data
    }));
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};