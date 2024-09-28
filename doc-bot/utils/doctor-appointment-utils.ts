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

export const searchDoctors = async (location: string, specialty: string): Promise<Doctor[]> => {
  try {
    const response = await fetch(`/doctors?location=${encodeURIComponent(location)}&specialty=${encodeURIComponent(specialty)}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match the Doctor interface
    return data.map((doctor: any) => ({
      id: doctor.id || Math.random().toString(36).substr(2, 9), // Generate a random ID if not provided
      name: doctor.name,
      specialty: specialty, // Use the provided specialty
      email: doctor.email,
      phone: doctor.telefon || 'N/A',
      address: doctor.adresse || 'N/A',
      website: doctor.website || 'N/A'
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const generateEmailContent = async (selectedDoctors, patientName, patientEmail, specialty) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const doctorSpecialties = selectedDoctors.map(d => d.specialty).join(", ");
  
  return `Sehr geehrte Damen und Herren,

ich bin ${patientName} und ich suche einen Termin bei einem Facharzt für ${specialty}.

Bitte kontaktieren Sie mich unter ${patientEmail} für weitere Informationen oder um einen Termin zu vereinbaren.

Mit freundlichen Grüßen,
${patientName}`;
}

export const sendEmails = async (doctors, emailContent) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log("Sending emails to:", doctors.map(d => d.email).join(", "));
  console.log("Email content:", emailContent);
  
  return { success: true, message: "Emails sent successfully" };
}
