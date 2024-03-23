import { z } from "zod";
import { BusType, SeatType, SortBy, SortOrder } from "./utils";

export const TripSchema = z.object({
  originId: z.number().int(),
  destinationId: z.number().int(),
  busType: BusType,
  seatType: SeatType,
  durationInHours: z.number().int(), // Assuming it's an integer
  busId: z.string(), // Assuming it's a string
  totalSeats: z.number().int(), // Assuming it's an integer
  farePerSeat: z.string(), // Assuming it's a decimal number
});

export const SearchTripSchema = z.object({
  originId: z.string().min(1, { message: "originId should not be empty" }),
  destinationId: z
    .string()
    .min(1, { message: "destinationId should not be empty" }),
  tripDate: z.string().min(1, { message: "tripDate should not be empty" }),
  page: z
    .string()
    .min(1, { message: "page should not be empty" })
    .refine((value) => !isNaN(parseInt(value, 10)), {
      message: "page must be a number conforming to the specified constraints",
    })
    .refine((value) => parseInt(value, 10) >= 1, {
      message: "page must not be less than 1",
    }),
  pageSize: z
    .string()
    .min(1, { message: "page should not be empty" })
    .refine((value) => !isNaN(parseInt(value, 10)), {
      message:
        "pageSize must be a number conforming to the specified constraints",
    })
    .refine((value) => parseInt(value, 10) >= 1, {
      message: "pageSize must be greater than or equal to 1",
    }),

  seatType: SeatType.optional(),
  busType: BusType.optional(),
  sortBy: SortBy.optional(),
  sortOrder: SortOrder.optional()
});
