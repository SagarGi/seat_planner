// seat_helper.js

function getInitialSeats() {
  // rows can be extended to A-Z but columns are fixed to 10
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const columns = Array.from({ length: 10 }, (_, i) => i + 1);
  const seats = [];
  rows.forEach((row) => {
    columns.forEach((col) => {
      let seatType = "R";
      if (row === "A" && col === 10) {
        seatType = "VA";
      } else if (row === "A") {
        seatType = "V";
      } else if (row !== "A" && col === 10) {
        seatType = "RA";
      }
      const seat = {
        seatId: `${row}${col}`,
        row: row,
        column: col,
        isOccupied: false,
        seatType: seatType,
      };
      seats.push(seat);
    });
  });
  return seats;
}

function getSampleBookingInputs() {
  const bookings = [
    { name: "b1", size: 1, seatType: "R" },
    { name: "b2", size: 2, seatType: "R" },
    { name: "b3", size: 3, seatType: "V" },
    { name: "b4", size: 6, seatType: "V" },
    { name: "b5", size: 1, seatType: "V" },
  ];
  return bookings;
}

function isBookingAvailable(bookings, seatType) {
  const vaBookings = getBookingsForSeatType(bookings, seatType);
  if (vaBookings.length >= 1) {
    return true;
  }
  return false;
}

function getBookingsForSeatType(bookings, seatType) {
  const vaBookings = bookings.filter(
    (booking) => booking.seatType === seatType
  );
  return vaBookings;
}

function getSizeForSeatTypeFromBookings(bookings, seatType) {
  const filteredBookings = bookings.filter(
    (booking) => booking.seatType === seatType
  );
  const bookingSizes = filteredBookings.map((booking) => booking.size);
  const totalSize = bookingSizes.reduce((acc, size) => acc + size, 0);
  return totalSize;
}

function markSeatOccupied(seats, targetRow, targetColumn) {
  return seats.map((seat) => {
    if (seat.row === targetRow && seat.column === targetColumn) {
      return { ...seat, isOccupied: true };
    }
    return seat;
  });
}

module.exports = {
  getInitialSeats,
  getSampleBookingInputs,
  isBookingAvailable,
  getSizeForSeatTypeFromBookings,
  getBookingsForSeatType,
  markSeatOccupied,
};
