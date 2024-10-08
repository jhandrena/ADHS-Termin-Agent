import json
import webbrowser
import urllib.parse


def parse_output_json() -> list:
    with open('output.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data


def filter_doctors_with_email(data: list) -> list:
    return [doctor for doctor in data if doctor['terminOptionen']['email'] is True]


def get_user_exclusions(doctors: list) -> list:
    print("Available doctors:")
    for index, doctor in enumerate(doctors):
        print(f"{index}: {doctor['name']}")

    exclusions = input("Enter the indices of doctors to exclude, separated by commas (e.g., 0,2,3): ")
    if exclusions.strip():
        excluded_indices = {int(index.strip()) for index in exclusions.split(',') if index.strip().isdigit()}
        return [doctor for i, doctor in enumerate(doctors) if i not in excluded_indices]
    return doctors


def get_filtered_doctors(doctors: list) -> list:
    complete_doctors = [
        doctor for doctor in doctors
        if doctor['name'] != "not set" and doctor['email'] != "not set" and doctor['telefon'] != "not set"
    ]
    return complete_doctors


def open_mailto_link(doctors, subject, body):
    for doctor in doctors:
        if doctor['email'] != "not set":
            mailto_link = f"mailto:{doctor['email']}?subject={urllib.parse.quote(subject)}&body={urllib.parse.quote(body)}"
            print(mailto_link)
            webbrowser.open(mailto_link)


def create_mass_emailing(doctors, subject, specialty, name):
    doctors_with_email = filter_doctors_with_email(doctors)
    doctors_to_contact = get_user_exclusions(doctors_with_email)
    print("Doctors to contact:")
    for doctor in doctors_to_contact:
        print(doctor['name'])
    complete_doctors = get_filtered_doctors(doctors_to_contact)
    from adhs_termin_agent.mail.mail_composer import first_draft
    email_body = first_draft(subject, specialty, name)
    open_mailto_link(complete_doctors, "Termin Anfrage", email_body)
    for doctor in complete_doctors:
        print(doctor['name'])


if __name__ == "__main__":
    data = parse_output_json()
    create_mass_emailing(data, "ADS Diagnose", "Neurologe","Anna Karenina")
