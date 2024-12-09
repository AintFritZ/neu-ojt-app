import React, { createContext, useState, useContext } from 'react';

// Create the CompanyContext
const CompanyContext = createContext();

// CompanyProvider component to manage company state
export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState({
    companyName: '',
    companyAddress: '',
    companyContact: '',
  });

  // Update company data
  const updateCompany = (newData) => {
    setCompany((prevCompany) => ({ ...prevCompany, ...newData }));
  };

  // Reset company data to default values
  const deleteCompany = () => {
    setCompany({
      companyName: '',
      companyAddress: '',
      companyContact: '',
    });
  };

  return (
    <CompanyContext.Provider value={{ company, updateCompany, deleteCompany }}>
      {children} {/* Render child components */}
    </CompanyContext.Provider>
  );
};

// Custom hook to access CompanyContext
export const useCompany = () => useContext(CompanyContext);

// Export default component (optional as it doesn't render anything)
const CompanyContextPage = () => null;
export default CompanyContextPage;
