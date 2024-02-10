let nextEvent = 0;
function nextEventDate(array, month, year) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == 1) {
            nextEvent = new Date(year, month, i + 1); // Correct date initialization
            break;
        }
    }
}

// Function to generate the calendar
function generateCalendar(year, month) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysElement = document.getElementById('days');
    const monthElement = document.getElementById('month');

    monthElement.textContent = `${monthNames[month]} ${year}`;

    // Clear previous days
    daysElement.innerHTML = '';

    const length = lastDay.getDate() - firstDay.getDate() + 1;
    const eventArray = new Array(length).fill(0); // Declare eventArray outside the loop

    // Fill in the days
    for (let i = 0; i < firstDay.getDay(); i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day', 'empty');
        daysElement.appendChild(dayElement);
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.classList.add('day');
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add('today');
        }

        dayElement.addEventListener('click', function () {
            const eventTitle = prompt("Enter event title:");
            if (eventTitle) {
                const eventMsg = `${eventTitle} on ${monthNames[month]} ${day}, ${year}`;
                // < !--alert(`Event added: ${eventTitle} on ${monthNames[month]} ${day}, ${year}`); -->
                // Here you can perform further actions like storing the event in a database or displaying it somewhere else on the page
                dayElement.classList.add('event');
                const showEventElement = document.createElement('div');
                showEventElement.textContent = eventMsg;
                showEventElement.classList.add('show-event');
                dayElement.appendChild(showEventElement);
                let newDate = new Date(year, month, day);
                if (newDate.getDate() > today.getDate()) {
                    if (nextEvent == 0) {
                        nextEvent = newDate;
                    }
                    else if (newDate.getDate() < nextEvent.getDate()) {
                        nextEvent = newDate;
                    }

                }
                else if (newDate.getDate() == today.getDate()) {
                    nextEvent = 0;
                }
                countdown();
            }
        });
        daysElement.appendChild(dayElement);
    }
}


// Initial calendar generation
const currentDate = new Date();
generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

function countdown() {
    if (nextEvent == 0) {
        return;
    }
    const newYearsDate = new Date(nextEvent)
    const currentDate = new Date();

    const totaltime = (newYearsDate - currentDate) / 1000;
    const days = Math.floor(totaltime / (3600 * 24));
    const hours = Math.floor(((totaltime / (3600 * 24)) - Math.floor(totaltime / (3600 * 24))) * 24);
    const minutes = Math.floor(((((totaltime / (3600 * 24)) - Math.floor(totaltime / (3600 * 24))) * 24) - (hours)) * 60);
    const seconds = Math.floor(((((((totaltime / (3600 * 24)) - Math.floor(totaltime / (3600 * 24))) * 24) - (hours)) * 60) - (minutes)) * 60);
    // // console.log(totaltime)
    // console.log(days);
    // console.log(hours)
    // console.log(minutes)
    // console.log(seconds)
    document.getElementById('day').innerHTML = formatTime(days);
    document.getElementById('hours').innerHTML = formatTime(hours);
    document.getElementById('mins').innerHTML = formatTime(minutes);
    document.getElementById('secs').innerHTML = formatTime(seconds);

}
countdown()
function formatTime(time) {
    if (time < 10) {
        return `0${time}`;
    }
    else {
        return time;
    }
}
setInterval(countdown, 1000);