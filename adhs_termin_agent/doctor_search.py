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
        messages=messages,
        top_p=0.9
    )
    try:
        return (completion.choices[0].message.content)
    except:
        print(completion)

def name_search(specialty: str, location: str, count: int) -> str: 
    prompt_template = """Erstelle eine Liste von Ärzten im Fachgebiet {} aus {}. Diese Liste soll {} einträge beinhalten und für jeden Arzt den Namen und die Adresse auflisten. Gute Quellen um Ärzte zu finden sind das örtliche, arztsuche.116117.de, doctolib und yameda."""
    prompt_template2 = """
Bitte recherchieren Sie mindestens {} Ärzte, welche diese bedingungen erfüllen:

Fachgebiet: {}
Ort/Stadt: {}

Basierend auf diesen Angaben, finden Sie bitte so viele der folgenden Informationen für jeden der Ärzte wie möglich:
1. Name
2. Adresse
"""
    #system_prompt:str = "verwende folgende quellen:arztsuche: https://arztsuche.116117.de/, yameda, doctolib, das örtliche."
    prompt: str = prompt_template.format(specialty,location,count)
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
    prompt_template = """Suche auf der Kontakt-Seite von {} nach:
E-Mail-Adresse
Telefonnummer
Website-URL
Terminvereinbarungsmöglichkeiten (telefonisch, per E-Mail, online)
Akzeptierte Patientenversicherungen (privat, gesetzlich, Selbstzahler)
Telefonische Erreichbarkeit (Zeiten für jeden Wochentag)
Öffnungszeiten (für jeden Wochentag)"""
    prompt: str = prompt_template.format(doctor_json['arztname'], doctor_json['adresse'])
    doctor_information = callApi(prompt, "perplexity/llama-3.1-sonar-large-128k-online")
    if doctors:
        doctors.append(doctor_information)
    else:
        return doctor_information

def _append_converted_doctor(information, doctor_json_source, doctors, retried=False):
    prompt_template = "{}"
    prompt = prompt_template.format(information)
    json_format = """
{
  "name": "Der vollständige Name der Praxis oder des Arztes",
  "email": "Die E-Mail-Adresse der Praxis oder 'not set', wenn keine angegeben",
  "telefon": "Die Telefonnummer der Praxis oder 'not set', wenn keine angegeben",
  "websiteLink": "Eine gültige Website-URL der Praxis oder 'not set', wenn keine angegeben",
  "terminOptionen": {
    "telefon": true/false,
    "email": true/false,
    "online": true/false
  },
  "patienten": {
    "privat": true/false/"not set",
    "kasse": true/false/"not set",
    "selbstzahler": true/false/"not set"
  },
  "telefonErreichbarkeit": {
    "montag": [
      {
        "von": "hh:mm",
        "bis": "hh:mm"
      },
      {
        "von": "hh:mm",
        "bis": "hh:mm"
      },
      ...
    ],
    "dienstag": [ ... ],
    "mittwoch": [ ... ],
    "donnerstag": [ ... ],
    "freitag": [ ... ],
    "samstag": [ ... ],
    "sonntag": [ ... ]
  },
  "oeffnungszeiten": {
    "montag": [
      {
        "von": "hh:mm",
        "bis": "hh:mm"
      },
      {
        "von": "hh:mm",
        "bis": "hh:mm"
      },
      ...
    ],
    "dienstag": [ ... ],
    "mittwoch": [ ... ],
    "donnerstag": [ ... ],
    "freitag": [ ... ],
    "samstag": [ ... ],
    "sonntag": [ ... ]
  }
}

.
Für Felder wie "email", "telefon" und "websiteLink" wird "not set" verwendet, wenn keine Information verfügbar ist.
Die "terminOptionen" und "patienten" Felder verwenden boolesche Werte (true/false). Bei "patienten" ist auch "not set" möglich, wenn keine Information verfügbar ist.
"telefonErreichbarkeit" ist nur gesetzt, wenn eine Telefonnummer angegeben ist. Wenn keine Erreichbarkeitszeiten gefunden wurden, wird das array für den Tag leer gelassen.
Die Zeitangaben in "telefonErreichbarkeit" und "oeffnungszeiten" folgen dem 24-Stunden-Format (hh:mm).
Wenn keine Öffnungszeiten angegeben sind und nur Termine möglich sind, wird für "oeffnungszeiten" der String "nur termine" verwendet.

"""
    system_template = """Du wirst aus einem Dokument informationen über einen Doktor extrahieren. Antworte mit reinem JSON ohne code block in folgendem format:\n{}\n\n\nBei öffnugszeiten und telefon erreichbarkeit müssen alle tage immer eingetragen sein, auch wenn es ein leeres array ist, hierbei ist die einzige ausnahme wenn es keine öffnugnszeiten sondern nur öffnug für termine gibt, dann ist oefnungszeiten ein string der sagt "nur termine". Du musst dich immer komplett an dieses format halten ohne ausnahme. Antwote nur mit dem json, ohne codeblock und ohne irgendwelchen anderen text. Gib nur einen Doktor an. Wenn es mehrere gibt wähle den mit mehr daten."""
    system = system_template.format(json_format)
    doctor_raw = callApi(prompt, "openai/gpt-4o-mini", system)
    doctor_raw = doctor_raw.replace('"not set"', '""')
    try:
        doctor_json = json.loads(doctor_raw)
        doctor_json['adresse'] = doctor_json_source['adresse']
        doctor_json['name'] = doctor_json_source['name']
        doctors.append(doctor_json)
    except:
        if not retried:
            print("Retrying converting detials to doctor json")
            _append_converted_doctor(information, doctor_json_source, doctors, True)
        else:
            print("Failed to convert doctor details to json")
            print(doctor_raw)

def _extend_doctor_json(doctor_json, doctors, count):
    info_text = _get_doctor_information(doctor_json)
    adresse = doctor_json['adresse']
    _append_converted_doctor(info_text, doctor_json, doctors)
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


def main(specialty, region, count=5):
    findAllDoctors(region, specialty, count)
    #info = (find_information(doctors_json))
    ##print(info)
    #print("Verarbeite informationen über die Ärzte...")
    #print(information_to_doctors(info))


def findAllDoctors(region, specialty,count=5):
    print("Finde passende Ärzte...")
    search = name_search(specialty, region, count)
    #print(search)
    print("Verarbeite Ärzte liste...")
    doctors_json = names_to_json(search)
    doctors_json = doctors_json[:count]
    print(doctors_json)
    print(str(len(doctors_json)) + " Ärzte gefunden...")
    print("Finde und verarbeite weitere informationen über Ärzte...")
    doctors = extendDoctors(doctors_json)
    print(doctors)
    return doctors


if __name__ == "__main__":
    main("Neurologie", "Bruchsal")

