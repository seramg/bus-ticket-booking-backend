import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { LocationSchema } from "../schema/location";
import { NotFoundException } from "../exceptions/not-found";
import { Booking, PassengerDetails } from "@prisma/client";

export const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const createBooking = async (req: Request, res: Response) => {
  const { tripId, bookings } = req.body;

  const trip = await prismaClient.trip.findFirst({
    where: { id: tripId },
  });
  if (!trip) {
    throw new NotFoundException("Trip not found!", ErrorCode.TRIP_NOT_FOUND);
  }

  // Create bookings for each booking object
  const createdBookings = await Promise.all(
    bookings.map(async (bookingObj: PassengerDetails) => {
      const createdBooking = await prismaClient.booking.create({
        data: {
          tripId: tripId,
          status: "confirmed",
          seatNumber: bookingObj.seatNumber,
          passengerName: bookingObj.passengerName,
          passengerAge: bookingObj.passengerAge,
          passengerGender: bookingObj.passengerGender,
          fare: trip.farePerSeat,
          userId: req.user.id, // Assuming userId is provided in the booking object
          pnrNumber: generateRandomString(), // Assuming pnrNumber is provided in the booking object
        },
        include: {
          trip: true,
          bookedBy: {
            select: { id: true, name: true, email: true, phone: true }, // Include specific fields of the bookedBy user
          },
        },
      });
      const { userId, ...bookingWithoutUserId } = createdBooking;
      return bookingWithoutUserId;
    })
  );

  res.json({
    success: true,
    message: "Booked Successfully",
    data: createdBookings,
  });
};

export const listBookings = async (req: Request, res: Response) => {
  const { page, pageSize } = req.query;
  const pageNumber = page ? parseInt(page.toString(), 10) : 1;
  const size = pageSize ? parseInt(pageSize.toString(), 10) : 5;

  const skip = (pageNumber - 1) * size;

  const bookings = await prismaClient.booking.findMany({
    skip,
    take: size,

    include: {
      trip: true, // Include trip origin location
    },
  });

  const bookingsCount = await prismaClient.booking.count();

  res.json({
    success: true,
    message: "Fetched all bookings",
    data: { bookings, resultCount: bookingsCount },
  });
};
