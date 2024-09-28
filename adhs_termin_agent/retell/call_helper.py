import dotenv
from retell import Retell


def place_call(name:str,specialty:str,topic:str):
    client = Retell(
        api_key=dotenv.get_key("../.env", "RETELL_API_KEY"),
    )
    web_call_response = client.call.create_web_call(
        agent_id="agent_1e0c4a3df9389fef6b0cf3c254",
    )
    print(web_call_response.agent_id)


if __name__ == "__main__":
    place_call("Max Muster","Neurologe","Autismus-Diagnose")
