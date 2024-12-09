import { googleLogout } from '@react-oauth/google';
import supabase from '../../Lib/supabase'; // Import the Supabase client

const LogOutButton = ({ onLogout, className = '' }) => {
  const handleClick = async () => {
    // Log out of Google OAuth
    googleLogout();

    // Log out from Supabase
    const { error } = await supabase.auth.signOut(); 

    if (error) {
      console.error('Error logging out from Supabase:', error.message);
    }

    // Call onLogout function passed from parent component (to clear context, etc.)
    onLogout();
  };

  return (
    <button className={`logout-button ${className}`} onClick={handleClick}>
      Log Out
    </button>
  );
};

export default LogOutButton;
