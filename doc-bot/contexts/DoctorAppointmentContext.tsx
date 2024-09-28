import React, { createContext, useContext, useState } from 'react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

interface DoctorAppointmentState {
  step: number;
  location: string;
  specialty: string;
  doctors: Doctor[];
  selectedDoctors: Doctor[];
  emailContent: string;
  patientName: string;
  diagnosis: string;
  preferredContact: string;
  isLoading: boolean;
  emailStatus: { success: boolean; message: string } | null;
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
  });

  return (
    <DoctorAppointmentContext.Provider value={{ state, setState }}>
      {children}
    </DoctorAppointmentContext.Provider>
  );
};
