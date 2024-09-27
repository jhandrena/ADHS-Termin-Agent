import os

import dotenv
from dotenv import load_dotenv

from langchain_community.llms import AlephAlpha
from langchain_core.prompts import PromptTemplate

def get_llm():
    load_dotenv()

    prompt = PromptTemplate.from_template(template)

    llm = AlephAlpha(
        model="llama-3.1-8b-instruct",
        maximum_tokens=20,
        stop_sequences=["Q:"],
        aleph_alpha_api_key=dotenv.get_key('.env','ALEPH_ALPHA_API_KEY'),
    )
