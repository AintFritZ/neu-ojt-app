import { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import styles from '../../styles/StudentInfo.module.css';
import { useRouter } from 'next/router';
import {
  semesterOptions,
  generateSchoolYearOptions,
  courseOptions,
} from '../../Lib/Options';

const StudentInfo = () => {
  const { user, updateUser } = useUser(); // Use updateUser here
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    studentID: '',
    studentType: '',
    course: '',
    section: '',
    schoolYear: '',
    semester: '',
  });

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        lastName: user.lastName || '',
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        studentID: user.studentID || '',
        studentType: user.studentType || '',
        course: user.course || '',
        section: user.section || '',
        schoolYear: user.schoolYear || '',
        semester: user.semester || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData); // Call updateUser here
    alert('Student information updated successfully!');
    router.push('/Views/MainUI');
  };

  const handleBackClick = () => {
    router.push('/Views/MainUI');
  };

  return (
    <div className={styles.container}>
      {/* Header Bar */}
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
          <h1 className={styles.headingTitle}>Student Information</h1>
        </div>
        <button className={styles.backButton} onClick={handleBackClick}>
          Back to Main UI
        </button>
      </div>

      {/* Form Container */}
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Row 1: Last Name, First Name, Middle Name */}
          <div className={styles.row}>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              Middle Name:
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
          </div>

          {/* Row 2: Student Type (dropdown), Student ID, Course */}
          <div className={styles.row}>
            <label>
              Student Type:
              <select
                name="studentType"
                value={formData.studentType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
            </label>
            <label>
              Student ID:
              <input
                type="text"
                name="studentID"
                value={formData.studentID}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              Course:
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={styles.select}
              >
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Row 3: Section, School Year, Semester */}
          <div className={styles.row}>
            <label>
              Section:
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              School Year:
              <select
                name="schoolYear"
                value={formData.schoolYear}
                onChange={handleChange}
                className={styles.select}
              >
                {generateSchoolYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Semester:
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={styles.select}
              >
                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.button}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentInfo;
