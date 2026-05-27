let currentUsername = "";

async function analyze() {
  // 1. Grab the raw input text safely
  let usernameInput = document.getElementById("username");
  if (!usernameInput) {
    console.error("Could not find the HTML input field with ID 'username'");
    return;
  }

  let username = usernameInput.value.trim();
  
  // 2. Automatically clean up if someone types or pastes 'github.com/username'
  if (username.includes("github.com/")) {
    username = username.split("github.com/").pop().split("/")[0];
    usernameInput.value = username; // Clean it up visually in the box
  }

  const purpose = document.getElementById("purpose").value;
  const btn = document.querySelector(".btn-primary");
  const errorEl = document.getElementById("error-msg");

  if (!username) return;

  // 3. Set UI Processing Feedback State
  btn.disabled = true;
  document.getElementById("btn-text").textContent = "Analyzing...";
  errorEl.classList.add("hidden");
  document.getElementById("results").classList.add("hidden");

  try {
    console.log("Sending request to backend for username:", username);
    const res = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, purpose })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || "Something went wrong.";
      errorEl.classList.remove("hidden");
      return;
    }

    currentUsername = username;
    renderResults(data);
  } catch (err) {
    console.error("Fetch operational error:", err);
    errorEl.textContent = "Network error. Check your terminal console.";
    errorEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    document.getElementById("btn-text").textContent = "Analyze →";
  }
}

function renderResults(data) {
  const { profile, email } = data;

  document.getElementById("avatar").src = profile.avatar_url;
  document.getElementById("profile-name").textContent = profile.name;
  document.getElementById("profile-bio").textContent = profile.bio || "No bio provided.";
  document.getElementById("stat-repos").textContent = profile.public_repos;
  document.getElementById("stat-followers").textContent = profile.followers;

  const langContainer = document.getElementById("lang-bars");
  langContainer.innerHTML = "";
  
  if (profile.top_languages && profile.top_languages.length > 0) {
    profile.top_languages.forEach(lang => {
      const barWrapper = document.createElement("div");
      barWrapper.className = "lang-bar-wrapper";
      barWrapper.innerHTML = `
        <div class="lang-info">
          <span class="lang-name">${lang.name}</span>
          <span class="lang-pct">${lang.percentage}%</span>
        </div>
        <div class="bar-container">
          <div class="bar-fill" id="bar-${lang.name}"></div>
        </div>
      `;
      langContainer.appendChild(barWrapper);
      
      setTimeout(() => {
        const fillElement = document.getElementById(`bar-${lang.name}`);
        if (fillElement) fillElement.style.width = `${lang.percentage}%`;
      }, 50);
    });
  } else {
    langContainer.innerHTML = `<p class="muted small">No explicit repository code languages found.</p>`;
  }

  const repoBox = document.getElementById("top-repo");
  if (profile.top_repo) {
    document.getElementById("top-repo-link").href = profile.top_repo.url;
    document.getElementById("top-repo-link").textContent = profile.top_repo.name;
    document.getElementById("top-repo-desc").textContent = profile.top_repo.description;
    document.getElementById("top-repo-stars").textContent = `⭐ ${profile.top_repo.stars} stars`;
    repoBox.classList.remove("hidden");
  } else {
    repoBox.classList.add("hidden");
  }

  document.getElementById("email-body").textContent = email;
  document.getElementById("results").classList.remove("hidden");
}

function copyEmail() {
  const text = document.getElementById("email-body").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(".email-actions button");
    const originalText = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = originalText), 1800);
  });
}

function exportExcel() {
  if (!currentUsername) return;
  window.open(`/export/${currentUsername}`, "_blank");
}

async function toggleHistory() {
  const panel = document.getElementById("history-panel");
  if (!panel.classList.contains("hidden")) {
    panel.classList.add("hidden");
    return;
  }

  const res = await fetch("/history");
  const data = await res.json();
  const list = document.getElementById("history-list");

  if (!data.length) {
    list.innerHTML = `<p style="color: var(--muted); font-size: 0.88rem;">No searches recorded yet.</p>`;
  } else {
    list.innerHTML = data.map(item => `
      <div class="history-item" onclick="document.getElementById('username').value='${item.username}'; analyze(); toggleHistory();">
        <span class="history-username">@${item.username}</span>
        <span class="history-meta">${item.repo_count} repos · ${item.top_languages.join(", ")}</span>
      </div>
    `).join("");
  }
  
  panel.classList.remove("hidden");
}