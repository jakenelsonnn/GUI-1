/*
Jacob A. Nelson, UMass Lowell Computer Science, jacob_nelson@student.uml.edu

File: hw3.js
GUI Assignment: HW3: Creating an Interactive Dynamic Table
Description: This is the javascript for HW3. For more information about HW3, please
look at index.html.

Copyright (c) 2023 by Jacob A. Nelson. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
Last modified by JN on June 16, 2023 at 9:40 AM
*/

// programatically generate the mult. table
function generateTable() {
    var width_start = parseInt(document.getElementById("width-start").value);
    var width_end = parseInt(document.getElementById("width-end").value);

    var height_start = parseInt(document.getElementById("height-start").value);
    var height_end = parseInt(document.getElementById("height-end").value);

    // input range check
    if(width_end < width_start) {
        createAlert("Width end should be greater than width start.");
        return;
    }

    if(height_end < height_start) {
        createAlert("Height end should be greater than height start.");
        return;
    }

    // check for non-numeric entry 
    if(width_start == NaN || width_end == NaN || height_start == NaN || height_end == NaN) {
        createAlert("Make sure all inputs are numeric.");
        return;
    }

    // check for too large range - creating a vary large table may cause nonresponsiveness
    var height = height_end - height_start;
    var width = width_end - width_start;
    if(width > 100 || height > 100) {
        createAlert("Input range is too large. Please enter a smaller range and try again.");
        return;
    }

    // hide any previous alert message
    hideAlert();

    var tableContainer = document.getElementById("tableContainer");
    // clear previously created table
    tableContainer.innerHTML = "";

    // create the table and the table body
    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");

    // create the first (empty) cell
    var firstRow = document.createElement("tr");
    var cell = document.createElement("th");
    cell.textContent = 0;
    firstRow.appendChild(cell);

    // create the first row after the empty cell
    for (var i = width_start; i <= width_end; i++) {
        var cell = document.createElement("th");
        cell.textContent = i;
        firstRow.appendChild(cell);
    }
    tableBody.appendChild(firstRow);

    // create the remaining rows
    for (var i = height_start; i <= height_end; i++) {
        var row = document.createElement("tr");

        // first column cell
        var firstCell = document.createElement("th");
        firstCell.textContent = i;
        row.appendChild(firstCell);

        // remaining cells
        for (var j = width_start; j <= width_end; j++) {
            var cell = document.createElement("td");
            cell.textContent = i * j;
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }

    // finally, assemble the table
    table.appendChild(tableBody);
    tableContainer.appendChild(table);
}

// makes an alert visible on the page. used for input validation.
function createAlert(message) {
    var alertBox = document.getElementById("alert");
    alertBox.style.display = "block";
    alertBox.textContent = message;
}

// hides the alert.
function hideAlert() {
    var alertBox = document.getElementById("alert");
    alertBox.style.display = "none";
}