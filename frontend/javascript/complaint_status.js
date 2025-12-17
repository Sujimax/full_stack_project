document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#complaints-table tbody");

  try {
    const response = await fetch("http://127.0.0.1:8000/complaints/");
    if (!response.ok) throw new Error("Failed to fetch complaints");

    const complaints = await response.json();

    complaints.forEach((complaint) => {
      const row = document.createElement("tr");

      // Determine the initial status class
      let statusClass = "";
      const statusLower = complaint.status.toLowerCase();
      if (statusLower === "pending") statusClass = "pending";
      else if (statusLower === "in progress") statusClass = "in-progress";
      else if (statusLower === "solved" || statusLower === "resolved") statusClass = "solved";

      // Add the table row
      row.innerHTML = `
        <td>${complaint.id}</td>
        <td>${complaint.problem_type}</td>
        <td>${complaint.name || "N/A"}</td>
        <td>${complaint.district}</td>
        <td>${complaint.village}</td>
        <td>${complaint.door_no || "N/A"}</td>
        <td>${new Date(complaint.created_at).toLocaleDateString()}</td>
        <td><span class="status ${statusClass}">${complaint.status}</span></td>
        <td>
          <img src="${complaint.image_url ? 'http://127.0.0.1:8000/' + complaint.image_url : '../../images/icon1.png'}" alt="Problem Image" width="50">
        </td>
        <td>
          <select class="problem-status" data-complaint-id="${complaint.id}">
            <option value="in progress">In Progress</option>
            <option value="solved">Solved</option>
          </select>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      // Set the dropdown to the current status
      const statusSelect = row.querySelector(".problem-status");
      statusSelect.value = statusLower;

      // Update status on dropdown change
      statusSelect.addEventListener("change", async (e) => {
        const newStatus = e.target.value;
        const complaintId = e.target.dataset.complaintId;

        try {
          // Send update request to backend
          const res = await fetch(`http://127.0.0.1:8000/admin/complaints/${complaintId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus, solved_image: null })
          });

          if (!res.ok) throw new Error("Failed to update status");

          // Update the table visually FIRST
          const statusSpan = row.querySelector(".status");
          statusSpan.textContent = newStatus;       
          statusSpan.className = `status ${newStatus.replace(" ", "-")}`; 

          // THEN show alert
          alert("Status updated successfully!");

        } catch (err) {
          console.error(err);
          alert("Error updating status");
        }
      });

      // Delete functionality
      row.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this complaint?")) {
          try {
            const delResponse = await fetch(`http://127.0.0.1:8000/complaints/${complaint.id}`, {
              method: "DELETE"
            });
            if (!delResponse.ok) throw new Error("Delete failed");
            row.remove();
          } catch (err) {
            alert("Error deleting complaint");
            console.error(err);
          }
        }
      });

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `<tr><td colspan="10">Error loading complaints</td></tr>`;
  }
});
