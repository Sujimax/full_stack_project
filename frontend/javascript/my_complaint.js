document.addEventListener("DOMContentLoaded", async () => {
  const complaintSection = document.querySelector(".complaint-section");

  try {
    const response = await fetch("http://127.0.0.1:8000/complaints/");
    if (!response.ok) throw new Error("Failed to fetch complaints");

    const complaints = await response.json();

    complaints.forEach((complaint) => {
      const complaintBox = document.createElement("div");
      complaintBox.classList.add("complaint-box");

      let statusClass = "";
      const statusLower = complaint.status.toLowerCase();
      if (statusLower === "pending") statusClass = "status-pending";
      else if (statusLower === "in progress") statusClass = "status-in-progress";
      else if (statusLower === "solved" || statusLower === "resolved") statusClass = "status-solved";

      complaintBox.innerHTML = `
        <div class="complaint-content">
          <div class="details">
            <h2 class="problem-title">Problem: ${complaint.problem_type}</h2>
            <p><strong>District:</strong> ${complaint.district}</p>
            <p><strong>Village:</strong> ${complaint.village}</p>
            <p><strong>Door No:</strong> ${complaint.door_no || "N/A"}</p>
            <p><strong>Date:</strong> ${new Date(complaint.created_at).toLocaleString()}</p>
            <p><strong>Description:</strong> ${complaint.description || "N/A"}</p>
            <p><strong>Status:</strong> <span class="${statusClass}">${complaint.status}</span></p>
            <div class="action-section">
              <a href="edit_complaint.html?id=${complaint.id}" class="edit-btn">✏️ Edit</a>
              <button class="delete-btn">🗑️ Delete</button>
            </div>
          </div>
          <div class="image">
            <img src="${complaint.image_url ? 'http://127.0.0.1:8000/' + complaint.image_url : '../../images/icon1.png'}" alt="Problem Image" />
          </div>
        </div>
      `;

      // Delete button
      complaintBox.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this complaint?")) {
          try {
            const delResponse = await fetch(`http://127.0.0.1:8000/complaints/${complaint.id}`, {
              method: "DELETE"
            });
            if (!delResponse.ok) throw new Error("Delete failed");
            complaintBox.remove();
          } catch (err) {
            alert("Error deleting complaint");
            console.error(err);
          }
        }
      });

      complaintSection.appendChild(complaintBox);
    });
  } catch (error) {
    console.error(error);
    complaintSection.innerHTML = "<p>Error loading complaints</p>";
  }
});
