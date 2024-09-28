import unittest
from adhs_termin_agent.retell.doctor_call_filter import get_list_of_callable_doctors_at

class TestDoctorCallFilter(unittest.TestCase):

    def setUp(self):
        self.doctors = [
            {
                "name": "Dr. A",
                "telefon": "123456789",
                "telefonErreichbarkeit": {
                    "montag": [{"von": "08:00", "bis": "12:00"}]
                },
                "oeffnungszeiten": {
                    "montag": ["01.10.2024"]
                }
            },
            {
                "name": "Dr. B",
                "telefon": "not set",
                "telefonErreichbarkeit": {
                    "dienstag": [{"von": "09:00", "bis": "17:00"}]
                },
                "oeffnungszeiten": {
                    "dienstag": ["02.10.2024"]
                }
            }
        ]

    def test_callable_doctors(self):
        result = get_list_of_callable_doctors_at("01.10.2024", "09:00", self.doctors)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['name'], "Dr. A")

    def test_no_callable_doctors(self):
        result = get_list_of_callable_doctors_at("01.10.2024", "13:00", self.doctors)
        self.assertEqual(len(result), 0)

if __name__ == '__main__':
    unittest.main()
