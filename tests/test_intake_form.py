import unittest
from unittest import mock
from adhs_termin_agent.patient import Patient
from adhs_termin_agent.intake_form import intake_form


class TestPatient(unittest.TestCase):
    def test_patient_initialization(self):
        patient = Patient(location="Berlin", specialty="Cardiology")
        self.assertEqual(patient.location, "Berlin")
        self.assertEqual(patient.specialty, "Cardiology")


class TestIntakeForm(unittest.TestCase):
    def test_intake_form(self):
        # Mock input to simulate user input
        with unittest.mock.patch('builtins.input', side_effect=["Cardiology", "Berlin"]):
            patient = intake_form()
            self.assertEqual(patient.specialty, "Cardiology")
            self.assertEqual(patient.location, "Berlin")


if __name__ == '__main__':
    unittest.main()
