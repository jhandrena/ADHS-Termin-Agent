from dotenv import load_dotenv

from adhs_termin_agent.ai_client import get_llm


def main():
    load_dotenv()
    get_llm()