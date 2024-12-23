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
          id: session.user.id,
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

      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (error || !data) {
        const { error: insertError, data: insertedUser } = await supabase
          .from('users')
          .insert([{ email, name, profile_picture: picture }])
          .single(); 

        if (insertError) {
          console.error('Error inserting user into Supabase:', insertError.message);
          return;
        }

        setUser({
          id: insertedUser.id,  
          name,
          email,
          profilePicture: picture,
        });
      } else {
        const { error: updateError } = await supabase
          .from('users')
          .update({ name, profile_picture: picture })
          .eq('email', email);

        if (updateError) {
          console.error('Error updating user in Supabase:', updateError.message);
          return;
        }

        setUser({
          id: data.id,  
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
          <h1>Login with University Email</h1>
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
