// ***** ADD NEW ITEM TO END OF LIST

// Find the first unordered list element on the page
const ul = document.querySelector('ul');

// Create a new list item
const kaleItem = document.createElement('li');
kaleItem.textContent = 'kale';

// Insert the new item at the start of the list
ul.insertBefore(kaleItem, ul.firstChild);

// ***** ADD NEW ITEM START OF LIST

// Create a new list item
const creamItem = document.createElement('li');
creamItem.textContent = 'cream';

// Insert the new item at the start of the list
ul.insertBefore(creamItem, ul.lastChild);

// ***** ADD A CLASS OF COOL TO ALL LIST ITEMS

// Get all list items on the page
const listItems = document.querySelectorAll('li');

// Iterate through the list items, and add 'cool' class to all
listItems.forEach(item => {
    item.classList.add('cool');
});

// ***** ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING

// Get the header
const h2 = document.querySelector('h2');

// Create a span element
const span = document.createElement('span');

// Set the text of the span to the length of the list
span.textContent = ul.children.length;

// add the span to the h2
h2.appendChild(span);