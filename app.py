from flask import Flask, jsonify
import os

app = Flask(__name__, static_folder='static', static_url_path='')

@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/api/images")
def getImagePaths():
    img_dir = os.path.join(app.static_folder, 'images')

    files = []
    for f in os.listdir(img_dir):
        if f.lower().endswith('.jpg'):
            files.append(f)
    
    paths = []
    for file in files:

        title = os.path.splitext(file)[0].replace('_', ' ')

        paths.append({
            "src":      f"/images/{file}",
            "title":    title
        })

    return jsonify(paths)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001,debug=True)