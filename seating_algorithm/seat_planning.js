// seat_planning.js

const {
  rows,
  col,
  numberOfSampleBookingInputs,
  getInitialSeatsLayout,
  getSampleBookingInputs,
  isBookingAvailable,
  getBookingsForSeatType,
  getSizeForSeatTypeFromBookings,
  markSeatOccupied,
  getBookingsOfSeatTypeOrderedBySizeDescending,
  getOccupiedSeats,
  getUnOccupiedSeats,
  getBrokenSeats,
  getUnBrokenSeats,
  getNumberOfVipSeats,
  getNumberOfAccessibleSeats,
  findConsecutiveSeatsBasedOnSizes,
  findConsecutiveSeatsBasedOnSizesAndIndex,
  splitBookingInput,
  getMaxConsecutiveSeats,
} = require("./seat_helper.js");

let seats = getInitialSeatsLayout(); // Initialize the seat layout
const bookings = getSampleBookingInputs(numberOfSampleBookingInputs); // Sample bookings

// this can be pointed by admin or even when generating the sample bookings
// @ADMIN can mark seat as broken with row and column
function markSeatBroken(seats, row, column) {
  if (seats[row][column].isOccupied) {
    console.error("This seat is already occupied");
    return;
  }
  seats[row][column].isBroken = true;
}

function randomlyMarkBrokenSeats(seats, count) {
  const totalRows = seats.length;
  const totalCols = seats[0].length;
  let marked = 0;

  while (marked < count) {
    const row = Math.floor(Math.random() * totalRows);
    const col = Math.floor(Math.random() * totalCols);
    const seat = seats[row][col];

    if (!seat.isOccupied && !seat.isBroken) {
      seat.isBroken = true;
      marked++;
    }
  }
}

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
  let sortedRegularBookings = getBookingsOfSeatTypeOrderedBySizeDescending(
    bookings,
    "R"
  );

  console.log("sortedRegularBookings", sortedRegularBookings);

  let seatOverflowed = false;
  let lastRowIndexUsed = 0;
  while (!seatOverflowed) {
    console.log("lopping");
    for (let i = 0; i < sortedRegularBookings.length; i++) {
      let prevGroupName = sortedRegularBookings[i - 1]?.name;
      let resultForConsecutiveSeats = null;
      if (prevGroupName === sortedRegularBookings[i].name) {
        noOfSeatsConsecutiveFromPrevRow =
          findConsecutiveSeatsBasedOnSizesAndIndex(
            seats,
            sortedRegularBookings[i].size,
            lastRowIndexUsed + 1
          );
        if (noOfSeatsConsecutiveFromPrevRow !== null) {
          resultForConsecutiveSeats = noOfSeatsConsecutiveFromPrevRow;
        } else {
          resultForConsecutiveSeats = findConsecutiveSeatsBasedOnSizes(
            seats,
            sortedRegularBookings[i].size
          );
        }
      } else {
        resultForConsecutiveSeats = findConsecutiveSeatsBasedOnSizes(
          seats,
          sortedRegularBookings[i].size
        );
      }

      if (resultForConsecutiveSeats === null) {
        // we will go vist another row to find suitable consecutive seats
        sortedRegularBookings.splice(0, i);

        const maxConsecutiveSeats = getMaxConsecutiveSeats(seats);
        sortedRegularBookings = splitBookingInput(
          maxConsecutiveSeats,
          sortedRegularBookings
        );
        console.log("Yeta aayo!");
        seatOverflowed = false;
        break; // we will run another round of loop to arrange the seats
      }
      // assigning the seats
      let iterator = resultForConsecutiveSeats.startColumnIndex;
      row = resultForConsecutiveSeats.startRowIndex;
      let memberID = 1;
      let tmpItrator = iterator;
      for (let j = 0; j < sortedRegularBookings[i].size; j++) {
        seats = markSeatOccupied(
          seats,
          sortedRegularBookings[i].name,
          row,
          tmpItrator,
          memberID
        );
        memberID++;
        tmpItrator++;
      }
      seatOverflowed = true;
      lastRowIndexUsed = resultForConsecutiveSeats.startRowIndex;
    }
  }
}

function arrangeSeats() {
  // during the arrangement of seats if there are no VIPS at all then we treat them as regular bookings
  if (isBookingAvailable(bookings, "V")) {
    handleVIPBookings();
  }
  handleRegularBookings();
  console.log("Your current bookings \n", bookings);
  console.log(
    "The final arrangement of seats is as follows based on the given inputs:\n"
  );
  console.log(seats);
}

// Extra
// Before arranging the seats lets make 5 of them as broken and algorithm handle the seat
// arrangement even if there is a broken seat
// randomlyMarkBrokenSeats(seats, 5);
// console.log(getBrokenSeats(seats));
// Now arrange the seats
arrangeSeats();
