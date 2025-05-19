export class Booking {
  constructor(name, size, seatType = "R", seatPreference = "") {
    this.name = name;
    this.size = size;
    this.seatType = seatType;
    this.seatPreference = seatPreference;
  }
}
