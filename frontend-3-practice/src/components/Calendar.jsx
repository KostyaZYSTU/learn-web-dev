
import { useState } from "react";

const MONTHS = [
    "Январь", "Февраль", "Март",
    "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь",
    "Октябрь", "Ноябрь", "Декабрь"
];

const WEEKDAYS = [
    "Пн", "Вт", "Ср", "Чт",
    "Пт", "Сб", "Вс"
];

function Calendar({ selectedDate, onDateChange }) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentMonth, setCurrentMonth] = useState(
        today.getMonth()
    );

    const [currentYear, setCurrentYear] = useState(
        today.getFullYear()
    );

    // Количество дней в месяце
    const daysInMonth = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

    // День недели первого числа
    const firstDay = new Date(
        currentYear,
        currentMonth,
        1
    );

    const startDay = (firstDay.getDay() + 6) % 7;

    // Формируем массив дней
    const calendarDays = [
        ...Array(startDay).fill(null),
        ...Array.from(
            { length: daysInMonth },
            (_, index) => index + 1
        )
    ];

    // Проверяем прошедшие даты
    function isPastDate(day) {
        const date = new Date(
            currentYear,
            currentMonth,
            day
        );

        return date < today;
    }

    // Переключаем месяц
    function changeMonth(direction) {

        const newDate = new Date(
            currentYear,
            currentMonth + direction,
            1
        );

        const currentMonthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        if (newDate < currentMonthStart) {
            return;
        }

        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());

        onDateChange(null);
    }

    return (
        <section className="calendar">

            <div className="calendar-header">

                <button
                    className="month-button"
                    onClick={() => changeMonth(-1)}
                    disabled={
                        currentMonth === today.getMonth() &&
                        currentYear === today.getFullYear()
                    }
                >
                    ‹
                </button>

                <h3 className="calendar-title">
                    {MONTHS[currentMonth]} {currentYear}
                </h3>

                <button
                    className="month-button"
                    onClick={() => changeMonth(1)}
                >
                    ›
                </button>

            </div>

            <div className="calendar-grid">

                {WEEKDAYS.map((day) => (
                    <span
                        className="weekday"
                        key={day}
                    >
                        {day}
                    </span>
                ))}

                {calendarDays.map((day, index) => {

                    if (day === null) {
                        return (
                            <span
                                className="empty-day"
                                key={`empty-${index}`}
                            />
                        );
                    }

                    const disabled = isPastDate(day);

                    const selected =
                        selectedDate &&
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === currentMonth &&
                        selectedDate.getFullYear() === currentYear;

                    return (
                        <button
                            key={`${currentYear}-${currentMonth}-${day}`}
                            className={
                                "day" +
                                (disabled ? " day-disabled" : "") +
                                (selected ? " selected" : "")
                            }
                            disabled={disabled}
                            onClick={() => {
                                onDateChange(
                                    new Date(
                                        currentYear,
                                        currentMonth,
                                        day
                                    )
                                );
                            }}
                        >
                            {day}
                        </button>
                    );
                })}

            </div>
        </section>
    );
}

export default Calendar;
