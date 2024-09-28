from typing import List, Dict
from openai import OpenAI
import threading
import dotenv
import json

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=dotenv.get_key("../.env", "OPENROUTER_API_KEY"),
)

def callApi(prompt: str, model: str, system_message: str = ""):
    messages = []
    if system_message.strip() != "":
        messages.append(
            {
                "role": "system",
                "content": system_message
            }
        )
    messages.append(
        {
            "role": "user",
            "content": prompt
        }
    )
    completion = client.chat.completions.create(
        model=model,
        messages=messages
    )
    try:
        return (completion.choices[0].message.content)
    except:
        print(completion)

class Doctor:
    def __init__(self, name: str, phone: str, email: str, address: str, url: str) -> None:
        self.name = name
        self.phone = phone
        self.email = email
        self.address = address
        self.url = url

def search_doctors(specialty: str, location: str) -> List[Doctor]:
    search_results = name_search(specialty, location)


    return [
        Doctor(name="Dr. Müller", phone="123-456-7890", email="dr.mueller@example.com", address="123 Main St, Berlin", url="http://drmueller.com"),
        Doctor(name="Dr. Schmidt", phone="098-765-4321", email="dr.schmidt@example.com", address="456 Elm St, Berlin", url="http://drschmidt.com"),
    ]

def name_search(specialty: str, location: str) -> str: 
    prompt_template: str = """Gib mir eine liste mit namen und Adressen von {} in {}. """
    system_prompt:str = "verwende folgende quellen:arztsuche: https://arztsuche.116117.de/, yameda, doctolib, das örtliche"
    prompt: str = prompt_template.format(specialty,location,system_prompt)
    return callApi(prompt,"perplexity/llama-3.1-sonar-large-128k-online")


def _filter_and_convert(result):
    splitlines = result.split("\n")
    filtered_lines = list(filter(lambda line: not line.startswith("```"), splitlines))
    filtered_result = "\n".join(filtered_lines)
    return json.loads(filtered_result)


def names_to_json(search_results: str):
    prompt_template: str = """Konvertiere mir folgende Suchergebnisse in eine json Liste. Folge dem format {} 
Suchergebnisse: 
{}"""
    system_prompt: str = "Antworte nur mit dem fertigen json"
    prompt: str = prompt_template.format('[{"arztname": "...","praxisname":"...","adresse":"..." }]', search_results)
    result = callApi(prompt, "openai/gpt-4o-mini", system_prompt)
    doctors_json = _filter_and_convert(result)

    return doctors_json

def _get_doctor_information(doctor_json, doctors) -> str:
    prompt_template: str = "Finde für den Artzt {} bei {} die Kontakt-Mail, Telefonnummer und ob man Termine per mail machen kann."
    prompt: str = prompt_template.format(doctor_json['arztname'], doctor_json['adresse'])
    doctor_information = callApi(prompt, "perplexity/llama-3.1-sonar-large-128k-online")
    doctors.append(doctor_information)

def find_information(doctors_json) -> str:
    doctors = []
    for doctor_json in doctors_json[:5]:
        _get_doctor_information(doctor_json, doctors)
    return doctors

def information_to_doctor(information: str):
    pass

if __name__ == "__main__":
    #search = name_search("Neurologe", "Karlsruhe")
    #print(search)
    #doctors_json = names_to_json(search)
    doctors_json = json.loads("[{'arztname': 'Dr. med. Michael H. Stienen', 'praxisname': '', 'adresse': 'Stephanienstr. 57, Karlsruhe'}, {'arztname': 'Yu Jun Huang', 'praxisname': '', 'adresse': 'Amalienstr. 93, Karlsruhe'}, {'arztname': 'Dr. med. Volker Schenk', 'praxisname': '', 'adresse': 'Marstallstr. 18 a, Karlsruhe'}, {'arztname': 'Dr. med. Thies Lindenlaub', 'praxisname': '', 'adresse': 'Karlstr. 29, Karlsruhe'}, {'arztname': 'Dr. med. Anja Haberl', 'praxisname': '', 'adresse': 'Reinhold-Frank-Str. 9, Karlsruhe'}, {'arztname': 'Dr. med. Christoph Müller', 'praxisname': 'Neurologische Gemeinschaftspraxis', 'adresse': 'Karlstr. 84, Karlsruhe'}, {'arztname': 'Dr. med. Bianca Ehbauer', 'praxisname': '', 'adresse': 'Karlstr. 61, Karlsruhe'}, {'arztname': 'Neurologische Gemeinschaftspraxis (Dres. Ulrich Husemann, Alexander Hladek, Christoph Müller u.w.)', 'praxisname': '', 'adresse': 'Karlstr. 84, Karlsruhe'}, {'arztname': 'Dr. med. Tatjana Pföhler', 'praxisname': '', 'adresse': 'Karlstr. 15, Karlsruhe'}, {'arztname': 'Dr. med. Roland Niessner', 'praxisname': '', 'adresse': 'Kaiserstr. 116, Karlsruhe'}, {'arztname': 'Gemeinschaftspraxis für Neurologie, Psychiatrie und Psychotherapie', 'praxisname': '', 'adresse': 'Nowackanlage 15, 76137 Karlsruhe'}]".replace("'", '"'))
    print(find_information(doctors_json))






"""Here is a list of neurologists in Karlsruhe, including their names and addresses, based on the provided sources:

## Dr. med. Michael H. Stienen
- **Adresse:** Stephanienstr. 57, Karlsruhe.

## Yu Jun Huang
- **Adresse:** Amalienstr. 93, Karlsruhe.

## Dr. med. Volker Schenk
- **Adresse:** Marstallstr. 18 a, Karlsruhe
- **Spezialgebiete:** Neurologie, Psychiatrie, Psychosomatische Grundversorgung, Physikalische Therapie & Balneologie.

## Dr. med. Thies Lindenlaub
- **Adresse:** Karlstr. 29, Karlsruhe.

## Dr. med. Anja Haberl
- **Adresse:** Reinhold-Frank-Str. 9, Karlsruhe
- **Spezialgebiete:** Neurologie und Psychiatrie.

## Dr. med. Christoph Müller
- **Adresse:** Hildebrandstr. 20, Karlsruhe.
- **Adresse:** Karlstr. 84, Karlsruhe (Neurologische Gemeinschaftspraxis).

## Dr. med. Bianca Ehbauer
- **Adresse:** Karlstr. 61, Karlsruhe
- **Spezialgebiete:** Neurologie und Psychiatrie, ärztliche Psychotherapie.

## Neurologische Gemeinschaftspraxis (Dres. Ulrich Husemann, Alexander Hladek, Christoph Müller u.w.)
- **Adresse:** Karlstr. 84, Karlsruhe.

## Dr. med. Tatjana Pföhler
- **Adresse:** Karlstr. 15, Karlsruhe.

## Dr. med. Roland Niessner
- **Adresse:** Kaiserstr. 116, Karlsruhe
- **Spezialgebiete:** Neurologie, Psychiatrie, Psychotherapie, Psychosomatische Grundversorgung.

## Gemeinschaftspraxis für Neurologie, Psychiatrie und Psychotherapie
- **Adresse:** Nowackanlage 15, 76137 Karlsruhe
- **Ärzte-Team:**
  - Friedrich Fässler, Facharzt für Neurologie und Psychiatrie
  - Dr. med. Petra Hubrich-Durm, Fachärztin für Neurologie, Psychiatrie und Psychotherapie
  - Till van der List, Facharzt für Psychiatrie und Psychotherapie
  - Dr. med. Monika Bottlender, Fachärztin für Psychiatrie, Psychotherapie und Psychosomatische Medizin
  - Dr. med. Franziska Uhrenbacher, Fachärztin für Neurologie.
"""