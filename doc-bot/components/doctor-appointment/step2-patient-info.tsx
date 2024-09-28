'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Step2Props {
  patientName: string
  patientEmail: string
  onPatientNameChange: (name: string) => void
  onPatientEmailChange: (email: string) => void
  onNext: () => void
  onBack: () => void
}

export function Step2PatientInfo({ patientName, patientEmail, onPatientNameChange, onPatientEmailChange, onNext, onBack }: Step2Props) {
  const [emailError, setEmailError] = useState("")

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  const handleNext = () => {
    if (!validateEmail(patientEmail)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein.")
      return
    }
    setEmailError("")
    onNext()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientName">Name</Label>
        <Input
          id="patientName"
          placeholder="z.B. Max Mustermann"
          value={patientName}
          onChange={(e) => onPatientNameChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patientEmail">E-Mail Adresse</Label>
        <Input
          id="patientEmail"
          type="email"
          placeholder="z.B. max.mustermann@example.com"
          value={patientEmail}
          onChange={(e) => {
            onPatientEmailChange(e.target.value)
            setEmailError("")
          }}
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>
      <div className="flex justify-between">
        <Button onClick={onBack}>Zurück</Button>
        <Button 
          onClick={handleNext} 
          disabled={!patientName || !patientEmail}
        >
          Weiter
        </Button>
      </div>
    </div>
  )
}
