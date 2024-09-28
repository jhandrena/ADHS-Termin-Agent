import json
import webbrowser
import urllib.parse


def parse_output_json() -> list:
    with open('output.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data


def get_list_of_callable_doctors_at(date, time, doctors):
    callable_doctors = []
    for doctor in doctors:
        if not doctor['terminOptionen']['email']:
            for day, times in doctor['telefonErreichbarkeit'].items():
                for time_slot in times:
                    if time_slot['von'] <= time <= time_slot['bis']:
                        callable_doctors.append(doctor)
                        break
    return callable_doctors


if __name__ == "__main__":
    doctors = parse_output_json()

    #date = input("Bitte geben Sie das Datum ein (TT.MM.JJJJ): ")
    #time = input("Bitte geben Sie die Uhrzeit ein (HH:MM): ")

    callable_doctors_at = get_list_of_callable_doctors_at("30.09.2024", "18:40", doctors)

    for doctor in callable_doctors_at:
        print(f"Name: {doctor['name']}, Telefon: {doctor['telefon']}")
