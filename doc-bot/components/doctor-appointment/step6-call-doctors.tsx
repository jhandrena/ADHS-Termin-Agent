'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PhoneIcon, Bot } from 'lucide-react'
import { isMobileDevice } from '@/utils/device-detection'
import { QRCodeDialog } from '@/components/qr-code-dialog'
import { Input } from "@/components/ui/input"

export function Step6CallDoctors() {
  const { state } = useDoctorAppointment();
  
  const [qrCodeOpen, setQRCodeOpen] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState<typeof selectedDoctors>([]);

  const fetchAvailableDoctors = async () => {
    try {
      const [date, time] = dateTime.split('T');
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}.${month}.${year}`;
      const response = await fetch(`http://127.0.0.1:5000/doctors/phone?date=${encodeURIComponent(formattedDate)}&time=${encodeURIComponent(time)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch available doctors');
      }
      const data = await response.json();
      setAvailableDoctors(data);
    } catch (error) {
      console.error('Error fetching available doctors:', error);
    }
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
    setAvailableDoctors([]); // Clear previous results
  };

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
      <div className="space-y-2">
        <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">
          Wählen Sie Datum und Uhrzeit für den Anruf:
        </label>
        <Input
          type="datetime-local"
          id="dateTime"
          value={dateTime}
          onChange={handleDateTimeChange}
          className="block w-full"
        />
      </div>
      {dateTime && (
        <Button onClick={fetchAvailableDoctors} className="w-full">
          Verfügbare Ärzte anzeigen
        </Button>
      )}
      {availableDoctors.map(doctor => (
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
