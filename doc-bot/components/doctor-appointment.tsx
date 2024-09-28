'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Step1LocationSpecialty } from './doctor-appointment/step1-location-specialty'
import { Step2PatientInfo } from './doctor-appointment/step2-patient-info'
import { Step3DoctorSelection } from './doctor-appointment/step3-doctor-selection'

import { DoctorAppointmentProvider, useDoctorAppointment } from '../contexts/DoctorAppointmentContext'
import { Step4Email } from "./doctor-appointment/step4-email-compose"
import { Step5EmailConfirmation } from "./doctor-appointment/step5-confirmation"
import { Step6CallDoctors } from "./doctor-appointment/step6-call-doctors"

function DoctorAppointmentContent() {
  const { state, setState } = useDoctorAppointment();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <Step1LocationSpecialty />;
      case 2:
        return <Step2PatientInfo />;
      case 3:
        return <Step3DoctorSelection />;
      case 4:
        return <Step4Email />;
      case 5:
        return <Step5EmailConfirmation />;
      case 6:
        return <Step6CallDoctors />;
      case 7:
        return <Step7AICall />;
      default:
        return null;
    }
  };

  const handleBreadcrumbClick = (step: number) => {
    if (step <= state.step || (step === 2 && state.location && state.specialty) || 
        (step === 3 && state.patientName && state.diagnosis) || 
        (step === 4 && state.selectedDoctors.length > 0) || 
        (step === 5 && state.emailStatus?.success)) {
      setState(prev => ({ ...prev, step }));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => handleBreadcrumbClick(1)}
              className={`${state.step >= 1 ? "font-bold" : ""} cursor-pointer`}
            >
              Ort & Fachrichtung
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => handleBreadcrumbClick(2)}
              className={`${state.step >= 2 ? "font-bold" : ""} ${(state.step >= 2 || (state.location && state.specialty)) ? "cursor-pointer" : "cursor-default"}`}
            >
              Patienteninfo
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => handleBreadcrumbClick(3)}
              className={`${state.step >= 3 ? "font-bold" : ""} ${(state.step >= 3 || (state.patientName && state.diagnosis)) ? "cursor-pointer" : "cursor-default"}`}
            >
              Arztauswahl
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => handleBreadcrumbClick(4)}
              className={`${state.step >= 4 ? "font-bold" : ""} ${(state.step >= 4 || state.selectedDoctors.length > 0) ? "cursor-pointer" : "cursor-default"}`}
            >
              E-Mail verfassen
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => handleBreadcrumbClick(5)}
              className={`${state.step >= 5 ? "font-bold" : ""} ${(state.step >= 5 || state.emailStatus?.success) ? "cursor-pointer" : "cursor-default"}`}
            >
              Bestätigung
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => handleBreadcrumbClick(6)}
              className={`${state.step >= 6 ? "font-bold" : ""} ${state.step >= 6 ? "cursor-pointer" : "cursor-default"}`}
            >
              Anrufen
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => handleBreadcrumbClick(7)}
              className={`${state.step === 7 ? "font-bold" : ""} ${state.step === 7 ? "cursor-pointer" : "cursor-default"}`}
            >
              AI Anruf
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
