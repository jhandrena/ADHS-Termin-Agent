'use client'

import { Button } from "@/components/ui/button"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'

export function Step5EmailConfirmation() {
  const { state } = useDoctorAppointment();
  const { location, specialty, selectedDoctors } = state;

  const handleTryCall = () => {
    if (selectedDoctors.length > 0) {
      window.location.href = `tel:${selectedDoctors[0].phone}`;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Bestätigung</h2>
      <p>Ihr E-Mail-Programm wurde geöffnet, um die ausgewählten Ärzte zu kontaktieren.</p>
      <p>Ort: {location}</p>
      <p>Fachrichtung: {specialty}</p>
      <p>Kontaktierte Ärzte:</p>
      <ul className="list-disc list-inside">
        {selectedDoctors.map(doctor => (
          <li key={doctor.id}>{doctor.name} - {doctor.specialty}</li>
        ))}
      </ul>
      <div className="space-y-2">
        <Button onClick={handleTryCall}>
          Versuchen Sie jetzt, einen Arzt anzurufen
        </Button>
      </div>
    </div>
  );
}
