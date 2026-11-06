
import { useEffect, useState } from "react";

import "./barber.css";

import { fetchToday, fetchSlots } from "./api";

import Header from "./components/Header";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";

function App() {
    const [today, setToday] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const [slots, setSlots] = useState([]);

    const [loadingToday, setLoadingToday] = useState(true);
    const [errorToday, setErrorToday] = useState(null);

    const [loadingSlots, setLoadingSlots] = useState(false);
    const [errorSlots, setErrorSlots] = useState(null);

    // Загружаем сегодняшнюю дату с сервера
    useEffect(() => {
        let active = true;

        async function loadToday() {
            try {
                const data = await fetchToday();

                if (!active) return;

                const date = new Date(
                    data.year,
                    data.month,
                    data.day
                );

                setToday(date);
                setSelectedDate(date);
            } catch (error) {
                if (active) {
                    setErrorToday(error.message);
                }
            } finally {
                if (active) {
                    setLoadingToday(false);
                }
            }
        }

        loadToday();

        return () => {
            active = false;
        };
    }, []);

    // Загружаем слоты при выборе даты
    useEffect(() => {
        if (!selectedDate) return;

        let active = true;

        async function loadSlots() {
            setLoadingSlots(true);
            setErrorSlots(null);
            setSlots([]);

            const requestedDate = {
                day: selectedDate.getDate(),
                month: selectedDate.getMonth(),
                year: selectedDate.getFullYear()
            };

            try {
                const data = await fetchSlots(requestedDate);

                if (!active) return;

                // Проверяем, что ответ относится
                // именно к запрошенной дате
                if (
                    data.date.day !== requestedDate.day ||
                    data.date.month !== requestedDate.month ||
                    data.date.year !== requestedDate.year
                ) {
                    return;
                }

                setSlots(data.slots);
            } catch (error) {
                if (active) {
                    setErrorSlots(error.message);
                }
            } finally {
                if (active) {
                    setLoadingSlots(false);
                }
            }
        }

        loadSlots();

        return () => {
            active = false;
        };
    }, [selectedDate]);

    function handleDateChange(date) {
        setSelectedDate(date);
        setSelectedTime(null);
        setSlots([]);
    }

    return (
        <>
            <Header />

            <main className="main">
                <section className="booking">

                    <h2 className="booking-title">
                        Выберите дату и время
                    </h2>

                    <p className="booking-description">
                        Мужская стрижка · 1 час · 1500 ₽
                    </p>

                    {loadingToday ? (
                        <p>Загрузка календаря...</p>
                    ) : errorToday ? (
                        <p role="alert">
                            Ошибка загрузки: {errorToday}
                        </p>
                    ) : (
                        <>
                            <Calendar
                                today={today}
                                selectedDate={selectedDate}
                                onDateChange={handleDateChange}
                            />

                            <TimeSlots
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                onTimeChange={setSelectedTime}
                                slots={slots}
                                loading={loadingSlots}
                                error={errorSlots}
                            />

                            <BookingBottomBar
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                            />
                        </>
                    )}

                </section>
            </main>

            <footer className="footer">
                <p className="footer-text">
                    © 2026 Barber House
                </p>
            </footer>
        </>
    );
}

export default App;
