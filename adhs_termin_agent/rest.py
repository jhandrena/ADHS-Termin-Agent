from flask import Flask, request, jsonify

app = Flask(__name__)

all_doctors = []

@app.route('/doctors', methods=['GET'])
def get_doctors():
    location = request.args.get('location')
    specialty = request.args.get('specialty')





if __name__ == '__main__':
    app.run(debug=True)
