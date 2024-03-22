import { z } from "zod";

export const LocationSchema = z.object({
  name: z.string(),
  shortCode: z.string(),
});

export const BusSchema = z.object({
  originId: z.number(),
  destinationId: z.number(),
});
