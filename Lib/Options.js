// C:\Users\evban\ojt-app\pages\Context\Options.js

export const semesterOptions = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester (Summer)',
  ];
  
  export const studentTypeOptions = ['Regular', 'Irregular'];
  
  export const courseOptions = [
    'Bachelor of Science in Accountancy (BS in Accountancy)',
    'Bachelor of Science in Accounting Information Systems',
    'Bachelor of Science in Accounting Technology',
    'Bachelor of Science in Medical Technology',
    'Bachelor of Science in Nursing',
    'Bachelor of Science in Physical Therapy',
    'Bachelor of Science in Respiratory Therapy',
    'Bachelor of Science in Computer Science',
    'Bachelor of Science in Information Technology',
    'Bachelor of Science in Information Systems',
    'Bachelor of Science in Entertainment and Multimedia Computing',
  ];
  
  export function generateSchoolYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    return years;
  }
  