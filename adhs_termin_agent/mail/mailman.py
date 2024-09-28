

import json


def parse_output_json():
    with open('output.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def filter_doctors_with_email(data):
    return [doctor for doctor in data if doctor['terminOptionen']['email'] is True]

if __name__ == "__main__":
    data = parse_output_json()
    doctors_with_email = filter_doctors_with_email(data)
    print(doctors_with_email)  # For debugging purposes, you can remove this line later

