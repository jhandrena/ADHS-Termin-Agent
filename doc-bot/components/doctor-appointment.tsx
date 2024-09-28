'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPinIcon, MailIcon, PhoneIcon, GlobeIcon, XIcon, UserIcon } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { specialties } from '@/app/constants'



const sampleDoctors = [
  { 
    id: 1, 
    name: "Dr. Schmidt", 
    specialty: "Kardiologie", 
    email: "schmidt@example.com",
    phone: "+49 30 12345678",
    address: "Friedrichstraße 100, 10117 Berlin",
    website: "https://dr-schmidt.de"
  },
  { 
    id: 2, 
    name: "Dr. Müller", 
    specialty: "Dermatologie", 
    email: "mueller@example.com",
    phone: "+49 30 87654321",
    address: "Kurfürstendamm 234, 10719 Berlin",
    website: "https://dr-mueller.de"
  },
  { 
    id: 3, 
    name: "Dr. Weber", 
    specialty: "Orthopädie", 
    email: "weber@example.com",
    phone: "+49 30 23456789",
    address: "Alexanderplatz 7, 10178 Berlin",
    website: "https://dr-weber.de"
  },
  { 
    id: 4, 
    name: "Dr. Fischer", 
    specialty: "Allgemeinmedizin", 
    email: "fischer@example.com",
    phone: "+49 30 34567890",
    address: "Unter den Linden 77, 10117 Berlin",
    website: "https://dr-fischer.de"
  },
  { 
    id: 5, 
    name: "Dr. Meyer", 
    specialty: "Neurologie", 
    email: "meyer@example.com",
    phone: "+49 30 45678901",
    address: "Potsdamer Platz 1, 10785 Berlin",
    website: "https://dr-meyer.de"
  },
]

const searchDoctors = async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return sampleDoctors;
}

const generateEmailContent = async (selectedDoctors, patientName, patientEmail, specialty) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const doctorSpecialties = selectedDoctors.map(d => d.specialty).join(", ");
  
  return `Sehr geehrte Damen und Herren,

ich bin ${patientName} und ich suche einen Termin bei einem Facharzt für ${specialty}.

Bitte kontaktieren Sie mich unter ${patientEmail} für weitere Informationen oder um einen Termin zu vereinbaren.

Mit freundlichen Grüßen,
${patientName}`;
}

const sendEmails = async (doctors, emailContent) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log("Sending emails to:", doctors.map(d => d.email).join(", "));
  console.log("Email content:", emailContent);
  
  return { success: true, message: "Emails sent successfully" };
}

export function DoctorAppointment() {
  const [state, setState] = useState({
    step: 1,
    location: "",
    specialty: "",
    doctors: [],
    selectedDoctors: [],
    emailContent: "",
    patientName: "",
    patientEmail: "",
    preferredContact: "all",
  })
  const [filteredSpecialties, setFilteredSpecialties] = useState(specialties)
  const [isLoading, setIsLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)
  const [emailError, setEmailError] = useState("")

  useEffect(() => {
    if (state.specialty) {
      setFilteredSpecialties(
        specialties.filter(s =>
          s.toLowerCase().includes(state.specialty.toLowerCase())
        )
      )
    } else {
      setFilteredSpecialties(specialties)
    }
  }, [state.specialty])

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  const handleNext = async () => {
    if (state.step === 1) {
      setIsLoading(true)
      try {
        const doctors = await searchDoctors()
        setState(prev => ({ ...prev, step: 2, doctors }))
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setIsLoading(false)
      }
    } else if (state.step === 2) {
      if (!validateEmail(state.patientEmail)) {
        setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein.")
        return
      }
      setEmailError("")
      setState(prev => ({ ...prev, step: 3 }))
    } else if (state.step === 3) {
      setIsLoading(true)
      try {
        const emailContent = await generateEmailContent(
          state.selectedDoctors,
          state.patientName,
          state.patientEmail,
          state.specialty
        )
        setState(prev => ({ ...prev, step: prev.step + 1, emailContent }))
      } catch (error) {
        console.error("Error generating email content:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setState(prev => ({ ...prev, step: prev.step + 1 }))
    }
  }

  const handleBack = () => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }))
  }

  const handleStepChange = (step) => {
    if (step <= state.step) {
      setState(prev => ({ ...prev, step }))
    }
  }

  const useCurrentLocation = () => {
    setState(prev => ({ ...prev, location: "Berlin" }))
  }

  const toggleDoctorSelection = (doctor) => {
    setState(prev => {
      const isSelected = prev.selectedDoctors.some(d => d.id === doctor.id)
      const newSelectedDoctors = isSelected
        ? prev.selectedDoctors.filter(d => d.id !== doctor.id)
        : [...prev.selectedDoctors, doctor]
      return { ...prev, selectedDoctors: newSelectedDoctors }
    })
  }

  const handleSendEmails = async () => {
    setIsLoading(true)
    try {
      const result = await sendEmails(state.selectedDoctors, state.emailContent)
      setEmailStatus(result)
      if (result.success) {
        setState(prev => ({ ...prev, step: prev.step + 1 }))
      }
    } catch (error) {
      console.error("Error sending emails:", error)
      setEmailStatus({ success: false, message: "Failed to send emails. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const clearSpecialty = () => {
    setState(prev => ({ ...prev, specialty: "" }))
  }

  const toggleAllDoctors = () => {
    setState(prev => {
      if (prev.selectedDoctors.length === prev.doctors.length) {
        return { ...prev, selectedDoctors: [] }
      } else {
        return { ...prev, selectedDoctors: [...prev.doctors] }
      }
    })
  }

  const filteredDoctors = state.doctors.filter(doctor => {
    if (state.preferredContact === 'all') return true;
    if (state.preferredContact === 'email') return doctor.email;
    if (state.preferredContact === 'phone') return doctor.phone;
    if (state.preferredContact === 'website') return doctor.website;
    return true;
  });

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="z.B. Berlin, München, Hamburg"
                value={state.location}
                onChange={(e) => setState(prev => ({ ...prev, location: e.target.value }))}
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
                  value={state.specialty}
                  onValueChange={(value) => setState(prev => ({ ...prev, specialty: value }))}
                />
                <CommandList>
                  <CommandEmpty>Keine Fachrichtungen gefunden.</CommandEmpty>
                  <CommandGroup>
                    {filteredSpecialties.map((specialty) => (
                      <CommandItem
                        key={specialty}
                        onSelect={() => setState(prev => ({ ...prev, specialty }))}
                      >
                        {specialty}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              {state.specialty && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={clearSpecialty}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button onClick={handleNext} disabled={!state.location || !state.specialty || isLoading}>
              {isLoading ? "Suche Ärzte..." : "Weiter"}
            </Button>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Name</Label>
              <Input
                id="patientName"
                placeholder="z.B. Max Mustermann"
                value={state.patientName}
                onChange={(e) => setState(prev => ({ ...prev, patientName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientEmail">E-Mail Adresse</Label>
              <Input
                id="patientEmail"
                type="email"
                placeholder="z.B. max.mustermann@example.com"
                value={state.patientEmail}
                onChange={(e) => {
                  setState(prev => ({ ...prev, patientEmail: e.target.value }))
                  setEmailError("")
                }}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>
            <div className="flex justify-between">
              <Button onClick={handleBack}>Zurück</Button>
              <Button 
                onClick={handleNext} 
                disabled={!state.patientName || !state.patientEmail}
              >
                Weiter
              </Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button onClick={toggleAllDoctors}>
                {state.selectedDoctors.length === state.doctors.length ? "Alle abwählen" : "Alle auswählen"}
              </Button>
              <Select
                value={state.preferredContact}
                onValueChange={(value) => setState(prev => ({ ...prev, preferredContact: value }))}
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
                    checked={state.selectedDoctors.some(d => d.id === doctor.id)}
                    onCheckedChange={() => toggleDoctorSelection(doctor)}
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
                          <a href={`tel:${doctor.phone}`} className="text-primary hover:text-primary-fore

ground">
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
              <Button onClick={handleBack}>Zurück</Button>
              <Button onClick={handleNext} disabled={state.selectedDoctors.length === 0}>
                Weiter
              </Button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Überprüfen und bearbeiten Sie die E-Mail an die ausgewählten Ärzte:</p>
            <Textarea
              placeholder="Ihre Nachricht an die Ärzte..."
              value={state.emailContent}
              onChange={(e) => setState(prev => ({ ...prev, emailContent: e.target.value }))}
              rows={10}
            />
            {emailStatus && (
              <p className={emailStatus.success ? "text-green-600" : "text-red-600"}>
                {emailStatus.message}
              </p>
            )}
            <div className="flex justify-between">
              <Button onClick={handleBack}>Zurück</Button>
              <Button 
                onClick={handleSendEmails} 
                disabled={!state.emailContent || isLoading}
                className="flex items-center"
              >
                <MailIcon className="w-4 h-4 mr-2" />
                {isLoading ? "Sende E-Mails..." : "E-Mails senden"}
              </Button>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Bestätigung</h2>
            <p>Ihre E-Mails wurden erfolgreich gesendet.</p>
            <p>Ort: {state.location}</p>
            <p>Fachrichtung: {state.specialty}</p>
            <p>Kontaktierte Ärzte:</p>
            <ul className="list-disc list-inside">
              {state.selectedDoctors.map(doctor => (
                <li key={doctor.id}>{doctor.name} - {doctor.specialty}</li>
              ))}
            </ul>
            <Button onClick={() => setState({ 
              step: 1, 
              location: "", 
              specialty: "", 
              doctors: [], 
              selectedDoctors: [], 
              emailContent: "",
              patientName: "",
              patientEmail: "",
              preferredContact: "all",
            })}>
              Neue Anfrage starten
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(1)} className={state.step >= 1 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              Ort & Fachrichtung
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(2)} className={state.step >= 2 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              Patienteninfo
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(3)} className={state.step >= 3 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              Arztauswahl
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(4)} className={state.step >= 4 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              E-Mail verfassen
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => handleStepChange(5)} className={state.step === 5 ? "font-bold cursor-pointer" : "cursor-pointer"}>
              Bestätigung
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Facharzt-Termin anfragen</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </div>
  )
}