'use client'

import { Button } from "@/components/ui/button"

interface Doctor {
  id: number
  name: string
  specialty: string
}

interface Step5Props {
  location: string
  specialty: string
  selectedDoctors: Doctor[]
  onRestart: () => void
}

export function Step5Confirmation({ location, specialty, selectedDoctors, onRestart }: Step5Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Bestätigung</h2>
      <p>Ihre E-Mails wurden erfolgreich gesendet.</p>
      <p>Ort: {location}</p>
      <p>Fachrichtung: {specialty}</p>
      <p>Kontaktierte Ärzte:</p>
      <ul className="list-disc list-inside">
        {selectedDoctors.map(doctor => (
          <li key={doctor.id}>{doctor.name} - {doctor.specialty}</li>
        ))}
      </ul>
      <Button onClick={onRestart}>
        Neue Anfrage starten
      </Button>
    </div>
  )
}
