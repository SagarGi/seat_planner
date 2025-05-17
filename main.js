import { SeatPlanner } from "./seat_planner_oop/Seat_Planner.js";

const seatPlanner = new SeatPlanner();
seatPlanner.randomlyMarkBrokenSeats(5);
seatPlanner.arrangeSeats();
const finalSeats = seatPlanner.seats;
console.log(finalSeats);
