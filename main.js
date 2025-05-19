import { SeatPlanner } from "./seat_planner_oop/Seat_Planner.js";
import { SeatHelper } from "./seat_planner_oop/Seat_Helper.js";
import { Booking } from "./seat_planner_oop/Booking.js";

const seatHelper = new SeatHelper();
// seatHelper.bookings = [new Booking()];
let seatPlanner = new SeatPlanner(
  seatHelper,
  seatHelper.getInitialSeatsLayout(),
  seatHelper.getBookings()
);

seatHelper.bookings.push(
  new Booking("B5", 1, "R"),
  new Booking("B4", 1, "R"),
  new Booking("B3", 1, "R"),
  new Booking("B2", 1, "R"),
  new Booking("B1", 1, "R"),
  new Booking("VIP3", 2, "V"),
  new Booking("VIP4", 5, "V")
);
globalSeats = seatPlanner.seats;
seatPlanner = new SeatPlanner(
  seatHelper,
  seatHelper.getInitialSeatsLayout(),
  seatHelper.getBookings()
);
seatPlanner.randomlyMarkBrokenSeats(5);
seatPlanner.arrangeSeats();
// console.log(seatPlanner.bookings);
const finalSeats = seatPlanner.seats;
console.log(finalSeats);
