// seat_helper.js
const rows = ["A", "B", "C", "D", "E", "F", "G"];
const col = 10;

function getInitialSeats() {
  const seatGrid = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const seatRow = [];

    for (let j = 0; j < col; j++) {
      const column = j + 1;
      let seatType = "R";

      if (row === "A") {
        // one third of the seats in row A are priority seats and rest are VIP
        const threshold = col - Math.floor(col / 3);
        seatType = j >= threshold ? "RA" : "V";
      }

      const seat = {
        seatId: `${row}${column}`,
        row: row,
        column: column,
        isOccupied: false,
        isBroken: false,
        seatType: seatType,
      };

      seatRow.push(seat);
    }

    seatGrid.push(seatRow);
  }

  return seatGrid;
}

function getSampleBookingInputs() {
  const bookings = [
    { name: "b1", size: 2, seatType: "RA" },
    { name: "b1", size: 1, seatType: "RA" },
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

function markSeatOccupied(
  seats,
  bookingName,
  targetRow,
  targetColumn,
  memberID
) {
  seats[targetRow][targetColumn].isOccupied = true;
  seats[targetRow][targetColumn].memberID = memberID;
  seats[targetRow][targetColumn].groupName = bookingName;
  return seats;
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

// this function returns the row along with column start and end index for the consecutive seats
function getCorrectConsecutiveSeatIndex(noOfConsecutiveSeatsToFind, seats) {
  const rowLenth = rows.length;
  const colLenth = col;

  for (let i = 0; i < rowLenth; i++) {
    // see consecutive in first row and so on
    for (j = 0; j <= colLenth; j++) {
      console.log(seats[i * colLenth + j]);
    }
  }
}

function findConsecutiveSeatsBasedOnSizes(seats, sizeWanted) {
  for (let i = 0; i < seats.length; i++) {
    let consecutive = 0;

    for (let j = 0; j < seats[i].length; j++) {
      if (!seats[i][j].isOccupied) {
        consecutive++;
        if (consecutive === sizeWanted) {
          const startIndex = j - sizeWanted + 1;
          return {
            row: seats[i][0].row,
            startColumnIndex: startIndex,
          };
        }
      } else {
        consecutive = 0;
      }
    }
  }
  return null;
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
  findConsecutiveSeatsBasedOnSizes,
};
