import { SeatPlanner } from "./seat_planner_oop/Seat_Planner.js";
import { SeatHelper } from "./seat_planner_oop/Seat_Helper.js";
import { Booking } from "./seat_planner_oop/Booking.js";

// seatPlanner.randomlyMarkBrokenSeats(5);
const seatHelper = new SeatHelper();
seatHelper.bookings.push(new Booking("B1", 3, "R"));
seatHelper.bookings.push(new Booking("B2", 7, "V"));
seatHelper.bookings.push(new Booking("B3", 1, "RA"));
seatHelper.bookings.push(new Booking("B4", 3, "R"));
const seatPlanner = new SeatPlanner(
  seatHelper,
  seatHelper.getInitialSeatsLayout(),
  seatHelper.getBookings()
);
seatPlanner.arrangeSeats();
console.log(seatPlanner.bookings);
const finalSeats = seatPlanner.seats;
console.log(finalSeats);
