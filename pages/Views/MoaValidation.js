import { useUser } from '../Context/UserContext';
import styles from '../../styles/MOAValidation.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { companyOptions } from '../../Lib/PartneredCompanies';

const MoaValidation = () => {
  const { user } = useUser();
  const router = useRouter();
  
  const [companyName, setCompanyName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleBackClick = () => {
    router.push('/Views/MainUI');
  };

  const handleValidateClick = () => {
    const normalizedCompanyName = companyName.trim().toLowerCase();
    const isValidCompany = companyOptions.some(company =>
      company.toLowerCase() === normalizedCompanyName
    );
  
    if (isValidCompany) {
      setValidationMessage("Company is valid!");
    } else {
      setValidationMessage("Company not found. Please check the name.");
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
              <div className={styles.profileImagePlaceholder}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className={styles.profileName}>{user.name}</span>
          </div>
        </div>

        <div className={styles.centerHeaderContent}>
          <h1 className={styles.headingTitle}>Moa Validation</h1>
        </div>

        <button className={styles.backButton} onClick={handleBackClick}>
          Back to Main UI
        </button>
      </div>

      <div className={styles.formWrapper}>
        <h2 className={styles.centeredText}>Enter Company Name</h2>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={handleValidateClick}
            disabled={!companyName}
          >
            Validate Company
          </button>
        </div>

        {validationMessage && (
          <div className={styles.validationMessage}>
            {validationMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoaValidation;