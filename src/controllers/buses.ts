import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { BusSchema } from "../schema/location";
import { NotFoundException } from "../exceptions/not-found";

export const generateBusId = async (
  originId: number,
  destinationId: number
) => {
  // Find the first bus with the same origin and destination
  const bus = await prismaClient.bus.findFirst({
    where: {
      originId,
      destinationId,
    },
  });
  // If it's a new route, start IDs from B1
  const latestBus = await prismaClient.bus.findFirst({
    orderBy: {
      id: "desc", // Order by creation date in descending order
    },
  });
  console.log(bus);
  if (!bus) {
    if (!latestBus) {
      return "A1";
    }
    return `${String.fromCharCode(
      latestBus.id.toString().charAt(0).charCodeAt(0) + 1
    )}1`;
  }

  // Find the count of buses with the same origin and destination
  const count = await prismaClient.bus.count({
    where: {
      originId,
      destinationId,
    },
  });

  // Generate the next available ID
  let nextId: string;
  if (count > 0) {
    console.log(count);
    // If buses exist on this route, generate ID based on count
    nextId = `${bus.id.toString().charAt(0)}${count + 1}`;
  } else {
    // If it's a new route, start IDs from B1
    const lastBus = await prismaClient.bus.findFirst({
      where: {
        originId,
        destinationId,
      },
      orderBy: {
        id: "desc", // Order by creation date in descending order
      },
    });
    console.log(lastBus);

    const firstChar = lastBus.id.toString().charAt(0);
    console.log(firstChar);

    const secondChar = parseInt(lastBus.id.toString().charAt(1));
    console.log(secondChar);

    const newFirstChar = String.fromCharCode(firstChar.charCodeAt(0) + 1);
    console.log(newFirstChar);

    const newSecondChar = secondChar + 1;
    console.log(newSecondChar);

    nextId = newFirstChar + newSecondChar;
  }
  console.log(nextId);

  return nextId;
};

export const checkLocationExists = async (locationId: number) => {
  // Find the location with the specified ID
  const location = await prismaClient.location.findFirst({
    where: {
      id: locationId,
    },
  });

  // If location exists, return true, otherwise return false
  return !!location;
};

export const createBus = async (req: Request, res: Response) => {
  const { originId, destinationId } = req.body;
  const originLocationFlag = checkLocationExists(originId);
  const destinationLocationFlag = checkLocationExists(destinationId);

  originLocationFlag.then((exists) => {
    if (!exists)
      throw new NotFoundException(
        "Location not found!",
        ErrorCode.LOCATION_NOT_FOUND
      );
  });

  destinationLocationFlag.then((exists) => {
    if (!exists)
      new NotFoundException(
        "Location not found!",
        ErrorCode.LOCATION_NOT_FOUND
      );
  });

  const busId = await generateBusId(originId, destinationId);

  const bus = await prismaClient.bus.create({
    data: {
      ...req.body,
      id: busId,
    },
  });

  return res.json({
    success: true,
    message: "Added new bus",
    data: {
      bus: {
        originId: bus.originId,
        destinationId: bus.destinationId,
        id: busId,
      },
    },
  });
};

export const listBuses = async (req: Request, res: Response) => {
  const buses = await prismaClient.bus.findMany();
  return res.json({
    success: true,
    message: "Fetched all bus",
    data: { buses },
  });
};
