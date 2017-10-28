from flask import Flask, render_template, send_from_directory
app = Flask(__name__, static_url_path='/static/')

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/data/<path:filename>', methods=["GET"])
def getData(filename):
    print(filename)
    return send_from_directory("data/", filename)
