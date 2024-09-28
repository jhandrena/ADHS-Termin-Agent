from flask import Flask, request, jsonify

app = Flask(__name__)

all_doctors = []

@app.route('/doctors', methods=['GET'])
def get_doctors():
    location = request.args.get('location')
    specialty = request.args.get('specialty')





@app.route('/greet', methods=['GET'])
def greet():
    thema = request.args.get('thema')
    name = request.args.get('name')

    if not thema or not name:
        return "Missing 'thema' or 'name' parameter", 400

    return f"Hello {name}, welcome to the {thema}!"
    app.run(debug=True)
