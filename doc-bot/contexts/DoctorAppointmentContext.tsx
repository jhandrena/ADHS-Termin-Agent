import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor, searchDoctors, triggerDoctorsSearch } from '../utils/doctor-appointment-utils';
import Cookies from 'js-cookie';


interface DoctorAppointmentState {
  step: number;
  location: string;
  specialty: string;
  doctors: Doctor[];
  selectedDoctors: Doctor[];
  emailContent: string;
  patientName: string;
  patientEmail: string;
  diagnosis: string;
  preferredContact: string;
  isLoading: boolean;
  emailStatus: { success: boolean; message: string } | null;
  fetchDoctors: (location: string, specialty: string) => Promise<void>;
}

interface DoctorAppointmentContextType {
  state: DoctorAppointmentState;
  setState: React.Dispatch<React.SetStateAction<DoctorAppointmentState>>;
}

const DoctorAppointmentContext = createContext<DoctorAppointmentContextType | undefined>(undefined);

export const useDoctorAppointment = () => {
  const context = useContext(DoctorAppointmentContext);
  if (!context) {
    throw new Error('useDoctorAppointment must be used within a DoctorAppointmentProvider');
  }
  return context;
};

export const DoctorAppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DoctorAppointmentState>(() => {
    const savedState = Cookies.get('patientInfo');
    const initialState = {
      step: 1,
      location: "",
      specialty: "",
      doctors: [],
      selectedDoctors: [],
      emailContent: "",
      patientName: "",
      patientEmail: "",
      diagnosis: "",
      preferredContact: "all",
      isLoading: false,
      emailStatus: null,
      fetchDoctors: async (location: string, specialty: string) => {
        try {
          await triggerDoctorsSearch(location, specialty);
          const doctors = await searchDoctors(location, specialty);
          
          setState(prev => ({ ...prev, doctors, selectedDoctors: [] }));
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      },
    };

    return savedState ? { ...initialState, ...JSON.parse(savedState) } : initialState;
  });

  useEffect(() => {
    Cookies.set('patientInfo', JSON.stringify({
      patientName: state.patientName,
      patientEmail: state.patientEmail,
      preferredContact: state.preferredContact,
      location: state.location,
    }), { expires: 30 }); // Cookie expires in 30 days
  }, [state.patientName, state.patientEmail, state.preferredContact, state.location]);

  return (
    <DoctorAppointmentContext.Provider value={{ state, setState }}>
      {children}
    </DoctorAppointmentContext.Provider>
  );
};
