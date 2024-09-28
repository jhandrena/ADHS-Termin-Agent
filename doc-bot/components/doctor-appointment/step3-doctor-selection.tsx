'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { MailIcon, PhoneIcon, GlobeIcon } from 'lucide-react'
import { useDoctorAppointment } from '@/contexts/DoctorAppointmentContext'
import { isMobileDevice } from '@/utils/device-detection'
import { QRCodeDialog } from '@/components/qr-code-dialog'

export function Step3DoctorSelection() {
  const { state, setState } = useDoctorAppointment();
  const { doctors, selectedDoctors, isLoading } = state;
  const [qrCodeOpen, setQRCodeOpen] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  const toggleAllDoctors = () => {
    if (selectedDoctors.length === doctors.length) {
      setState(prev => ({ ...prev, selectedDoctors: [] }));
    } else {
      setState(prev => ({ ...prev, selectedDoctors: [...doctors] }));
    }
  };

  const onDoctorSelection = (doctor) => {
    setState(prev => {
      const isSelected = prev.selectedDoctors.some(d => d.id === doctor.id);
      const newSelectedDoctors = isSelected
        ? prev.selectedDoctors.filter(d => d.id !== doctor.id)
        : [...prev.selectedDoctors, doctor];
      return { ...prev, selectedDoctors: newSelectedDoctors };
    });
  };

  const handleNext = () => {
    if (doctors.length > 0 && selectedDoctors.length > 0) {
      setState(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleCall = (phone: string) => {
    if (isMobileDevice()) {
      window.location.href = `tel:${phone}`;
    } else {
      setCurrentPhone(phone);
      setQRCodeOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      {doctors.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <Button onClick={toggleAllDoctors} disabled={isLoading}>
              {selectedDoctors.length === doctors.length ? "Alle abwählen" : "Alle auswählen"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Wählen Sie die Ärzte aus, die Sie kontaktieren möchten. <br/>Im nächsten Schritt werden wir hierzu eine E-Mail formulieren.</p>
        </>
      )}
      {!isLoading && doctors.length === 0 && (
        <p className="text-sm text-muted-foreground">Leider wurden keine Ärzte gefunden. Bitte versuchen Sie es mit einer anderen Suche.</p>
      )}
      {isLoading && doctors.length === 0 ? (
        Array(3).fill(0).map((_, index) => (
          <Card key={index} className="cursor-pointer">
            <CardHeader className="flex flex-row items-center space-x-4 py-2">
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex-grow">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </CardHeader>
          </Card>
        ))
      ) : doctors.length > 0 ? (
        doctors.map((doctor) => (
          <Card key={doctor.id} className="cursor-pointer">
            <CardHeader className="py-2">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedDoctors.some(d => d.id === doctor.id)}
                  onCheckedChange={() => onDoctorSelection(doctor)}
                />
                <div className="flex-grow">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    <p className="text-sm text-muted-foreground">{doctor.address}</p>
                  </CardContent>
                </div>
              </div>
              <div className="flex justify-end mt-2 space-x-2">
                {doctor.phone && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCall(doctor.phone)}
                          className="text-primary hover:text-primary-foreground"
                        >
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Anrufen</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-secondary text-secondary-foreground">
                        <p>Anrufen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {doctor.email && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${doctor.email}`} className="text-primary hover:text-primary-foreground">
                            <MailIcon className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">E-Mail</span>
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-secondary text-secondary-foreground">
                        <p>E-Mail senden</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {doctor.website && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" asChild>
                          <a 
                            href={doctor.website.startsWith('http') ? doctor.website : `https://${doctor.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:text-primary-foreground"
                          >
                            <GlobeIcon className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Website</span>
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-secondary text-secondary-foreground">
                        <p>Website besuchen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardHeader>
          </Card>
        ))
      ) : null}
      <div className="flex justify-between">
        <Button onClick={handleBack}>Zurück</Button>
        <Button 
          onClick={handleNext} 
          disabled={doctors.length === 0 || selectedDoctors.length === 0 || isLoading}
        >
          Weiter
        </Button>
      </div>
      <QRCodeDialog
        open={qrCodeOpen}
        onOpenChange={setQRCodeOpen}
        phoneNumber={currentPhone}
      />
    </div>
  );
}
