let currentFolderHandle = null;
let currentFileHandle = null;

async function selectFolder() {
  try {
    const dirHandle = await window.showDirectoryPicker();
    currentFolderHandle = dirHandle;
    document.getElementById("folderTree").innerHTML = "";
    await loadFiles(dirHandle);
  } catch (error) {
    console.error("Folder selection canceled:", error);
  }
}

async function loadFiles(dirHandle, parentElement = null) {
  for await (const entry of dirHandle.values()) {
    const listItem = document.createElement("li");
    listItem.textContent = entry.name;
    listItem.style.fontWeight = entry.kind === "directory" ? "bold" : "normal";

    if (entry.kind === "directory") {
      let isExpanded = false;
      let sublist = document.createElement("ul");
      sublist.style.display = "none";

      listItem.addEventListener("click", async (event) => {
        event.stopPropagation();
        if (isExpanded) {
          sublist.style.display = "none";
          sublist.innerHTML = "";
        } else {
          await loadFiles(entry, sublist);
          sublist.style.display = "block";
        }
        isExpanded = !isExpanded;
      });

      listItem.appendChild(sublist);
    } else {
      listItem.addEventListener("click", async () => {
        await openFile(entry);
      });
    }

    if (parentElement) {
      parentElement.appendChild(listItem);
    } else {
      document.getElementById("folderTree").appendChild(listItem);
    }
  }
}

async function openFile(fileHandle) {
  try {
    const file = await fileHandle.getFile();
    const content = await file.text();
    const fileName = file.name;

    document.getElementById("fileName").textContent = fileName;
    window.editor.setValue(content); // Load content into CodeMirror
    setEditorMode(fileName);
  } catch (error) {
    console.error("Error opening file:", error);
  }
}

function setEditorMode(fileName) {
  let fileExtension = fileName.split(".").pop().toLowerCase();
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
}

async function saveFile() {
  if (!currentFileHandle) {
    alert("No file selected!");
    return;
  }

  try {
    const writable = await currentFileHandle.createWritable();
    await writable.write(window.editor.getValue()); // Save from CodeMirror editor
    await writable.close();
    alert("File saved successfully!");
  } catch (error) {
    console.error("Error saving file:", error);
  }
}

async function downloadFolder() {
  if (!currentFolderHandle) {
    alert("No folder selected!");
    return;
  }

  const zip = new JSZip();

  async function addFilesToZip(dirHandle, folder) {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file") {
        const file = await entry.getFile();
        const content = await file.arrayBuffer();
        folder.file(entry.name, content);
      } else {
        const subFolder = folder.folder(entry.name);
        await addFilesToZip(entry, subFolder);
      }
    }
  }

  await addFilesToZip(currentFolderHandle, zip);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(zipBlob);
  link.download = "folder.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
