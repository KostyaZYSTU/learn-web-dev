
const MONTHS = [
    "января", "февраля", "марта",
    "апреля", "мая", "июня",
    "июля", "августа", "сентября",
    "октября", "ноября", "декабря"
];

const WEEKDAYS = [
    "Воскресенье", "Понедельник",
    "Вторник", "Среда", "Четверг",
    "Пятница", "Суббота"
];

function BookingBottomBar({ selectedDate, selectedTime }) {

    let formattedDate = "Дата не выбрана";

    if (selectedDate) {
        formattedDate =
            WEEKDAYS[selectedDate.getDay()] + ", " +
            selectedDate.getDate() + " " +
            MONTHS[selectedDate.getMonth()] + " " +
            selectedDate.getFullYear();
    }

    function handleContinue() {
        if (!selectedDate || !selectedTime) {
            return;
        }

        alert(
            "Вы выбрали запись:\n" +
            formattedDate + "\n" +
            selectedTime
        );
    }

    return (
        <section className="bottom-bar">
            <div className="booking-summary">
                <span className="summary-label">
                    Ваша запись
                </span>

                <p className="summary-date">
                    {formattedDate}
                </p>

                <p className="summary-time">
                    {selectedTime
                        ? `Время: ${selectedTime}`
                        : "Время не выбрано"}
                </p>
            </div>

            <button
                className="continue-button"
                type="button"
                disabled={!selectedDate || !selectedTime}
                onClick={handleContinue}
            >
                Продолжить
            </button>
        </section>
    );
}

export default BookingBottomBar;
