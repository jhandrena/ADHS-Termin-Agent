from typing import List, Dict
from openai import OpenAI
import threading
import dotenv

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
    return (completion.choices[0].message.content)

class Doctor:
    def __init__(self, name: str, phone: str, email: str, address: str, url: str) -> None:
        self.name = name
        self.phone = phone
        self.email = email
        self.address = address
        self.url = url

def search_doctors(specialty: str, location: str) -> List[Doctor]:
    return [
        Doctor(name="Dr. Müller", phone="123-456-7890", email="dr.mueller@example.com", address="123 Main St, Berlin", url="http://drmueller.com"),
        Doctor(name="Dr. Schmidt", phone="098-765-4321", email="dr.schmidt@example.com", address="456 Elm St, Berlin", url="http://drschmidt.com"),
    ]

def name_search(specialty: str, location: str) -> str: 
    prompt_template: str = """Gib mir eine liste mit namen und Adressen von {} in {}. """
    system_prompt:str = "verwende folgende quellen:arztsuche: https://arztsuche.116117.de/, yameda, doctolib, das örtliche"
    prompt: str = prompt_template.format(specialty,location,system_prompt)
    return callApi(prompt,"perplexity/llama-3.1-sonar-large-128k-online")


def names_to_json(search_results: str):
    pass

def find_information(names) -> str:
    pass

def information_to_doctor(information: str):
    pass

if __name__ == "__main__":
    print(name_search("Neurologe","Karlsruhe"))