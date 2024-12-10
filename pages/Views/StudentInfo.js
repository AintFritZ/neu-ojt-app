import { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import styles from '../../styles/StudentInfo.module.css';
import { useRouter } from 'next/router';
import { semesterOptions, generateSchoolYearOptions, courseOptions } from '../../Lib/Options';
import supabase from '../../Lib/supabase';

const StudentInfo = () => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    middlename: '',
    studentid: '',
    studenttype: '',
    course: '',
    section: '',
    schoolyear: '',
    semester: '',
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('usersinfo')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setFormData({
          lastname: data.lastname || '',
          firstname: data.firstname || '',
          middlename: data.middlename || '',
          studentid: data.studentid || '',
          studenttype: data.studenttype || '',
          course: data.course || '',
          section: data.section || '',
          schoolyear: data.schoolyear || '',
          semester: data.semester || '',
        });
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      console.error('User ID is missing!');
      return; 
    }

    try {
      const { data, error } = await supabase
        .from('usersinfo')
        .upsert([{
          id: user.id,
          lastname: formData.lastname,
          firstname: formData.firstname,
          middlename: formData.middlename,
          studentid: formData.studentid,
          studenttype: formData.studenttype,
          course: formData.course,
          section: formData.section,
          schoolyear: formData.schoolyear,
          semester: formData.semester,
        }])
        .single();

      if (error) {
        console.error('Error saving user data:', error.message);
        return;
      }

      console.log('User saved:', data);

      updateUser(formData);
      console.log('User context updated');
    } catch (error) {
      console.error('Error saving user data:', error.message);
    }
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
                <img src={user.profilePicture} alt="Profile" className={styles.profileImage} />
              ) : (
                <div className={styles.profileImagePlaceholderText}>U</div>
              )}
            </div>
            <span className={styles.profileName}>{user?.name || 'Guest'}</span>
          </div>
        </div>
        <div className={styles.centerHeaderContent}>
          <h1 className={styles.headingTitle}>Student Information</h1>
        </div>
        <button className={styles.backButton} onClick={handleBackClick}>
          Back to Main UI
        </button>
      </div>

      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <label>
              Last Name:
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              First Name:
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              Middle Name:
              <input
                type="text"
                name="middlename"
                value={formData.middlename}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.row}>
            <label>
              Student Type:
              <select
                name="studenttype"
                value={formData.studenttype}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="regular">Regular</option>
                <option value="irregular">Irregular</option>
              </select>
            </label>
            <label>
              Student ID:
              <input
                type="text"
                name="studentid"
                value={formData.studentid}
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
                name="schoolyear"
                value={formData.schoolyear}
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

          <button type="submit" className={styles.button}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentInfo;