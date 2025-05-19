import { SeatHelper } from "../../seat_planner_oop/Seat_Helper.js";
import { Seat } from "../../seat_planner_oop/Seat.js";
import { Booking } from "../../seat_planner_oop/Booking.js";

describe("SeatHelper class", () => {
  let helper;

  beforeEach(() => {
    helper = new SeatHelper();
  });

  test("should generate initial seat layout correctly", () => {
    const layout = helper.getInitialSeatsLayout();

    expect(layout.length).toBe(7); // 7 rows
    expect(layout[0].length).toBe(10); // 10 columns

    // Check VIP and RA seat types in row A
    const rowA = layout[0];
    const threshold = 10 - Math.floor(10 / 3);
    for (let i = 0; i < rowA.length; i++) {
      if (i >= threshold) {
        expect(rowA[i].seatType).toBe("RA");
      } else {
        expect(rowA[i].seatType).toBe("V");
      }
    }
  });

  test("should mark 5 random broken seats", () => {
    const layout = helper.getInitialSeatsLayout();
    const updatedLayout = helper.makeRandomBrokenSeats(layout, 5);

    const brokenSeats = helper.getBrokenSeats(updatedLayout);
    expect(brokenSeats.length).toBe(5);
  });

  test("should generate sample booking inputs", () => {
    const totalSeats = 20;
    const bookings = helper.getSampleBookingInputs(totalSeats);

    const totalBookedSeats = bookings.reduce((acc, b) => acc + b.size, 0);
    expect(totalBookedSeats).toBeLessThanOrEqual(totalSeats);
    expect(bookings.length).toBeGreaterThan(0);
  });

  test("should return correct number of VIP and Accessible seats", () => {
    expect(helper.getNumberOfVipSeats()).toBe(10 - Math.floor(10 / 3));
    expect(helper.getNumberOfAccessibleSeats()).toBe(Math.floor(10 / 3));
  });

  test("should find bookings by seat type", () => {
    const bookings = [
      new Booking("B1", 2, "R"),
      new Booking("B2", 3, "V"),
      new Booking("B3", 1, "R"),
    ];

    const rBookings = helper.getBookingsForSeatType(bookings, "R");
    expect(rBookings.length).toBe(2);

    const vBookings = helper.getBookingsForSeatType(bookings, "V");
    expect(vBookings.length).toBe(1);
  });

  test("should return max consecutive unoccupied and unbroken seats", () => {
    const layout = helper.getInitialSeatsLayout();

    // Mark one seat in row A as occupied
    layout[0][0].markOccupied("TestGroup");

    const max = helper.getMaxConsecutiveSeats(layout);
    expect(max).toBeLessThanOrEqual(10);
    expect(max).toBeGreaterThan(0);
  });

  test("should cancel booking by name", () => {
    const layout = helper.getInitialSeatsLayout();
    layout[0][0].markOccupied("G1");
    layout[0][1].markOccupied("G1");

    helper.cancelBooking(layout, "G1");

    expect(layout[0][0].isOccupied).toBe(false);
    expect(layout[0][1].isOccupied).toBe(false);
  });

  test("should split booking input based on available consecutive seats", () => {
    const bookings = [new Booking("B1", 6, "R")];
    const result = helper.splitBookingInput(4, bookings);

    expect(result.length).toBe(2);
    expect(result[0].size).toBe(4);
    expect(result[1].size).toBe(2);
  });

  test("should swap seats correctly", () => {
    const layout = helper.getInitialSeatsLayout();
    const seat1 = layout[0][0];
    const seat2 = layout[0][1];

    seat1.markOccupied("A");
    seat2.markOccupied("B");

    const id1 = seat1.seatId;
    const id2 = seat2.seatId;

    const originalGroup1 = seat1.groupName;
    const originalGroup2 = seat2.groupName;

    helper.swapSeats(layout, id1, id2);

    expect(seat1.groupName).toBe(originalGroup2);
    expect(seat2.groupName).toBe(originalGroup1);
  });
});
