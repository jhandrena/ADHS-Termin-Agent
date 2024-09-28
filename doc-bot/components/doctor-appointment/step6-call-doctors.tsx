'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PhoneIcon, Bot, Loader2, CheckCircle2 } from 'lucide-react'
import { isMobileDevice } from '@/utils/device-detection'
import { QRCodeDialog } from '@/components/qr-code-dialog'
import { Input } from "@/components/ui/input"

export function Step6CallDoctors() {
  const { state, setState } = useDoctorAppointment();
  
  const [qrCodeOpen, setQRCodeOpen] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  const getNextWorkday = () => {
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    return nextDay;
  };
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [availableDoctors, setAvailableDoctors] = useState<typeof state.selectedDoctors>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const fetchAvailableDoctors = async () => {
    setIsLoading(true);
    setError(null);
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
      setError('Fehler beim Abrufen der verfügbaren Ärzte. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
    setAvailableDoctors([]);
    setError(null);
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
    setAiCallInProgress(true);
    // Implement AI call functionality here
    console.log(`AI call to doctor ${doctorId}`);

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
    const selectedDoctor = availableDoctors[0]; // Use the first available doctor for this example
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-bold">Termin bestätigt!</h2>
        <p className="text-lg">Ein Termin wurde erfolgreich für Sie vereinbart.</p>
        <div className="text-left">
          <p><strong>Arzt:</strong> {selectedDoctor?.name || 'Name nicht verfügbar'}</p>
          <p><strong>Datum:</strong> {dateTime ? new Date(dateTime).toLocaleDateString() : 'Datum nicht verfügbar'}</p>
          <p><strong>Uhrzeit:</strong> {dateTime ? new Date(dateTime).toLocaleTimeString() : 'Uhrzeit nicht verfügbar'}</p>
        </div>
      </div>
    );
  }

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
        <Button onClick={fetchAvailableDoctors} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ärzte werden geladen...
            </>
          ) : (
            'Verfügbare Ärzte anzeigen'
          )}
        </Button>
      )}
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
      {!isLoading && availableDoctors.length === 0 && dateTime && !error && (
        <div className="text-gray-500 mt-2">
          <p>Keine verfügbaren Ärzte gefunden.</p>
          <p className="text-sm mt-1">Tipp: Versuchen Sie es mit einem späteren Datum, um mehr Ergebnisse zu erhalten.</p>
          <Button
            onClick={() => {
              const nextWorkday = getNextWorkday();
              nextWorkday.setHours(13, 0, 0, 0);
              setDateTime(nextWorkday.toISOString().slice(0, 16));
            }}
            className="mt-2"
          >
            Nächsten Werktag um 13 Uhr auswählen
          </Button>
        </div>
      )}
      {availableDoctors.map(doctor => (
        <Card key={doctor.id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{doctor.name}</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Button onClick={() => handleCall(doctor.telefon)} className="flex items-center">
              <PhoneIcon className="w-4 h-4 mr-2" />
              Anrufen
            </Button>
            <Button 
              onClick={() => handleAICall(doctor.id)} 
              className="flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Bot className="w-4 h-4 mr-2" />
              )}
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
