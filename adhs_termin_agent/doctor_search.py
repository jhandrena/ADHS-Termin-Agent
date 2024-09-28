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

def name_search(specialty: str, location: str) -> str: 
    prompt_template: str = """Gib mir eine Ärzte liste mit Namen und Adressen von {} in {}. Die Liste sollte im optimalfall 20 einträge lang sein."""
    system_prompt:str = "verwende folgende quellen:arztsuche: https://arztsuche.116117.de/, yameda, doctolib, das örtliche."
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

def _get_doctor_information(doctor_json, doctors = False) -> str:
    prompt_template: str = "Deine Aufgabe ist es, informationen über Ärtzte herauszufinden. Finde für deinen Arzt namens {} bei {} die mail, telefonnummer und die website. Finde auch heraus, ob man termine per mail, telefonisch und online verinbaren kann. Es ist auch wichtig zu wissen, ob es sich um einen Privat oder Kassen arzt handelt. Gib zum schluss auch die erreichbarkeits zeiten und öffnungs zeiten kann."
    prompt: str = prompt_template.format(doctor_json['arztname'], doctor_json['adresse'])
    doctor_information = callApi(prompt, "perplexity/llama-3.1-sonar-large-128k-online")
    if doctors:
        doctors.append(doctor_information)
    else:
        return doctor_information

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

def _extend_doctor_json(doctor_json, doctors, count):
    info_text = _get_doctor_information(doctor_json)
    _append_converted_doctor(info_text, doctors)
    print(str(100 * int(len(doctors))/int(count)) + "%")

def extendDoctors(doctors_json):
    doctors = []
    threads = []
    for doctor_json in doctors_json:
        threads.append(threading.Thread(target=_extend_doctor_json, args=(doctor_json, doctors, len(doctors_json))))
        threads[-1].start()
    for thread in threads:
        thread.join()
    return doctors


def main(specialty, region):
    print("Finde passende Ärzte...")
    search = name_search(specialty, region)
    #print(search)
    print("Verarbeite Ärzte liste...")
    doctors_json = names_to_json(search)
    doctors_json = doctors_json[:20]
    print(str(len(doctors_json)) + " Ärzte gefunden...")
    print("Finde und verarbeite weitere informationen über Ärzte...")
    print(extendDoctors(doctors_json))
    #info = (find_information(doctors_json))
    ##print(info)
    #print("Verarbeite informationen über die Ärzte...")
    #print(information_to_doctors(info))


if __name__ == "__main__":
    main("Neurologie", "Karlsruhe")

