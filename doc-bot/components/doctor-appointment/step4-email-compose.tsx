'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MailIcon } from 'lucide-react'
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { sendEmails } from '@/utils/doctor-appointment-utils'

export function Step4EmailCompose() {
  const { state, setState } = useDoctorAppointment();
  const { emailContent, isLoading, emailStatus, selectedDoctors } = state;

  const onEmailContentChange = (content: string) => {
    setState(prev => ({ ...prev, emailContent: content }));
  };

  const handleSendEmails = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await sendEmails(selectedDoctors, emailContent);
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

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Überprüfen und bearbeiten Sie die E-Mail an die ausgewählten Ärzte:</p>
      <Textarea
        placeholder="Ihre Nachricht an die Ärzte..."
        value={emailContent}
        onChange={(e) => onEmailContentChange(e.target.value)}
        rows={10}
      />
      {emailStatus && (
        <p className={emailStatus.success ? "text-green-600" : "text-red-600"}>
          {emailStatus.message}
        </p>
      )}
      <div className="flex justify-between">
        <Button onClick={handleBack}>Zurück</Button>
        <Button 
          onClick={handleSendEmails} 
          disabled={!emailContent || isLoading}
          className="flex items-center"
        >
          <MailIcon className="w-4 h-4 mr-2" />
          {isLoading ? "Sende E-Mails..." : "E-Mails senden"}
        </Button>
      </div>
    </div>
  );
}
