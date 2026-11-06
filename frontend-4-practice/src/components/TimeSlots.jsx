
const MONTHS = [
    "января", "февраля", "марта",
    "апреля", "мая", "июня",
    "июля", "августа", "сентября",
    "октября", "ноября", "декабря"
];

function TimeSlots({
    selectedDate,
    selectedTime,
    onTimeChange,
    slots,
    loading,
    error
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

    return (
        <section className="time-section">

            <h3 className="time-title">
                Свободное время · {day} {MONTHS[month]}
            </h3>

            {loading ? (
                <p role="status">Загрузка слотов...</p>
            ) : error ? (
                <p role="alert">
                    Не удалось загрузить время: {error}
                </p>
            ) : slots.length === 0 ? (
                <p>На эту дату нет доступных записей.</p>
            ) : (
                <div className="time-grid">
                    {slots.map((slot) => (
                        <button
                            key={slot.time}
                            type="button"
                            className={
                                "time-slot" +
                                (!slot.available ? " busy" : "") +
                                (selectedTime === slot.time ? " active" : "")
                            }
                            disabled={!slot.available}
                            onClick={() => onTimeChange(slot.time)}
                        >
                            {slot.time}
                        </button>
                    ))}
                </div>
            )}

        </section>
    );
}

export default TimeSlots;
