import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../../Lib/supabase';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState({
    companyName: '',
    companyAddress: '',
    companyContact: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const { data, error } = await supabase.from('companies').select('*').single();
      if (error) {
        console.error('Error fetching company data:', error);
      } else if (data) {
        setCompany({
          companyName: data.company_name || '',
          companyAddress: data.company_address || '',
          companyContact: data.company_contact || '',
        });
      }
      setLoading(false);
    };
    fetchCompany();
  }, []);

  // Update company data in state and Supabase
  const updateCompany = async (newData) => {
    const updatedCompany = {
      company_name: newData.companyName,
      company_address: newData.companyAddress,
      company_contact: newData.companyContact,
    };
    const { error } = await supabase
      .from('companies')
      .update(updatedCompany)
      .eq('id', 1); // Replace `1` with a dynamic ID if applicable
    if (error) {
      console.error('Error updating company:', error);
    } else {
      setCompany((prevCompany) => ({ ...prevCompany, ...newData }));
    }
  };

  // Reset company data in state and delete it from Supabase
  const deleteCompany = async () => {
    const { error } = await supabase.from('companies').delete().eq('id', 1);
    if (error) {
      console.error('Error deleting company:', error);
    } else {
      setCompany({
        companyName: '',
        companyAddress: '',
        companyContact: '',
      });
    }
  };

  return (
    <CompanyContext.Provider value={{ company, updateCompany, deleteCompany, loading }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);

const CompanyContextPage = () => null;
export default CompanyContextPage;