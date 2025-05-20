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
  new Booking("VIP3", 2, "V"),
  new Booking("VIP4", 5, "V")
);
seatPlanner = new SeatPlanner(
  seatHelper,
  seatHelper.getInitialSeatsLayout(),
  seatHelper.getBookings()
);
seatPlanner.arrangeSeats();
// console.log(seatPlanner.bookings);
const finalSeats = seatPlanner.seats;
console.log(finalSeats);
