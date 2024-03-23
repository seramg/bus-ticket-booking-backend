import { z } from "zod";

export const BusType = z.enum(["AC", "NON_AC"]);
export const SeatType = z.enum(["SLEEPER", "SEATER"]);

export const SortBy = z.enum(["departure", "farePerSeat","totalSeats"]);
export const SortOrder = z.enum(["ASC", "DESC"]);

export const Gender = z.enum(["male", "female"]);
