import '../styles/globals.css';
import '../pages/index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from '../pages/Context/UserContext';
import { CompanyProvider } from '../pages/Context/CompanyContext';

function MyApp({ Component, pageProps }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error('Google Client ID is not defined in environment variables');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <UserProvider>
        <CompanyProvider>
          <Component {...pageProps} />
        </CompanyProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;
