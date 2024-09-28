'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Step1LocationSpecialty } from './doctor-appointment/step1-location-specialty'
import { Step2PatientInfo } from './doctor-appointment/step2-patient-info'
import { Step3DoctorSelection } from './doctor-appointment/step3-doctor-selection'
import { Step4EmailCompose } from './doctor-appointment/step4-email-compose'
import { Step5Confirmation } from './doctor-appointment/step5-confirmation'
import { searchDoctors, generateEmailContent, sendEmails } from '../utils/doctor-appointment-utils'

export function DoctorAppointment() {
  const [state, setState] = useState({
    step: 1,
    location: "",
    specialty: "",
    doctors: [],
    selectedDoctors: [],
    emailContent: "",
    patientName: "",
    patientEmail: "",
    preferredContact: "all",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)

  const handleNext = async () => {
    if (state.step === 1) {
      setIsLoading(true)
      try {
        const doctors = await searchDoctors()
        setState(prev => ({ ...prev, step: 2, doctors }))
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setIsLoading(false)
      }
    } else if (state.step === 2) {
      setState(prev => ({ ...prev, step: 3 }))
    } else if (state.step === 3) {
      setIsLoading(true)
      try {
        const emailContent = await generateEmailContent(
          state.selectedDoctors,
          state.patientName,
          state.patientEmail,
          state.specialty
        )
        setState(prev => ({ ...prev, step: prev.step + 1, emailContent }))
      } catch (error) {
        console.error("Error generating email content:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setState(prev => ({ ...prev, step: prev.step + 1 }))
    }
  }

  const handleBack = () => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }))
  }

  const handleStepChange = (step) => {
    if (step <= state.step) {
      setState(prev => ({ ...prev, step }))
    }
  }

  const handleSendEmails = async () => {
    setIsLoading(true)
    try {
      const result = await sendEmails(state.selectedDoctors, state.emailContent)
      setEmailStatus(result)
      if (result.success) {
        setState(prev => ({ ...prev, step: prev.step + 1 }))
      }
    } catch (error) {
      console.error("Error sending emails:", error)
      setEmailStatus({ success: false, message: "Failed to send emails. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <Step1LocationSpecialty
            location={state.location}
            specialty={state.specialty}
            onLocationChange={(location) => setState(prev => ({ ...prev, location }))}
            onSpecialtyChange={(specialty) => setState(prev => ({ ...prev, specialty }))}
            onNext={handleNext}
            isLoading={isLoading}
          />
        )
      case 2:
        return (
          <Step2PatientInfo
            patientName={state.patientName}
            patientEmail={state.patientEmail}
            onPatientNameChange={(patientName) => setState(prev => ({ ...prev, patientName }))}
            onPatientEmailChange={(patientEmail) => setState(prev => ({ ...prev, patientEmail }))}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <Step3DoctorSelection
            doctors={state.doctors}
            selectedDoctors={state.selectedDoctors}
            preferredContact={state.preferredContact}
            onDoctorSelection={(doctor) => {
              setState(prev => {
                const isSelected = prev.selectedDoctors.some(d => d.id === doctor.id)
                const newSelectedDoctors = isSelected
                  ? prev.selectedDoctors.filter(d => d.id !== doctor.id)
                  : [...prev.selectedDoctors, doctor]
                return { ...prev, selectedDoctors: newSelectedDoctors }
              })
            }}
            onPreferredContactChange={(preferredContact) => setState(prev => ({ ...prev, preferredContact }))}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 4:
        return (
          <Step4EmailCompose
            emailContent={state.emailContent}
            onEmailContentChange={(emailContent) => setState(prev => ({ ...prev, emailContent }))}
            onSendEmails={handleSendEmails}
            onBack={handleBack}
            isLoading={isLoading}
            emailStatus={emailStatus}
          />
        )
      case 5:
        return (
          <Step5Confirmation
            location={state.location}
            specialty={state.specialty}
            selectedDoctors={state.selectedDoctors}
            onRestart={() => setState({
              step: 1,
              location: "",
              specialty: "",
              doctors: [],
              selectedDoctors: [],
              emailContent: "",
              patientName: "",
              patientEmail: "",
              preferredContact: "all",
            })}
          />
        )
    }
  }

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
  )
}
