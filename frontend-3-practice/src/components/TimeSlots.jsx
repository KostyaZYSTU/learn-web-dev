
const ALL_TIMES = [
    "10:00",
    "11:30",
    "13:00",
    "14:30",
    "16:00",
    "18:00"
];

const MONTHS = [
    "января", "февраля", "марта",
    "апреля", "мая", "июня",
    "июля", "августа", "сентября",
    "октября", "ноября", "декабря"
];

function TimeSlots({
    selectedDate,
    selectedTime,
    onTimeChange
}) {

    if (!selectedDate) {
        return (
            <section className="time-section">
                <h3 className="time-title">
                    Выберите дату для просмотра времени
                </h3>
            </section>
        );
    }

    const day = selectedDate.getDate();
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    // Демонстрационная занятость слотов
    const slots = ALL_TIMES.map((time, index) => ({
        time,
        busy: (day + month + year + index) % 4 === 0
    }));

    return (
        <section className="time-section">

            <h3 className="time-title">
                Свободное время · {day} {MONTHS[month]}
            </h3>

            <div className="time-grid">

                {slots.map((slot) => (
                    <button
                        key={slot.time}
                        type="button"
                        className={
                            "time-slot" +
                            (slot.busy ? " busy" : "") +
                            (selectedTime === slot.time ? " active" : "")
                        }
                        disabled={slot.busy}
                        onClick={() => onTimeChange(slot.time)}
                    >
                        {slot.time}
                    </button>
                ))}

            </div>
        </section>
    );
}

export default TimeSlots;
