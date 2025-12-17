document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("editComplaintForm");
  const complaintId = new URLSearchParams(window.location.search).get("id")

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: form.name.value,
      problem_type: form.problem_type.value,
      description: form.description.value,
      district:form.district.value,
      village:form.village.value,
      door_no:form.door_no.value
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Failed to update complaint");

      alert("Updated successfully!");
      window.location.href = "my_complaint.html"; // redirect after update

    } catch (error) {
      console.error(error);
      alert("Error updating complaint: " + error.message);
    }
  });

  if(complaintId){
    fetch(`http://127.0.0.1:8000/complaints/${complaintId}`)
    .then(res => res.json())
    .then(data => {
     
      const prob_type = document.getElementById("problem_type")
      const descrip = document.getElementById("description")
      const district = document.getElementById("district")
      const village = document.getElementById("village")
      const doorno = document.getElementById("door_no")

      prob_type.value = data.problem_type
      district.value = data.district
      village.value = data.village
      doorno.value = data.door_no
      descrip.value = data.description
    })
  }
});
