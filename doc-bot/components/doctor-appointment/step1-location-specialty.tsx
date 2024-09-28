'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { MapPinIcon } from 'lucide-react'
import { specialties } from '@/app/constants'
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'

export function Step1LocationSpecialty() {
  const { state, setState } = useDoctorAppointment();
  const { location, specialty, isLoading } = state;
  const [filteredSpecialties, setFilteredSpecialties] = useState(specialties);

  useEffect(() => {
    if (specialty) {
      setFilteredSpecialties(
        specialties.filter(s =>
          s.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    } else {
      setFilteredSpecialties(specialties);
    }
  }, [specialty]);

  const onLocationChange = (newLocation: string) => {
    setState(prev => ({ ...prev, location: newLocation }));
  };

  const onSpecialtyChange = (newSpecialty: string) => {
    setState(prev => ({ ...prev, specialty: newSpecialty }));
  };

  const useCurrentLocation = () => {
    onLocationChange("Berlin");
  };


  const handleNext = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="z.B. Berlin, München, Hamburg"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={useCurrentLocation} variant="outline" className="flex items-center">
          <MapPinIcon className="w-4 h-4 mr-2" />
          Aktueller Standort
        </Button>
      </div>
      <div className="relative">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Suche nach Fachrichtungen..."
            value={specialty}
            onValueChange={onSpecialtyChange}
          />
          <CommandList>
            <CommandEmpty>Keine Fachrichtungen gefunden.</CommandEmpty>
            <CommandGroup>
              {filteredSpecialties.map((s) => (
                <CommandItem
                  key={s}
                  onSelect={() => onSpecialtyChange(s)}
                >
                  {s}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <Button onClick={handleNext} disabled={!location || !specialty || isLoading}>
        {isLoading ? "Suche Ärzte..." : "Weiter"}
      </Button>
    </div>
  );
}
