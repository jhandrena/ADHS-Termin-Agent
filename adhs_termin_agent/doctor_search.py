from typing import List, Dict

class Doctor:
    def __init__(self, name: str, phone: str, email: str, address: str, url: str) -> None:
        self.name = name
        self.phone = phone
        self.email = email
        self.address = address
        self.url = url

def search_doctors(specialty: str, location: str) -> List[Doctor]:
    # Dummy implementation simulating an LLM call
    return [
        Doctor(name="Dr. Müller", phone="123-456-7890", email="dr.mueller@example.com", address="123 Main St, Berlin", url="http://drmueller.com"),
        Doctor(name="Dr. Schmidt", phone="098-765-4321", email="dr.schmidt@example.com", address="456 Elm St, Berlin", url="http://drschmidt.com"),
    ]
