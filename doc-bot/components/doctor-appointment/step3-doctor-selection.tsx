'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MailIcon, PhoneIcon, GlobeIcon } from 'lucide-react'

interface Doctor {
  id: number
  name: string
  specialty: string
  email: string
  phone: string
  address: string
  website: string
}

interface Step3Props {
  doctors: Doctor[]
  selectedDoctors: Doctor[]
  preferredContact: string
  onDoctorSelection: (doctor: Doctor) => void
  onPreferredContactChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}

export function Step3DoctorSelection({ 
  doctors, 
  selectedDoctors, 
  preferredContact, 
  onDoctorSelection, 
  onPreferredContactChange, 
  onNext, 
  onBack 
}: Step3Props) {
  const toggleAllDoctors = () => {
    if (selectedDoctors.length === doctors.length) {
      selectedDoctors.forEach(doctor => onDoctorSelection(doctor))
    } else {
      doctors.forEach(doctor => {
        if (!selectedDoctors.some(d => d.id === doctor.id)) {
          onDoctorSelection(doctor)
        }
      })
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    if (preferredContact === 'all') return true;
    if (preferredContact === 'email') return doctor.email;
    if (preferredContact === 'phone') return doctor.phone;
    if (preferredContact === 'website') return doctor.website;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={toggleAllDoctors}>
          {selectedDoctors.length === doctors.length ? "Alle abwählen" : "Alle auswählen"}
        </Button>
        <Select
          value={preferredContact}
          onValueChange={onPreferredContactChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Bevorzugter Kontakt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kontaktmöglichkeiten</SelectItem>
            <SelectItem value="email">E-Mail</SelectItem>
            <SelectItem value="phone">Telefon</SelectItem>
            <SelectItem value="website">Website</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">Wählen Sie die Ärzte aus, die Sie kontaktieren möchten:</p>
      {filteredDoctors.map((doctor) => (
        <Card key={doctor.id} className="cursor-pointer">
          <CardHeader className="flex flex-row items-center space-x-4 py-2">
            <Checkbox
              checked={selectedDoctors.some(d => d.id === doctor.id)}
              onCheckedChange={() => onDoctorSelection(doctor)}
            />
            <div className="flex-grow">
              <CardTitle>{doctor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              <p className="text-sm text-muted-foreground">{doctor.address}</p>
            </div>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={`tel:${doctor.phone}`} className="text-primary hover:text-primary-foreground">
                      <PhoneIcon className="w-4 h-4" />
                      <span className="sr-only">Anrufen</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Anrufen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={`mailto:${doctor.email}`} className="text-primary hover:text-primary-foreground">
                      <MailIcon className="w-4 h-4" />
                      <span className="sr-only">E-Mail senden</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>E-Mail senden</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-foreground">
                      <GlobeIcon className="w-4 h-4" />
                      <span className="sr-only">Website besuchen</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Website besuchen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
        </Card>
      ))}
      <div className="flex justify-between">
        <Button onClick={onBack}>Zurück</Button>
        <Button onClick={onNext} disabled={selectedDoctors.length === 0}>
          Weiter
        </Button>
      </div>
    </div>
  )
}
