export interface PatientenInfo {
  kasse: boolean;
  privat: boolean;
  selbstzahler: string;
}

export interface TelefonErreichbarkeit {
  montag: string[];
  dienstag: string[];
  mittwoch: string[];
  donnerstag: string[];
  freitag: string[];
  samstag: string[];
  sonntag: string[];
}

export interface TerminOptionen {
  email: boolean;
  online: boolean;
  telefon: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  oeffnungszeiten: string;
  patienten: PatientenInfo;
  telefonErreichbarkeit: TelefonErreichbarkeit;
  terminOptionen: TerminOptionen;
  websiteLink: string;
}

export const searchDoctors = async (
  location: string,
  specialty: string
): Promise<Doctor[]> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/doctors?location=${encodeURIComponent(location)}&specialty=${encodeURIComponent(specialty)}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown[] = await response.json();
    
    // Transform the data to match the Doctor interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((doctor: any) => ({
      name: doctor.name,
      specialty: specialty, // Use the provided specialty
      email: doctor.email,
      phone: doctor.telefon,
      address: doctor.adresse,
      website: doctor.websiteLink,
      oeffnungszeiten: doctor.oeffnungszeiten || 'Nicht angegeben',
      patienten: {
        kasse: doctor.patienten?.kasse === true || 'Nicht angegeben',
        privat: doctor.patienten?.privat === true || 'Nicht angegeben',
        selbstzahler: doctor.patienten?.selbstzahler === true || 'Nicht angegeben',
      },
      telefonErreichbarkeit: {
        montag: doctor.telefonErreichbarkeit?.montag || [],
        dienstag: doctor.telefonErreichbarkeit?.dienstag || [],
        mittwoch: doctor.telefonErreichbarkeit?.mittwoch || [],
        donnerstag: doctor.telefonErreichbarkeit?.donnerstag || [],
        freitag: doctor.telefonErreichbarkeit?.freitag || [],
        samstag: doctor.telefonErreichbarkeit?.samstag || [],
        sonntag: doctor.telefonErreichbarkeit?.sonntag || [],
      },
      terminOptionen: {
        email: doctor.terminOptionen?.email || false,
        online: doctor.terminOptionen?.online || false,
        telefon: doctor.terminOptionen?.telefon || false,
      },
      websiteLink: doctor.websiteLink,
    })) as Doctor[];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const generateEmailContent = async (
  selectedDoctors: Doctor[],
  patientName: string,
  patientEmail: string,
  specialty: string
): Promise<string> => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/mail?thema=${encodeURIComponent(specialty)}&name=${encodeURIComponent(patientName)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const emailContent = await response.text();
    return emailContent;
  } catch (error) {
    console.error("Error generating email content:", error);
    // Fallback to a default message if the API call fails
    return `Sehr geehrte Damen und Herren,

ich bin ${patientName} und ich suche einen Termin bei einem Facharzt für ${specialty}.

Bitte kontaktieren Sie mich unter ${patientEmail} für weitere Informationen oder um einen Termin zu vereinbaren.

Mit freundlichen Grüßen,
${patientName}`;
  }
}

export const sendEmails = async (
  doctors: Doctor[],
  emailContent: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log("Sending emails to:", doctors.map(d => d.email).join(", "));
  console.log("Email content:", emailContent);
  
  return { success: true, message: "Emails sent successfully" };
}
