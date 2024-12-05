// pages/Context/CompanyContext.js
import React, { createContext, useContext, useState } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState({
    companyName: '',
    companyAddress: '',
    companyContact: '',
  });

  const updateCompany = (newData) => {
    setCompany((prevCompany) => ({ ...prevCompany, ...newData }));
  };

  // Function to delete company (reset to empty values)
  const deleteCompany = () => {
    setCompany({
      companyName: '',
      companyAddress: '',
      companyContact: '',
    });
  };

  return (
    <CompanyContext.Provider value={{ company, updateCompany, deleteCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);

// Default export as a dummy component to prevent Next.js page-related error
const CompanyContextPage = () => null;
export default CompanyContextPage;
