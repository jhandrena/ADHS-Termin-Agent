from datetime import datetime, time

# Beispiel-Datenstruktur für Arztpraxen und ihre Erreichbarkeitszeiten
praxen = {
    "Dr. Müller": [
        {"tag": "Monday", "von": time(8, 0), "bis": time(12, 0)},
        {"tag": "Monday", "von": time(14, 0), "bis": time(18, 0)},
        {"tag": "Tuesday", "von": time(8, 0), "bis": time(12, 0)},
    ],
    "Dr. Schmidt": [
        {"tag": "Monday", "von": time(9, 0), "bis": time(13, 0)},
        {"tag": "Tuesday", "von": time(14, 0), "bis": time(18, 0)},
        {"tag": "Wednesday", "von": time(9, 0), "bis": time(13, 0)},
    ],
    # Fügen Sie hier weitere Praxen hinzu
}


def erreichbare_praxen(zeitpunkt):
    wochentag = zeitpunkt.strftime("%A")
    uhrzeit = zeitpunkt.time()

    erreichbar = []

    for praxis, zeiten in praxen.items():
        for zeit in zeiten:
            if zeit["tag"] == wochentag and zeit["von"] <= uhrzeit < zeit["bis"]:
                erreichbar.append(praxis)
                break

    return erreichbar


def teste_zeit(datum_string, zeit_string):
    # Datum und Zeit aus den Eingaben kombinieren
    datetime_string = f"{datum_string} {zeit_string}"
    try:
        zeitpunkt = datetime.strptime(datetime_string, "%d.%m.%Y %H:%M")
    except ValueError:
        print(
            "Ungültiges Datum oder Zeitformat. Bitte verwenden Sie das Format TT.MM.JJJJ für das Datum und HH:MM für die Zeit.")
        return

    erreichbare = erreichbare_praxen(zeitpunkt)
    print(f"\nErreichbare Praxen am {zeitpunkt.strftime('%A, %d.%m.%Y')} um {zeitpunkt.strftime('%H:%M')} Uhr:")
    for praxis in erreichbare:
        print(f"- {praxis}")



if __name__ == "__main__":

    teste_zeit("30.09.2024","10:00")
    # Benutzer nach Datum und Zeit fragen
    datum = input("Bitte geben Sie das Datum ein (TT.MM.JJJJ): ")
    zeit = input("Bitte geben Sie die Uhrzeit ein (HH:MM): ")

    teste_zeit(datum, zeit)
