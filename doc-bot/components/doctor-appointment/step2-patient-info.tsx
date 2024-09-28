'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { Loader2 } from 'lucide-react'

export function Step2PatientInfo() {
  const { state, setState } = useDoctorAppointment();
  const { patientName, patientEmail, isLoading } = state;
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleNext = () => {
    if (!validateEmail(patientEmail)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    setEmailError("");
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p>Ärzte werden geladen...</p>
        </div>
      ) : state.doctors.length > 0 ? (
        <p className="text-sm text-muted-foreground italic">Ärzte wurden erfolgreich geladen.</p>
      ) : null}
      <p className="text-sm italic">
        Bitte geben Sie Ihren Namen und die Diagnose ein um fortzufahren.
      </p>
      <div className="space-y-2">
        <Label htmlFor="patientName">Name</Label>
        <Input
          id="patientName"
          placeholder="z.B. Max Mustermann"
          value={patientName}
          onChange={(e) => setState(prev => ({ ...prev, patientName: e.target.value }))}
          autoComplete="name"
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
            setState(prev => ({ ...prev, patientEmail: e.target.value }));
            setEmailError("");
          }}
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>
      <div className="flex justify-between">
        <Button onClick={handleBack}>Zurück</Button>
        <Button 
          onClick={handleNext} 
          disabled={!patientName || !patientEmail}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
}
