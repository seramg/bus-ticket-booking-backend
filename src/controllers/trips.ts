import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { SearchTripSchema, TripSchema } from "../schema/trip";

export const getLocation = async (locationId: number) => {
  // Find the location with the specified ID
  const location = await prismaClient.location.findFirst({
    where: {
      id: locationId,
    },
  });

  // If location exists, return true, otherwise return false
  return location;
};

export const createTrip = async (req: Request, res: Response) => {
  TripSchema.parse(req.body);
  const { originId, destinationId, busId } = req.body;
  let trip = await prismaClient.trip.findFirst({
    where: { originId, destinationId, busId },
  });
  if (trip) {
    throw new BadRequestsException(
      "Trip with similar properties exist",
      ErrorCode.TRIP_ALREADY_EXISTS
    );
  }

  const originLocation = await getLocation(originId);
  const destinationLocation = await getLocation(destinationId);

  if (!originLocation)
    throw new NotFoundException(
      "Trip origin is wrong!",
      ErrorCode.LOCATION_NOT_FOUND
    );

  if (!destinationLocation)
    throw new NotFoundException(
      "Trip destination is wrong!",
      ErrorCode.LOCATION_NOT_FOUND
    );

  trip = await prismaClient.trip.create({
    data: {
      ...req.body,
    },
  });

  res.json({
    success: true,
    message: "Added new trip",
    data: {
      trip: {
        origin: originLocation,
        destination: destinationLocation,
        tripDate: trip.tripDate,
        departure: trip.departure,
        arrival: trip.arrival,
        durationInHours: trip.durationInHours,
        busId: trip.busId,
        busType: trip.busType,
        seatType: trip.seatType,
        totalSeats: trip.totalSeats,
        farePerSeat: trip.farePerSeat,
        originId: trip.originId,
        destinationId: trip.destinationId,
        createdAt: trip.createdAt,
        updatedAt: trip.updatedAt,
      },
    },
  });
};

export const listTrips = async (req: Request, res: Response) => {
  const trips = await prismaClient.trip.findMany({
    include: {
      origin: true, // Include trip origin location
      destination: true, // Include trip destination location
    },
  });

  res.json({
    success: true,
    message: "Fetched all trips",
    data: { trips },
  });
};

export const searchTrips = async (req: Request, res: Response) => {
  const {
    originId,
    destinationId,
    tripDate,
    page,
    pageSize,
    seatType,
    busType,
    sortBy,
    sortOrder,
  } = SearchTripSchema.parse(req.query);

  // Convert page and pageSize to numbers (assuming they are strings in query parameters)
  const pageNumber = parseInt(page.toString(), 10) || 1;
  const limit = parseInt(pageSize.toString(), 10) || 10;

  const dateObj = new Date(tripDate as string);
  const formattedDate = dateObj.toISOString().split("T")[0]; // Extracts YYYY-MM-DD part

  // Define where clause based on provided query parameters
  const whereClause: any = {
    originId: parseInt(originId.toString()),
    destinationId: parseInt(destinationId.toString()),
    tripDate: formattedDate,
  };

  // Add seatType and busType to where clause if they are provided in the query
  if (seatType) {
    whereClause.seatType = seatType;
  }
  if (busType) {
    whereClause.busType = busType;
  }

  const count = await prismaClient.trip.count({
    where: whereClause,
  });
  // Perform search based on provided query parameters
  const trips = await prismaClient.trip.findMany({
    where: whereClause,
    include: {
      origin: true, // Include trip origin location
      destination: true, // Include trip destination location
    },
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder === "ASC" ? "asc" : "desc" }
        : { totalSeats: "asc" },
    skip: (pageNumber - 1) * limit,
    take: limit,
  });

  res.json({
    success: true,
    message: "Fetched all trips",
    data: { trips, resultCount: count },
  });
};

export const getTripById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Perform search based on provided query parameters
  const trip = await prismaClient.trip.findFirst({
    where: { id: parseInt(id, 10) },
    include: { bookings: true, origin: true, destination: true },
  });

  if (!trip) {
    res.json({
      success: false,
      message: "Fetched trip details",
      data: { trip: null },
    });
  }

  res.json({
    success: true,
    message: "Fetched trip details",
    data: { trip },
  });
};
