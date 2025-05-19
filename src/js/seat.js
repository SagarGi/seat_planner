import { SeatHelper } from "../../seat_planner_oop/Seat_Helper.js";
import { Booking } from "../../seat_planner_oop/Booking.js";
import { SeatPlanner } from "../../seat_planner_oop/Seat_Planner.js";

let bookingId = 1;
let sn = 1;
let operateAs = "staff";
let firstSelectedSeat = null;
let globalSeats = []; // ✅ This now holds the live seat state
let seatHelper = new SeatHelper();
let checkBrokenSeats = false;

// ✅ Dynamically display seats based on the current state
function displaySeats(seats) {
  const seatGrid = document.getElementById("seat-grid");
  seatGrid.innerHTML = "";
  seatGrid.classList.add("seat-grid");
  for (let i = 0; i < seatHelper.rows.length; i++) {
    for (let j = 0; j < seatHelper.col; j++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");

      const currentSeatInGrid = seats[i][j];
      seat.textContent =
        currentSeatInGrid.seatId +
        `${
          currentSeatInGrid.groupName ? "/" + currentSeatInGrid.groupName : ""
        }`;

      // Seat color logic
      if (
        currentSeatInGrid.seatType === "V" &&
        !currentSeatInGrid.isOccupied &&
        !currentSeatInGrid.isBroken
      ) {
        seat.style.backgroundColor = "#000a9b"; // Blue
      } else if (
        currentSeatInGrid.seatType === "R" &&
        !currentSeatInGrid.isOccupied &&
        !currentSeatInGrid.isBroken
      ) {
        seat.style.backgroundColor = "#a5a5a5"; // Gray
      } else if (
        currentSeatInGrid.seatType === "RA" &&
        !currentSeatInGrid.isOccupied &&
        !currentSeatInGrid.isBroken
      ) {
        seat.style.backgroundColor = "#37ff52"; // Green
      } else if (currentSeatInGrid.isBroken) {
        seat.style.backgroundColor = "#000000"; // Black
      } else if (currentSeatInGrid.isOccupied) {
        seat.style.backgroundColor = "#cc0000"; // Red
      }

      // Admin swap logic
      // Admin swap logic
      if (operateAs === "admin") {
        seat.style.cursor = "pointer";

        seat.addEventListener("click", () => {
          const clickedSeat = currentSeatInGrid;

          if (!firstSelectedSeat) {
            firstSelectedSeat = clickedSeat;
            seat.style.border = "2px solid yellow"; // highlight first selection
          } else {
            // Only swap allowed properties, keep seatId and restricted seatType
            const temp = {
              isOccupied: firstSelectedSeat.isOccupied,
              isBroken: firstSelectedSeat.isBroken,
              booking: firstSelectedSeat.booking,
              groupName: firstSelectedSeat.groupName,
            };

            // Swap only if neither seat is V or RA
            const protectSeatType = (type) => type === "V" || type === "RA";

            // Swap allowed properties
            if (
              !protectSeatType(firstSelectedSeat.seatType) &&
              !protectSeatType(clickedSeat.seatType)
            ) {
              const seatTypeTemp = firstSelectedSeat.seatType;
              firstSelectedSeat.seatType = clickedSeat.seatType;
              clickedSeat.seatType = seatTypeTemp;
            }

            firstSelectedSeat.isOccupied = clickedSeat.isOccupied;
            firstSelectedSeat.isBroken = clickedSeat.isBroken;
            firstSelectedSeat.booking = clickedSeat.booking;
            firstSelectedSeat.groupName = clickedSeat.groupName;

            clickedSeat.isOccupied = temp.isOccupied;
            clickedSeat.isBroken = temp.isBroken;
            clickedSeat.booking = temp.booking;
            clickedSeat.groupName = temp.groupName;

            firstSelectedSeat = null;

            // Re-render after swap
            displaySeats(seats);
          }
        });
      }

      seatGrid.appendChild(seat);
    }
  }
}

function updateAndArrangeSeats(seats) {
  displaySeats(seats);
}

// Booking form handler
function handleBookingForm() {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookingForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const size = Number(document.getElementById("numPeople").value);
      if (size < 1) {
        alert("Please enter a valid number of people.");
        return;
      }

      const seatType = document.getElementById("seatType").value;
      const preferredSeat = document.getElementById("preferredSeat").value;
      if (preferredSeat && size !== 1) {
        alert("One Seat For one Person");
        return;
      }

      const booking = new Booking(
        `B${bookingId++}`,
        size,
        seatType,
        preferredSeat
      );
      seatHelper.bookings.push(booking);
      if (seatHelper.bookings.length > 0) {
        displayBookingsInTable(booking);
      }
      form.reset();
    });
  });
}

// Display booking data in table
function displayBookingsInTable(booking) {
  const tableBody = document.getElementById("bookingTableBody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${sn++}</td>
    <td>${booking?.name}</td>
    <td>${booking?.seatType}</td>
    <td>${booking?.size}</td>
    <td><button class="delete-btn">Cancel</button></td>
  `;
  tableBody.appendChild(row);
}

// Cancel booking
function cancelBooking() {
  const tableBody = document.getElementById("bookingTableBody");

  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const row = e.target.closest("tr");
      const bookingName = row.children[1].textContent;

      seatHelper.bookings = seatHelper.bookings.filter(
        (booking) => booking.name !== bookingName
      );

      if (seatHelper.bookings.length === 0) {
        seatHelper.bookings = [];
        // ✅ 2. Clear table rows from DOM
        const tableBody = document.getElementById("bookingTableBody");
        tableBody.innerHTML = "";
        // ✅ 3. Reset seat layout
        globalSeats = seatHelper.getInitialSeatsLayout();
        displaySeats(globalSeats);
      } else {
        const seatPlanner = new SeatPlanner(
          seatHelper,
          seatHelper.getInitialSeatsLayout(), // ✅ reuse current layout
          seatHelper.getBookings()
        );
        seatPlanner.arrangeSeats();
        globalSeats = seatPlanner.seats;
        updateAndArrangeSeats(globalSeats);
        e.target.closest("tr").remove();
      }
    }
  });
}

// Role change listener — don't reset seat state
function changeAuthority() {
  document.addEventListener("DOMContentLoaded", () => {
    const roleRadios = document.querySelectorAll('input[name="role"]');

    roleRadios.forEach((radio) => {
      radio.addEventListener("change", (event) => {
        operateAs = event.target.value;
        alert("Selected role: " + operateAs);

        // ✅ Just re-render current seats
        displaySeats(globalSeats);
      });
    });
  });
}

// Button click listeners (arrange & reset)
document.addEventListener("DOMContentLoaded", function () {
  const arrangeBtn = document.getElementById("arrangeBtn");
  const resetBtn = document.getElementById("resetBtn");

  arrangeBtn.addEventListener("click", function () {
    if (seatHelper.bookings.length === 0) {
      alert("No bookings to arrange.");
      return;
    }
    if (!checkBrokenSeats) {
      const seatPlanner = new SeatPlanner(
        seatHelper,
        seatHelper.getInitialSeatsLayout(), // ✅ use current layout
        seatHelper.bookings
      );
      seatPlanner.arrangeSeats();
      console.log(seatPlanner.seats);
      globalSeats = seatPlanner.seats;
      updateAndArrangeSeats(globalSeats);
    } else {
      const seatPlanner = new SeatPlanner(
        seatHelper,
        globalSeats, // ✅ use current layout
        seatHelper.bookings
      );
      seatPlanner.arrangeSeats();
      console.log(seatPlanner.seats);
      globalSeats = seatPlanner.seats;
      updateAndArrangeSeats(globalSeats);
    }
  });

  resetBtn.addEventListener("click", function () {
    alert("Reset Seats button clicked");
    // ✅ 1. Clear bookings array in memory
    seatHelper.bookings = [];
    // ✅ 2. Clear table rows from DOM
    const tableBody = document.getElementById("bookingTableBody");
    tableBody.innerHTML = "";
    // ✅ 3. Reset seat layout
    globalSeats = seatHelper.getInitialSeatsLayout();
    displaySeats(globalSeats);
  });
});

// ✅ Initial load setup
document.addEventListener("DOMContentLoaded", () => {
  globalSeats = seatHelper.getInitialSeatsLayout(); // ✅ Only set once
  displaySeats(globalSeats);
});

const randomBrokenCheckbox = document.getElementById("randomBrokenSeats");

// When the checkbox is clicked
randomBrokenCheckbox.addEventListener("change", function () {
  if (this.checked) {
    checkBrokenSeats = true;
    alert("Random Broken Seats checkbox checked");
    const seatPlanner = new SeatPlanner(
      seatHelper,
      seatHelper.getInitialSeatsLayout(), // ✅ use current layout
      seatHelper.getBookings()
    );
    seatPlanner.randomlyMarkBrokenSeats(5);
    globalSeats = seatPlanner.seats;
    displaySeats(globalSeats);
  } else {
    alert("Random Broken Seats checkbox unchecked");
    checkBrokenSeats = true;
    // Optionally: Reset broken seats if unchecked
    globalSeats = seatHelper.getInitialSeatsLayout();
    displaySeats(globalSeats);
  }
});

handleBookingForm();
cancelBooking();
changeAuthority();
