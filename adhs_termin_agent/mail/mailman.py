

import json


def parse_output_json():
    with open('output.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def filter_doctors_with_email(data):
    return [doctor for doctor in data if doctor['terminOptionen']['email'] is True]

def get_user_exclusions(doctors):
    print("Available doctors:")
    for index, doctor in enumerate(doctors):
        print(f"{index}: {doctor['name']}")

    exclusions = input("Enter the indices of doctors to exclude, separated by commas (e.g., 0,2,3): ")
    if exclusions.strip():
        excluded_indices = {int(index.strip()) for index in exclusions.split(',') if index.strip().isdigit()}
        return [doctor for i, doctor in enumerate(doctors) if i not in excluded_indices]
    return doctors

def write_filtered_json(doctors, filename='filtered_doctors.json'):
    complete_doctors = [
        doctor for doctor in doctors
        if doctor['name'] != "not set" and doctor['email'] != "not set" and doctor['telefon'] != "not set"
    ]
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(complete_doctors, file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    data = parse_output_json()
    doctors_with_email = filter_doctors_with_email(data)
    doctors_to_contact = get_user_exclusions(doctors_with_email)
    print("Doctors to contact:")
    for doctor in doctors_to_contact:
        print(doctor['name'])
    write_filtered_json(doctors_to_contact)

