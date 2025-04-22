document.getElementById('htmlCode').addEventListener('input', RunCode);
document.getElementById('cssCode').addEventListener('input', RunCode);
document.getElementById('jsCode').addEventListener('input', RunCode);

function RunCode() {
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = '<style>' + document.getElementById('cssCode').value + '</style>';
    const jsCode = document.getElementById('jsCode').value;

    const previewFrame = document.getElementById('preview');
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;

    previewDoc.open();
    previewDoc.write(htmlCode + cssCode); // Write HTML & CSS first
    previewDoc.close();

    // Create a script element for JavaScript
    const script = previewDoc.createElement("script");
    script.textContent = jsCode;
    previewDoc.body.appendChild(script);
}

function toggleHTML() {
    const htmlTextarea = document.getElementById('htmlCode');
    htmlTextarea.style.display = (htmlTextarea.style.display === 'none') ? 'block' : 'none';
}

function toggleCSS() {
    const cssTextarea = document.getElementById('cssCode');
    cssTextarea.style.display = (cssTextarea.style.display === 'none') ? 'block' : 'none';
}

function toggleJS() {
    const jsTextarea = document.getElementById('jsCode');
    jsTextarea.style.display = (jsTextarea.style.display === 'none') ? 'block' : 'none';
}

function ShowOutput() {
    const outPutArea = document.getElementById('preview');
    outPutArea.style.display = (outPutArea.style.display === 'none') ? 'block' : 'none';
}

function checkDisplaySize() {
    if (window.innerWidth < 750) {
        document.getElementById('content').classList.add('hidden');
        document.getElementById('alertMessage').style.display = 'block';
        alert("Please make sure you have a bigger display");
    }
}

function reloadPage() {
    location.reload();
}

window.onload = checkDisplaySize;
window.onresize = checkDisplaySize;

function toggleHTML() {
    const htmlEditor = document.getElementById("htmlCode");
    const htmlStatus = document.querySelector(".html .status-circle");
    if (htmlEditor.style.display === "none" || htmlEditor.style.display === "") {
        htmlEditor.style.display = "block";
        htmlStatus.classList.add("filled");
    } else {
        htmlEditor.style.display = "none";
        htmlStatus.classList.remove("filled");
    }
}

function toggleCSS() {
    const cssEditor = document.getElementById("cssCode");
    const cssStatus = document.querySelector(".css .status-circle");
    if (cssEditor.style.display === "none" || cssEditor.style.display === "") {
        cssEditor.style.display = "block";
        cssStatus.classList.add("filled");
    } else {
        cssEditor.style.display = "none";
        cssStatus.classList.remove("filled");
    }
}

function toggleJS() {
    const jsEditor = document.getElementById("jsCode");
    const jsStatus = document.querySelector(".js .status-circle");
    if (jsEditor.style.display === "none" || jsEditor.style.display === "") {
        jsEditor.style.display = "block";
        jsStatus.classList.add("filled");
    } else {
        jsEditor.style.display = "none";
        jsStatus.classList.remove("filled");
    }
}

window.onload = function () {
    document.getElementById("htmlCode").style.display = "block";
    document.getElementById("cssCode").style.display = "block";
    document.getElementById("jsCode").style.display = "block";
};
