// AUTOMATED DATE GENERATION PART

// Generate today's date in dd-mm-yyyy format
document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB").replace(/\//g, "-");
    document.getElementById("date-of-issue").value = formattedDate;
});

// Generate current time in hh-mm format
window.onload = () => {
    const now = new Date();
    document.getElementById("time-of-issue").value = now.toTimeString().slice(0, 5);
};


// INVOICE TABLE CALCULATION PART

let slNo = 1;  // SL No. starts from 1

// Function to add a new row
function addRow() {
    const tableBody = document.querySelector(".invoice-table tbody");

    // Check if all rows are removed, reset SL No. to 1
    if (tableBody.rows.length === 1) {  // Only the Total Row remains
        slNo = 1;
    }

    // Create a new row
    const row = tableBody.insertRow(tableBody.rows.length - 1);  // Insert before the last row (Total row)

    row.innerHTML = `
                        <td>${slNo++}</td>
                        <td><input type="text" onchange="calculateRow(this)"></td>
                        <td><input type="number" onchange="calculateRow(this)" oninput="calculateRow(this)"></td>
                        <td><input type="number" onchange="calculateRow(this)" oninput="calculateRow(this)"></td>
                        <td><input type="number" onchange="calculateRow(this)" oninput="calculateRow(this)"></td>
                        <td class="total-value">0</td>
                        <td>
                            <select onchange="calculateRow(this)">
                                <option value="0">0%</option>
                                <option value="0.005">0.5%</option>
                                <option value="0.05">5%</option>
                                <option value="0.1">10%</option>
                                <option value="0.15">15%</option>
                            </select>
                        </td>
                        <td class="supp-duty">0</td>
                        <td>
                            <select onchange="calculateRow(this)">
                                <option value="0">0%</option>
                                <option value="0.005">0.5%</option>
                                <option value="0.05">5%</option>
                                <option value="0.075">7.5%</option>
                                <option value="0.1">10%</option>
                                <option value="0.15">15%</option>
                            </select>
                        </td>
                        <td class="vat">0</td>
                        <td class="total-incl-vat">0</td>
                        <td><button class="remove-row" onclick="removeRow(this)">X</button></td>
                    `;

    // Recalculate totals after adding a new row
    calculateTotal();
}

// Function to calculate the total values for a row
function calculateRow(inputElement) {
    const row = inputElement.closest('tr');

    // Get input values
    const quantity = parseFloat(row.cells[3].querySelector('input').value) || 0;
    const unitPrice = parseFloat(row.cells[4].querySelector('input').value) || 0;
    const totalValue = quantity * unitPrice;
    row.cells[5].innerText = totalValue.toFixed(2);

    const supplementaryDutyRate = parseFloat(row.cells[6].querySelector('select').value) || 0;
    const supplementaryDuty = totalValue * supplementaryDutyRate;
    row.cells[7].innerText = supplementaryDuty.toFixed(2);

    const vatRate = parseFloat(row.cells[8].querySelector('select').value) || 0;
    const vat = (totalValue + supplementaryDuty) * vatRate;
    row.cells[9].innerText = vat.toFixed(2);

    const valueIncludingSPVAT = totalValue + supplementaryDuty + vat;
    row.cells[10].innerText = valueIncludingSPVAT.toFixed(2);

    // Recalculate the total row
    calculateTotal();
}

// Function to calculate and update the total row
function calculateTotal() {
    let totalValueSum = 0, supplementaryDutySum = 0, vatRateSum = 0, vatSum = 0, valueIncludingSPVATSum = 0;

    // Get all rows except the last one (which will be the total row)
    const rows = document.querySelectorAll(".invoice-table tbody tr");

    rows.forEach(row => {
        if (!row.classList.contains('total-row')) {
            totalValueSum += parseFloat(row.cells[5].innerText) || 0;
            supplementaryDutySum += parseFloat(row.cells[7].innerText) || 0;
            vatRateSum += parseFloat(row.cells[8].innerText) || 0;
            vatSum += parseFloat(row.cells[9].innerText) || 0;
            valueIncludingSPVATSum += parseFloat(row.cells[10].innerText) || 0;
        }
    });

    // Check if total row exists, if not, create it
    let totalRow = document.querySelector(".invoice-table tbody .total-row");

    if (!totalRow) {
        totalRow = document.createElement('tr');
        totalRow.classList.add('total-row');
        totalRow.innerHTML = `
                                <td colspan="5"><strong>Total</strong></td>
                                <td class="total-value">${totalValueSum.toFixed(2)}</td>
                                <td></td>
                                <td class="supp-duty">${supplementaryDutySum.toFixed(2)}</td>
                                <td class="vat-rate">${vatRateSum.toFixed(2)}</td>
                                <td class="vat">${vatSum.toFixed(2)}</td>
                                <td class="total-incl-vat">${valueIncludingSPVATSum.toFixed(2)}</td>
                            `;

        document.querySelector(".invoice-table tbody").appendChild(totalRow);
    } else {
        totalRow.cells[1].innerText = totalValueSum.toFixed(2);
        totalRow.cells[3].innerText = supplementaryDutySum.toFixed(2);
        totalRow.cells[4].innerText = vatRateSum.toFixed(2);
        totalRow.cells[5].innerText = vatSum.toFixed(2);
        totalRow.cells[6].innerText = valueIncludingSPVATSum.toFixed(2);
    }
}

// Function to remove a row and update the total row
function removeRow(button) {
    const row = button.closest('tr');

    // Get values of the row to deduct from totals
    const totalValue = parseFloat(row.cells[5].innerText) || 0;
    const supplementaryDuty = parseFloat(row.cells[7].innerText) || 0;
    const vat = parseFloat(row.cells[9].innerText) || 0;
    const valueIncludingSPVAT = parseFloat(row.cells[10].innerText) || 0;

    // Remove the row
    row.remove();

    // Recalculate totals after removing the row
    calculateTotal();
}


// NOTICE BOX PART

// Get the buttons and notice box elements
const cashButton = document.querySelector('.cash-btn');
const onlineButton = document.querySelector('.online-btn');
const noticeBox = document.getElementById('notice-box');
const noticeMessage = document.getElementById('notice-message');
const closeButton = document.getElementById('close-btn');

// Function to show the notice box with the appropriate message
function showNotice(message) {
    noticeMessage.textContent = message; // Set the message inside the notice box
    noticeBox.style.display = 'block'; // Display the notice box
}

// Close the notice box when the "okay" button is clicked
closeButton.addEventListener('click', () => {
    noticeBox.style.display = 'none'; // Hide the notice box
});

// Event listener for the cash payment button
cashButton.addEventListener('click', () => {
    showNotice('Cash Payment Received!');
});

// Event listener for the online payment button
onlineButton.addEventListener('click', () => {
    showNotice('Online Payment Received!');
});