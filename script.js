const calendarDays = document.getElementById('calendarDays');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const timeSlots = document.getElementById('timeSlots');
const timeSlotButtons = document.getElementById('timeSlotButtons');
const confirmAppointmentButton = document.getElementById('confirmAppointment');
const appointmentsTable = document.getElementById('appointmentsTable');

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let lastSelectedDate = null;
let appointments = [];

const timeSlotOptions = ['8:00', '10:00', '12:00', '14:00', '16:00'];

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonthElement.textContent = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDays.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        calendarDays.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;

        const currentDay = new Date(year, month, day);
        if (currentDay < new Date().setHours(0, 0, 0, 0)) {
            dayElement.classList.add('past-date');
        } else {
            dayElement.addEventListener('click', () => selectDate(currentDay));
        }

        if (currentDay.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }

        if (selectedDate && currentDay.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }

        if (lastSelectedDate && currentDay.toDateString() === lastSelectedDate.toDateString()) {
            dayElement.classList.add('last-selected');
        }

        calendarDays.appendChild(dayElement);
    }
}

function selectDate(date) {
    selectedDate = date;
    lastSelectedDate = date;
    selectedTime = null;
    renderCalendar();
    renderTimeSlots();
}

function renderTimeSlots() {
    timeSlotButtons.innerHTML = '';
    timeSlots.style.display = 'block';
    confirmAppointmentButton.style.display = 'none';

    timeSlotOptions.forEach(time => {
        const button = document.createElement('button');
        button.classList.add('time-slot');
        button.textContent = time;
        button.addEventListener('click', () => selectTime(time));
        timeSlotButtons.appendChild(button);
    });
}

function selectTime(time) {
    selectedTime = time;
    Array.from(timeSlotButtons.children).forEach(button => {
        button.classList.toggle('selected', button.textContent === time);
    });
    confirmAppointmentButton.style.display = 'block';
}

function confirmAppointment() {
    if (selectedDate && selectedTime) {
        appointments.push({ date: selectedDate, time: selectedTime });
        renderAppointments();
        scheduleToGoogleCalendar({ date: selectedDate, time: selectedTime });
        selectedDate = null;
        selectedTime = null;
        renderCalendar();
        timeSlots.style.display = 'none';
        confirmAppointmentButton.style.display = 'none';
    }
}

function renderAppointments() {
    appointmentsTable.innerHTML = '';
    appointments.forEach(appointment => {
        const row = appointmentsTable.insertRow();
        row.insertCell().textContent = appointment.date.toDateString();
        row.insertCell().textContent = appointment.time;
    });
}

function scheduleToGoogleCalendar(appointment) {
    // This is a simulated function. In a real application, this would involve server-side code and OAuth2 authentication.
    console.log('Scheduling to Google Calendar:', {
        summary: 'Appointment',
        location: 'TBD',
        description: 'Appointment scheduled via our calendar app',
        start: {
            dateTime: `${appointment.date.toISOString().split('T')[0]}T${appointment.time}:00`,
            timeZone: 'Your_Timezone'
        },
        end: {
            dateTime: `${appointment.date.toISOString().split('T')[0]}T${appointment.time.split(':')[0]}:59:59`,
            timeZone: 'Your_Timezone'
        },
        attendees: [{ email: 'alonbenzion2005@gmail.com' }]
    });
    alert(`Your appointment on ${appointment.date.toDateString()} at ${appointment.time} has been scheduled to your Google Calendar.`);
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

confirmAppointmentButton.addEventListener('click', confirmAppointment);

renderCalendar();