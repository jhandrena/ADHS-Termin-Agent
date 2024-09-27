from adhs_termin_agent.patient import Patient

from adhs_termin_agent.doctor_search import search_doctors

def intake_form() -> Patient:
    specialty: str = input("Zu welchem Facharzt haben Sie eine Überweisung? ")
    location: str = input("An welchem Ort suchen Sie einen Arzt? ")
    patient = Patient(location=location, specialty=specialty)
    doctors = search_doctors(specialty, location)
    print("Gefundene Ärzte:")
    for doctor in doctors:
        print(f"Name: {doctor.name}, Telefon: {doctor.phone}, Email: {doctor.email}, Adresse: {doctor.address}, URL: {doctor.url}")
    return patient

if __name__ == "__main__":
    patient: Patient = intake_form()
    print(f"Patient sucht einen {patient.specialty} in {patient.location}.")
