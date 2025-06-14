from flask import Flask, jsonify
import os

app = Flask(__name__, static_folder='static', static_url_path='')

@app.route("/")
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000,debug=True)