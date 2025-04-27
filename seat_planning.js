// seat_planning.js

const {
  getInitialSeats,
  getSampleBookingInputs,
  assignVIPSeats,
  assignRegularSeats,
} = require("./seat_helper.js");

const seats = getInitialSeats(); // Initialize the seat layout
const bookings = getSampleBookingInputs(); // Sample bookings

function arrangeSeats(seats, bookings) {
  bookings.sort((a, b) => b.size - a.size); // Bigger groups first

  const hasVIPBookings = bookings.some(
    (b) => b.type === "V" || b.type === "VA"
  );

  if (hasVIPBookings) {
    console.log("VIP bookings found. Assigning VIP seats first...");
    const vipBookings = bookings.filter(
      (b) => b.type === "V" || b.type === "VA"
    );
    const regularBookings = bookings.filter((b) => b.type === "R");

    assignVIPSeats(seats, vipBookings);
    assignRegularSeats(seats, regularBookings, true); // avoid VIP seats
  } else {
    console.log(
      "No VIP bookings found. Using VIP seats for regular members..."
    );
    assignRegularSeats(seats, bookings, false); // allow VIP seats
  }

  printSeating(seats);
}

function printSeating(seats) {
  const bookedSeats = seats.filter((seat) => seat.isBooked);
  const unbookedSeats = seats.filter((seat) => !seat.isBooked);

  bookedSeats.forEach((seat) => {
    console.log(
      `Seat ${seat.row}${seat.column} is booked by member ${seat.memberNumber} booking name ${seat.bookingName}`
    );
  });

  console.log();
  console.log(`Total seats booked: ${bookedSeats.length}`);
  console.log(`Total seats not booked: ${unbookedSeats.length}`);
}

arrangeSeats(seats, bookings);
