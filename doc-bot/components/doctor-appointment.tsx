'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Step1LocationSpecialty } from './doctor-appointment/step1-location-specialty'
import { Step2PatientInfo } from './doctor-appointment/step2-patient-info'
import { Step3DoctorSelection } from './doctor-appointment/step3-doctor-selection'
import { Step4EmailCompose } from './doctor-appointment/step4-email-compose'
import { Step5Confirmation } from './doctor-appointment/step5-confirmation'
import { searchDoctors, generateEmailContent, sendEmails } from '../utils/doctor-appointment-utils'
import { DoctorAppointmentProvider, useDoctorAppointment } from '../contexts/DoctorAppointmentContext'

function DoctorAppointmentContent() {
  const { state, setState } = useDoctorAppointment();

  const handleNext = async () => {
    if (state.step === 1) {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const doctors = await searchDoctors(state.location, state.specialty);
        setState(prev => ({ ...prev, step: 2, doctors, isLoading: false }));
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else if (state.step === 2) {
      setState(prev => ({ ...prev, step: 3 }));
    } else if (state.step === 3) {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const emailContent = await generateEmailContent(
          state.selectedDoctors,
          state.patientName,
          state.patientEmail,
          state.specialty
        );
        setState(prev => ({ ...prev, step: prev.step + 1, emailContent, isLoading: false }));
      } catch (error) {
        console.error("Error generating email content:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const handleStepChange = (step: number) => {
    if (step <= state.step) {
      setState(prev => ({ ...prev, step }));
    }
  };

  const handleSendEmails = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await sendEmails(state.selectedDoctors, state.emailContent);
      setState(prev => ({ 
        ...prev, 
        emailStatus: result, 
        step: result.success ? prev.step + 1 : prev.step,
        isLoading: false 
      }));
    } catch (error) {
      console.error("Error sending emails:", error);
      setState(prev => ({ 
        ...prev, 
        emailStatus: { success: false, message: "Failed to send emails. Please try again." },
        isLoading: false 
      }));
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <Step1LocationSpecialty />;
      case 2:
        return <Step2PatientInfo />;
      case 3:
        return state.doctors.length > 0 ? (
          <Step3DoctorSelection />
        ) : (
          <div>Loading doctors...</div>
        );
      case 4:
        return <Step4EmailCompose />;
      case 5:
        return <Step5Confirmation />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(1)} className={state.step >= 1 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              Ort & Fachrichtung
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(2)} className={state.step >= 2 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              Patienteninfo
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(3)} className={state.step >= 3 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              Arztauswahl
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(4)} className={state.step >= 4 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              E-Mail verfassen
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(5)} className={state.step === 5 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              Bestätigung
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Facharzt-Termin anfragen</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </div>
  );
}

export function DoctorAppointment() {
  return (
    <DoctorAppointmentProvider>
      <DoctorAppointmentContent />
    </DoctorAppointmentProvider>
  );
}
