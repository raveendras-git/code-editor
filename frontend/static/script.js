// Initialize CodeMirror editor globally
window.editor = CodeMirror(document.getElementById("code"), {
    mode: "python",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true
});

document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];

    if (file) {
        const fileName = file.name;
        document.getElementById("fileName").innerText = " " + fileName;

        // Detect file extension and set language
        let fileExtension = fileName.split('.').pop().toLowerCase();
        let languageSelect = document.getElementById("language-select");

        if (fileExtension === "py") {
            languageSelect.value = "python";
            window.editor.setOption("mode", "python");
        } else if (fileExtension === "c") {
            languageSelect.value = "c";
            window.editor.setOption("mode", "text/x-csrc");
        } else if (fileExtension === "cpp") {
            languageSelect.value = "cpp";
            window.editor.setOption("mode", "text/x-c++src");
        }

        // Read and display file content in CodeMirror
        const reader = new FileReader();
        reader.onload = function(e) {
            window.editor.setValue(e.target.result); // Set content correctly
        };
        reader.readAsText(file);
    }
});

// Run Code Function
function runCode() {
    const language = document.getElementById("language-select").value;
    const code = window.editor.getValue();
    const userInput = document.getElementById("input-box").value;
    const outputBox = document.getElementById("output-box");

    // Create a data object to send to the backend
    const data = {
        language: language,
        code: code,
        input: userInput
    };

    // Send the request to the backend
    fetch('/run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        outputBox.textContent = data.output;
    })
    .catch(error => {
        outputBox.textContent = "Error: " + error.message;
    });
}
