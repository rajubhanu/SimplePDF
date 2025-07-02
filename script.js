
const API_URL = "https://easy2pdf.onrender.com"; // Replace this with real backend URL
let currentTool = "";
let currentLang = "en";

document.querySelectorAll(".tool").forEach(button => {
  button.addEventListener("click", () => {
    currentTool = button.dataset.endpoint;
    document.getElementById("result").textContent = currentLang === "en"
      ? "Selected tool: " + currentTool
      : "ఎంచుకున్న టూల్: " + currentTool;
  });
});

document.getElementById("submit-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("file-input");
  if (!fileInput.files.length || !currentTool) {
    alert(currentLang === "en" ? "Please select file and tool." : "దయచేసి ఫైల్ మరియు టూల్ ఎంచుకోండి.");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const res = await fetch(`${API_URL}/${currentTool}`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Conversion failed");

    const blob = await res.blob();
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "converted_output";
    a.click();
    window.URL.revokeObjectURL(url);

    document.getElementById("result").textContent = currentLang === "en"
      ? "File downloaded!"
      : "ఫైల్ డౌన్లోడ్ అయింది!";
  } catch (err) {
    alert(currentLang === "en" ? "Error: " + err.message : "పొరపాటు: " + err.message);
  }
});

document.getElementById("lang-toggle").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "te" : "en";
  document.getElementById("title").textContent = currentLang === "en" ? "EasyPDF" : "ఈజీపీడీఎఫ్";
  document.getElementById("submit-btn").textContent = currentLang === "en" ? "Upload & Convert" : "అప్‌లోడ్ చేసి మార్చు";
  document.getElementById("lang-toggle").textContent = currentLang === "en" ? "తెలుగు" : "English";
});
