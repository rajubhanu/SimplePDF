

const API_URL = "https://easypdf-9rhu.onrender.com/"; // Replace with your backend URL
let currentTool = "";
const langToggle = document.getElementById('lang-toggle');
const title = document.getElementById('title');
const submitBtn = document.getElementById('submit-btn');
let currentLang = "en";

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "te" : "en";
  langToggle.textContent = currentLang === "en" ? "తెలుగు" : "English";
  title.textContent = currentLang === "en" ? "EasyPDF" : "ఈజీపీడీఎఫ్";
  submitBtn.textContent = currentLang === "en" ? "Upload & Convert" : "అప్‌లోడ్ చేయి & మార్చు";
});

document.querySelectorAll(".tool").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTool = btn.dataset.endpoint;
    document.getElementById("result").textContent = (currentLang === "en" ? "Selected: " : "ఎంచుకున్నది: ") + currentTool;
  });
});

submitBtn.addEventListener("click", async () => {
  const fileInput = document.getElementById("file-input");
  if (!fileInput.files.length) {
    alert(currentLang === "en" ? "Please upload a file." : "దయచేసి ఫైల్ ఎంచుకోండి.");
    return;
  }
  if (!currentTool) {
    alert(currentLang === "en" ? "Please select a tool." : "దయచేసి టూల్ ఎంచుకోండి.");
    return;
  }
  
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  
  try {
    const response = await fetch(`${API_URL}/${currentTool}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      alert((currentLang === "en" ? "Error: " : "పొరపాటు: ") + text);
      return;
    }

    const blob = await response.blob();
    // Try to get filename from content-disposition header
    let filename = "output.pdf";
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.indexOf('filename=') !== -1) {
      filename = disposition.split('filename=')[1].replace(/["']/g, '');
    }

    // Download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    document.getElementById("result").textContent = currentLang === "en" ? "File downloaded!" : "ఫైల్ డౌన్లోడ్ అయింది!";

  } catch (error) {
    alert((currentLang === "en" ? "Request failed: " : "అనुरोधం విఫలం: ") + error.message);
  }
});
