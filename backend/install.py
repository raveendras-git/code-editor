import subprocess
import sys

def install_package(package_name):
    """Installs a given Python package and returns the result."""
    if not package_name:
        return {"error": "Package name is required"}

    try:
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", package_name],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            return {"message": f"Successfully installed {package_name}!"}
        else:
            return {"error": result.stderr}
    except Exception as e:
        return {"error": str(e)}
