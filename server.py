import os
from flask import Flask, render_template, send_from_directory, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
import random

################################################################################
# App config
################################################################################
UPLOAD_FOLDER = 'data/'
ALLOWED_EXTENSIONS = set(["csv"])
app = Flask(__name__, static_url_path='/static')
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['SESSION_TYPE'] = 'filesystem'

################################################################################
# GET Routes
################################################################################
@app.route('/')
def root():
    fname = request.args.get('filename')
    if fname == None:
        fname = "examples/example.csv"
    return render_template('index.html', LocationData=fname)

@app.route('/data/<path:filename>', methods=["GET"])
def getData(filename):
    return send_from_directory("data/", filename)

################################################################################
# File upload
################################################################################
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/data', methods=["POST"])
def uploadData():
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('root', filename=filename ))
