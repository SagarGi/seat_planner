// seat_helper.js

function getInitialSeats() {
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const columns = Array.from({ length: 10 }, (_, i) => i + 1);
  const seats = [];
  rows.forEach((row) => {
    columns.forEach((col) => {
      let type = "R";
      if (row === "A" && col === 10) {
        type = "VA/V";
      } else if (row === "A") {
        type = "V/R";
      } else if (col === 10) {
        type = "A/R";
      }
      const seat = {
        seatId: `${row}${col}`,
        row: row,
        column: col,
        isBooked: false,
        type: type,
      };
      seats.push(seat);
    });
  });
  return seats;
}

function getSampleBookingInputs() {
  const bookings = [
    { name: "b1", size: 1, type: "R" },
    { name: "b2", size: 2, type: "R" },
    { name: "b3", size: 3, type: "V" },
    { name: "b4", size: 6, type: "V" },
    { name: "b5", size: 2, type: "VA" },
  ];
  return bookings;
}

function assignVIPSeats(seats, vipBookings) {
  const vaBookingsAccessibe = vipBookings.filter((b) => b.type === "VA");
  const vBookings = vipBookings.filter((b) => b.type === "V");
  const totalVIPSeatsRequested = vipBookings.reduce(
    (sum, booking) => sum + booking.size,
    0
  );
  const totalVIPAccessibleSeatsRequested = vaBookingsAccessibe.reduce(
    (sum, booking) => sum + booking.size,
    0
  );

  console.log(totalVIPAccessibleSeatsRequested);

  if (totalVIPAccessibleSeatsRequested.length >= 2) {
    console.log(
      `❌ Error: Cannot have more than 2 VIP Accessible (VA) bookings.`
    );
    return;
  }

  if (totalVIPSeatsRequested > 10) {
    console.log(
      `❌ Error: Total VIP seats requested (${totalVIPSeatsRequested}) exceeds maximum available VIP seats (10).`
    );
    return;
  }

  const vipSeats = seats.filter(
    (seat) =>
      seat.row === "A" &&
      !seat.isBooked &&
      seat.type.includes("V") &&
      !seat.type.includes("A")
  );
  const vipAccessibleSeats = seats.filter(
    (seat) => seat.row === "A" && seat.column === 10
  );

  // 1. Assign VA bookings first to A10
  for (const booking of vaBookings) {
    if (booking.size > 1) {
      console.log(
        `❌ Error: VIP Accessible booking ${booking.name} requested more than 1 seat, but only 1 accessible seat available.`
      );
      continue;
    }
    const accessibleSeat = vipAccessibleSeats.find((seat) => !seat.isBooked);
    if (accessibleSeat) {
      accessibleSeat.isBooked = true;
      accessibleSeat.bookingName = booking.name;
      accessibleSeat.memberNumber = 1;
    } else {
      console.log(
        `⚠️ No VIP Accessible seat available for booking ${booking.name}`
      );
    }
  }

  // 2. Assign normal VIP bookings (V)
  for (const booking of vBookings) {
    const groupSeats = findGroupSeats(vipSeats, booking.size);
    if (groupSeats.length === booking.size) {
      groupSeats.forEach((seat, index) => {
        seat.isBooked = true;
        seat.bookingName = booking.name;
        seat.memberNumber = index + 1;
      });

      // Remove booked seats from vipSeats
      groupSeats.forEach((seat) => {
        const idx = vipSeats.indexOf(seat);
        if (idx !== -1) vipSeats.splice(idx, 1);
      });
    } else {
      console.log(
        `⚠️ Not enough VIP seats together for booking ${booking.name}`
      );
    }
  }

  // 3. If no VA bookings, allow normal V bookings to use seat A10
  if (vaBookings.length === 0) {
    const freeAccessibleSeat = vipAccessibleSeats.find(
      (seat) => !seat.isBooked
    );
    if (freeAccessibleSeat) {
      // Allow VIP bookings to use it
      const unassignedVIPs = vBookings
        .flatMap((booking) => {
          const bookedSeats = seats.filter(
            (seat) => seat.bookingName === booking.name
          );
          return Array.from(
            { length: booking.size - bookedSeats.length },
            (_, i) => ({ booking, index: bookedSeats.length + i + 1 })
          );
        })
        .filter((x) => x);

      if (unassignedVIPs.length > 0) {
        const nextVIP = unassignedVIPs[0];
        freeAccessibleSeat.isBooked = true;
        freeAccessibleSeat.bookingName = nextVIP.booking.name;
        freeAccessibleSeat.memberNumber = nextVIP.index;
      }
    }
  }
}

// Assign Regular seats
function assignRegularSeats(seats, regularBookings, avoidVIPSeats) {
  let availableSeats = seats.filter((seat) => !seat.isBooked);

  if (avoidVIPSeats) {
    availableSeats = availableSeats.filter((seat) => seat.row !== "A");
  }

  for (const booking of regularBookings) {
    const groupSeats = findGroupSeats(availableSeats, booking.size);
    if (groupSeats.length === booking.size) {
      groupSeats.forEach((seat, index) => {
        seat.isBooked = true;
        seat.bookingName = booking.name;
        seat.memberNumber = index + 1;
      });

      // Remove booked seats from availableSeats
      groupSeats.forEach((seat) => {
        const idx = availableSeats.indexOf(seat);
        if (idx !== -1) availableSeats.splice(idx, 1);
      });
    } else {
      console.log(
        `⚠️ Not enough regular seats together for booking ${booking.name}`
      );
    }
  }
}

// Find group seats (continuous seats in a row)
function findGroupSeats(seats, size) {
  const seatsByRow = {};

  seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) seatsByRow[seat.row] = [];
    seatsByRow[seat.row].push(seat);
  });

  for (const row in seatsByRow) {
    const sortedSeats = seatsByRow[row].sort((a, b) => a.column - b.column);

    for (let i = 0; i <= sortedSeats.length - size; i++) {
      let isGroup = true;
      for (let j = 1; j < size; j++) {
        if (sortedSeats[i + j].column !== sortedSeats[i].column + j) {
          isGroup = false;
          break;
        }
      }
      if (isGroup) {
        return sortedSeats.slice(i, i + size);
      }
    }
  }
  return [];
}

module.exports = {
  getInitialSeats,
  getSampleBookingInputs,
  assignVIPSeats,
  assignRegularSeats,
  findGroupSeats,
};
