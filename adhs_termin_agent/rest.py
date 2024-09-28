import json

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from adhs_termin_agent.doctor_search import findAllDoctors
from adhs_termin_agent.mail.doctor_filter import get_filtered_doctors, filter_doctors_with_email
from adhs_termin_agent.mail.mail_composer import first_draft
from adhs_termin_agent.retell.doctor_call_filter import get_list_of_callable_doctors_at
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

    all_doctors = findAllDoctors(location, specialty)
    
    return all_doctors

@app.route('/doctors/phone', methods=['GET'])
@cross_origin()
def get_phonable_doctors():
    global all_doctors
    date = request.args.get('date')
    time = request.args.get('time')
    available_now = get_list_of_callable_doctors_at(date, time, all_doctors)
    return jsonify(available_now)

@app.route('/doctors/mail', methods=['GET'])
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
