
import { useState } from "react";

import "./barber.css";

import Header from "./components/Header";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";

function App() {

    const [selectedDate, setSelectedDate] = useState(
        () => new Date()
    );

    const [selectedTime, setSelectedTime] = useState(null);

    function handleDateChange(date) {
        setSelectedDate(date);
        setSelectedTime(null);
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

                    <Calendar
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                    />

                    <TimeSlots
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onTimeChange={setSelectedTime}
                    />

                    <BookingBottomBar
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                    />

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
