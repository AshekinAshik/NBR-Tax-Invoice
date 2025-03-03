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

let paymentAmount = 0;

// Function to calculate and update the total row
function calculateTotal() {
    let totalValueSum = 0, supplementaryDutySum = 0, vatSum = 0, vatRateSum = 0, valueIncludingSPVATSum = 0;

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

    paymentAmount = vatSum.toFixed(2);
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
// onlineButton.addEventListener('click', () => {
//     showNotice('Online Payment Received!');
// });


// EXTRACT DATA FOR CUSTOEMR REPORT

// document.addEventListener("DOMContentLoaded", function () {
//     function exportInvoiceData(paymentChannel) {
//         let table = document.querySelector(".invoice-table");

//         // Extract table header names
//         let headers = [];
//         table.querySelectorAll("thead th").forEach(headerCell => {
//             headers.push(headerCell.innerText.trim());
//         });

//         // Extract table body data (including manually inserted data and dropdown selections)
//         let invoiceData = [];
//         let tableRows = table.querySelectorAll("tbody tr");
//         tableRows.forEach(row => {
//             let rowData = [];

//             row.querySelectorAll("td").forEach(cell => {
//                 let cellData = "";

//                 // Check if the cell contains a text input or textarea (manually inserted data)
//                 let input = cell.querySelector("input, textarea");
//                 if (input) {
//                     cellData = input.value.trim();  // Manually entered data in input fields
//                 } else {
//                     // For normal text or dropdown selections
//                     let select = cell.querySelector("select");
//                     if (select) {
//                         cellData = select.value.trim();  // Value from dropdown selection
//                     } else {
//                         cellData = cell.innerText.trim();  // Regular cell data (text)
//                     }
//                 }

//                 rowData.push(cellData);  // Push the extracted data into the row data
//             });
//             invoiceData.push(rowData);
//         });

//         // Extract total row values (footer row)
//         let totalValues = [];
//         let totalRow = table.querySelector("tfoot tr");
//         if (totalRow) {
//             totalRow.querySelectorAll("td").forEach(cell => {
//                 totalValues.push(cell.innerText.trim());
//             });
//         }

//         // Prepare the JSON data to export
//         let dataToExport = {
//             headers: headers,      // Headers (column names)
//             invoiceData: invoiceData,   // Table data rows
//             totalValues: totalValues,   // Total row values
//             paymentChannel: paymentChannel  // Payment channel (cash or online)
//         };

//         // Convert the data to JSON format
//         let jsonData = JSON.stringify(dataToExport, null, 2);

//         // Create a Blob for the JSON data
//         let blob = new Blob([jsonData], { type: "application/json" });
//         let url = URL.createObjectURL(blob);

//         // Create a download link for the JSON file
//         let link = document.createElement("a");
//         link.href = url;
//         link.download = "invoice_data.json"; // The file name
//         document.body.appendChild(link);  // Add the link to the document
//         link.click();  // Trigger the download
//         document.body.removeChild(link); // Clean up after download
//         URL.revokeObjectURL(url); // Free memory used by Blob
//     }

//     // Add event listeners to payment buttons
//     document.getElementById("cash-btn").addEventListener("click", function () {
//         exportInvoiceData("cash");
//     });

//     document.getElementById("online-btn").addEventListener("click", function () {
//         exportInvoiceData("online");
//     });
// });


// AUTHENTICATE
async function authentication() {
    const clientId = "1103472d3be149ecb0b62020059e7fd8";
    const clientSecret = "876e2b94b18e2219";

    const authHeader = btoa(`${clientId}:${clientSecret}`);

    try {
        const response = await fetch('https://api-UAT.dgepay.net/dipon/v3/payment_gateway/authenticate', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authHeader}`
            }
        });

        const data = await response.text();  // Get the response as text (XML format)
        console.log(data)

        if (response.ok) {
            // Parse the XML response
            // const parser = new DOMParser();
            // const xmlDoc = parser.parseFromString(data, 'application/xml');
            // const statusCode = xmlDoc.getElementsByTagName('status_code')[0].textContent;
            const parseData = JSON.parse(data)
            console.log("res", parseData)
            // const data = response.data
            if (parseData?.status_code === 200) {
                // const accessToken = xmlDoc.getElementsByTagName('access_token')[0].textContent;
                // Save access token to sessionStorage
                const accessToken = parseData?.data?.access_token;
                sessionStorage.setItem('access_token', accessToken);
                // Redirect to transaction page
                // window.location.href = 'transaction.html';
                transaction();
            } else {
                throw new Error('Authentication failed');
            }
        } else {
            throw new Error('Request failed');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// new code for signature
function createCheckSum(payload) {
    let checkSumString = '';
    let stringPayload;

    try {
        stringPayload = JSON.stringify(payload)
        // console.log("stringPayload", stringPayload)
        checkSumString = stringPayload.replace(/[{}\[\]=\s,"":]/g, "")

        console.log("\n checkSumString", checkSumString)
        return checkSumString;
    } catch (e) {
        console.error(e?.stack);
        return;
    }
}

function encryptPayload(body, SECRET_KEY) {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY); // Assuming password is 16 bytes or less
    // Ensure key is 16 bytes (similar to Java's `Arrays.copyOf(secretKey.getBytes("UTF-8"), 16);`)
    const key16 = key.clone(); // Ensure we are not modifying the original key object
    key16.words = key16.words.slice(0, 4);  // slice the array to ensure it is exactly 16 bytes long
    // Encrypt the data using AES in ECB mode with PKCS7 padding
    const encrypted = CryptoJS.AES.encrypt(body, key16, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7  // Ensure the padding is PKCS7, like Java default
    });
    // Convert the result (CipherParams) to Base64 and return
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function sanitizeString(input) {
    input = JSON.stringify(input);
    console.log("Original String:", input);
    // Use a regular expression to remove unwanted characters
    const sanitizedString = input.replace(/[{\"}:, ]/g, '');
    console.log("Sanitized String:", sanitizedString);
    return sanitizedString;
}


function formatParams(params) {
    let formatted = "";
    const sortedKeys = Object.keys(params).sort(); // Sort the keys alphabetically
    for (const key of sortedKeys) {
        const value = params[key];
        if (typeof value === 'object' && value !== null) {
            formatted += key + formatParams(value); // Handle nested objects with sorted keys
        } else {
            formatted += key + value;
        }
    }
    return formatted;
}

function generateUDID() {
    // Generate a random unique identifier
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0; // Generate a random number
        const v = c === 'x' ? r : (r & 0x3) | 0x8; // Apply RFC 4122 rules for UUID
        return v.toString(16); // Convert to hexadecimal
    });
}

async function transaction() {
    let amount = paymentAmount;
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken) {
        console.log("no accessToken");
        errorMessage.textContent = 'Authentication failed. Please log in again.';
        return;
    }

    amount = parseFloat(amount);
    // Prepare transaction data
    const params = {
        // amount: amount + .21,
        amount: amount,
        customer_token: null,
        note: "Purchasing Test E Ticket",
        payee_information: {
            dial_code: '+88',
            phone_number: '01711111111'
        },
        payment_method: null,
        redirect_url: 'https://www.google.com/',
        unique_txn_id: generateUDID()
        //unique_txn_id: 'XYZ_002'
    };

    // Format the parameters into a single string and sanitize
    const formattedParams = sanitizeString(formatParams(params));


    // Generate HMAC Signature
    const apiKey = "b4ecb09a87bd4c38bec5e35337e5e2d0";

    // New Code for signature
    requestPayload = Object.keys(params).sort().reduce(function (result, key) {
        result[key] = params[key];
        return result;
    }, {});
    let payloadStr = this.createCheckSum(requestPayload);
    const hmac = CryptoJS.HmacSHA256(payloadStr, apiKey);
    const signature = CryptoJS.enc.Base64.stringify(hmac);
    //End

    // Encrypt payload
    const secretKey = "876e2b94b18e2219";
    const jsonString = JSON.stringify(params);
    var encryptedPayload = await encryptPayload(jsonString, secretKey);

    // Send the request to initiate payment
    try {
        const response = await fetch('https://api-UAT.dgepay.net/dipon/v3/payment_gateway/initiate_payment', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'signature': signature
            },
            body: encryptedPayload
        });

        // const data = await response.json();
        // successMessage.textContent = response.text()

        const data = await response.text();
        console.log(data);
        if (response.ok) {
            // Get the XML string from the response
            // const xmlString = await response.text();

            // // Parse the XML string into a DOM object
            // const parser = new DOMParser();
            // const xmlDoc = parser.parseFromString(xmlString, "application/xml");

            // // Extract values from the XML
            // const status_code = xmlDoc.getElementsByTagName("status_code")[0].textContent;
            // const webview_url = xmlDoc.getElementsByTagName("webview_url")[0].textContent;
            // const unique_txn_id = xmlDoc.getElementsByTagName("unique_txn_id")[0].textContent;

            // // Create a JSON object
            // const jsonResponse = {
            //     status_code: status_code,
            //     data: {
            //         webview_url: webview_url,
            //         unique_txn_id: unique_txn_id
            //     }
            // };

            // Log the resulting JSON object
            const parseData = JSON.parse(data)
            const gateway_url = parseData.data.webview_url;

            window.open(gateway_url, "_blank");
            // window.location.replace(gateway_url);
        } else {
            throw new Error('Failed to initiate payment');
        }
    } catch (error) {
        console.log(error.message);
    }
}