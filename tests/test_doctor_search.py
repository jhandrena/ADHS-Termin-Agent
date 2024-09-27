import unittest
from adhs_termin_agent.doctor_search import Doctor, search_doctors

class TestDoctor(unittest.TestCase):
    def test_doctor_initialization(self) -> None:
        doctor = Doctor(name="Dr. Müller", phone="123-456-7890", email="dr.mueller@example.com", address="123 Main St, Berlin", url="http://drmueller.com")
        self.assertEqual(doctor.name, "Dr. Müller")
        self.assertEqual(doctor.phone, "123-456-7890")
        self.assertEqual(doctor.email, "dr.mueller@example.com")
        self.assertEqual(doctor.address, "123 Main St, Berlin")
        self.assertEqual(doctor.url, "http://drmueller.com")

class TestSearchDoctors(unittest.TestCase):
    def test_search_doctors(self) -> None:
        doctors = search_doctors(specialty="Cardiology", location="Berlin")
        self.assertEqual(len(doctors), 2)
        self.assertEqual(doctors[0].name, "Dr. Müller")
        self.assertEqual(doctors[1].name, "Dr. Schmidt")

if __name__ == '__main__':
    unittest.main()
