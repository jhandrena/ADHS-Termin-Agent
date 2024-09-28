'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function Step2PatientInfo() {
  const { state, setState } = useDoctorAppointment();
  const { patientName, patientEmail, diagnosis, isLoading } = state;
  const [emailTouched, setEmailTouched] = useState(false);

  const handleNext = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const isFormValid = patientName && isValidEmail(patientEmail) && diagnosis;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p>Ärzte werden im Hintergrund geladen...</p>
        </div>
      ) : <p className="text-sm text-muted-foreground italic">Ärzte wurden erfolgreich geladen.</p>
      }
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
        <Label htmlFor="patientEmail">E-Mail</Label>
        <Input
          id="patientEmail"
          type="email"
          placeholder="ihre.email@beispiel.de"
          value={patientEmail}
          onChange={(e) => setState(prev => ({ ...prev, patientEmail: e.target.value }))}
          onBlur={() => setEmailTouched(true)}
          autoComplete="email"
        />
        {emailTouched && patientEmail && !isValidEmail(patientEmail) && (
          <p className="text-sm text-red-500">Bitte geben Sie eine gültige E-Mail-Adresse ein.</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnose</Label>
        <Textarea
          id="diagnosis"
          placeholder="Diagnose auf der Überweisung"
          value={diagnosis}
          onChange={(e) => setState(prev => ({ ...prev, diagnosis: e.target.value }))}
          rows={4}
        />
      </div>
      <div className="flex justify-between">
        <Button onClick={handleBack}>Zurück</Button>
        <Button 
          onClick={handleNext} 
          disabled={!isFormValid}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
}
