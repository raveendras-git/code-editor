function runCode() {
  let code = document.getElementById("code-editor").value;
  let input = document.getElementById("input-box").value;
  let outputBox = document.getElementById("output-box");

  try {
      let result = eval(code);
      outputBox.innerText = result !== undefined ? result : "No output";
  } catch (error) {
      outputBox.innerText = "Error: " + error.message;
  }
}

  // Initialize CodeMirror
  const editor = CodeMirror(document.getElementById('code'), {
      mode: 'python',
      theme: 'dracula',
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
    });

    function runCode() {
      var language = document.getElementById("language-select").value; // Get the selected language
      var code = editor.getValue(); // Get the code from the CodeMirror editor
      var userInput = document.getElementById("input-box").value; // Get the input from the textarea
  
      // Create the data object to send to the backend
      var data = {
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
          document.getElementById("output-box").textContent = data.output;
      })
      .catch(error => {
          document.getElementById("output-box").textContent = "Error: " + error;
      });
  }
  