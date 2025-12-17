document.addEventListener("DOMContentLoaded", async () => {
  const complaintId = new URLSearchParams(window.location.search).get("id");
  if (!complaintId) {
    alert("No complaint ID found in URL");
    return;
  }

  const storageKey = "complaint_comments_" + complaintId; // fallback storage

  const problemTypeEl = document.getElementById("problemType");
  const districtEl = document.getElementById("district");
  const villageEl = document.getElementById("village");
  const dateEl = document.getElementById("date");
  const descriptionEl = document.getElementById("description");
  const problemImageEl = document.getElementById("problemImage");
  const commentsContainer = document.getElementById("commentsContainer");
  const commentTextEl = document.getElementById("commentText");

  // 🔹 Load complaint details
  async function loadComplaint() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}`);
      if (!res.ok) throw new Error("Failed to fetch complaint");
      const c = await res.json();

      problemTypeEl.textContent = "Problem: " + c.problem_type;
      districtEl.textContent = c.district;
      villageEl.textContent = c.village;
      dateEl.textContent = new Date(c.created_at).toLocaleDateString();
      descriptionEl.textContent = c.description || "N/A";
      problemImageEl.src = c.image_url ? "http://127.0.0.1:8000/" + c.image_url : "../../images/icon1.png";
    } catch (err) {
      console.error(err);
      alert("Could not load complaint details");
    }
  }

  // 🔹 Load comments (try backend first, fallback to localStorage)
  async function loadComments() {
    commentsContainer.innerHTML = "";
    let comments = [];

    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}/comments`);
      if (res.ok) comments = await res.json();
    } catch (err) {
      console.warn("Backend comments not available, using localStorage fallback");
    }

    // fallback
    const localComments = JSON.parse(localStorage.getItem(storageKey)) || [];
    comments = comments.length ? comments : localComments;

    comments.forEach(c => {
      const div = document.createElement("div");
      div.className = "comment-box";
      div.textContent = c.comment || c; // backend: {comment: "text"}, fallback: string
      commentsContainer.appendChild(div);
    });
  }

  // 🔹 Post comment
  document.getElementById("postComment").addEventListener("click", async () => {
    const text = commentTextEl.value.trim();
    if (!text) return alert("Please write a comment");

    // Try posting to backend
    let saved = false;
    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: text })
      });
      if (res.ok) saved = true;
    } catch (err) {
      console.warn("Backend not available, saving locally");
    }

    // Fallback: save in localStorage if backend fails
    if (!saved) {
      const localComments = JSON.parse(localStorage.getItem(storageKey)) || [];
      localComments.push(text);
      localStorage.setItem(storageKey, JSON.stringify(localComments));
    }

    commentTextEl.value = "";
    loadComments(); // refresh
  });

  // Initialize page
  await loadComplaint();
  await loadComments();
});
