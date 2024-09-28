

import json
from some_module import sendeEmailRoutine  # Replace 'some_module' with the actual module name

def parse_output_json():
    with open('adhs_termin_agent/mail/output.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def filter_doctors_with_email(data):
    return [doctor for doctor in data if doctor['terminOptionen']['email']]

if __name__ == "__main__":
    data = parse_output_json()
    doctors_with_email = filter_doctors_with_email(data)
    print(doctors_with_email)  # For debugging purposes, you can remove this line later
    sendeEmailRoutine()
