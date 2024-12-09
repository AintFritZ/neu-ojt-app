import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useUser } from './Context/UserContext';
import LogInButton from './Components/LogInButton';
import supabase from '../Lib/supabase';

const LoginPage = () => {
  const { setUser } = useUser(); 
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error.message);
        return;
      }

      if (session) {
        setUser({
          id: session.user.id, // Include user ID in the context
          name: session.user.user_metadata.name,
          email: session.user.email,
          profilePicture: session.user.user_metadata.avatar_url,
        });
        router.push('/Views/MainUI');
      }
    };

    checkSession();
  }, [router, setUser]);

  const handleLoginSuccess = async (response) => {
    console.log("Login Success: ", response);

    const userData = response?.credential ? JSON.parse(atob(response.credential.split('.')[1])) : null;

    if (userData) {
      const { name, email, picture } = userData;

      // Check if the user exists in Supabase
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (error || !data) {
        // If the user does not exist, insert the user into the database
        const { error: insertError, data: insertedUser } = await supabase
          .from('users')
          .insert([{ email, name, profile_picture: picture }])
          .single(); // Ensures only one user is returned

        if (insertError) {
          console.error('Error inserting user into Supabase:', insertError.message);
          return;
        }

        // After insertion, use the returned `id`
        setUser({
          id: insertedUser.id,  // Set the user ID from the inserted data
          name,
          email,
          profilePicture: picture,
        });
      } else {
        // If the user exists, update their information
        const { error: updateError } = await supabase
          .from('users')
          .update({ name, profile_picture: picture })
          .eq('email', email);

        if (updateError) {
          console.error('Error updating user in Supabase:', updateError.message);
          return;
        }

        // Set the user information in the context, including the ID
        setUser({
          id: data.id,  // Use the existing user ID
          name,
          email,
          profilePicture: picture,
        });
      }

      router.push('/Views/MainUI');
    }
  };

  const handleLoginFailure = (response) => {
    console.log("Login Failed: ", response);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="container">
        <div className="card">
          <h1>Login with School Email</h1>
          <LogInButton
            className="login-button"
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
