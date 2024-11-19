import { useUser } from '../Context/UserContext'; 
import styles from '../../styles/Home.module.css';
import LogOutButton from '../Components/LogOutButton';
import { useRouter } from 'next/router';

const MainUI = () => {
  const { user } = useUser(); 
  const router = useRouter();

  const onLogout = () => {
    router.push('/');
  };

  const handleClick = (boxName) => {
    alert(`You clicked on ${boxName}`);
  };

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        {/* Left Header Content: Profile Image and Name */}
        <div className={styles.leftHeaderContent}>
          <div className={styles.profile}>
            {/* Profile Picture */}
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.name}'s profile`}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileImagePlaceholder}>No Image</div>
            )}
            {/* User Name */}
            <span className={styles.profileName}>{user.name}</span>
          </div>
        </div>

        {/* Center Header Content: Welcome message */}
        <div className={styles.centerHeaderContent}>
          <h1>Welcome to the Main UI!</h1>
        </div>

        {/* Log Out Button */}
        <LogOutButton onLogout={onLogout} className={styles.logoutButton} />
      </div>

      {/* Main Content Boxes */}
      <div className={styles.boxContainer}>
        <div className={styles.box} onClick={() => handleClick('Student Info')}>
          Student Info
        </div>
        <div className={styles.box} onClick={() => handleClick('Upload Requirements')}>
          Upload Requirements
        </div>
        <div className={styles.box} onClick={() => handleClick('Generate Report')}>
          Generate Report
        </div>
        <div className={styles.box} onClick={() => handleClick('Update Company')}>
          Update Company
        </div>
      </div>
    </div>
  );
};

export default MainUI;
