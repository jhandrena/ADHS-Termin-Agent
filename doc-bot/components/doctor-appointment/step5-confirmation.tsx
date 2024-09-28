'use client'

import { Button } from "@/components/ui/button"
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'

export function Step5EmailConfirmation() {
  const { state, setState } = useDoctorAppointment();
  const { location, specialty, selectedDoctors } = state;

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
      <Button onClick={handleRestart}>
        Neue Anfrage starten
      </Button>
    </div>
  );
}
