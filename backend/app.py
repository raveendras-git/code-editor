from flask import Flask, render_template, request, jsonify, redirect, session, url_for
from run_code import execute_code
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

print(secrets.token_hex(32))

app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")
app.secret_key = "a73a1dd45267dc427f20f650385d0566e95b73189d076369be187445026ce9ad"

# Configure MongoDB Connection
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["CodeSphereDB"]
users_collection = db["users"]

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json(force=True)  

    full_name = data.get("fullName")
    username = data.get("username")
    password = data.get("password")

    if not full_name or not username or not password:
        return jsonify({"message": "All fields are required!"}), 400

    if users_collection.find_one({"username": username}):
        return jsonify({"message": "Username already taken!"}), 400

    hashed_password = generate_password_hash(password)

    users_collection.insert_one({
        "full_name": full_name,
        "username": username,
        "password": hashed_password
    })

    session["username"] = username
    session["full_name"] = full_name

    return jsonify({"message": "Signup successful!"}), 201

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/auth/login', methods=['POST'])
def authenticate():
    username = request.form.get("username")
    password = request.form.get("password")

    if not username or not password:
        return jsonify({"message": "Both username and password are required!"}), 400

    user = users_collection.find_one({"username": username})

    if user and check_password_hash(user["password"], password):
        session["username"] = username  
        session["full_name"] = user["full_name"]  

        return redirect(url_for('index'))  

    return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/profile')
def profile():
    if "username" not in session:
        return redirect(url_for("login_page"))

    return render_template("profile.html", full_name=session.get("full_name"), username=session.get("username"))

@app.route('/logout')
def logout():
    session.clear()  
    return redirect(url_for("login_page"))


@app.route('/run', methods=['POST'])
def run_code():
    data = request.get_json(force=True)
    language = data.get("language")
    code = data.get("code")
    user_input = data.get("input", "")

    try:
        output = execute_code(language, code, user_input)
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"output": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
