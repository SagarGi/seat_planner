import { Seat } from "./Seat.js";
import { Booking } from "./Booking.js";

export class SeatHelper {
  constructor() {
    this.rows = ["A", "B", "C", "D", "E", "F", "G"];
    this.col = 10;
    this.numberOfSampleBookingInputs = 65;
    this.bookings = [];
  }

  getInitialSeatsLayout() {
    const seatGrid = [];

    for (let i = 0; i < this.rows.length; i++) {
      const rowLabel = this.rows[i];
      const seatRow = [];

      for (let j = 0; j < this.col; j++) {
        const columnNumber = j + 1;
        let seatType = "R";

        if (rowLabel === "A") {
          const threshold = this.col - Math.floor(this.col / 3);
          seatType = j >= threshold ? "RA" : "V";
        }

        const seat = new Seat(rowLabel, columnNumber, seatType);
        seatRow.push(seat);
      }

      seatGrid.push(seatRow);
    }

    return seatGrid;
  }

  getBookings() {
    return this.bookings;
  }

  makeRandomBrokenSeats(globalSeats, count = 5) {
    const totalRows = globalSeats.length;
    const totalCols = globalSeats[0].length;
    let marked = 0;

    while (marked < count) {
      const row = Math.floor(Math.random() * totalRows);
      const col = Math.floor(Math.random() * totalCols);
      const seat = globalSeats[row][col];

      if (!seat.isOccupied && !seat.isBroken) {
        seat.markBroken();
        marked++;
      }
    }
    return globalSeats;
  }

  getSampleBookingInputs(totalSeats) {
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

      const seatType = this.getRandomSeatType(possibleTypes);

      let maxSize;
      if (seatType === "V") maxSize = Math.min(7 - vTotal, remainingSeats);
      else if (seatType === "RA")
        maxSize = Math.min(3 - raTotal, remainingSeats);
      else if (seatType === "R") maxSize = Math.min(14, remainingSeats);
      else maxSize = remainingSeats;

      if (maxSize < 1) continue;

      const size = this.getRandomInt(1, maxSize);

      bookings.push(new Booking(`B${bookingIndex++}`, size, seatType));

      currentSeats += size;

      if (seatType === "V") vTotal += size;
      if (seatType === "RA") raTotal += size;
    }

    return bookings;
  }

  getRandomSeatType(types) {
    return types[Math.floor(Math.random() * types.length)];
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  isBookingAvailable(bookings, seatType) {
    return this.getBookingsForSeatType(bookings, seatType).length > 0;
  }

  getBookingsForPreferredSeat(bookings) {
    return bookings.filter((booking) => booking.seatPreference !== "");
  }

  getBookingsForSeatType(bookings, seatType) {
    return bookings.filter((booking) => booking.seatType === seatType);
  }

  getSizeForSeatTypeFromBookings(bookings, seatType) {
    const filteredBookings = this.getBookingsForSeatType(bookings, seatType);
    const bookingSizes = filteredBookings.map((booking) => booking.size);
    return bookingSizes.reduce((acc, size) => acc + size, 0);
  }

  getBookingsOfSeatTypeOrderedBySizeDescending(bookings, seatType) {
    const filteredBookings = this.getBookingsForSeatType(bookings, seatType);
    filteredBookings.sort((a, b) => b.size - a.size);
    return filteredBookings;
  }

  getOccupiedSeats(seats) {
    return seats.flat().filter((seat) => seat.isOccupied);
  }

  getUnOccupiedSeats(seats) {
    return seats.flat().filter((seat) => !seat.isOccupied);
  }

  getBrokenSeats(seats) {
    return seats.flat().filter((seat) => seat.isBroken);
  }

  getUnBrokenSeats(seats) {
    return seats.flat().filter((seat) => !seat.isBroken);
  }

  getNumberOfVipSeats() {
    return this.col - Math.floor(this.col / 3);
  }

  getNumberOfAccessibleSeats() {
    return Math.floor(this.col / 3);
  }

  findConsecutiveSeatsBasedOnSizes(seats, sizeWanted) {
    for (let i = 0; i < seats.length; i++) {
      let consecutive = 0;
      for (let j = 0; j < seats[i].length; j++) {
        if (!seats[i][j].isOccupied && !seats[i][j].isBroken) {
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

  findConsecutiveSeatsBasedOnSizesAndIndex(seats, sizeWanted, minRowIndex = 0) {
    for (let i = minRowIndex; i < seats.length; i++) {
      let consecutive = 0;
      for (let j = 0; j < seats[i].length; j++) {
        if (!seats[i][j].isOccupied && !seats[i][j].isBroken) {
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

  getMaxConsecutiveSeats(seats) {
    let maxConsecutive = 0;
    for (let i = 0; i < seats.length; i++) {
      let currentConsecutive = 0;
      for (let j = 0; j < seats[i].length; j++) {
        if (!seats[i][j].isOccupied && !seats[i][j].isBroken) {
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

  splitBookingInput(availableConsecutiveSeat, currentBookings) {
    const result = [...currentBookings];
    const first = result[0];

    if (first && first.size > availableConsecutiveSeat) {
      const firstPart = { ...first, size: availableConsecutiveSeat };
      const secondPart = {
        ...first,
        size: first.size - availableConsecutiveSeat,
      };
      result.splice(0, 1, firstPart, secondPart);
    }

    return result;
  }

  cancelBooking(seats, bookingName) {
    for (let row of seats) {
      for (let seat of row) {
        if (seat.groupName === bookingName) {
          seat.cancelBooking();
        }
      }
    }
    return seats;
  }

  swapSeats(seats, srcSeatID, destSeatID) {
    let srcSeat = null;
    let destSeat = null;

    for (let row of seats) {
      for (let seat of row) {
        if (seat.seatId === srcSeatID) srcSeat = seat;
        if (seat.seatId === destSeatID) destSeat = seat;
      }
    }

    if (!srcSeat || !destSeat) {
      console.error("One or both seat IDs not found.");
      return;
    }

    const propsToSwap = { ...srcSeat };
    delete propsToSwap.seatId;

    for (let key in propsToSwap) {
      const temp = srcSeat[key];
      srcSeat[key] = destSeat[key];
      destSeat[key] = temp;
    }
  }
}
