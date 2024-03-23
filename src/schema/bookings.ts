import { z } from "zod";
import { Gender } from "./utils";

// Define a schema for the Passenger object
export const PassengerSchema = z.object({
  seatNumber: z
    .string()
    .max(2)
    .refine((value) => parseInt(value, 10) <= 46, {
      message: "Max value of a seat number is 46",
    }), // Assuming seat numbers are represented as strings
  passengerName: z.string(),
  passengerAge: z.number(),
  passengerGender: Gender,
});

// Define a schema for the Bookings array
export const BookingsSchema = z.array(PassengerSchema);

// Define a schema for the Trip object
export const BookingsSchemaGroupedByTrip = z.object({
  tripId: z.number(),
  bookings: BookingsSchema,
});
