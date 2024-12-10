import { googleLogout } from '@react-oauth/google';
import supabase from '../../Lib/supabase'; // Import the Supabase client

const LogOutButton = ({ onLogout, className = '' }) => {
  const handleClick = async () => {
    googleLogout();

    const { error } = await supabase.auth.signOut(); 

    if (error) {
      console.error('Error logging out from Supabase:', error.message);
    }

    onLogout();
  };

  return (
    <button className={`logout-button ${className}`} onClick={handleClick}>
      Log Out
    </button>
  );
};

export default LogOutButton;
