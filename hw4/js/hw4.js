/*
Jacob A. Nelson, UMass Lowell Computer Science, jacob_nelson@student.uml.edu

File: hw4.js
GUI Assignment: HW4: Using the jQuery Plugin/UI with Your Dynamic Table
Description: This is the javascript for HW4. For more information about HW4, please
look at index.html.

Copyright (c) 2023 by Jacob A. Nelson. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
Last modified by JN on June 21, 2023 at 6:30 PM
*/

// initial number of tabs
var tabCounter = 0;

$(document).ready(function () {

    $(document).ready(function () {
        // Initialize jQuery UI sliders
        $("#widthstartslider").slider({
            range: "min",
            value: "1",
            min: -100,
            max: 100,
            slide: function (event, ui) {
                $("#widthstartslider").val(ui.value);
                $("#widthstart").val(ui.value);
                generateTable(false);
            }
        });

        $("#widthendslider").slider({
            range: "min",
            value: "10",
            min: -100,
            max: 100,
            slide: function (event, ui) {
                $("#widthendslider").val(ui.value);
                $("#widthend").val(ui.value);
                generateTable(false);
            }
        });

        $("#heightstartslider").slider({
            range: "min",
            value: "1",
            min: -100,
            max: 100,
            slide: function (event, ui) {
                $("#heightstartslider").val(ui.value);
                $("#heightstart").val(ui.value);
                generateTable(false);
            }
        });

        $("#heightendslider").slider({
            range: "min",
            value: "10",
            min: -100,
            max: 100,
            slide: function (event, ui) {
                $("#heightendslider").val(ui.value);
                $("#heightend").val(ui.value);
                generateTable(false);
            }
        });
    });

    // two way bind the sliders and the inputs
    function updateWidthStartSlider() {
        var sliderValue = $("#widthstart").val();
        $("#widthstartslider").slider("value", sliderValue);
        generateTable(false);
    }

    function updateWidthEndSlider() {
        var sliderValue = $("#widthend").val();
        $("#widthendslider").slider("value", sliderValue);
        generateTable(false);
    }

    function updateHeightStartSlider() {
        var sliderValue = $("#heightstart").val();
        $("#heightstartslider").slider("value", sliderValue);
        generateTable(false);
    }

    function updateHeightEndSlider() {
        var sliderValue = $("#heightend").val();
        $("#heightendslider").slider("value", sliderValue);
        generateTable(false);
    }

    // numeric inputs update the sliders on change
    $("#widthstart").on("input", updateWidthStartSlider);
    $("#widthend").on("input", updateWidthEndSlider);
    $("#heightstart").on("input", updateHeightStartSlider);
    $("#heightend").on("input", updateHeightEndSlider);

    // Add validation rules to width form
    $("#width-form").validate({
        rules: {
            widthstart: {
                required: true,
                number: true
            },
            widthend: {
                required: true,
                number: true
            }
        },
        messages: {
            widthstart: {
                required: "Please enter a width start value.",
                number: "Please enter a valid number."
            },
            widthend: {
                required: "Please enter a width end value.",
                number: "Please enter a valid number."
            }
        },
        submitHandler: function (form) {
            // Form submission logic
            if ($("#width-form").valid() && $("#height-form").valid()) {
                generateTable(false);
            } else {
                createAlert("Please fix the validation errors before generating the table.");
            }
            return false; // Prevent form submission
        }
    });

    // Custom validation method for width range check
    $.validator.addMethod("widthRangeCheck", function (value, element) {
        var start = parseFloat($("#widthstart").val());
        var end = parseFloat($("#widthend").val());
        var range = end - start;
        return range <= 100;
    }, "The width range must be less than or equal to 100.");

    // Add custom rule for range check
    $("#widthend").rules("add", {
        widthRangeCheck: true
    });

    // Custom validation method for lessthan
    $.validator.addMethod("widthEndLessThanStart", function (value, element) {
        var start = parseFloat($("#widthstart").val());
        var end = parseFloat($("#widthend").val());
        return start < end;
    }, "The Width Start value must be less than the Width End value!");

    // Add custom rule for lessthan
    $("#widthstart").rules("add", {
        widthEndLessThanStart: true
    });

    // Custom validation method for greaterthan
    $.validator.addMethod("widthStartGreaterThanEnd", function (value, element) {
        var start = parseFloat($("#widthstart").val());
        var end = parseFloat($("#widthend").val());
        return start < end;
    }, "The Width End value must be greater than the Width Start value!");

    // Add custom rule for greaterthan
    $("#widthend").rules("add", {
        widthStartGreaterThanEnd: true
    });

    /////////////////////////////////// height

    // Add validation rules to height form
    $("#height-form").validate({
        rules: {
            heightstart: {
                required: true,
                number: true
            },
            heightend: {
                required: true,
                number: true
            }
        },
        messages: {
            heightstart: {
                required: "Please enter a height start value.",
                number: "Please enter a valid number."
            },
            heightend: {
                required: "Please enter a height end value.",
                number: "Please enter a valid number."
            }
        },
        submitHandler: function (form) {
            // Form submission logic
            if ($("#width-form").valid() && $("#height-form").valid()) {
                generateTable(false);
            } else {
                createAlert("Please fix the validation errors before generating the table.");
            }
            return false; // Prevent form submission
        }
    });

    // Custom validation method for range check
    $.validator.addMethod("heightRangeCheck", function (value, element) {
        var start = parseFloat($("#heightstart").val());
        var end = parseFloat($("#heightend").val());
        var range = end - start;
        return range <= 100;
    }, "The height range must be less than or equal to 100.");

    // Add custom rule for range check
    $("#heightend").rules("add", {
        heightRangeCheck: true
    });

    // Custom validation method for lessthan
    $.validator.addMethod("heightEndLessThanStart", function (value, element) {
        var start = parseFloat($("#heightstart").val());
        var end = parseFloat($("#heightend").val());
        return start < end;
    }, "The Height Start value must be less than the Height End value!");

    // Add custom rule for lessthan
    $("#heightstart").rules("add", {
        heightEndLessThanStart: true
    });

    // Custom validation method for greaterthan
    $.validator.addMethod("heightStartGreaterThanEnd", function (value, element) {
        var start = parseFloat($("#heightstart").val());
        var end = parseFloat($("#heightend").val());
        return start < end;
    }, "The Height End value must be greater than the Height Start value!");

    // Add custom rule for greaterthan
    $("#heightend").rules("add", {
        heightStartGreaterThanEnd: true
    });

    // initialize the tabs
    $("#tabs").tabs();

    // generate the initial table
    generateTable(true);

    // make the first tab active
    $("#tabs").tabs("option", "active", 0);
});

function generateTable(tab) {
    var width_start = parseInt(document.getElementById("widthstart").value);
    var width_end = parseInt(document.getElementById("widthend").value);

    var height_start = parseInt(document.getElementById("heightstart").value);
    var height_end = parseInt(document.getElementById("heightend").value);

    // Check if both forms are valid
    if ($("#width-form").valid() && $("#height-form").valid()) {
        // hide any previous alert message
        hideAlert();

        // to store the HTML table
        var tableHtml = "";

        // Create the table and the table body
        tableHtml += "<table>";
        tableHtml += "<tbody>";

        // Create the first (empty) cell
        tableHtml += "<tr>";
        tableHtml += "<th>0</th>";

        // Create the first row after the empty cell
        for (var i = width_start; i <= width_end; i++) {
            tableHtml += "<th>" + i + "</th>";
        }
        tableHtml += "</tr>";

        // Create the remaining rows
        for (var i = height_start; i <= height_end; i++) {
            tableHtml += "<tr>";

            // First column cell
            tableHtml += "<th>" + i + "</th>";

            // Remaining cells
            for (var j = width_start; j <= width_end; j++) {
                tableHtml += "<td>" + (i * j) + "</td>";
            }
            tableHtml += "</tr>";
        }

        // Close the table body and table tags
        tableHtml += "</tbody>";
        tableHtml += "</table>";

        // Pass the HTML content to the addTab function
        if(tab) {
            addTab(tableHtml);
        } else {
            editTab(tableHtml);
        }
    } else {
        createAlert("Please fix the validation errors before generating the table.");
    }
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

// add a tab given the html content
function addTab(content) {
    var tabTitle = "Tab " + tabCounter;

    // add the tab to the list of tabs
    $("#tabs ul").append("<li><a href='#tab-" + tabCounter + "'>" + tabTitle + "</a><span class='ui-icon ui-icon-close' role='presentation'></span></li>");
    
    // add the tab content to the tab
    $("#tabs").append("<div id='tab-" + tabCounter + "'>" + content + "</div>");

    $("#tabs").tabs("refresh");
    tabCounter++;
}

// edit the current tab
function editTab(content) {
    var currentIndex = $("#tabs").tabs("option", "active");
    $("#tab-" + currentIndex).html(content);
    $("#tabs").tabs("refresh");
}