// seat_helper.js
const rows = ["A", "B", "C", "D", "E", "F", "G"];
const col = 10;

function getInitialSeatsLayout() {
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

// this function generates random booking inputs
function getSampleBookingInputs(totalSeats) {
  const bookings = [];
  let currentSeats = 0;
  let bookingIndex = 1;

  let vTotal = 0;
  let raTotal = 0;

  while (currentSeats < totalSeats) {
    const remainingSeats = totalSeats - currentSeats;

    const possibleTypes = [];
    if (vTotal < 7) possibleTypes.push("V");
    if (raTotal < 3) possibleTypes.push("RA");
    possibleTypes.push("R");

    const seatType = getRandomSeatType(possibleTypes);

    let maxSize;
    if (seatType === "V") maxSize = Math.min(7 - vTotal, remainingSeats);
    else if (seatType === "RA") maxSize = Math.min(3 - raTotal, remainingSeats);
    else if (seatType === "R") maxSize = Math.min(14, remainingSeats);
    else maxSize = remainingSeats;

    if (maxSize < 1) continue;

    const size = getRandomInt(1, maxSize);

    bookings.push({
      name: `b${bookingIndex++}`,
      size,
      seatType,
    });

    currentSeats += size;

    if (seatType === "V") vTotal += size;
    if (seatType === "RA") raTotal += size;
  }

  return bookings;

  function getRandomSeatType(types) {
    return types[Math.floor(Math.random() * types.length)];
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
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
  return seats.flat().filter((seat) => seat.isOccupied);
}

function getUnOccupiedSeats(seats) {
  return seats.flat().filter((seat) => !seat.isOccupied);
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
            startRowIndex: i,
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

function findConsecutiveSeatsBasedOnSizes1(seats, sizeWanted, minRowIndex = 0) {
  for (let i = minRowIndex; i < seats.length; i++) {
    let consecutive = 0;

    for (let j = 0; j < seats[i].length; j++) {
      if (!seats[i][j].isOccupied) {
        consecutive++;
        if (consecutive === sizeWanted) {
          const startIndex = j - sizeWanted + 1;
          return {
            row: seats[i][0].row,
            startRowIndex: i,
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

function getMaxConsecutiveSeats(seats) {
  let maxConsecutive = 0;

  for (let i = 0; i < seats.length; i++) {
    let currentConsecutive = 0;

    for (let j = 0; j < seats[i].length; j++) {
      if (!seats[i][j].isOccupied) {
        currentConsecutive++;
        if (currentConsecutive > maxConsecutive) {
          maxConsecutive = currentConsecutive;
        }
      } else {
        currentConsecutive = 0;
      }
    }
  }

  return maxConsecutive;
}

function splitBookingInput(availableConsecutiveSeat, currentBookings) {
  const result = [...currentBookings];
  const first = result[0];

  if (first.size > availableConsecutiveSeat) {
    const firstPart = { ...first, size: availableConsecutiveSeat };
    const secondPart = {
      ...first,
      size: first.size - availableConsecutiveSeat,
    };
    result.splice(0, 1, firstPart, secondPart);
  }

  return result;
}

module.exports = {
  rows,
  col,
  getInitialSeatsLayout,
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
  splitBookingInput,
  getMaxConsecutiveSeats,
  findConsecutiveSeatsBasedOnSizes1,
};
