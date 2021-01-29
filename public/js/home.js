const MONTH_NAMES = [
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
const DAYS_IN_CALENDAR = document.getElementById('days');
const MONTH_IN_CALENDAR = document.getElementById('month');
const YEAR_IN_CALENDAR = document.getElementById('year');

const TODAY = new Date();
let firstDayOfMonth;
let lastDayOfMonth;
let currentMonth;
let currentYear;

function previousMonth() {
    let newMonthValue;
    let newYearValue;
    if (currentMonth==0) {
        newMonthValue = 11;
        newYearValue = currentYear - 1;
    } else {
        newMonthValue = currentMonth-1;
        newYearValue = currentYear;
    }
    let newToday = new Date(newYearValue, newMonthValue, 1, 0, 0, 0, 0);
    initializeCalendar(newToday);
}

function nextMonth() {
    let newMonthValue;
    let newYearValue;
    if (currentMonth==11) {
        newMonthValue = 0;
        newYearValue = currentYear + 1;
    } else {
        newMonthValue = currentMonth+1;
        newYearValue = currentYear;
    }
    let newToday = new Date(newYearValue, newMonthValue, 1, 0, 0, 0, 0);
    initializeCalendar(newToday);
}


//////////
function addDaysFromPreviousMonthToCalendar() {
    DAYS_IN_CALENDAR.innerHTML = "";
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        let dayForContainer = document.createElement("li");
        dayForContainer.appendChild(document.createTextNode(""));
        DAYS_IN_CALENDAR.appendChild(dayForContainer);
    }
}

function addDaysToCalendar(presentDate, dateValue, coffeeData) {
    let calendarMonth = dateValue.getMonth();
    
    let todayInCalendar; // For checking if Today's date is in the calendar
    if (presentDate.getFullYear() == dateValue.getFullYear() && presentDate.getMonth() == dateValue.getMonth()) {
        todayInCalendar = presentDate.getDate();
    }

    for (let i = 1; i <= lastDayOfMonth; i++) {
        let dayForContainer = document.createElement("li");
        let divInsideDay = document.createElement("div");
        if (i==todayInCalendar) {
            divInsideDay.setAttribute('id', 'today');            
        }
        if (coffeeData[calendarMonth].hasOwnProperty(i)) {
            divInsideDay.setAttribute('tooltip', coffeeData[calendarMonth][i]);
        }        
        
        divInsideDay.appendChild(document.createTextNode(i));   
        dayForContainer.appendChild(divInsideDay);
        
        DAYS_IN_CALENDAR.appendChild(dayForContainer);
    }
}

async function initializeCalendar(dateValue) {
    let response = await fetch('/calendar?year='+dateValue.getFullYear());
    let coffeeData = await response.json();

    firstDayOfMonth = new Date(dateValue.getFullYear(), dateValue.getMonth(), 1);
    lastDayOfMonth = new Date(dateValue.getYear(), dateValue.getMonth() + 1, 0).getDate();
    currentMonth = dateValue.getMonth();
    currentYear = dateValue.getFullYear();

    MONTH_IN_CALENDAR.textContent = MONTH_NAMES[currentMonth];
    YEAR_IN_CALENDAR.textContent = currentYear;

    addDaysFromPreviousMonthToCalendar();
    addDaysToCalendar(TODAY, dateValue, coffeeData);
}
//////////
initializeCalendar(TODAY);