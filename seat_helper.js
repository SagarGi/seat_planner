// seat_helper.js
const rows = ["A", "B", "C", "D", "E", "F", "G"];
const col = 10;

function getInitialSeats() {
  const columns = Array.from({ length: col }, (_, i) => i + 1);
  const seats = [];

  rows.forEach((row) => {
    columns.forEach((col, colIndex) => {
      let seatType = "R";

      if (row === "A") {
        // Last 1/3 of row A are RA
        const threshold = columns.length - Math.floor(columns.length / 3);
        if (colIndex >= threshold) {
          seatType = "RA";
        } else {
          seatType = "V";
        }
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
    { name: "b1", size: 2, seatType: "RA" },
    { name: "b2", size: 1, seatType: "R" },
    { name: "b3", size: 1, seatType: "V" },
    { name: "b4", size: 2, seatType: "R" },
    { name: "b5", size: 2, seatType: "V" },
    { name: "b6", size: 4, seatType: "V" },
    { name: "b7", size: 2, seatType: "R" },
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

function markSeatOccupied(seats, booking, targetRow, targetColumn, memberID) {
  return seats.map((seat) => {
    if (seat.row === targetRow && seat.column === targetColumn) {
      return {
        ...seat,
        isOccupied: true,
        bookingID: booking.name,
        memberID: memberID,
      };
    }
    return seat;
  });
}

function getBookingsOfSeatTypeOrderedBySizeDescending(bookings, seatType) {
  const filteredBookings = bookings.filter(
    (booking) => booking.seatType === seatType
  );
  filteredBookings.sort((a, b) => b.size - a.size);
  return filteredBookings;
}

function getOccupiedSeats(seats) {
  return seats.filter((seat) => seat.isOccupied);
}

function getUnOccupiedSeats(seats) {
  return seats.filter((seat) => !seat.isOccupied);
}

function getNumberOfVipSeats(colLength) {
  return colLength - Math.floor(colLength / 3);
}

function getNumberOfAccessibleSeats(colLength) {
  return Math.floor(colLength / 3);
}

module.exports = {
  rows,
  col,
  getInitialSeats,
  getSampleBookingInputs,
  isBookingAvailable,
  getSizeForSeatTypeFromBookings,
  getBookingsForSeatType,
  markSeatOccupied,
  getBookingsOfSeatTypeOrderedBySizeDescending,
  getOccupiedSeats,
  getUnOccupiedSeats,
  getNumberOfVipSeats,
  getNumberOfAccessibleSeats,
};
