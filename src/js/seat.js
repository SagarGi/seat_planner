import { SeatHelper } from "../../seat_planner_oop/Seat_Helper.js";
import { Booking } from "../../seat_planner_oop/Booking.js";
import { SeatPlanner } from "../../seat_planner_oop/Seat_Planner.js";
let bookingId = 1;
let sn = 1;
const seatHelper = new SeatHelper();

function updateAndArrangeSeats(seats) {
  const seatGrid = document.getElementById("seat-grid");

  // ❗ Clear existing seats before re-rendering
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

      // 🎨 Set seat color using hex codes
      if (currentSeatInGrid.seatType === "V" && !currentSeatInGrid.isOccupied) {
        seat.style.backgroundColor = "#000a9b"; // Blue
      } else if (
        currentSeatInGrid.seatType === "R" &&
        !currentSeatInGrid.isOccupied
      ) {
        seat.style.backgroundColor = "#a5a5a5"; // Gray
      } else if (
        currentSeatInGrid.seatType === "RA" &&
        !currentSeatInGrid.isOccupied
      ) {
        seat.style.backgroundColor = "#37ff52"; // Green
      } else if (currentSeatInGrid.isBroken) {
        seat.style.backgroundColor = "#000000"; // Black
      } else if (currentSeatInGrid.isOccupied) {
        seat.style.backgroundColor = "#cc0000"; // Red
      }

      seat.addEventListener("click", () => {
        alert(`Seat clicked: ${seat.textContent}`);
      });

      seatGrid.appendChild(seat);
    }
  }
}

function displaySeats() {
  document.addEventListener("DOMContentLoaded", function () {
    const seats = seatHelper.getInitialSeatsLayout();
    const seatGrid = document.getElementById("seat-grid");
    seatGrid.classList.add("seat-grid");
    for (let i = 0; i < seatHelper.rows.length; i++) {
      for (let j = 0; j < seatHelper.col; j++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");

        const currentSeatInGrid = seats[i][j];
        seat.textContent = currentSeatInGrid.seatId;
        // Set seat color using hex codes
        if (
          currentSeatInGrid.seatType === "V" &&
          !currentSeatInGrid.isOccupied
        ) {
          seat.style.backgroundColor = "#000a9b"; // Blue
        } else if (
          currentSeatInGrid.seatType === "R" &&
          !currentSeatInGrid.isOccupied
        ) {
          seat.style.backgroundColor = "#a5a5a5"; // Gray
        } else if (
          currentSeatInGrid.seatType === "RA" &&
          !currentSeatInGrid.isOccupied
        ) {
          seat.style.backgroundColor = "#37ff52"; // Green
        } else if (currentSeatInGrid.isBroken) {
          seat.style.backgroundColor = "#000000"; // Gray
        } else if (currentSeatInGrid.isOccupied) {
          console.log("occupied");
          seat.style.backgroundColor = "#cc0000"; // Green
        } else {
          console.log("here");
        }

        seat.addEventListener("click", () => {
          alert(`Seat clicked: ${seat.textContent}`);
          // You can replace alert with any custom logic
        });
        seatGrid.appendChild(seat);
      }
    }
  });
}

function handleBookingForm() {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookingForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // prevent page reload
      const size = Number(document.getElementById("numPeople").value);
      const seatType = document.getElementById("seatType").value;
      // handle this later
      const preferredSeat = document.getElementById("preferredSeat").value;
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
      form.reset(); // reset the form after alert
    });
  });
}

function displayBookingsInTable(booking) {
  // table values:
  const tableBody = document.getElementById("bookingTableBody");
  const row = document.createElement("tr");
  row.innerHTML = `
          <td>${sn++}</td>
          <td>${booking?.name}</td>
          <td>${booking?.seatType}</td>
          <td>${booking?.size}</td>
          <td>${'<button class="delete-btn">Cancel</button>'}</td>
        `;
  tableBody.appendChild(row);
}

function cancelBooking() {
  const tableBody = document.getElementById("bookingTableBody");

  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const row = e.target.closest("tr");
      const bookingName = row.children[1].textContent;

      // Remove all bookings with this name from the array
      seatHelper.bookings = seatHelper.bookings.filter(
        (booking) => booking.name !== bookingName
      );
      const seatPlanner = new SeatPlanner(
        seatHelper,
        seatHelper.getInitialSeatsLayout(),
        seatHelper.getBookings()
      );
      // seatPlanner.randomlyMarkBrokenSeats(5);
      seatPlanner.arrangeSeats();
      const seats = seatPlanner.seats;
      updateAndArrangeSeats(seats);
      e.target.closest("tr").remove();
    }
  });
}

function changeAuthority() {
  // radio button functionality
  document.addEventListener("DOMContentLoaded", () => {
    const roleRadios = document.querySelectorAll('input[name="role"]');

    roleRadios.forEach((radio) => {
      radio.addEventListener("change", (event) => {
        alert("Selected role: " + event.target.value);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const arrangeBtn = document.getElementById("arrangeBtn");
  const resetBtn = document.getElementById("resetBtn");

  arrangeBtn.addEventListener("click", function () {
    console.log(seatHelper.bookings);
    const seatPlanner = new SeatPlanner(
      seatHelper,
      seatHelper.getInitialSeatsLayout(),
      seatHelper.getBookings()
    );
    // seatPlanner.randomlyMarkBrokenSeats(5);
    seatPlanner.arrangeSeats();
    const seats = seatPlanner.seats;
    updateAndArrangeSeats(seats);
  });

  resetBtn.addEventListener("click", function () {
    alert("Reset Seats button clicked");
  });
});

displaySeats();
handleBookingForm();
cancelBooking();
