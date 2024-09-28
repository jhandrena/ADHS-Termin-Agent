import React, { createContext, useContext, useState } from 'react';
import { Doctor, searchDoctors } from '../utils/doctor-appointment-utils';

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
  fetchDoctors: () => Promise<void>;
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
  const [state, setState] = useState<DoctorAppointmentState>({
    step: 1,
    location: "",
    specialty: "",
    doctors: [],
    selectedDoctors: [],
    emailContent: "",
    patientName: "",
    diagnosis: "",
    preferredContact: "all",
    isLoading: false,
    emailStatus: null,
    fetchDoctors: async () => {
      setState(prev => ({ ...prev, isLoading: true, doctors: [], selectedDoctors: [] }));
      try {
        const doctors = await searchDoctors(state.location, state.specialty);
        setState(prev => ({ ...prev, doctors, isLoading: false }));
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
  });

  return (
    <DoctorAppointmentContext.Provider value={{ state, setState }}>
      {children}
    </DoctorAppointmentContext.Provider>
  );
};
