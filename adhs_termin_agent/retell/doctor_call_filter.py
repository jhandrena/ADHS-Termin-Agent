import json
import webbrowser
import urllib.parse
import datetime


def parse_output_json() -> list:
    with open('output.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data


def get_list_of_callable_doctors_at(date_str, time, doctors):
    date = datetime.datetime.strptime(date_str, "%d.%m.%Y")
    weekday = date.strftime("%A").lower()
    callable_doctors = []
    for doctor in doctors:
        if not doctor['terminOptionen']['email'] and doctor['telefon'] != "not set":
            if weekday in doctor['telefonErreichbarkeit']:
                for time_slot in doctor['telefonErreichbarkeit'][weekday]:
                    if time_slot['von'] <= time <= time_slot['bis']:
                        callable_doctors.append(doctor)
                        break
    return callable_doctors


if __name__ == "__main__":
    doctors = parse_output_json()

    #date = input("Bitte geben Sie das Datum ein (TT.MM.JJJJ): ")
    #time = input("Bitte geben Sie die Uhrzeit ein (HH:MM): ")

    callable_doctors_at = get_list_of_callable_doctors_at("30.09.2024", "08:00", doctors)

    for doctor in callable_doctors_at:
        print(f"Name: {doctor['name']}, Telefon: {doctor['telefon']}")
