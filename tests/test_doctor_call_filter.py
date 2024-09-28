import json
import unittest
from adhs_termin_agent.retell.doctor_call_filter import get_list_of_callable_doctors_at

class TestDoctorCallFilter(unittest.TestCase):

    def setUp(self):
        self.doctors = json.loads("""[
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

    def test_callable_doctors(self):
        result = get_list_of_callable_doctors_at("01.10.2024", "09:00", self.doctors)
        self.assertGreater(len(result), 0)
        self.assertEqual(result[0]['name'], "Dr. med. Franziska Uhrenbacher")

    def test_no_callable_doctors(self):
        result = get_list_of_callable_doctors_at("01.10.2024", "13:00", self.doctors)
        self.assertEqual(len(result), 0)

if __name__ == '__main__':
    unittest.main()
