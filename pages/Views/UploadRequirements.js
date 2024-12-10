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
    if (user) {
      fetchFiles(user.id);
    }
  }, [user]);

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
        filesData[file.id] = { file_name: file.file_name, file_url: file.file_url };
      });
      setFiles(filesData);
    }
  };

  const handleFileUpload = async (event, key) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploading(true);
      try {
        const fileName = file.name;
        const { data, error } = await supabase.storage
          .from('requirements')
          .upload(`RequirementFiles/${user.id}/${fileName}`, file, {
            contentType: file.type,
            upsert: true,
          });

        if (error) {
          throw error;
        }

        const fileUrl = `https://ncvlhbaeyxtzdfketglj.supabase.co/storage/v1/object/public/requirements/RequirementFiles/${user.id}/${fileName}`;

        await addFileToSupabase(user.id, fileName, fileUrl, key);

        await fetchFiles(user.id);
        
        setFiles((prevFiles) => ({
          ...prevFiles,
          [key]: { file_name: fileName, file_url: fileUrl },
        }));
      } catch (error) {
        alert('Error uploading file: ' + error.message);
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };
  
  const addFileToSupabase = async (userId, fileName, fileUrl, key) => {
    const fileIds = {
      'Parents Consent': 1,
      'Medical Exam': 2,
      'Psychological Exam': 3,
      'Resume': 4,
    };

    const fileId = fileIds[key];

    const { data, error } = await supabase
      .from('files')
      .upsert(
        {
          id: fileId,
          user_id: userId,
          file_name: fileName,
          file_url: fileUrl,
        },
        { onConflict: ['id', 'user_id'] }
      );

    if (error) {
      console.error('Error adding file to Supabase:', error);
    } else {
      console.log('File metadata added/updated in Supabase:', data);
    }
  };

  const handleViewFile = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      alert('No file to view.');
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
        {['Parents Consent', 'Medical Exam', 'Psychological Exam', 'Resume'].map((label, index) => {
          const fileId = index + 1;
          const file = files[fileId];

          return (
            <div className={styles.box} key={label}>
              <span className={styles.label}>{label}</span>
              {file && <span className={styles.fileName}>{file.file_name}</span>}
              <div className={styles.actions}>
                <button
                  className={styles.uploadButton}
                  onClick={() => document.getElementById(`fileInput-${label}`).click()}
                >
                  Upload
                </button>
                <button
                  className={styles.viewButton}
                  onClick={() => handleViewFile(file?.file_url)}
                >
                  View
                </button>
                <input
                  id={`fileInput-${label}`}
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, label)}
                />
              </div>
              {uploading && <div className={styles.uploadingIndicator}>Uploading...</div>}
            </div>
          );
        })}
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