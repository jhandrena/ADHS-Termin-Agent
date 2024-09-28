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
    """
    Mail
    TElefonnummer
    website-link
    termin optinoen {
    "mail":bool,
    "telefon": bool
    "online": bool
    }
    privat/kassenartzt
    erreichbarkeit 

    """
    prompt_template: str = "Deine Aufgabe ist es, informationen über Ärtzte herauszufinden. Finde für deinen Arzt namens {} bei {} die mail, telefonnummer und die website. Finde auch heraus, ob man termine per mail, telefonisch und online verinbaren kann. Es ist auch wichtig zu wissen, ob es sich um einen Privat oder Kassen arzt handelt. Gib zum schluss auch die erreichbarkeits zeiten und öffnungs zeiten kann."
    prompt: str = prompt_template.format(doctor_json['arztname'], doctor_json['adresse'])
    doctor_information = callApi(prompt, "perplexity/llama-3.1-sonar-large-128k-online")
    doctors.append(doctor_information)

def find_information(doctors_json) -> str:
    doctors = []
    threads = []
    for doctor_json in doctors_json:
        threads.append(threading.Thread(target=_get_doctor_information, args=(doctor_json, doctors)))
        threads[-1].start()
    for thread in threads:
        thread.join()
    return doctors

def information_to_doctors(information: List[str]):
    doctors = []
    threads = []
    for info in information:
        threads.append(threading.Thread(target=_append_converted_doctor, args=(info, doctors, )))
        threads[-1].start()
    for thread in threads:
        thread.join()
    return doctors

def _append_converted_doctor(information, doctors, retried=False):
    prompt_template = "{}"
    prompt = prompt_template.format(information)
    json_format = """
{
"name": <der name>
"email": <die email oder "not set">
"telefon": <die telefon nummer oder "not set">
"websiteLink": <eine valide website url oder "not set">
"terminOptionen": {
    "telefon": <boolean: ob man per telefon einen termin machen kann>
    "email": <boolean: ob man per email einen termin machen kann>
    "online": <boolean: ob man online einen termin machen kann>
    }
"patienten": {
    "privat": <boolean | not set: ob privatversicherte patienten angenommen werden>
    "kasse": <boolean | not set: ob kassenversicherte patienten angenommen werden>
    "selbstzahler": <boolean | not set: ob selbstzahler patienten angenommen werden>
    }
"telefonErreichbarkeit": <nur gesetzt wenn telefon nummer gegeben ist, wenn keine erreichbarkeits zeiten gefunden wurde ist es "not found">{
    "montag": [
            {
                "von": <str: start der erreichbarkeit in 24h format, geschrieben als hh:mm, z.b. 08:30>, "bis": <str: ende der erreichbarkeit im 24h format, geschrieben als hh:mm, z.b. 08:30>   
            },
            {
                "von": ..., "bis": ...
            },
            ...
        ],
    "dienstag": [
            {
                "von": <str: start der erreichbarkeit in 24h format, geschrieben als hh:mm, z.b. 08:30>, "bis": <str: ende der erreichbarkeit im 24h format, geschrieben als hh:mm, z.b. 08:30>   
            },
            {
                "von": ..., "bis": ...
            },
            ...
        ],
    "mittwoch": [
        ...
    ],
    "donnerstag": [...],
    "freitag": [...],
    "samstag": [...],
    "sonntag": [...]
    }
"oeffnungszeiten": {
<gleiches forat wie die telefon erreichbarkeit - wenn es keine öffnungszeiten gibt UND man erst einen termin braucht ist oeffnungszeiten der string "nur termine">
}
}
"""
    system_template = """Du wirst aus einem Dokument informationen über einen Doktor extrahieren. Antworte mit reinem JSON ohne code block in folgendem format:\n{}\n\n\nBei öffnugszeiten und telefon erreichbarkeit müssen alle tage immer eingetragen sein, auch wenn es ein leeres array ist, hierbei ist die einzige ausnahme wenn es keine öffnugnszeiten sondern nur öffnug für termine gibt, dann ist oefnungszeiten ein string der sagt "nur termine". Du musst dich immer komplett an dieses format halten ohne ausnahme. Antwote nur mit dem json, ohne codeblock und ohne irgendwelchen anderen text."""
    system = system_template.format(json_format)
    doctor_raw = callApi(prompt, "openai/gpt-4o-mini", system)
    try:
        doctor_json = json.loads(doctor_raw)
        doctors.append(doctor_json)
    except:
        if not retried:
            print("Retrying converting detials to doctor json")
            _append_converted_doctor(information, doctors, True)
        else:
            print("Failed to convert doctor details to json")


if __name__ == "__main__":
    print("Finde passende Ärzte...")
    search = name_search("Neurologe", "Karlsruhe")
    #print(search)
    print("Verarbeite Ärzte liste...")
    doctors_json = names_to_json(search)
    doctors_json = doctors_json[:10]
    print("Finde weitere informationen über Ärzte...")
    info = (find_information(doctors_json))
    #print(info)
    print("Verarbeite informationen über die Ärzte...")
    print(information_to_doctors(info))



