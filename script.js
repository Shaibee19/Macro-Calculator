// When the page loads, set up everything
document.addEventListener("DOMContentLoaded", function () {
  updateDate();
});

// Set up click events
function setupEventListeners() {
  addButton.addEventListener("click", openAddModal);
  closeButton.addEventListener("click", closeModal);
  saveButton.addEventListener("click", saveItem);

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// Update the date in the header
function updateDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[now.getDay()];

  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  document.getElementById("currentDay").textContent = dayName;
  document.getElementById("currentDate").textContent = formattedDate;
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Get references to all necessary HTML elements by their IDs
  const calculateBtn = document.getElementById("calculate__btn");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const ageInput = document.getElementById("age");
  const activityLevelSelect = document.getElementById("activity__level");

  const maintenanceCaloriesSpan = document.getElementById(
    "maintenance__calories"
  );
  const proteinGramsSpan = document.getElementById("protein__grams");
  const carbsGramsSpan = document.getElementById("carbs__grams");
  const fatsGramsSpan = document.getElementById("fats__grams");

  // Add an event listener to the calculate button
  calculateBtn.addEventListener("click", calculateMacros);

  // Calculates the suggested macros based on user input. retrieves values, performs calculations, and displays results
  function calculateMacros() {
    // Parse (making sure its a full number) input values as floating-point numbers
    const weight = parseFloat(weightInput.value); // weight in kilograms (kg)
    const height = parseFloat(heightInput.value); // height in centimeters (cm)
    const age = parseFloat(ageInput.value); // age in years (yrs)
    const activityLevel = parseFloat(activityLevelSelect.value); // activity multiplier

    // Basic validation: check if inputs are valid numbers
    if (
      isNaN(weight) ||
      isNaN(height) ||
      isNaN(age) ||
      weight <= 0 ||
      height <= 0 ||
      age <= 0
    ) {
      // Use a custom message box instead of alert() for better UX
      displayMessage(
        "Please enter valid positive numbers for weight, height, and age."
      );
      // Clear previous results if inputs are invalid
      maintenanceCaloriesSpan.textContent = "";
      proteinGramsSpan.textContent = "";
      carbsGramsSpan.textContent = "";
      fatsGramsSpan.textContent = "";
      return; // Stop the function if validation fails
    }

    // Mifflin-St Jeor Equation for Basal Metabolic Rate (BMR). formula is a common standard - for simplicity, we are using the male formula
    let bmr = 10 * weight + 6.25 * weight - 5 * age + 5;

    // Calculate Total Daily Energy Expenditure (TDEE) - also known as maintenance calories. TDEE = BMR x Activity Level Factor
    const maintenanceCalories = bmr * activityLevel;

    // Macro calculations based on common percentaged of total calories: Protein: ~30% of total calories, Carbohydrates: ~40% of total calories, and Fats: ~30% of total calories
    const protienCalories = maintenanceCalories * 0.3;
    const carbsCalories = maintenanceCalories * 0.4;
    const fatsCalories = maintenanceCalories * 0.3;

    // Convert calories to grams using standard caloric values per gram: Protein: 4 cal per gram, Carbohydrates: 4 cal per gram, and Fats: 9 cal per gram
    const protienGrams = protienCalories / 4;
    const carbsGrams = carbsCalories / 4;
    const fatsGrams = fatsCalories / 9;

    // Display the calculated results in the respective span elements .toFixed(0) rounds the number to a whole integer
    maintenanceCaloriesSpan.textContent = maintenanceCalories.toFixed(0);
    proteinGramsSpan.textContent = proteinGrams.toFixed(0);
    carbsGramsSpan.textContent = carbsGrams.toFixed(0);
    fatsGramsSpan.textContent = fatsGrams.toFixed(0);
  }

  function displayMessage(message) {
    // Create a div element for the message box
    const messageBox = document.createElement("div");
    messageBox.className = "custom__message--box";
    messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
        font-family: 'Inter', Arial, sans-serif;
        color: #333;
        font-size: 1.1em;
        max-width: 300px;
        line-height: 1.5;
    `;

    // Create a paragraph for the message text
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageBox.appendChild(messageText);

    // Create a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "OK";
    closeButton.style.cssText = `
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 15px;
        font-size: 1em;
        transition: background-color 0.3s ease;
    `;
    closeButton.onmouseover = () =>
      (closeButton.style.backgroundColor = "#0056b3"); // Like the hover effect in HTML
    closeButton.onmouseout = () =>
      (closeButton.style.backgroundColor = "#007bff");
    closeButton.onclick = () => document.body.removeChild(messageBox); // Remove message box on click
    messageBox.appendChild(closeButton);

    // Append the message box to the body
    document.body.appendChild(messageBox);
  }
});
