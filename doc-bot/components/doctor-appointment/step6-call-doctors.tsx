'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PhoneIcon, Bot } from 'lucide-react'
import { isMobileDevice } from '@/utils/device-detection'
import { QRCodeDialog } from '@/components/qr-code-dialog'

export function Step6CallDoctors() {
  const { state } = useDoctorAppointment();
  const { selectedDoctors } = state;
  const [qrCodeOpen, setQRCodeOpen] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  const handleCall = (phone: string) => {
    if (isMobileDevice()) {
      window.location.href = `tel:${phone}`;
    } else {
      setCurrentPhone(phone);
      setQRCodeOpen(true);
    }
  };

  const handleAICall = (doctorId: string) => {
    // Implement AI call functionality here
    console.log(`AI call to doctor ${doctorId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ärzte anrufen</h2>
      {selectedDoctors.map(doctor => (
        <Card key={doctor.id} className="mb-4">
          <CardHeader>
            <CardTitle>{doctor.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Button onClick={() => handleCall(doctor.phone)} className="flex items-center">
              <PhoneIcon className="w-4 h-4 mr-2" />
              Anrufen
            </Button>
            <Button onClick={() => handleAICall(doctor.id)} className="flex items-center">
              <Bot className="w-4 h-4 mr-2" />
              AI Anruf
            </Button>
          </CardContent>
        </Card>
      ))}
      <QRCodeDialog
        open={qrCodeOpen}
        onOpenChange={setQRCodeOpen}
        phoneNumber={currentPhone}
      />
    </div>
  );
}
