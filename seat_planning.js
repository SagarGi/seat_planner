// seat_planning.js

const {
  rows,
  col,
  getInitialSeats,
  getSampleBookingInputs,
  isBookingAvailable,
  getBookingsForSeatType,
  getSizeForSeatTypeFromBookings,
  markSeatOccupied,
  getBookingsOfSeatTypeOrderedBySizeDescending,
  getOccupiedSeats,
  getUnOccupiedSeats,
  getNumberOfVipSeats,
  getNumberOfAccessibleSeats,
  findConsecutiveSeatsBasedOnSizes,
} = require("./seat_helper.js");

let seats = getInitialSeats(); // Initialize the seat layout
const bookings = getSampleBookingInputs(); // Sample bookings

function assignSeatsForVIP(sortedVIPBookings) {
  let iterator = 0;
  // for VIP its always row A whose index is 0
  let row = 0;
  for (let i = 0; i < sortedVIPBookings.length; i++) {
    const vipBooking = sortedVIPBookings[i];
    let memberID = 1;
    let tmpItrator = iterator;
    for (let j = 0; j < vipBooking.size; j++) {
      seats = markSeatOccupied(
        seats,
        vipBooking.name,
        row,
        tmpItrator,
        memberID
      );
      memberID++;
      tmpItrator++;
    }
    iterator += vipBooking.size;
  }
}

function assignSeatsForRegularAccessible(
  sortedRegularOrAccessibleBookings,
  startIterator = 0
) {
  let iterator = startIterator;
  // for accessible seats its always row A
  let row = 0;
  for (let i = 0; i < sortedRegularOrAccessibleBookings.length; i++) {
    const raBooking = sortedRegularOrAccessibleBookings[i];
    let memberID = 1;
    let tmpItrator = iterator;
    for (let j = 0; j < raBooking.size; j++) {
      seats = markSeatOccupied(
        seats,
        raBooking.name,
        row,
        tmpItrator,
        memberID
      );
      memberID++;
      tmpItrator++;
    }
    iterator += raBooking.size;
  }
}

// first we handle the VIP bookings and then only go for regular bookings
function handleVIPBookings() {
  // 1. check if there is any V in the bookings
  if (isBookingAvailable(bookings, "V")) {
    const totalSizeOfVIPBookings = getSizeForSeatTypeFromBookings(
      bookings,
      "V"
    );
    // validation is required as we have limited vip seats and accessible or priority seats
    const vipSeatsAvailable = getNumberOfVipSeats(col);
    if (totalSizeOfVIPBookings > vipSeatsAvailable) {
      console.error(
        `In Booking \n ${JSON.stringify(
          getBookingsForSeatType(bookings, "V")
        )} \n` +
          `There are only ${vipSeatsAvailable} VIP seats available but found ${totalSizeOfVIPBookings},
        Please go with the regular seats if possible`
      );
      return;
    }
    // we know there are VIP seats available
    // we will assign them first in groups and then individuals
    const sortedVIPBookings = getBookingsOfSeatTypeOrderedBySizeDescending(
      bookings,
      "V"
    );
    assignSeatsForVIP(sortedVIPBookings);
  }
}

function handleRegularBookings() {
  // first we check if there any Regular Accessible in the bookings
  if (isBookingAvailable(bookings, "RA")) {
    const totalSizeOfRegularAccessibleBookings = getSizeForSeatTypeFromBookings(
      bookings,
      "RA"
    );
    // validation is required as we have limited accessible or priority seats
    const accessibleSeatsAvailable = getNumberOfAccessibleSeats(col);
    if (totalSizeOfRegularAccessibleBookings > accessibleSeatsAvailable) {
      console.error(
        `In Booking \n ${JSON.stringify(
          getBookingsForSeatType(bookings, "RA")
        )} \n` +
          `There are only ${accessibleSeatsAvailable} Accessible seats available but found ${totalSizeOfRegularAccessibleBookings},
        Please go with the regular seats if possible`
      );
      return;
    }
    // we know there are Accessible seats available
    // we will assign them first in groups and then individuals
    const sortedRegularAccessibleBookings =
      getBookingsOfSeatTypeOrderedBySizeDescending(bookings, "RA");
    assignSeatsForRegularAccessible(
      sortedRegularAccessibleBookings,
      col - accessibleSeatsAvailable
    );
  }

  // And then we handle the rest of the seats following a specific algorithm to maximize the seat planning.
  const sortedRegularBookings = getBookingsOfSeatTypeOrderedBySizeDescending(
    bookings,
    "R"
  );

  for (let i = 0; i < sortedRegularBookings.length; i++) {
    const resultForConsecutiveSeats = findConsecutiveSeatsBasedOnSizes(
      seats,
      sortedRegularBookings[i].size
    );
    c; // assigning the seats
    assignSeatsForRegularAccessible(
      sortedRegularBookings,
      resultForConsecutiveSeats.startIterator
    );
  }
  console.log("sortedRegularBookings", sortedRegularBookings);
}

function arrangeSeats() {
  // during the arrangement of seats if there are no VIPS at all then we treat them as regular bookings
  if (isBookingAvailable(bookings, "V")) {
    handleVIPBookings();
  }
  handleRegularBookings();
}

arrangeSeats();
