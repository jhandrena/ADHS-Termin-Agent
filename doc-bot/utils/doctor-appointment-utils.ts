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
