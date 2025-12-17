document.addEventListener("DOMContentLoaded", async () => {
  const complaintSection = document.querySelector(".complaint-section");

  try {
    const response = await fetch("http://127.0.0.1:8000/complaints/");
    if (!response.ok) throw new Error("Failed to fetch complaints");

    const complaints = await response.json();
    complaintSection.innerHTML = ""; 

    complaints.forEach((complaint) => {
      const complaintBox = document.createElement("div");
      complaintBox.classList.add("complaint-box");

      // Determine status class for badge (match My Complaint page)
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
            <p><strong>Date:</strong> ${new Date(complaint.created_at).toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${complaint.description || "N/A"}</p>
            <p><strong>Status:</strong> <span class="${statusClass}">${complaint.status}</span></p>
            <p><strong>Votes:</strong> <span class="vote-count">${complaint.votes || 0}</span></p>
            <div class="vote-section">
              <button class="vote-btn">👍 Support</button>
              <a href="comment.html?id=${complaint.id}" class="comment-btn">Comment</a>
            </div>
          </div>
          <div class="image">
            <img src="${complaint.image_url ? 'http://127.0.0.1:8000/' + complaint.image_url : '../../images/icon1.png'}" alt="Problem Image" />
          </div>
        </div>
      `;

      // Add vote functionality
      const voteBtn = complaintBox.querySelector(".vote-btn");
      const voteCount = complaintBox.querySelector(".vote-count");

      voteBtn.addEventListener("click", async () => {
        try {
          const voteResponse = await fetch(`http://127.0.0.1:8000/complaints/${complaint.id}/vote`, {
            method: "POST"
          });
          if (!voteResponse.ok) throw new Error("Vote failed");

          // Update vote count in UI
          voteCount.textContent = parseInt(voteCount.textContent) + 1;
        } catch (err) {
          alert("Error voting. Try again!");
          console.error(err);
        }
      });

      complaintSection.appendChild(complaintBox);
    });

  } catch (error) {
    console.error(error);
    complaintSection.innerHTML = "<p>Error loading complaints</p>";
  }
});
