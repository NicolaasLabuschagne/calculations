// Initialize variables for the projections
let unitPrice, unitSize, levies, rates, bondCost, rentalIncome, capitalGrowth, ltv, interestRate, loanTerm, rentEscalation;
let yearsAhead = 0;  // Start at the current year
// Event listener for the calculate button
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the section with the specified ID
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
        console.log(`Section ${sectionId} is now displayed.`);
    }
}
document.getElementById("calculateBtn").addEventListener("click", function () {
  // Collect the form data
  unitPrice = parseFloat(document.getElementById("unitPrice1").value);
  unitSize = parseFloat(document.getElementById("unitSize1").value);
  levies = parseFloat(document.getElementById("levies1").value);
  rates = parseFloat(document.getElementById("rates1").value);
  bondCost = parseFloat(document.getElementById("bondCost1").value);
  rentalIncome = parseFloat(document.getElementById("rentalIncome1").value);
  capitalGrowth = parseFloat(document.getElementById("capitalGrowth1").value) / 100;
  ltv = parseFloat(document.getElementById("ltv1").value) / 100;
  interestRate = parseFloat(document.getElementById("interestRate1").value) / 100;
  loanTerm = parseInt(document.getElementById("loanTerm1").value);
  rentEscalation = parseInt(document.getElementById("RentalEscalation1").value) / 100;

  // Validate required fields
  if (
    isNaN(unitPrice) || isNaN(unitSize) || isNaN(levies) || isNaN(rates) || 
    isNaN(bondCost) || isNaN(rentalIncome) || isNaN(capitalGrowth) ||
    isNaN(ltv) || isNaN(interestRate) || isNaN(loanTerm)
  ) {
    alert("Please fill in all fields with valid numbers.");
    return; // Stop execution if validation fails
  }

  // Save the data to localStorage
  const propertyData = {
    unitPrice,
    unitSize,
    levies,
    rates,
    bondCost,
    rentalIncome,
    capitalGrowth,
    ltv,
    interestRate,
    loanTerm
  };
  localStorage.setItem("propertyData", JSON.stringify(propertyData));
  updateFinancialSituation();
});

function updateFinancialSituation(){
  // Get the current year and selected target year
  const currentYear = new Date().getFullYear();
  const targetYear = parseInt(document.getElementById("currentYear").textContent);
  yearsAhead = targetYear - currentYear;
  // Initial calculations
  const monthlyCost = bondCost + levies + rates; //????????????????????Remember to write the code for bondcost and levies calculations.
  const annualCost = monthlyCost * 12;
  let projectedRentalIncome = rentalIncome;
  let projectedLoanBalance = unitPrice * ltv;

  // Apply projections for the selected year
  for (let i = 0; i < yearsAhead; i++) {
    projectedRentalIncome *= 1 + rentEscalation; // Apply rent escalation
    projectedLoanBalance -= (projectedLoanBalance / loanTerm); // Reduce loan balance annually
  }

  // Calculate other financial values
  const annualIncome = projectedRentalIncome * 12;
  const netOperatingIncome = annualIncome - annualCost;
  const capRate = ((netOperatingIncome / unitPrice) * 100).toFixed(2);
  const grm = (unitPrice / annualIncome).toFixed(2);
  const roi = (((annualIncome - annualCost) / unitPrice) * 100).toFixed(2);

    // Display the results in the #calculate section
    document.getElementById("annualIncome2").textContent = `R${annualIncome}`;
    document.getElementById("rentalIncome2").textContent = `R${projectedRentalIncome.toFixed(2)}`;
    document.getElementById("monthlyCost2").textContent = `R${monthlyCost.toFixed(2)}`;
    document.getElementById("annualCost2").textContent = `R${annualCost.toFixed(2)}`;
    document.getElementById("noi2").textContent = `R${netOperatingIncome.toFixed(2)}`;
    document.getElementById("capRate2").textContent = `${capRate}%`;
    document.getElementById("grm2").textContent = grm;
    document.getElementById("roi2").textContent = `${roi}%`;

    // Show the calculate section and hide others only after successful validation
  showSection('calculate');

  // Generate charts
  //generateCharts(rentalIncome, monthlyCost, capitalGrowth, unitPrice, loanTerm);
}
// Event listener for the "Next Year" button
document.getElementById("nextYearBtn").addEventListener("click", function () {
  const yearElement = document.getElementById("currentYear");
  let currentYear = parseInt(yearElement.textContent);
  currentYear += 1;  // Increase the year by 1
  yearElement.textContent = currentYear;

  // Update the financial situation for the next year
  updateFinancialSituation();
});

// Event listener for the "Previous Year" button
document.getElementById("prevYearBtn").addEventListener("click", function () {
  const yearElement = document.getElementById("currentYear");
  let currentYear = parseInt(yearElement.textContent);
  currentYear -= 1;  // Decrease the year by 1
  yearElement.textContent = currentYear;

  // Update the financial situation for the previous year
  updateFinancialSituation();
});
window.onload = function() {
    // Retrieve the stored property data from localStorage
    const storedData = localStorage.getItem("propertyData");
    if (storedData) {
        const propertyData = JSON.parse(storedData);

        // Example calculation for monthly cost (just an example, adjust as needed)
        const rentalIncome = propertyData.rentalIncome;
        const bondCost = propertyData.bondCost;
        const monthlyCost = bondCost + propertyData.levies + propertyData.rates;
        const roi = ((rentalIncome - monthlyCost) / monthlyCost) * 100;

        // Display the results
        document.getElementById("rentalIncome").textContent = `R${rentalIncome}`;
        document.getElementById("monthlyCost").textContent = `R${monthlyCost}`;
        document.getElementById("roi").textContent = `${roi.toFixed(2)}%`;

        // Optionally, generate charts
        //generateCharts(rentalIncome, monthlyCost, propertyData.capitalGrowth, propertyData.unitPrice, propertyData.loanTerm);
    } else {
        alert("No data available.");
    }
};
  // Generate charts function
  /*function generateCharts(rentalIncome, totalMonthlyCost, capitalGrowth, unitPrice, loanTerm) {
    const cashFlowCtx = document.getElementById("cashFlowChart").getContext("2d");
    const growthCtx = document.getElementById("capitalGrowthChart").getContext("2d");
  
    const cashFlowData = Array.from({ length: loanTerm }, (_, i) => rentalIncome - totalMonthlyCost);
    const growthData = Array.from({ length: loanTerm }, (_, i) => unitPrice * Math.pow(1 + capitalGrowth, i + 1));
  
    new Chart(cashFlowCtx, {
      type: 'line',
      data: {
        labels: Array.from({ length: loanTerm }, (_, i) => `Year ${i + 1}`),
        datasets: [{
          label: "Cash Flow (R)",
          data: cashFlowData,
          borderColor: '#f5ba2f',
          backgroundColor: 'rgba(245, 186, 47, 0.2)',
          fill: true,
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#f0f0f0' } },
        },
        scales: {
          x: { ticks: { color: '#f0f0f0' }, grid: { color: '#333' } },
          y: { ticks: { color: '#f0f0f0' }, grid: { color: '#333' } },
        }
      }
    });
  
    new Chart(growthCtx, {
      type: 'line',
      data: {
        labels: Array.from({ length: loanTerm }, (_, i) => `Year ${i + 1}`),
        datasets: [{
          label: "Property Value (R)",
          data: growthData,
          borderColor: '#77c2f2',
          backgroundColor: 'rgba(119, 194, 242, 0.2)',
          fill: true,
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#f0f0f0' } },
        },
        scales: {
          x: { ticks: { color: '#f0f0f0' }, grid: { color: '#333' } },
          y: { ticks: { color: '#f0f0f0' }, grid: { color: '#333' } },
        }
      }
    });
  }
  // When the dashboard page is loaded, populate the form with the data from localStorage*/
  document.addEventListener("DOMContentLoaded", function () {
    const propertyData = JSON.parse(localStorage.getItem("propertyData"));
    
    if (propertyData) {
      document.getElementById("unitPrice").value = propertyData.unitPrice || '';
      document.getElementById("unitSize").value = propertyData.unitSize || '';
      document.getElementById("levies").value = propertyData.levies || '';
      document.getElementById("rates").value = propertyData.rates || '';
      document.getElementById("bondCost").value = propertyData.bondCost || '';
      document.getElementById("rentalIncome").value = propertyData.rentalIncome || '';
      document.getElementById("capitalGrowth").value = propertyData.capitalGrowth || '';
      document.getElementById("ltv").value = propertyData.ltv || '';
      document.getElementById("interestRate").value = propertyData.interestRate || '';
      document.getElementById("loanTerm").value = propertyData.loanTerm || '';
    }
  });