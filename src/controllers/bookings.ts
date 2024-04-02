import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { LocationSchema } from "../schema/location";
import { NotFoundException } from "../exceptions/not-found";
import { Booking, PassengerDetails } from "@prisma/client";
import { BookingsSchemaGroupedByTrip } from "../schema/bookings";

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
  const { tripId, bookings } = BookingsSchemaGroupedByTrip.parse(req.body);

  const trip = await prismaClient.trip.findFirst({
    where: { id: tripId },
  });
  if (!trip) {
    throw new NotFoundException("Trip not found!", ErrorCode.TRIP_NOT_FOUND);
  }

  const updatedTrip = await prismaClient.trip.update({
    where: { id: tripId },
    data: { totalSeats: trip.totalSeats - bookings.length },
  });

  const existingBooking = await prismaClient.booking.findFirst({
    where: {
      tripId: tripId,
      seatNumber: {
        in: bookings.map((booking) => booking.seatNumber),
      },
    },
  });

  if (existingBooking) {
    console.log(existingBooking);
    if (existingBooking) {
      throw new BadRequestsException(
        "Rebooking is not allowed",
        ErrorCode.BOOKING_ALREADY_EXISTS
      );
    }
  }
  const pnrNumber = generateRandomString();
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
          pnrNumber,
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

  return res.json({
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
      trip: {
        include: {
          origin: {
            select: {
              id: true,
              name: true,
              shortCode: true,
            },
          },
          destination: {
            select: {
              id: true,
              name: true,
              shortCode: true,
            },
          },
        },
      },
    },
  });

  const filteredBookings = bookings.map(
    ({
      createdAt,
      updatedAt,
      userId,
      tripId,
      trip: { createdAt: tripCreatedAt, updatedAt: tripUpdatedAt, ...trip },
      ...rest
    }) => ({
      ...rest,
      trip: { ...trip },
    })
  );

  const bookingsCount = await prismaClient.booking.count();

  return res.json({
    success: true,
    message: "Fetched all bookings",
    data: { bookings: filteredBookings, resultCount: bookingsCount },
  });
};

export const getBookingsOfUser = async (req: Request, res: Response) => {
  const userId = req.user.id;
  console.log("userId", userId);
  const trips = await prismaClient.trip.findMany({
    include: {
      bookings: {
        where: {
          userId,
        },
      },
      origin: {
        select: {
          id: true,
          name: true,
          shortCode: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
          shortCode: true,
        },
      },
    },
  });
  const filteredTrips = trips
    .filter((trip) => trip.bookings.length > 0)
    .map(({ createdAt, updatedAt, bookings, ...rest }) => ({
      ...rest,
      bookings: bookings.map(
        ({ createdAt, updatedAt, userId, tripId, ...bookingRest }) =>
          bookingRest
      ),
    }));

  const bookingsCount = await prismaClient.booking.count({ where: { userId } });

  return res.json({
    success: true,
    message: "Fetched all bookings of the user",
    data: {
      bookings: filteredTrips,
      resultCount: bookingsCount,
    },
  });
};

export const getBookingsByPnr = async (req: Request, res: Response) => {
  const { pnrNumber } = req.params;

  const trip = await prismaClient.trip.findFirst({
    where: {
      bookings: {
        some: {
          pnrNumber: pnrNumber,
        },
      },
    },
    include: {
      bookings: {
        where: {
          pnrNumber,
        },
      },
      origin: {
        select: {
          id: true,
          name: true,
          shortCode: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
          shortCode: true,
        },
      },
    },
  });

  if (!trip) {
    return res.json({
      success: false,
      message: "Couldn't find booking with the given PNR.",
      data: {},
    });
  }

  const filteredTrip = {
    ...trip,

    bookings: trip.bookings.map(
      ({ createdAt, updatedAt, userId, tripId, ...bookingRest }) => bookingRest
    ),
  };

  return res.json({
    success: true,
    message: "Fetched all bookings with the given PNR",
    data: filteredTrip,
  });
};

export const cancelBooking = async (req: Request, res: Response) => {
  const { pnrNumber } = req.params;
  const userId = req.user.id

  const bookingsToDlt = await prismaClient.booking.findMany({
    where: {
      pnrNumber,
      userId
    },
  });

  if (bookingsToDlt.length == 0) {
    return res.json({
      success: false,
      message: "Couldn't find any bookings with the given PNR.",
      data: {},
    });
  }

  bookingsToDlt.map(
    async (bookingToDlt) =>
      await prismaClient.booking.delete({
        where: {
          id: bookingToDlt.id,
        },
      })
  );

  return res.json({
    success: true,
    message: "Canceled all bookings with the given PNR",
    data: pnrNumber,
  });
};
