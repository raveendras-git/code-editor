import subprocess
import sys
import tempfile
import os


def execute_code(language, code, user_input):
    # Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        file_map = {
            "python": "script.py",
            "c": "program.c",
            "cpp": "program.cpp",
            "java": "Program.java",
        }

        if language not in file_map:
            raise ValueError("Unsupported language")

        # Create the full path for the file in the temporary directory
        filename = os.path.join(temp_dir, file_map[language])

        # Write the code to the temporary file
        with open(filename, "w") as f:
            f.write(code)

        # Define commands for each language
        if language == "python":
            python_path = sys.executable  # Automatically gets the current Python interpreter path
            command = [python_path, filename]
        elif language == "c":
            subprocess.run(["gcc", filename, "-o", os.path.join(temp_dir, "program")])
            command = [os.path.join(temp_dir, "program")]
        elif language == "cpp":
            subprocess.run(["g++", filename, "-o", os.path.join(temp_dir, "program")])
            command = [os.path.join(temp_dir, "program")]
        elif language == "java":
            subprocess.run(["javac", filename])
            command = ["java", "-cp", temp_dir, "Program"]

        # Execute the command
        process = subprocess.Popen(
            command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        stdout, stderr = process.communicate(input=user_input)

        if stderr:
            return stderr.strip()
        return stdout.strip()
