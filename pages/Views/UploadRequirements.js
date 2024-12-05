import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser  } from '../Context/UserContext';
import styles from '../../styles/UploadRequirement.module.css'; 

const UploadRequirements = () => {
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { user } = useUser ();

  const handleFileUpload = async (event, key) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch('/api/uploadFile', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.success) {
          setFiles((prevFiles) => ({
            ...prevFiles,
            [key]: { file, url: data.blobUrl },
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
      alert("Please upload a valid PDF file.");
    }
  };

  const handleBackClick = () => {
    router.push('/Views/MainUI');
  };

  useEffect(() => {
    // Prevent any mismatches during SSR
  }, []);

  return (
    <div className={styles.container}>
      {/* Header bar with Back button */}
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
              {files[label] ? files[label].file.name : 'Click to Upload'}
            </label>
            <input
              id={`fileInput-${label}`}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, label)}
            />
            {files[label] && (
              <span className={styles.fileName}> - {files[label].file.name}</span>
            )}
            {uploading && <div className={styles.uploadingIndicator}>Uploading...</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadRequirements;