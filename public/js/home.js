// Data
var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
let today = new Date();
let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
console.log(firstDayOfMonth.getDay())
let lastDayOfMonth = new Date(today.getYear(), today.getMonth() + 1, 0).getDate();



//////////

const daysContainer = document.getElementById('days');
// Add days from previous month
for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    let dayForContainer = document.createElement("li");
    dayForContainer.appendChild(document.createTextNode(""));
    daysContainer.appendChild(dayForContainer);
}



// Add days to calendar
for (let i = 1; i <= lastDayOfMonth; i++) {
    let dayForContainer = document.createElement("li");
    dayForContainer.appendChild(document.createTextNode(i));
    daysContainer.appendChild(dayForContainer);
}

