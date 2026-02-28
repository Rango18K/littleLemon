import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// ─── Helper: navigate to /booking before rendering ───────────────────────────
// App.js already contains <BrowserRouter> internally, so we must NOT wrap it
// in a second router — doing so causes a nested router error and breaks all tests.
// Instead, we use window.history.pushState to set the URL before rendering.
const renderBookingPage = () => {
  window.history.pushState({}, "Booking", "/booking");
  return render(<App />);
};

const renderHomePage = () => {
  window.history.pushState({}, "Home", "/");
  return render(<App />);
};

// ─── 1. RENDERING ─────────────────────────────────────────────────────────────
describe("BookingForm — rendering", () => {
  test("renders the booking form heading", () => {
    renderBookingPage();
    expect(screen.getByText(/make a reservation/i)).toBeInTheDocument();
  });

  test("renders all form fields", () => {
    renderBookingPage();
    expect(screen.getByLabelText(/choose date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
  });

  test("renders the submit button", () => {
    renderBookingPage();
    expect(
      screen.getByRole("button", { name: /make your reservation/i })
    ).toBeInTheDocument();
  });
});

// ─── 2. AVAILABLE TIMES ───────────────────────────────────────────────────────
describe("BookingForm — available times", () => {
  test("time select has a default placeholder option", () => {
    renderBookingPage();
    expect(screen.getByRole("option", { name: /select a time/i })).toBeInTheDocument();
  });

  test("time select renders at least one time option on load", () => {
    renderBookingPage();
    const select = screen.getByLabelText(/choose time/i);
    // Should have more than just the placeholder
    expect(select.options.length).toBeGreaterThan(1);
  });
});

// ─── 3. CLIENT-SIDE VALIDATION ────────────────────────────────────────────────
describe("BookingForm — validation", () => {
  test("shows all error messages when form is submitted empty", async () => {
    renderBookingPage();
    fireEvent.click(screen.getByRole("button", { name: /make your reservation/i }));

    await waitFor(() => {
      expect(screen.getByText(/please select a date/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a time/i)).toBeInTheDocument();
      expect(screen.getByText(/guests must be between 1 and 10/i)).toBeInTheDocument();
      expect(screen.getByText(/please select an occasion/i)).toBeInTheDocument();
    });
  });

  test("does not show errors when all fields are filled correctly", async () => {
    renderBookingPage();

    // Fill in date
    fireEvent.change(screen.getByLabelText(/choose date/i), {
      target: { value: "2025-12-25" },
    });

    // Pick the first real time option
    const timeSelect = screen.getByLabelText(/choose time/i);
    const firstTime = timeSelect.options[1].value;
    fireEvent.change(timeSelect, { target: { value: firstTime } });

    // Fill guests
    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: "4" },
    });

    // Pick an occasion
    fireEvent.change(screen.getByLabelText(/occasion/i), {
      target: { value: "Birthday" },
    });

    fireEvent.click(screen.getByRole("button", { name: /make your reservation/i }));

    await waitFor(() => {
      expect(screen.queryByText(/please select a date/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/please select a time/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/guests must be between/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/please select an occasion/i)).not.toBeInTheDocument();
    });
  });

  test("shows guest error when guests value is 0", async () => {
    renderBookingPage();
    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: /make your reservation/i }));

    await waitFor(() => {
      expect(screen.getByText(/guests must be between 1 and 10/i)).toBeInTheDocument();
    });
  });

  test("shows guest error when guests value exceeds 10", async () => {
    renderBookingPage();
    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: "11" },
    });
    fireEvent.click(screen.getByRole("button", { name: /make your reservation/i }));

    await waitFor(() => {
      expect(screen.getByText(/guests must be between 1 and 10/i)).toBeInTheDocument();
    });
  });
});

// ─── 4. FORM INTERACTIONS ─────────────────────────────────────────────────────
describe("BookingForm — interactions", () => {
  test("date input updates its value on change", () => {
    renderBookingPage();
    const dateInput = screen.getByLabelText(/choose date/i);
    fireEvent.change(dateInput, { target: { value: "2025-06-15" } });
    expect(dateInput.value).toBe("2025-06-15");
  });

  test("guests input updates its value on change", () => {
    renderBookingPage();
    const guestsInput = screen.getByLabelText(/number of guests/i);
    fireEvent.change(guestsInput, { target: { value: "5" } });
    expect(guestsInput.value).toBe("5");
  });

  test("occasion select updates its value on change", () => {
    renderBookingPage();
    const occasionSelect = screen.getByLabelText(/occasion/i);
    fireEvent.change(occasionSelect, { target: { value: "Anniversary" } });
    expect(occasionSelect.value).toBe("Anniversary");
  });
});

// ─── 5. NAVIGATION AFTER SUBMIT ───────────────────────────────────────────────
describe("BookingForm — successful submission", () => {
  test("navigates to confirmation page after valid form submission", async () => {
    renderBookingPage();

    fireEvent.change(screen.getByLabelText(/choose date/i), {
      target: { value: "2025-12-25" },
    });

    const timeSelect = screen.getByLabelText(/choose time/i);
    const firstTime = timeSelect.options[1]?.value;
    if (firstTime) {
      fireEvent.change(timeSelect, { target: { value: firstTime } });
    }

    fireEvent.change(screen.getByLabelText(/number of guests/i), {
      target: { value: "2" },
    });

    fireEvent.change(screen.getByLabelText(/occasion/i), {
      target: { value: "Birthday" },
    });

    fireEvent.click(screen.getByRole("button", { name: /make your reservation/i }));

    await waitFor(() => {
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
    });
  });
});

// ─── 6. HOME PAGE ─────────────────────────────────────────────────────────────
describe("Home page — rendering", () => {
  test("renders the hero section on home route", () => {
    renderHomePage();
    expect(screen.getByText(/little lemon/i)).toBeInTheDocument();
  });

  test("renders the reserve a table link", () => {
    renderHomePage();
    expect(screen.getByRole("link", { name: /reserve a table/i })).toBeInTheDocument();
  });
});