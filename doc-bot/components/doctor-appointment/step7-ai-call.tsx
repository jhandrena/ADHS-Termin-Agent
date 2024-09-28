'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function Step7AICall() {
  const { state, setState } = useDoctorAppointment();
  const [aiCallInProgress, setAiCallInProgress] = useState(false);
  const [aiCallCompleted, setAiCallCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (aiCallInProgress) {
      timer = setTimeout(() => {
        setAiCallInProgress(false);
        setAiCallCompleted(true);
      }, 30000);
    }
    return () => clearTimeout(timer);
  }, [aiCallInProgress]);

  const handleAICall = () => {
    setAiCallInProgress(true);
    window.open(`http://localhost:3006/?name=${encodeURIComponent(state.patientName)}&thema=${encodeURIComponent(state.diagnosis)}&specialty=${encodeURIComponent(state.specialty)}`, '_blank');
  };

  if (aiCallInProgress) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="text-lg font-semibold">KI-Assistent führt den Anruf durch...</p>
      </div>
    );
  }

  if (aiCallCompleted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-bold">AI-Anruf abgeschlossen!</h2>
        <p className="text-lg">Der KI-Assistent hat den Anruf erfolgreich durchgeführt.</p>
        <Button onClick={() => setState(prev => ({ ...prev, step: 1 }))}>
          Neuen Termin vereinbaren
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">KI-Assistent Anruf</h2>
      <p>Klicken Sie auf den Button unten, um den KI-Assistenten einen Anruf für Sie tätigen zu lassen.</p>
      <Button onClick={handleAICall} className="w-full">
        KI-Anruf starten
      </Button>
    </div>
  );
}
