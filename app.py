from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/robot')
def robot():
    return render_template('robot.html')

@app.route('/loop')
def loop():
    return render_template('loop.html')

@app.route('/looper')
def looper():
    return render_template('looper.html')

@app.route('/race')
def race():
    return render_template('race.html')

@app.route('/explain')
def explain():
    return render_template('explain.html')

@app.route('/predict')
def predict():
    return render_template('predict.html')

if __name__ == '__main__':
    app.run(debug=True)

