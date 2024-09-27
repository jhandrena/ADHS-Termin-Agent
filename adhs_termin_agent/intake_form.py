from adhs_termin_agent.patient import Patient

from typing import List, Dict

def search_doctors(specialty: str, location: str) -> List[Dict[str, str]]:
    # Dummy implementation simulating an LLM call
    return [
        {"name": "Dr. Müller", "phone": "123-456-7890", "email": "dr.mueller@example.com", "address": "123 Main St, Berlin"},
        {"name": "Dr. Schmidt", "phone": "098-765-4321", "email": "dr.schmidt@example.com", "address": "456 Elm St, Berlin"},
    ]

def intake_form() -> Patient:
    specialty: str = input("Zu welchem Facharzt haben Sie eine Überweisung? ")
    location: str = input("An welchem Ort suchen Sie einen Arzt? ")
    patient = Patient(location=location, specialty=specialty)
    doctors = search_doctors(specialty, location)
    print("Gefundene Ärzte:")
    for doctor in doctors:
        print(f"Name: {doctor['name']}, Telefon: {doctor['phone']}, Email: {doctor['email']}, Adresse: {doctor['address']}")
    return patient

if __name__ == "__main__":
    patient: Patient = intake_form()
    print(f"Patient sucht einen {patient.specialty} in {patient.location}.")
