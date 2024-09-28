import json

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from adhs_termin_agent.doctor_search import findAllDoctors
from adhs_termin_agent.mail.doctor_filter import get_filtered_doctors, filter_doctors_with_email
from adhs_termin_agent.mail.mail_composer import first_draft
from adhs_termin_agent.retell.doctor_call_filter import get_next_callable_doctor, get_list_of_callable_doctors_at

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

all_doctors = []


@app.route('/doctors', methods=['POST'])
@cross_origin()
def get_doctors():
    global all_doctors
    location = request.args.get('location')
    specialty = request.args.get('specialty')

    #all_doctors = findAllDoctors(location, specialty)
    all_doctors = json.loads("""[
  {
    "name": "Dr. med. Franziska Uhrenbacher",
    "email": "",
    "telefon": "0721 / 38 80 30",
    "websiteLink": "www.neurologie-psychiatrie-karlsruhe.de",
    "terminOptionen": {
      "telefon": true,
      "email": false,
      "online": false
    },
    "patienten": {
      "privat": true,
      "kasse": false,
      "selbstzahler": true
    },
    "telefonErreichbarkeit": {
      "montag": [],
      "dienstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [],
      "donnerstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        }
      ],
      "freitag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "nach Vereinbarung",
          "bis": "nach Vereinbarung"
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "oeffnungszeiten": {
      "montag": [],
      "dienstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [],
      "donnerstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        }
      ],
      "freitag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "nach Vereinbarung",
          "bis": "nach Vereinbarung"
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "adresse": "Nowackanlage 15, 76137 Karlsruhe"
  },
  {
    "name": "Till van der List",
    "email": "",
    "telefon": "0721 / 3 19 78",
    "websiteLink": "https://www.neurologie-psychiatrie-karlsruhe.de",
    "terminOptionen": {
      "telefon": true,
      "email": false,
      "online": false
    },
    "patienten": {
      "privat": true,
      "kasse": true,
      "selbstzahler": true
    },
    "telefonErreichbarkeit": {
      "montag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "dienstag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [],
      "donnerstag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "freitag": [
        {
          "von": "12:00",
          "bis": ""
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "oeffnungszeiten": {
      "montag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "dienstag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": "nur termine",
      "donnerstag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "freitag": [
        {
          "von": "12:00",
          "bis": ""
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "adresse": "Nowackanlage 15, 76137 Karlsruhe"
  },
  {
    "name": "Dr. med. Monika Bottlender",
    "email": "",
    "telefon": "0721 / 3 19 78",
    "websiteLink": "www.neurologie-psychiatrie-karlsruhe.de",
    "terminOptionen": {
      "telefon": true,
      "email": false,
      "online": false
    },
    "patienten": {
      "privat": true,
      "kasse": false,
      "selbstzahler": true
    },
    "telefonErreichbarkeit": {
      "montag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "dienstag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [],
      "donnerstag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "freitag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "oeffnungszeiten": {
      "montag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "dienstag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [],
      "donnerstag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "freitag": [
        {
          "von": "12:00",
          "bis": "17:30"
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "adresse": "Nowackanlage 15, 76137 Karlsruhe"
  },
  {
    "name": "Friedrich Fässler",
    "email": "",
    "telefon": "0721 / 38 80 30",
    "websiteLink": "https://www.neurologie-psychiatrie-karlsruhe.de",
    "terminOptionen": {
      "telefon": true,
      "email": false,
      "online": false
    },
    "patienten": {
      "privat": true,
      "kasse": true,
      "selbstzahler": ""
    },
    "telefonErreichbarkeit": {
      "montag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "dienstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [],
      "donnerstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "freitag": [
        {
          "von": "08:00",
          "bis": "12:00"
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "oeffnungszeiten": {
      "montag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "dienstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [],
      "donnerstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "freitag": [
        {
          "von": "08:00",
          "bis": "12:00"
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "adresse": "Nowackanlage 15, 76137 Karlsruhe"
  },
  {
    "name": "Dr. med. Petra Hubrich-Durm",
    "email": "",
    "telefon": "0721 / 388030",
    "websiteLink": "www.neurologie-psychiatrie-karlsruhe.de",
    "terminOptionen": {
      "telefon": true,
      "email": false,
      "online": false
    },
    "patienten": {
      "privat": true,
      "kasse": true,
      "selbstzahler": true
    },
    "telefonErreichbarkeit": {
      "montag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "dienstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [
        {
          "von": "08:00",
          "bis": "12:00"
        }
      ],
      "donnerstag": [
        {
          "von": "08:00",
          "bis": "12:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "freitag": [
        {
          "von": "08:00",
          "bis": "12:00"
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "oeffnungszeiten": {
      "montag": [
        {
          "von": "11:00",
          "bis": "13:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "dienstag": [
        {
          "von": "11:30",
          "bis": "13:00"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "mittwoch": [],
      "donnerstag": [
        {
          "von": "11:00",
          "bis": "12:30"
        },
        {
          "von": "15:00",
          "bis": "17:30"
        }
      ],
      "freitag": [
        {
          "von": "00:00",
          "bis": "12:00"
        }
      ],
      "samstag": [],
      "sonntag": []
    },
    "adresse": "Nowackanlage 15, 76137 Karlsruhe"
  }
]""")
    return all_doctors


@app.route('/doctors/phone', methods=['Get'])
def get_phonable_doctors():
    global all_doctors
    date = request.args.get('date')
    time = request.args.get('time')
    print(type(all_doctors))
    print(type(all_doctors[0]))
    #available_now = get_list_of_callable_doctors_at(date, time, all_doctors)

    available_now = get_list_of_callable_doctors_at("01.10.2024", "09:00", all_doctors)
    print(available_now)
    return available_now


@app.route('/doctors/mail', methods=['get'])
@cross_origin()
def get_mailable_doctors():
    global all_doctors
    return filter_doctors_with_email(all_doctors)


@app.route('/mail', methods=['GET'])
@cross_origin()
def greet():
    thema = request.args.get('thema')
    name = request.args.get('name')

    if not thema or not name:
        return "Missing 'thema' or 'name' parameter", 400

    return first_draft(thema, name)


if __name__ == '__main__':
    app.run(debug=True)
