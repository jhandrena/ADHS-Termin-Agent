'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { MapPinIcon, Loader2 } from 'lucide-react'
import { specialties } from '@/app/constants'
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { LocationHelper } from '@/utils/location-helper'

// Fuzzy search function
const fuzzySearch = (query: string, text: string) => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (queryLower[queryIndex] === textLower[i]) {
      queryIndex++;
    }
  }
  return queryIndex === queryLower.length;
};

export function Step1LocationSpecialty() {
  const { state, setState } = useDoctorAppointment();
  const { location, specialty, isLoading } = state;
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const filteredSpecialties = useMemo(() => {
    if (!specialty) return specialties;
    return specialties.filter(s => fuzzySearch(specialty, s));
  }, [specialty]);

  const onLocationChange = (newLocation: string) => {
    setState(prev => ({ ...prev, location: newLocation }));
  };

  const onSpecialtyChange = (newSpecialty: string) => {
    setState(prev => ({ ...prev, specialty: newSpecialty }));
  };

  const useCurrentLocation = async () => {
    setGeoError(null);
    setIsLoadingLocation(true);
    try {
      const { location, error } = await LocationHelper.useCurrentLocation();
      if (error) {
        setGeoError(error);
      } else {
        onLocationChange(location);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleNext = async () => {
    if (location && specialty) {
      setState(prev => ({ 
        ...prev, 
        location: location,
        specialty: specialty,
        step: prev.step + 1,
        isLoading: true
      }));
      await state.fetchDoctors(location, specialty);
      setState(prev => ({ ...prev, isLoading: false }));
    }
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
        <Button 
          onClick={useCurrentLocation} 
          variant="outline" 
          className="flex items-center"
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MapPinIcon className="w-4 h-4 mr-2" />
          )}
          Aktueller Standort
        </Button>
      </div>
      {geoError && <p className="text-red-500 text-sm">{geoError}</p>}
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
