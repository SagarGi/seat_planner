export class Seat {
  constructor(row, column, seatType = "R") {
    this.seatId = `${row}${column}`;
    this.row = row;
    this.column = column;
    this.isOccupied = false;
    this.isBroken = false;
    this.seatType = seatType;
    this.groupName = null;
  }

  markOccupied(bookingName) {
    if (!this.isBroken) {
      this.isOccupied = true;
      this.groupName = bookingName;
    }
  }

  markBroken() {
    if (!this.isOccupied) {
      this.isBroken = true;
    } else {
      console.error(
        "This seat is already occupied and cannot be marked as broken."
      );
    }
  }

  cancelBooking() {
    this.isOccupied = false;
    this.groupName = null;
  }
}
