import { useState, useEffect } from 'react';
import { useCompany } from '../Context/CompanyContext';
import { useUser } from '../Context/UserContext';
import { useRouter } from 'next/router';
import supabase from '../../Lib/supabase';
import styles from '../../styles/UpdateCompany.module.css';

const UpdateCompany = () => {
  const { company, updateCompany, deleteCompany } = useCompany();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyContact: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyData = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching company data:', error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setFormData({
          companyName: data.company_name || '',
          companyAddress: data.company_address || '',
          companyContact: data.company_contact || '',
        });
      }

      setLoading(false);
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('companies')
        .upsert([
          {
            id: 1,
            company_name: formData.companyName,
            company_address: formData.companyAddress,
            company_contact: formData.companyContact,
          },
        ])
        .single();

      if (error) {
        console.error('Error updating company data:', error.message);
        return;
      }

      console.log('Company updated:', data);

      updateCompany({
        companyName: formData.companyName,
        companyAddress: formData.companyAddress,
        companyContact: formData.companyContact,
      });

      console.log('Company context updated');
      setIsEditable(false);
    } catch (error) {
      console.error('Error updating company:', error.message);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', 1);

      if (error) {
        console.error('Error deleting company data:', error.message);
        return;
      }

      console.log('Company deleted');
      deleteCompany();
      router.push('/Views/MainUI');
    } catch (error) {
      console.error('Error deleting company:', error.message);
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleBackClick = () => {
    router.push('/Views/MainUI');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div className={styles.leftHeaderContent}>
          <div className={styles.profile}>
            <div className={styles.profileImagePlaceholder}>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileImagePlaceholderText}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
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

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.button}
              onClick={handleEditClick}
              disabled={isEditable}
            >
              Edit
            </button>
            <button
              type="submit"
              className={styles.button}
              disabled={!isEditable}
            >
              Save
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCompany;