document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const villagesByDistrict = {
    chennai: ["Ananthapuram", "Keelapatti", "Madhavaram", "Manali", "Puzhal", "Perumbakkam", "Sholinganallur"],
    coimbatore: ["Perur", "Thondamuthur", "Madukkarai", "Sulur", "Annur", "Karamadai", "Kinathukadavu"],
    madurai: ["Melur", "Alanganallur", "Vadipatti", "Usilampatti", "Peraiyur", "Kottampatti", "Chekkanoorani"],
    tiruchirappalli: ["Thottiyam", "Manachanallur", "Lalgudi", "Musiri", "Thuraiyur", "Manapparai", "Pullambadi"],
    salem: ["Attur", "Omalur", "Mettur", "Edappadi", "Yercaud", "Valapady", "Gangavalli"],
    erode: ["Bhavani", "Gobichettipalayam", "Sathyamangalam", "Perundurai", "Anthiyur", "Kodumudi", "Nambiyur"],
    vellore: ["Katpadi", "Gudiyatham", "Vaniyambadi", "Ambur", "Pernambut", "Arcot", "Anaicut"]
  };

  const districtSelect = document.getElementById("district");
  const villageSelect = document.getElementById("village");

  districtSelect.addEventListener("change", () => {
    villageSelect.innerHTML = `<option value="">-- Select Village --</option>`;

    villagesByDistrict[districtSelect.value]?.forEach(village => {
      const option = document.createElement("option");
      option.value = village;
      option.textContent = village;
      villageSelect.appendChild(option);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      problem_type: document.getElementById("problem-name").value,
      description: document.getElementById("description").value,
      district: document.getElementById("district").value,
      village: document.getElementById("village").value,
      door_no: document.getElementById("doorno").value,
      image_url: null
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/complaints/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      alert("Complaint submitted successfully ✅");
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting complaint ❌ Check console");
    }
  });
});
