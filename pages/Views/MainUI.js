// pages/Views/MainUI.js
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
    if (boxName === 'Upload Requirements') {
      router.push('/Views/UploadRequirements'); 
    } else if (boxName === 'Student Info') {
      router.push('/Views/StudentInfo'); 
    } else if (boxName === 'Update Company') {
      router.push('/Views/UpdateCompany'); 
    } else {
      alert(`You clicked on ${boxName}`);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
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

        <LogOutButton onLogout={onLogout} className={styles.logoutButton} />
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
