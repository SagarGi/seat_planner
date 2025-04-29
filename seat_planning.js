// seat_planning.js

const {
  getInitialSeats,
  getSampleBookingInputs,
  isBookingAvailable,
  getBookingsForSeatType,
  getSizeForSeatTypeFromBookings,
  markSeatOccupied,
  getBookingsOfSeatTypeOrderedBySizeDescending,
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
          `There are only 1 VIP Accessible seats available but found ${totalSizeOfVIPAccessibleBookings},
        Please go with the regular seats`
      );
      return;
    } else {
      // it means there is only one VA booking, we can assign it to the VA seat in column 10 of row A
      // seats has been updated
      seats = markSeatOccupied(
        seats,
        getBookingsForSeatType(bookings, "VA")[0],
        "A",
        10,
        `member 1`
      );
      console.log("VIP Accessible Seat arranged successfully");
    }
  }

  // 3. check if there is any V in the bookings
  if (isBookingAvailable(bookings, "V")) {
    // we will assign VIP seats now
    // if VA is not occipied then we will validate for upto 10 VIP seats
    // if VA is occupied then we will assign upto 9 VIP seats
    const totalSizeOfVIPBookings = getSizeForSeatTypeFromBookings(
      bookings,
      "V"
    );
    if (!isBookingAvailable(bookings, "VA")) {
      // we validate for 10 VIP seats
      if (totalSizeOfVIPBookings > 10) {
        console.error(
          `In Booking \n ${JSON.stringify(
            getBookingsForSeatType(bookings, "V")
          )} \n` +
            `There are only 9 VIP seats available but found ${totalSizeOfVIPBookings},
             Please go with the regular seats`
        );
        return;
      }
      // now we can assign upto 10 VIP seats
      const sortedVIPBookings = getBookingsOfSeatTypeOrderedBySizeDescending(
        bookings,
        "V"
      );
      let iterator = 1;
      // for VIP its always row A
      let row = "A";
      for (let i = 0; i < sortedVIPBookings.length; i++) {
        const vipBooking = sortedVIPBookings[i];
        let memberID = 1;
        let tmpItrator = iterator;
        for (let j = 0; j < vipBooking.size; j++) {
          seats = markSeatOccupied(
            seats,
            vipBooking,
            row,
            tmpItrator,
            memberID
          );
          memberID++;
          tmpItrator++;
        }
        iterator += vipBooking.size;
      }
      console.log(seats);
    } else {
      // we validate for 9 VIP seats
      if (totalSizeOfVIPBookings > 9) {
        console.error(
          `In Booking \n ${JSON.stringify(
            getBookingsForSeatType(bookings, "V")
          )} \n` +
            `There are only 9 VIP seats available but found ${totalSizeOfVIPBookings},
             Please go with the regular seats`
        );
        return;
      }
      // now we can assign upto 9 VIP seats
      // now we can assign upto 10 VIP seats
      const sortedVIPBookings = getBookingsOfSeatTypeOrderedBySizeDescending(
        bookings,
        "V"
      );
      let iterator = 1;
      // for VIP its always row A
      let row = "A";
      for (let i = 0; i < sortedVIPBookings.length; i++) {
        const vipBooking = sortedVIPBookings[i];
        let memberID = 1;
        let tmpItrator = iterator;
        for (let j = 0; j < vipBooking.size; j++) {
          seats = markSeatOccupied(
            seats,
            vipBooking,
            row,
            tmpItrator,
            memberID
          );
          memberID++;
          tmpItrator++;
        }
        iterator += vipBooking.size;
      }
      console.log(seats);
    }
  }
}

handleVIPBookings();
// console.log(seats);
