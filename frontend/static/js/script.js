// Predefined keywords for Python, C, and C++
const keywords = {
    python: [
        "False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue",
        "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import",
        "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while",
        "with", "yield", "enter", "input",
        "abs", "all", "any", "bin", "bool", "chr", "dict", "dir", "divmod", "enumerate", "eval", "exec",
        "filter", "float", "format", "getattr", "globals", "hasattr", "hash", "help", "hex", "id", "input",
        "int", "isinstance", "issubclass", "iter", "len", "list", "map", "max", "min", "next", "object",
        "oct", "open", "ord", "pow", "print", "range", "repr", "reversed", "round", "set", "slice", "sorted",
        "str", "sum", "tuple", "type", "vars", "zip"
    ],
    c: [
        "auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum",
        "extern", "float", "for", "goto", "if", "inline", "int", "long", "register", "restrict", "return",
        "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void",
        "volatile", "while", "enter", "input",
        "printf", "scanf", "malloc", "free", "strcpy", "strlen", "strcat", "strcmp", "fopen", "fclose",
        "fgets", "fputs", "fprintf", "fscanf", "atoi", "atof", "calloc", "realloc", "exit"
    ],
    cpp: [
        "alignas", "alignof", "and", "and_eq", "asm", "auto", "bitand", "bitor", "bool", "break",
        "case", "catch", "char", "char16_t", "char32_t", "class", "compl", "concept", "const", "consteval",
        "constexpr", "constinit", "const_cast", "continue", "co_await", "co_return", "co_yield", "decltype",
        "default", "delete", "do", "double", "dynamic_cast", "else", "enum", "explicit", "export",
        "extern", "false", "float", "for", "friend", "goto", "if", "inline", "int", "long", "mutable",
        "namespace", "new", "noexcept", "not", "not_eq", "nullptr", "operator", "or", "or_eq",
        "private", "protected", "public", "register", "reinterpret_cast", "requires", "return",
        "short", "signed", "sizeof", "static", "static_assert", "static_cast", "struct", "switch",
        "synchronized", "template", "this", "thread_local", "throw", "true", "try", "typedef",
        "typeid", "typename", "union", "unsigned", "using", "virtual", "void", "volatile",
        "wchar_t", "while", "xor", "xor_eq", "enter", "input",
        "cout", "cin", "endl", "vector", "map", "set", "string", "push_back", "pop_back", "begin",
        "end", "size", "sort", "find", "insert", "erase", "clear", "emplace", "swap", "lower_bound",
        "upper_bound"
    ]
};

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
