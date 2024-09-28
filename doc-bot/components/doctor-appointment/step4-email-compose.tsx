'use client'

import { Button } from "@/components/ui/button"
import { MailIcon, PhoneIcon } from 'lucide-react'
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { generateEmailContent } from '@/utils/doctor-appointment-utils'

export function Step4Email() {
  const { state, setState } = useDoctorAppointment();
  const { selectedDoctors, patientName, patientEmail, diagnosis } = state;

  const handleOpenMailClient = async () => {
    const emailContent = await generateEmailContent(patientName, patientEmail, diagnosis);
    const subject = encodeURIComponent(`Terminanfrage für ${diagnosis}`);
    const body = encodeURIComponent(emailContent);
    const bcc = selectedDoctors.map(doctor => doctor.email).join(',');
    const mailtoLink = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleSkipToCall = () => {
    setState(prev => ({ ...prev, step: 6 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Wählen Sie eine Option:</p>
      <Button 
        onClick={handleOpenMailClient} 
        className="w-full h-20 text-lg flex items-center justify-center"
      >
        <MailIcon className="w-6 h-6 mr-2" />
        E-Mail-Programm öffnen
      </Button>
      <Button 
        onClick={handleSkipToCall} 
        className="w-full h-20 text-lg flex items-center justify-center"
        variant="outline"
      >
        <PhoneIcon className="w-6 h-6 mr-2" />
        Direkt zum Anrufen
      </Button>
      <div className="flex justify-between">
        <Button onClick={handleBack}>Zurück</Button>
      </div>
    </div>
  );
}
