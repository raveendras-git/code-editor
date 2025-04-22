// Initialize CodeMirror editor
window.editor = CodeMirror(document.getElementById("code"), {
    mode: "text/x-python",
    lineNumbers: true,
    theme: "neat",
    matchBrackets: true,
    autoCloseBrackets: true,
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    }
});

function customHint(editor) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const currentLang = document.getElementById("language-select").value;

    const list = keywords[currentLang].filter((kw) => kw.startsWith(token.string));
    return {
        list: list.length ? list : keywords[currentLang],
        from: CodeMirror.Pos(cursor.line, token.start),
        to: CodeMirror.Pos(cursor.line, token.end)
    };
}

window.editor.on("inputRead", function(cm, event) {
    if (!cm.state.completionActive) {
        cm.showHint({ hint: customHint, completeSingle: false });
    }
});

document.getElementById("language-select").addEventListener("change", function() {
    let selectedLang = this.value;
    let mode = "text/x-python";

    if (selectedLang === "c") mode = "text/x-csrc";
    else if (selectedLang === "cpp") mode = "text/x-c++src";

    window.editor.setOption("mode", mode);
});

document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];

    if (file) {
        const fileName = file.name;
        document.getElementById("fileName").innerText = " " + fileName;

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

        const reader = new FileReader();
        reader.onload = function(e) {
            window.editor.setValue(e.target.result);
        };
        reader.readAsText(file);
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleFileSection");
    const fileSection = document.querySelector(".file-section");

    toggleButton.addEventListener("click", function () {
        fileSection.classList.toggle("show");
    });
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
