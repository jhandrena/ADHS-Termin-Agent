

import json

def parse_output_json():
    with open('adhs_termin_agent/mail/output.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

if __name__ == "__main__":
    data = parse_output_json()
    print(data)  # For debugging purposes, you can remove this line later
    sendeEmailRoutine()
