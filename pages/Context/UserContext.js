import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../../Lib/supabase';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setLoading(false); 
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
        setUser(null);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe(); 
      }
    };
  }, []);

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setUser(null); 
    }
  };

  // Function to update user data
  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData, 
    }));
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;