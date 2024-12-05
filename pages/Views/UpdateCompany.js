import { useState, useEffect } from 'react';
import { useCompany } from '../Context/CompanyContext';
import { useUser } from '../Context/UserContext';
import styles from '../../styles/UpdateCompany.module.css';
import { useRouter } from 'next/router';

const UpdateCompany = () => {
  const { company, updateCompany, deleteCompany } = useCompany();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyContact: '',
  });

  const [isEditable, setIsEditable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || '',
        companyAddress: company.companyAddress || '',
        companyContact: company.companyContact || '',
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompany(formData);
    setIsEditable(false);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleDeleteClick = () => {
    deleteCompany();
  };

  const handleBackClick = () => {
    router.push('/Views/MainUI');
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div className={styles.leftHeaderContent}>
          <div className={styles.profile}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className={styles.profileImage} />
            ) : (
              <div className={styles.profileImagePlaceholder}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
              </div>
            )}
            <span className={styles.profileName}>{user?.name || 'Guest'}</span>
          </div>
        </div>

        <div className={styles.centerHeaderContent}>
          <h1 className={styles.headingTitle}>Update Company Information</h1>
        </div>

        <button className={styles.backButton} onClick={handleBackClick}>
          Back to Main UI
        </button>
      </div>

      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputContainer}>
            <div className={styles.row}>
              <label>
                Company Name:
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={!isEditable}
                />
              </label>
            </div>

            <div className={styles.row}>
              <label>
                Company Address:
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={!isEditable}
                />
              </label>
            </div>

            <div className={styles.row}>
              <label>
                Company Contact:
                <input
                  type="text"
                  name="companyContact"
                  value={formData.companyContact}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={!isEditable}
                />
              </label>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button type="button" className={styles.button} onClick={handleEditClick} disabled={isEditable}>
              Edit
            </button>
            <button type="submit" className={styles.button} disabled={!isEditable}>
              Save
            </button>
            <button type="button" className={styles.button} onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCompany;