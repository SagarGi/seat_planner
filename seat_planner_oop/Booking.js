export class Booking {
  constructor(name, size, seatType = "R") {
    this.name = name;
    this.size = size;
    this.seatType = seatType;
  }
}
