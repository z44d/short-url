const form = document.getElementById("form");
const urlInput = document.getElementById("url-input");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const customRadio = document.querySelector('input[value="custom"]');
const customWrapper = document.getElementById("custom-date-wrapper");
const customDate = document.getElementById("custom-date");

customRadio.addEventListener("change", () => {
  customWrapper.classList.toggle("show", customRadio.checked);
});

document.querySelectorAll('input[name="expiry"]').forEach((r) => {
  r.addEventListener("change", () => {
    if (r.value !== "custom") customWrapper.classList.remove("show");
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.style.display = "none";
  resultEl.style.display = "none";

  const url = urlInput.value.trim();
  if (!url) return;

  const selected = document.querySelector('input[name="expiry"]:checked');
  let ttl = 0;

  if (selected.value === "custom") {
    const d = new Date(customDate.value);
    if (!d.getTime()) {
      showError("Please select a date");
      return;
    }
    ttl = Math.floor((d - Date.now()) / 1000);
    if (ttl <= 0) {
      showError("Date must be in the future");
      return;
    }
  } else {
    ttl = Number(selected.value);
  }

  const btn = form.querySelector("button");
  btn.disabled = true;
  btn.textContent = "Shortening...";

  try {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, ttl }),
    });
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Something went wrong");
      return;
    }

    const shortUrl = `${window.location.origin}/s/${data.short_code}`;
    resultEl.innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a><button class="copy-btn" data-url="${shortUrl}">Copy</button><div class="hint">Expires: ${data.expires_at ? new Date(data.expires_at).toLocaleString() : "Never"}</div>`;
    resultEl.style.display = "block";
    resultEl
      .querySelector(".copy-btn")
      .addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        try {
          await navigator.clipboard.writeText(shortUrl);
          btn.textContent = "Copied!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 2000);
        } catch {
          showError("Failed to copy");
        }
      });
    urlInput.value = "";
  } catch (_e) {
    showError("Failed to connect");
  } finally {
    btn.disabled = false;
    btn.textContent = "Shorten";
  }
});

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.style.display = "block";
}
