// seat_planning.js

const {
  getInitialSeats,
  getSampleBookingInputs,
  isBookingAvailable,
  getBookingsForSeatType,
  getSizeForSeatTypeFromBookings,
  markSeatOccupied,
} = require("./seat_helper.js");

let seats = getInitialSeats(); // Initialize the seat layout
const bookings = getSampleBookingInputs(); // Sample bookings

// first we handle the VIP bookings and then only go for regular bookings

function handleVIPBookings() {
  // 1. get and check if there is any VA in the bookings
  // 2. since there is only one VA seats, if there are more then 1 VA seats we need to tell the user
  // to go with the regular Accessible one
  if (isBookingAvailable(bookings, "VA")) {
    const totalSizeOfVIPAccessibleBookings = getSizeForSeatTypeFromBookings(
      bookings,
      "VA"
    );
    if (totalSizeOfVIPAccessibleBookings > 1) {
      console.error(
        `In Booking \n ${JSON.stringify(
          getBookingsForSeatType(bookings, "VA")
        )} \n` +
          "There is only 1 VIP Accessible Seat available, Please go with the regular Accessible seats"
      );
      return;
    } else {
      // it means there is only one VA booking, we can assign it to the VA seat in column 10 of row A
      // seats has been updated
      seats = markSeatOccupied(seats, "A", 10);
      console.log("VIP Accessible Seat arranged successfully");
    }
  } else {
    console.log("No VIP Accessible Seat booking found");
  }
}

handleVIPBookings();
// console.log(seats);
