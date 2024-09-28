import json
import webbrowser
import urllib.parse


def parse_output_json() -> list:
    with open('output.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data


def get_list_of_callable_doctors_at(date, time, doctors):
    pass


if __name__ == "__main__":
    doctors = parse_output_json()

    date = input("Bitte geben Sie das Datum ein (TT.MM.JJJJ): ")
    time = input("Bitte geben Sie die Uhrzeit ein (HH:MM): ")

    get_list_of_callable_doctors_at(date,time,doctors)
