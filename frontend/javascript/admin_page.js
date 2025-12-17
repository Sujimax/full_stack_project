document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#complaints-table tbody");

  const totalCount = document.getElementById("total-count");
  const solvedCount = document.getElementById("solved-count");
  const pendingCount = document.getElementById("pending-count");

  try {
    const response = await fetch("http://127.0.0.1:8000/complaints/");
    const complaints = await response.json();

    let solved = 0;
    let pending = 0;

    complaints.forEach((complaint) => {
      // Count status
      if (complaint.status.toLowerCase() === "solved") solved++;
      else pending++;

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${complaint.id}</td>
        <td>${complaint.problem_type}</td>
        <td>${complaint.name || "N/A"}</td>
        <td>${complaint.district}</td>
        <td>${complaint.votes}</td>
        <td>${complaint.description}</td>
        <td>${new Date(complaint.created_at).toLocaleDateString()}</td>
        <td>
          <img src="${complaint.image_url ? 'http://127.0.0.1:8000/' + complaint.image_url : '../../images/icon1.png'}">
        </td>
        <td>
          <button class="view-btn" onclick="location.href='complaint_status.html'">View</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    // Update summary counts
    totalCount.textContent = complaints.length;
    solvedCount.textContent = solved;
    pendingCount.textContent = pending;

  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `<tr><td colspan="8">Error loading complaints</td></tr>`;
  }
});
