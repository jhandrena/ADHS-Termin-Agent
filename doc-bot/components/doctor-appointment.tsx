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
import React from "react"

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
          {[
            { step: 1, label: "Ort & Fachrichtung", condition: true },
            { step: 2, label: "Patienteninfo", condition: state.step >= 2 || (state.location && state.specialty) },
            { step: 3, label: "Arztauswahl", condition: state.step >= 3 || (state.patientName && state.diagnosis) },
            { step: 4, label: "E-Mail verfassen", condition: state.step >= 4 && state.selectedDoctors.length > 0 },
            { step: 5, label: "Bestätigung", condition: state.step >= 5 && state.emailStatus?.success },
            { step: 6, label: "Anrufen", condition: state.step >= 6 || (state.step >= 3 && state.selectedDoctors.length === 0) },
            { step: 7, label: "AI Anruf", condition: state.step === 7 },
          ].map((item, index) => (
            item.condition ? (
              <React.Fragment key={item.step}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => handleBreadcrumbClick(item.step)}
                    className={`${state.step >= item.step ? "font-bold" : ""} cursor-pointer`}
                  >
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ) : null
          ))}
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
