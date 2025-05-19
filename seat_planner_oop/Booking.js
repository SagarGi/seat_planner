export class Booking {
  constructor(name, size, seatType = "R", seatPreference = null) {
    this.name = name;
    this.size = size;
    this.seatType = seatType;
    this.seatPreference = seatPreference;
  }
}
