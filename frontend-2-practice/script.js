
document.addEventListener("DOMContentLoaded", function () {

    // 1. ДАННЫЕ

    const MONTHS = [
        "Январь", "Февраль", "Март",
        "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь",
        "Октябрь", "Ноябрь", "Декабрь"
    ];

    const MONTHS_GENITIVE = [
        "января", "февраля", "марта",
        "апреля", "мая", "июня",
        "июля", "августа", "сентября",
        "октября", "ноября", "декабря"
    ];

    const WEEKDAYS = [
        "Пн", "Вт", "Ср", "Чт",
        "Пт", "Сб", "Вс"
    ];

    const WEEKDAYS_FULL = [
        "Воскресенье", "Понедельник",
        "Вторник", "Среда", "Четверг",
        "Пятница", "Суббота"
    ];

    const ALL_TIMES = [
        "10:00", "11:30", "13:00",
        "14:30", "16:00", "18:00"
    ];

    // Сегодняшняя дата
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. СОСТОЯНИЕ

    const state = {
        currentMonth: today.getMonth(),
        currentYear: today.getFullYear(),
        selectedDay: today.getDate(),
        selectedTime: null,
        slots: []
    };

    // 3. ЭЛЕМЕНТЫ СТРАНИЦЫ

    const monthTitle = document.querySelector("#month-title");
    const calendarGrid = document.querySelector("#calendar-grid");
    const prevButton = document.querySelector("#prev-month");
    const nextButton = document.querySelector("#next-month");

    const timeTitle = document.querySelector("#time-title");
    const timeGrid = document.querySelector("#time-grid");

    const summaryDate = document.querySelector("#summary-date");
    const summaryTime = document.querySelector("#summary-time");
    const continueButton = document.querySelector("#continue-button");

    // 4. ЧИСТЫЕ ФУНКЦИИ

    // Сравниваем две даты
    function compareDates(date1, date2) {
        const first = new Date(
            date1.getFullYear(),
            date1.getMonth(),
            date1.getDate()
        );

        const second = new Date(
            date2.getFullYear(),
            date2.getMonth(),
            date2.getDate()
        );

        return first.getTime() - second.getTime();
    }

    // Можно ли выбрать дату?
    function isDateSelectable(day, month, year) {
        const date = new Date(year, month, day);
        return compareDates(date, today) >= 0;
    }

    // Строим календарную сетку
    function buildCalendarGrid(year, month) {
        const firstDay = new Date(year, month, 1);

        const startDay =
            (firstDay.getDay() + 6) % 7;

        const daysInMonth = new Date(
            year,
            month + 1,
            0
        ).getDate();

        const cells = [];

        for (let i = 0; i < startDay; i++) {
            cells.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            cells.push(day);
        }

        return cells;
    }

    // Демонстрационные слоты для даты
    function getSlotsForDate(day, month, year) {
        if (day === null) {
            return [];
        }

        return ALL_TIMES.map(function (time, index) {
            const busy =
                (day + month + year + index) % 4 === 0;

            return {
                time: time,
                busy: busy
            };
        });
    }

    // 5. ОТРИСОВКА КАЛЕНДАРЯ

    function renderCalendar() {
        monthTitle.textContent =
            MONTHS[state.currentMonth] +
            " " +
            state.currentYear;

        const cells = buildCalendarGrid(
            state.currentYear,
            state.currentMonth
        );

        let html = "";

        WEEKDAYS.forEach(function (day) {
            html += `
                <span class="weekday">${day}</span>
            `;
        });

        cells.forEach(function (day) {

            if (day === null) {
                html += `<span class="empty-day"></span>`;
                return;
            }

            const selectable = isDateSelectable(
                day,
                state.currentMonth,
                state.currentYear
            );

            const selected =
                day === state.selectedDay;

            let className = "day";

            if (!selectable) {
                className += " day-disabled";
            }

            if (selected && selectable) {
                className += " selected";
            }

            html += `
                <button
                    class="${className}"
                    type="button"
                    data-day="${day}"
                    ${selectable ? "" : "disabled"}
                >
                    ${day}
                </button>
            `;
        });

        calendarGrid.innerHTML = html;

        // Обработчики после перерисовки
        calendarGrid
            .querySelectorAll(".day:not(:disabled)")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    onDayClick
                );
            });

        // Запрещаем листать в прошлые месяцы
        prevButton.disabled =
            state.currentYear === today.getFullYear() &&
            state.currentMonth === today.getMonth();
    }

    // 6. ОТРИСОВКА ВРЕМЕНИ

    function renderTimeSlots() {

        if (state.selectedDay === null) {
            timeTitle.textContent =
                "Выберите дату для просмотра времени";

            timeGrid.innerHTML = "";
            return;
        }

        timeTitle.textContent =
            "Свободное время · " +
            state.selectedDay + " " +
            MONTHS_GENITIVE[state.currentMonth];

        let html = "";

        state.slots.forEach(function (slot) {

            let className = "time-slot";

            if (slot.busy) {
                className += " busy";
            }

            if (slot.time === state.selectedTime) {
                className += " active";
            }

            html += `
                <button
                    class="${className}"
                    type="button"
                    data-time="${slot.time}"
                    ${slot.busy ? "disabled" : ""}
                >
                    ${slot.time}
                </button>
            `;
        });

        timeGrid.innerHTML = html;

        timeGrid
            .querySelectorAll(".time-slot:not(:disabled)")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    onTimeSlotClick
                );
            });
    }

    // 7. НИЖНЯЯ ПАНЕЛЬ

    function updateBottomBar() {

        if (state.selectedDay === null) {
            summaryDate.textContent = "Дата не выбрана";
            summaryTime.textContent = "Время не выбрано";
            continueButton.disabled = true;
            return;
        }

        const date = new Date(
            state.currentYear,
            state.currentMonth,
            state.selectedDay
        );

        const weekday = WEEKDAYS_FULL[date.getDay()];

        summaryDate.textContent =
            weekday + ", " +
            state.selectedDay + " " +
            MONTHS_GENITIVE[state.currentMonth] + " " +
            state.currentYear;

        summaryTime.textContent =
            state.selectedTime
                ? "Время: " + state.selectedTime
                : "Время не выбрано";

        continueButton.disabled = !state.selectedTime;
    }

    // 8. ОБРАБОТЧИКИ СОБЫТИЙ

    function onDayClick(event) {

        state.selectedDay = Number(
            event.currentTarget.dataset.day
        );

        // Сбрасываем время при смене дня
        state.selectedTime = null;

        state.slots = getSlotsForDate(
            state.selectedDay,
            state.currentMonth,
            state.currentYear
        );

        renderCalendar();
        renderTimeSlots();
        updateBottomBar();
    }

    function onTimeSlotClick(event) {

        state.selectedTime =
            event.currentTarget.dataset.time;

        renderTimeSlots();
        updateBottomBar();
    }

    // Переключение месяца
    function changeMonth(direction) {

        const newDate = new Date(
            state.currentYear,
            state.currentMonth + direction,
            1
        );

        // Не допускаем прошлые месяцы
        const currentMonthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        if (newDate < currentMonthStart) {
            return;
        }

        state.currentYear = newDate.getFullYear();
        state.currentMonth = newDate.getMonth();

        // Сбрасываем выбор
        state.selectedDay = null;
        state.selectedTime = null;
        state.slots = [];

        renderCalendar();
        renderTimeSlots();
        updateBottomBar();
    }

    function setupMonthNavigation() {

        prevButton.addEventListener("click", function () {
            changeMonth(-1);
        });

        nextButton.addEventListener("click", function () {
            changeMonth(1);
        });
    }

    // Кнопка продолжения
    function setupContinueButton() {

        continueButton.addEventListener("click", function () {

            if (!state.selectedDay || !state.selectedTime) {
                return;
            }

            alert(
                "Вы выбрали запись:\n" +
                summaryDate.textContent + "\n" +
                state.selectedTime
            );
        });
    }

    // 9. ИНИЦИАЛИЗАЦИЯ

    function init() {

        state.slots = getSlotsForDate(
            state.selectedDay,
            state.currentMonth,
            state.currentYear
        );

        renderCalendar();
        renderTimeSlots();
        updateBottomBar();

        setupMonthNavigation();
        setupContinueButton();
    }

    init();

});
