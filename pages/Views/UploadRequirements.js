import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../Context/UserContext';
import styles from '../../styles/UploadRequirement.module.css';
import supabase from '../../Lib/supabase';

const UploadRequirements = () => {
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      fetchFiles(user.id);
    }
  }, [user]);  // This runs when user changes

  const fetchFiles = async (userId) => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching files:', error);
    } else {
      const filesData = {};
      data.forEach((file) => {
        filesData[file.file_name] = { file_name: file.file_name, file_url: file.file_url };
      });
      setFiles(filesData);  // Update state with fetched files
    }
  };

  const handleFileUpload = async (event, key) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploading(true);
      try {
        const folderPath = `users/${user.username}/`;
        const filePath = folderPath + file.name;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id); 

        const response = await fetch('/api/uploadFile', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.success) {
          const fileUrl = data.fileUrl; // Now use Supabase URL from backend
          await addFileToSupabase(user.id, file.name, fileUrl);
          setFiles((prevFiles) => ({
            ...prevFiles,
            [key]: { file_name: file.name, file_url: fileUrl },
          }));
        } else {
          alert('File upload failed.');
        }
      } catch (error) {
        alert('Error uploading file: ' + error.message);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const addFileToSupabase = async (userId, fileName, fileUrl) => {
    const { data, error } = await supabase
      .from('files')
      .insert([{
        user_id: userId,
        file_name: fileName,
        file_url: fileUrl,
      }]);

    if (error) {
      console.error('Error adding file to Supabase:', error);
    } else {
      console.log('File metadata added to Supabase:', data);
    }
  };

  const handleBackClick = () => {
    router.push('/Views/MainUI');
  };

  const handleMoaValidationClick = () => {
    router.push('/Views/MoaValidation');
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div className={styles.leftHeaderContent}>
          <div className={styles.profile}>
            <div className={styles.profileImagePlaceholder}>
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className={styles.profileImage} />
              ) : (
                <div className={styles.profileImagePlaceholderText}>U</div>
              )}
            </div>
            <span className={styles.profileName}>{user.name || 'Guest'}</span>
          </div>
        </div>

        <div className={styles.centerHeaderContent}>
          <h1 className={styles.headingTitle}>Upload Requirements</h1>
        </div>

        <button className={styles.backButton} onClick={handleBackClick}>
          Back to Main UI
        </button>
      </div>

      <div className={styles.boxContainer}>
        {['Parents Consent', 'Medical Exam', 'Psychological Exam', 'Resume'].map((label) => (
          <div className={styles.box} key={label}>
            <span className={styles.label}>{label}:</span>
            <label htmlFor={`fileInput-${label}`} className={styles.uploadBox}>
              {files[label] ? files[label].file_name : 'Click to Upload'}
            </label>
            <input
              id={`fileInput-${label}`}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, label)}
            />
            {files[label] && (
              <span className={styles.fileName}> - {files[label].file_name}</span>
            )}
            {uploading && <div className={styles.uploadingIndicator}>Uploading...</div>}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.moaValidationButton} onClick={handleMoaValidationClick}>
          MOA Validation
        </button>
      </div>
    </div>
  );
};

export default UploadRequirements;