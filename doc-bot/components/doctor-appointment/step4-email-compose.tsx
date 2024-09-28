'use client'

import { Button } from "@/components/ui/button"
import { MailIcon } from 'lucide-react'
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { generateEmailContent } from '@/utils/doctor-appointment-utils'

export function Step4Email() {
  const { state, setState } = useDoctorAppointment();
  const { selectedDoctors, patientName, patientEmail, specialty } = state;

  const handleOpenMailClient = async () => {
    
    const emailContent = await generateEmailContent(patientName, patientEmail, specialty);
    const subject = encodeURIComponent(`Terminanfrage für ${specialty}`);
    const body = encodeURIComponent(emailContent);
    const bcc = selectedDoctors.map(doctor => doctor.email).join(',');
    const mailtoLink = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Klicken Sie auf den Button, um Ihre E-Mail-Anwendung zu öffnen und die Ärzte zu kontaktieren:</p>
      <Button 
        onClick={handleOpenMailClient} 
        className="w-full h-20 text-lg flex items-center justify-center"
      >
        <MailIcon className="w-6 h-6 mr-2" />
        E-Mail-Programm öffnen
      </Button>
      <div className="flex justify-between">
        <Button onClick={handleBack}>Zurück</Button>
      </div>
    </div>
  );
}
