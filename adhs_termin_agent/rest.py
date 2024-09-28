from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/doctors', methods=['GET'])
def get_doctors():
    location = request.args.get('location')
    specialty = request.args.get('specialty')

    # Dummy data for demonstration purposes
    doctors = [
        {"name": "Dr. Smith", "location": "Berlin", "specialty": "Cardiology"},
        {"name": "Dr. Jones", "location": "Munich", "specialty": "Neurology"},
        {"name": "Dr. Brown", "location": "Berlin", "specialty": "Dermatology"},
    ]

    # Filter doctors based on location and specialty
    filtered_doctors = [
        doctor for doctor in doctors
        if doctor['location'] == location and doctor['specialty'] == specialty
    ]

    return jsonify(filtered_doctors)

if __name__ == '__main__':
    app.run(debug=True)
