import json

from flask import Flask, request, jsonify

from adhs_termin_agent.doctor_search import findAllDoctors
from adhs_termin_agent.mail.doctor_filter import get_filtered_doctors, filter_doctors_with_email
from adhs_termin_agent.mail.mail_composer import first_draft

app = Flask(__name__)

all_doctors = []

@app.route('/doctors', methods=['POST'])
def get_doctors():
    global all_doctors
    location = request.args.get('location')
    specialty = request.args.get('specialty')

    #all_doctors = findAllDoctors(location, specialty)
    all_doctors = json.loads("""[
    {
        "email": "info@praxis-drstienen.de",
        "name": "Dr. med. Michael H. Stienen",
        "oeffnungszeiten": {
            "dienstag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                },
                {
                    "bis": "17:00",
                    "von": "14:00"
                }
            ],
            "donnerstag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                },
                {
                    "bis": "17:00",
                    "von": "14:00"
                }
            ],
            "freitag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                }
            ],
            "mittwoch": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                }
            ],
            "montag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                }
            ],
            "samstag": [],
            "sonntag": []
        },
        "patienten": {
            "kasse": false,
            "privat": true,
            "selbstzahler": true
        },
        "telefon": "0721 669801-11",
        "telefonErreichbarkeit": {
            "dienstag": [],
            "donnerstag": [],
            "freitag": [],
            "mittwoch": [],
            "montag": [],
            "samstag": [],
            "sonntag": []
        },
        "terminOptionen": {
            "email": true,
            "online": false,
            "telefon": true
        },
        "websiteLink": "www.praxis-drstienen.de"
    },
    {
        "email": "not set",
        "name": "Dr. Ulrich Husemann",
        "oeffnungszeiten": {
            "dienstag": [
                {
                    "bis": "17:30",
                    "von": "12:30"
                }
            ],
            "donnerstag": [
                {
                    "bis": "17:30",
                    "von": "12:30"
                }
            ],
            "freitag": [
                {
                    "bis": "not set",
                    "von": "12:30"
                }
            ],
            "mittwoch": [
                {
                    "bis": "not set",
                    "von": "12:30"
                }
            ],
            "montag": [
                {
                    "bis": "17:30",
                    "von": "12:30"
                }
            ],
            "samstag": [],
            "sonntag": []
        },
        "patienten": {
            "kasse": true,
            "privat": true,
            "selbstzahler": true
        },
        "telefon": "07 21 / 35 60 03 oder 07 21 / 35 80 89",
        "telefonErreichbarkeit": {
            "dienstag": [],
            "donnerstag": [],
            "freitag": [],
            "mittwoch": [],
            "montag": [],
            "samstag": [],
            "sonntag": []
        },
        "terminOptionen": {
            "email": false,
            "online": true,
            "telefon": false
        },
        "websiteLink": "www.neuropraxiskarlsruhe.de"
    },
    {
        "email": "not set",
        "name": "Neurologie am ZKM",
        "oeffnungszeiten": {
            "dienstag": [
                {
                    "bis": "18:00",
                    "von": "13:00"
                }
            ],
            "donnerstag": [
                {
                    "bis": "13:00",
                    "von": "08:30"
                }
            ],
            "freitag": [],
            "mittwoch": [
                {
                    "bis": "18:00",
                    "von": "13:00"
                }
            ],
            "montag": [],
            "samstag": [],
            "sonntag": []
        },
        "patienten": {
            "kasse": true,
            "privat": true,
            "selbstzahler": "not set"
        },
        "telefon": "+49 721 814068",
        "telefonErreichbarkeit": {
            "dienstag": [
                {
                    "bis": "18:00",
                    "von": "13:00"
                }
            ],
            "donnerstag": [
                {
                    "bis": "13:00",
                    "von": "08:30"
                }
            ],
            "freitag": [],
            "mittwoch": [
                {
                    "bis": "18:00",
                    "von": "13:00"
                }
            ],
            "montag": [],
            "samstag": [],
            "sonntag": []
        },
        "terminOptionen": {
            "email": false,
            "online": false,
            "telefon": true
        },
        "websiteLink": "https://www.neurologie-am-zkm.de/"
    },
    {
        "email": "info@neurologie-durlach.de",
        "name": "Dr. Mareile Brachmann",
        "oeffnungszeiten": {
            "dienstag": [
                {
                    "bis": "13:00",
                    "von": "08:30"
                },
                {
                    "bis": "18:00",
                    "von": "15:00"
                }
            ],
            "donnerstag": [
                {
                    "bis": "12:30",
                    "von": "08:30"
                },
                {
                    "bis": "17:00",
                    "von": "14:00"
                }
            ],
            "freitag": [
                {
                    "bis": "13:30",
                    "von": "08:30"
                }
            ],
            "mittwoch": [
                {
                    "bis": "13:30",
                    "von": "08:30"
                }
            ],
            "montag": [
                {
                    "bis": "13:00",
                    "von": "08:30"
                },
                {
                    "bis": "18:00",
                    "von": "14:00"
                }
            ],
            "samstag": [],
            "sonntag": []
        },
        "patienten": {
            "kasse": true,
            "privat": true,
            "selbstzahler": true
        },
        "telefon": "+49 721 9424770",
        "telefonErreichbarkeit": {
            "dienstag": [
                {
                    "bis": "08:30",
                    "von": "08:10"
                }
            ],
            "donnerstag": [
                {
                    "bis": "08:30",
                    "von": "08:10"
                }
            ],
            "freitag": [
                {
                    "bis": "08:30",
                    "von": "08:10"
                }
            ],
            "mittwoch": [
                {
                    "bis": "08:30",
                    "von": "08:10"
                }
            ],
            "montag": [
                {
                    "bis": "08:30",
                    "von": "08:10"
                }
            ],
            "samstag": [],
            "sonntag": []
        },
        "terminOptionen": {
            "email": false,
            "online": false,
            "telefon": true
        },
        "websiteLink": "www.nap-schenk.de"
    },
    {
        "email": "not set",
        "name": "Dr. Friedrich Fäßler",
        "oeffnungszeiten": {
            "dienstag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                },
                {
                    "bis": "17:30",
                    "von": "15:00"
                }
            ],
            "donnerstag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                },
                {
                    "bis": "17:30",
                    "von": "15:00"
                }
            ],
            "freitag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                }
            ],
            "mittwoch": [],
            "montag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                },
                {
                    "bis": "17:30",
                    "von": "15:00"
                }
            ],
            "samstag": [],
            "sonntag": []
        },
        "patienten": {
            "kasse": true,
            "privat": true,
            "selbstzahler": "not set"
        },
        "telefon": "0721 / 38 80 30",
        "telefonErreichbarkeit": {
            "dienstag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                },
                {
                    "bis": "17:30",
                    "von": "15:00"
                }
            ],
            "donnerstag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                },
                {
                    "bis": "17:30",
                    "von": "15:00"
                }
            ],
            "freitag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                }
            ],
            "mittwoch": [],
            "montag": [
                {
                    "bis": "12:00",
                    "von": "08:00"
                },
                {
                    "bis": "17:30",
                    "von": "15:00"
                }
            ],
            "samstag": [],
            "sonntag": []
        },
        "terminOptionen": {
            "email": false,
            "online": false,
            "telefon": true
        },
        "websiteLink": "www.neurologie-psychiatrie-karlsruhe.de"
    }
]""")
    return all_doctors

@app.route('/doctors/mail', methods=['get'])
def get_mailable_doctors():
    global all_doctors
    return filter_doctors_with_email(all_doctors)


@app.route('/mail', methods=['GET'])
def greet():
    thema = request.args.get('thema')
    name = request.args.get('name')

    if not thema or not name:
        return "Missing 'thema' or 'name' parameter", 400

    return first_draft(thema,name)


if __name__ == '__main__':
    app.run(debug=True)