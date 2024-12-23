from flask import Flask, render_template, request, jsonify
import subprocess
from run_code import execute_code

app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
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