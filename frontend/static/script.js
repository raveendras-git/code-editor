document.getElementById('run-btn').addEventListener('click', async () => {
  const code = editor.getValue(); // Get code from CodeMirror
  const input = document.getElementById('input').value || ''; // Ensure input is not null
  const language = document.getElementById('language').value;

  const response = await fetch('/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, input, language }),
  });

  const result = await response.json();
  document.getElementById('output').innerText = result.output || 'No Output';
});


document.getElementById('run-btn').addEventListener('click', async () => {
  const code = editor.getValue(); // Get code from CodeMirror
  const input = document.getElementById('input').value || ''; // Ensure input is not null
  const language = document.getElementById('language').value;

  const response = await fetch('/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, input, language }),
  });

  const result = await response.json();
  document.getElementById('output').innerText = result.output || 'No Output';
});
