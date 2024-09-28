'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { getNextCallableDoctor } from '@/utils/doctor-appointment-utils'

export function Step5EmailConfirmation() {
  const { state, setState } = useDoctorAppointment();
  const { location, specialty, selectedDoctors } = state;
  const [callableDoctor, setCallableDoctor] = useState(null);

  const handleRestart = () => {
    setState({
      step: 1,
      location: "",
      specialty: "",
      doctors: [],
      selectedDoctors: [],
      emailContent: "",
      patientName: "",
      patientEmail: "",
      diagnosis: "",
      preferredContact: "all",
      isLoading: false,
      emailStatus: null,
      fetchDoctors: state.fetchDoctors,
    });
  };

  const handleTryCall = async () => {
    const doctor = await getNextCallableDoctor(selectedDoctors);
    setCallableDoctor(doctor);
    if (doctor) {
      window.location.href = `tel:${doctor.phone}`;
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
        {callableDoctor && (
          <p className="text-sm text-muted-foreground">
            Anruf wird gestartet für: {callableDoctor.name}
          </p>
        )}
        {callableDoctor === null && (
          <p className="text-sm text-muted-foreground">
            Derzeit ist kein Arzt telefonisch erreichbar. Bitte versuchen Sie es später erneut.
          </p>
        )}
      </div>
      <Button onClick={handleRestart}>
        Neue Anfrage starten
      </Button>
    </div>
  );
}
