import { useUser } from '../Context/UserContext'; // Import the useUser hook
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';

const MainUI = () => {
  const { user, logOut } = useUser();  // Access user and logOut function from context
  const router = useRouter();

  const onLogout = async () => {
    await logOut();  // Log out using the logOut function from context
    router.push('/');  // Redirect to the login page
  };

  const handleClick = (boxName) => {
    if (boxName === 'Upload Requirements') {
      router.push('/Views/UploadRequirements'); 
    } else if (boxName === 'Student Info') {
      router.push('/Views/StudentInfo'); 
    } else if (boxName === 'Update Company') {
      router.push('/Views/UpdateCompany'); 
    } else {
      alert(`You clicked on ${boxName}`);
      console.log('Is the user authenticated?', !!user);

    }
  };

  if (!user) {
    return <div>Loading...</div>;  // Show loading if user data is not available
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div className={styles.leftHeaderContent}>
          <div className={styles.profile}>
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.name}'s profile`}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileImagePlaceholder}>No Image</div>
            )}
            <span className={styles.profileName}>{user.name}</span>
          </div>
        </div>

        <div className={styles.centerHeaderContent}>
          <h1>Welcome to the Main UI!</h1>
        </div>

        <button onClick={onLogout} className={styles.logoutButton}>
          Log Out
        </button>
      </div>

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