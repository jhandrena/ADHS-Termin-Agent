import dotenv
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=dotenv.get_key("../../.env", "OPENROUTER_API_KEY"),
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
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error: {e}")
        print(completion)


def first_draft(thema, name):
    prompt_template: str = (
        "Schreibe mir eine Email zum zu einer Terminanfrage bei einem Facharzt. "
        "Ich habe bereits eine Überweisung vom Hausarzt Mein Name ist {} und ich suche so bald wie möglich einen Termin zu {}. "
        "Beginne mit 'Guten Tag' und Ende mit 'Mit freundlichen Grüßen {}'"
    )
    system_prompt: str = "Antworte nur mit dem Email Text. Der Text sollte keine optionalen Felder beinhalten"
    prompt: str = prompt_template.format(name, thema, name)
    return callApi(prompt, "openai/gpt-4o-mini", system_prompt)


def get_user_input(prompt):
    return input(prompt).strip()


if __name__ == "__main__":
    email = first_draft("ADS Diagnose", "Neurologe", "Anna Karenina")
    print(email)

