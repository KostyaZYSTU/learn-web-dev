
import { useEffect, useState } from "react";

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

function Calendar({ today, selectedDate, onDateChange }) {

    const [currentMonth, setCurrentMonth] = useState(
        today.getMonth()
    );

    const [currentYear, setCurrentYear] = useState(
        today.getFullYear()
    );

    // Синхронизируем месяц с датой сервера
    useEffect(() => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    }, [today]);

    // Убираем время, оставляем только дату
    const serverToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    // Количество дней в текущем месяце
    const daysInMonth = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

    // Определяем день недели первого числа
    const firstDay = new Date(
        currentYear,
        currentMonth,
        1
    );

    const startDay = (firstDay.getDay() + 6) % 7;

    // Формируем календарную сетку
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

        return date < serverToday;
    }

    // Переключаем месяц
    function changeMonth(direction) {

        const newDate = new Date(
            currentYear,
            currentMonth + direction,
            1
        );

        const firstAllowedMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        if (newDate < firstAllowedMonth) {
            return;
        }

        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());

        // При переключении месяца сбрасываем выбор
        onDateChange(null);
    }

    const isCurrentMonth =
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

    return (
        <section className="calendar">

            <div className="calendar-header">

                <button
                    type="button"
                    className="month-button"
                    onClick={() => changeMonth(-1)}
                    disabled={isCurrentMonth}
                    aria-label="Предыдущий месяц"
                >
                    ‹
                </button>

                <h3 className="calendar-title">
                    {MONTHS[currentMonth]} {currentYear}
                </h3>

                <button
                    type="button"
                    className="month-button"
                    onClick={() => changeMonth(1)}
                    aria-label="Следующий месяц"
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
                            type="button"
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
