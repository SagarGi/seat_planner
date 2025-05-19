import { Seat } from "../../seat_planner_oop/Seat.js";

import { jest } from "@jest/globals";

describe("Seat class", () => {
  let seat;

  beforeEach(() => {
    seat = new Seat(1, "A", "VIP");
  });

  test("should initialize a seat with given parameters", () => {
    expect(seat.seatId).toBe("1A");
    expect(seat.row).toBe(1);
    expect(seat.column).toBe("A");
    expect(seat.seatType).toBe("VIP");
    expect(seat.isOccupied).toBe(false);
    expect(seat.isBroken).toBe(false);
    expect(seat.groupName).toBeNull();
  });

  test("should mark seat as occupied with group name", () => {
    seat.markOccupied("Group1");
    expect(seat.isOccupied).toBe(true);
    expect(seat.groupName).toBe("Group1");
  });

  test("should not mark broken if already occupied", () => {
    seat.markOccupied("Group1");
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    seat.markBroken();

    expect(seat.isBroken).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      "This seat is already occupied and cannot be marked as broken."
    );

    consoleSpy.mockRestore();
  });

  test("should mark seat as broken if not occupied", () => {
    seat.markBroken();
    expect(seat.isBroken).toBe(true);
  });

  test("should cancel booking", () => {
    seat.markOccupied("Group1");
    seat.cancelBooking();
    expect(seat.isOccupied).toBe(false);
    expect(seat.groupName).toBeNull();
  });

  test('should default seatType to "R" when not provided', () => {
    const defaultSeat = new Seat(2, "B");
    expect(defaultSeat.seatType).toBe("R");
  });
});
