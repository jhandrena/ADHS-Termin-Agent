from adhs_termin_agent.patient import Patient

def intake_form():
    specialty = input("Zu welchem Facharzt haben Sie eine Überweisung? ")
    location = input("An welchem Ort suchen Sie einen Arzt? ")
    patient = Patient(location=location, specialty=specialty)
    return patient

if __name__ == "__main__":
    patient = intake_form()
    print(f"Patient sucht einen {patient.specialty} in {patient.location}.")
