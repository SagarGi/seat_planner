import { SeatHelper } from "./Seat_Helper.js";

export class SeatPlanner {
  constructor() {
    this.seatHelper = new SeatHelper();
    this.seats = this.seatHelper.getInitialSeatsLayout();
    this.bookings = this.seatHelper.getSampleBookingInputs(
      this.seatHelper.numberOfSampleBookingInputs
    );
  }

  markSeatBroken(row, column) {
    if (this.seats[row] && this.seats[row][column]) {
      this.seats[row][column].markBroken();
    } else {
      console.error("Invalid row or column.");
    }
  }

  randomlyMarkBrokenSeats(count) {
    const totalRows = this.seats.length;
    const totalCols = this.seats[0].length;
    let marked = 0;

    while (marked < count) {
      const row = Math.floor(Math.random() * totalRows);
      const col = Math.floor(Math.random() * totalCols);
      const seat = this.seats[row][col];

      if (!seat.isOccupied && !seat.isBroken) {
        seat.markBroken();
        marked++;
      }
    }
  }

  assignSeatsForVIP(sortedVIPBookings) {
    let iterator = 0;
    const row = 0; // VIP seats are always in row A (index 0)
    for (const vipBooking of sortedVIPBookings) {
      let tmpIterator = iterator;
      for (let j = 0; j < vipBooking.size; j++) {
        if (this.seats[row] && this.seats[row][tmpIterator]) {
          this.seats[row][tmpIterator].markOccupied(vipBooking.name);
          tmpIterator++;
        } else {
          console.error(
            `Could not assign all VIP seats for booking ${vipBooking.name}`
          );
          break;
        }
      }
      iterator += vipBooking.size;
    }
  }

  assignSeatsForRegularAccessible(
    sortedRegularOrAccessibleBookings,
    startIterator = 0
  ) {
    let iterator = startIterator;
    const row = 0; // Accessible seats are always in row A (index 0)
    for (const raBooking of sortedRegularOrAccessibleBookings) {
      let tmpIterator = iterator;
      for (let j = 0; j < raBooking.size; j++) {
        if (this.seats[row] && this.seats[row][tmpIterator]) {
          this.seats[row][tmpIterator].markOccupied(raBooking.name);
          tmpIterator++;
        } else {
          console.error(
            `Could not assign all Accessible seats for booking ${raBooking.name}`
          );
          break;
        }
      }
      iterator += raBooking.size;
    }
  }

  handleVIPBookings() {
    if (this.seatHelper.isBookingAvailable(this.bookings, "V")) {
      const totalSizeOfVIPBookings =
        this.seatHelper.getSizeForSeatTypeFromBookings(this.bookings, "V");
      const vipSeatsAvailable = this.seatHelper.getNumberOfVipSeats();
      if (totalSizeOfVIPBookings > vipSeatsAvailable) {
        console.error(
          `In Booking \n ${JSON.stringify(
            this.seatHelper.getBookingsForSeatType(this.bookings, "V")
          )} \n` +
            `There are only ${vipSeatsAvailable} VIP seats available but found ${totalSizeOfVIPBookings},
          Please go with the regular seats if possible`
        );
        return;
      }
      const sortedVIPBookings =
        this.seatHelper.getBookingsOfSeatTypeOrderedBySizeDescending(
          this.bookings,
          "V"
        );
      this.assignSeatsForVIP(sortedVIPBookings);
    }
  }

  handleRegularBookings() {
    if (this.seatHelper.isBookingAvailable(this.bookings, "RA")) {
      const totalSizeOfRegularAccessibleBookings =
        this.seatHelper.getSizeForSeatTypeFromBookings(this.bookings, "RA");
      const accessibleSeatsAvailable =
        this.seatHelper.getNumberOfAccessibleSeats();
      if (totalSizeOfRegularAccessibleBookings > accessibleSeatsAvailable) {
        console.error(
          `In Booking \n ${JSON.stringify(
            this.seatHelper.getBookingsForSeatType(this.bookings, "RA")
          )} \n` +
            `There are only ${accessibleSeatsAvailable} Accessible seats available but found ${totalSizeOfRegularAccessibleBookings},
          Please go with the regular seats if possible`
        );
        return;
      }
      const sortedRegularAccessibleBookings =
        this.seatHelper.getBookingsOfSeatTypeOrderedBySizeDescending(
          this.bookings,
          "RA"
        );
      this.assignSeatsForRegularAccessible(
        sortedRegularAccessibleBookings,
        this.seatHelper.col - accessibleSeatsAvailable
      );
    }

    let sortedRegularBookings =
      this.seatHelper.getBookingsOfSeatTypeOrderedBySizeDescending(
        this.bookings,
        "R"
      );

    let seatOverflowed = false;
    let lastRowIndexUsed = 0;
    while (!seatOverflowed) {
      for (let i = 0; i < sortedRegularBookings.length; i++) {
        let prevGroupName = sortedRegularBookings[i - 1]?.name;
        let resultForConsecutiveSeats = null;
        if (prevGroupName === sortedRegularBookings[i].name) {
          const noOfSeatsConsecutiveFromPrevRow =
            this.seatHelper.findConsecutiveSeatsBasedOnSizesAndIndex(
              this.seats,
              sortedRegularBookings[i].size,
              lastRowIndexUsed + 1
            );
          if (noOfSeatsConsecutiveFromPrevRow !== null) {
            resultForConsecutiveSeats = noOfSeatsConsecutiveFromPrevRow;
          } else {
            resultForConsecutiveSeats =
              this.seatHelper.findConsecutiveSeatsBasedOnSizes(
                this.seats,
                sortedRegularBookings[i].size
              );
          }
        } else {
          resultForConsecutiveSeats =
            this.seatHelper.findConsecutiveSeatsBasedOnSizes(
              this.seats,
              sortedRegularBookings[i].size
            );
        }

        if (resultForConsecutiveSeats === null) {
          sortedRegularBookings.splice(0, i);

          const maxConsecutiveSeats = this.seatHelper.getMaxConsecutiveSeats(
            this.seats
          );
          sortedRegularBookings = this.seatHelper.splitBookingInput(
            maxConsecutiveSeats,
            sortedRegularBookings
          );
          seatOverflowed = false;
          break;
        }

        let iterator = resultForConsecutiveSeats.startColumnIndex;
        const row = resultForConsecutiveSeats.startRowIndex;
        let tmpIterator = iterator;
        for (let j = 0; j < sortedRegularBookings[i].size; j++) {
          if (this.seats[row] && this.seats[row][tmpIterator]) {
            this.seats[row][tmpIterator].markOccupied(
              sortedRegularBookings[i].name
            );
            tmpIterator++;
          } else {
            console.error(
              `Could not assign all regular seats for booking ${sortedRegularBookings[i].name}`
            );
            break;
          }
        }
        seatOverflowed = true;
        lastRowIndexUsed = resultForConsecutiveSeats.startRowIndex;
      }
    }
  }

  arrangeSeats() {
    if (this.seatHelper.isBookingAvailable(this.bookings, "V")) {
      this.handleVIPBookings();
    }
    this.handleRegularBookings();
  }

  getOccupiedSeats() {
    return this.seatHelper.getOccupiedSeats(this.seats);
  }

  getUnOccupiedSeats() {
    return this.seatHelper.getUnOccupiedSeats(this.seats);
  }

  getBrokenSeats() {
    return this.seatHelper.getBrokenSeats(this.seats);
  }

  getUnBrokenSeats() {
    return this.seatHelper.getUnBrokenSeats(this.seats);
  }
}
