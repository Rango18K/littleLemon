import React, { useReducer, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

// ─── IMAGES (replace with your actual imports) ───────────────────────────────
// import littlelemon_logo from "./images/littlelemon_logo.png";
// import small_logo from "./images/small_logo.png";

// ─── NAV ─────────────────────────────────────────────────────────────────────
const Nav = () => {
  return (
    <nav className="nav" role="navigation" aria-label="Main Navigation">
      <div className="nav__logo">
        {/* <img src={littlelemon_logo} alt="Little Lemon Logo" /> */}
        <span className="nav__logo-text">🍋 Little Lemon</span>
      </div>
      <ul className="nav__links">
        <li><a href="/" className="nav__link">Home</a></li>
        <li><a href="/about" className="nav__link">About</a></li>
        <li><a href="/menu" className="nav__link">Menu</a></li>
        <li><a href="/booking" className="nav__link nav__link--cta">Reservations</a></li>
        <li><a href="/order" className="nav__link">Order Online</a></li>
        <li><a href="/login" className="nav__link">Login</a></li>
      </ul>
    </nav>
  );
};

// ─── HEADER ──────────────────────────────────────────────────────────────────
const Header = () => {
  return (
    <header className="hero" role="banner">
      <div className="hero__content">
        <h1 className="hero__title">Little Lemon</h1>
        <h2 className="hero__subtitle">Chicago</h2>
        <p className="hero__description">
          We are a family-owned Mediterranean restaurant, focused on traditional
          recipes served with a modern twist. Come taste the flavors of the sun.
        </p>
        <a href="/booking" className="btn btn--primary">Reserve a Table</a>
      </div>
      <div className="hero__image" aria-hidden="true">
        <div className="hero__image-placeholder">🥗</div>
      </div>
    </header>
  );
};

// ─── BOOKING FORM ─────────────────────────────────────────────────────────────
const BookingForm = ({ availableTimes, dispatch, submitForm }) => {
  const [occasion, setOccasion] = useState("");
  const [guests, setGuests]     = useState("");
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("");
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const newErrors = {};
    if (!date)     newErrors.date     = "Please select a date.";
    if (!time)     newErrors.time     = "Please select a time.";
    if (!guests || guests < 1 || guests > 10)
                   newErrors.guests   = "Guests must be between 1 and 10.";
    if (!occasion) newErrors.occasion = "Please select an occasion.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    submitForm({ date, time, guests, occasion });
  };

  const handleDateChange = (value) => {
    setDate(value);
    dispatch(value);
  };

  return (
    <section className="booking-section" aria-labelledby="booking-heading">
      <h2 id="booking-heading" className="booking-section__title">Make a Reservation</h2>
      <form className="booking-form" onSubmit={handleSubmit} noValidate>

        {/* Date */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="book-date">Choose Date</label>
          <input
            id="book-date"
            className={`form-group__input ${errors.date ? "form-group__input--error" : ""}`}
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            required
            aria-required="true"
            aria-describedby={errors.date ? "book-date-error" : undefined}
          />
          {errors.date && <span id="book-date-error" className="form-group__error" role="alert">{errors.date}</span>}
        </div>

        {/* Time */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="book-time">Choose Time</label>
          <select
            id="book-time"
            className={`form-group__input ${errors.time ? "form-group__input--error" : ""}`}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            aria-required="true"
            aria-describedby={errors.time ? "book-time-error" : undefined}
          >
            <option value="">Select a Time</option>
            {availableTimes.availableTimes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.time && <span id="book-time-error" className="form-group__error" role="alert">{errors.time}</span>}
        </div>

        {/* Guests */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="book-guests">Number of Guests</label>
          <input
            id="book-guests"
            className={`form-group__input ${errors.guests ? "form-group__input--error" : ""}`}
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="1–10"
            required
            aria-required="true"
            aria-describedby={errors.guests ? "book-guests-error" : undefined}
          />
          {errors.guests && <span id="book-guests-error" className="form-group__error" role="alert">{errors.guests}</span>}
        </div>

        {/* Occasion */}
        <div className="form-group">
          <label className="form-group__label" htmlFor="book-occasion">Occasion</label>
          <select
            id="book-occasion"
            className={`form-group__input ${errors.occasion ? "form-group__input--error" : ""}`}
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            required
            aria-required="true"
            aria-describedby={errors.occasion ? "book-occasion-error" : undefined}
          >
            <option value="">Select an Option</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Business">Business Dinner</option>
            <option value="Other">Other</option>
          </select>
          {errors.occasion && <span id="book-occasion-error" className="form-group__error" role="alert">{errors.occasion}</span>}
        </div>

        <button type="submit" className="btn btn--primary btn--full">
          Make Your Reservation
        </button>
      </form>
    </section>
  );
};

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
const Booking = ({ availableTimes, dispatch, submitForm }) => {
  return (
    <BookingForm
      availableTimes={availableTimes}
      dispatch={dispatch}
      submitForm={submitForm}
    />
  );
};

// ─── CONFIRMED BOOKING ────────────────────────────────────────────────────────
const ConfirmedBooking = () => {
  return (
    <section className="confirmed" aria-labelledby="confirmed-heading">
      <div className="confirmed__icon" aria-hidden="true">✅</div>
      <h1 id="confirmed-heading" className="confirmed__title">Booking Confirmed!</h1>
      <p className="confirmed__message">
        Thank you for your reservation at Little Lemon. We look forward to seeing you!
      </p>
      <a href="/" className="btn btn--primary">Back to Home</a>
    </section>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__grid">

        <div className="footer__brand">
          {/* <img src={small_logo} alt="Little Lemon small logo" /> */}
          <span className="footer__logo-text">🍋 Little Lemon</span>
          <p className="footer__tagline">Mediterranean flavors in the heart of Chicago.</p>
        </div>

        <nav className="footer__nav" aria-label="Footer Navigation">
          <h3 className="footer__heading">Navigate</h3>
          <ul className="footer__list">
            <li><a href="/" className="footer__link">Home</a></li>
            <li><a href="/about" className="footer__link">About</a></li>
            <li><a href="/menu" className="footer__link">Menu</a></li>
            <li><a href="/booking" className="footer__link">Reservations</a></li>
            <li><a href="/order" className="footer__link">Order Online</a></li>
            <li><a href="/login" className="footer__link">Login</a></li>
          </ul>
        </nav>

        <div className="footer__contact">
          <h3 className="footer__heading">Contact</h3>
          <ul className="footer__list">
            <li>123 Lemon Street, Chicago, IL</li>
            <li>(312) 555-0192</li>
            <li>hello@littlelemon.com</li>
          </ul>
        </div>

        <div className="footer__social">
          <h3 className="footer__heading">Follow Us</h3>
          <ul className="footer__list">
            <li><a href="#" className="footer__link" aria-label="Little Lemon on Instagram">Instagram</a></li>
            <li><a href="#" className="footer__link" aria-label="Little Lemon on Facebook">Facebook</a></li>
            <li><a href="#" className="footer__link" aria-label="Little Lemon on Twitter">Twitter</a></li>
          </ul>
        </div>

      </div>
      <p className="footer__copy">© {new Date().getFullYear()} Little Lemon. All rights reserved.</p>
    </footer>
  );
};

// ─── MAIN (routing + state) ───────────────────────────────────────────────────
const seededRandom = (seed) => {
  const m = 2 ** 35 - 31;
  const a = 185852;
  let s = seed % m;
  return () => (s = (s * a) % m) / m;
};

const fetchAPI = (date) => {
  const result = [];
  const random = seededRandom(date.getDate());
  for (let i = 17; i <= 23; i++) {
    if (random() < 0.5) result.push(`${i}:00`);
    if (random() < 0.5) result.push(`${i}:30`);
  }
  return result;
};

const submitAPI = (_formData) => true;

function updateTimes(_state, date) {
  return { availableTimes: fetchAPI(new Date(date)) };
}

const Main = () => {
  const initialState = { availableTimes: fetchAPI(new Date()) };
  const [state, dispatch] = useReducer(updateTimes, initialState);
  const navigate = useNavigate();

  const submitForm = (formData) => {
    if (submitAPI(formData)) {
      navigate("/confirmed");
    }
  };

  return (
    <main id="main-content">
      <Routes>
        <Route path="/"         element={<Header />} />
        <Route path="/booking"  element={<Booking availableTimes={state} dispatch={dispatch} submitForm={submitForm} />} />
        <Route path="/confirmed" element={<ConfirmedBooking />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
};

// ─── APP (root) ───────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <Main />
      <Footer />
    </Router>
  );
}

export default App;