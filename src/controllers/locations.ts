import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { LocationSchema } from "../schema/location";
import { Location } from "@prisma/client";

export const createLocation = async (req: Request, res: Response) => {
  LocationSchema.parse(req.body);
  const { name, shortCode } = req.body;

  let location = await prismaClient.location.findFirst({
    where: { name, shortCode },
  });
  if (location) {
    throw new BadRequestsException(
      "City with this name or shortcode already exist",
      ErrorCode.LOCATION_ALREADY_EXISTS
    );
  }

  location = await prismaClient.location.create({
    data: {
      ...req.body,
    },
  });

  return res.json({
    success: true,
    message: "Added new city",
    data: {
      location: {
        name: location.name,
        shortCode: location.shortCode,
        id: location.id,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt,
      },
    },
  });
};

export const listLocations = async (req: Request, res: Response) => {
  const locations = await prismaClient.location.findMany();
  return res.json({
    success: true,
    message: "Fetched all cities",
    data: { locations },
  });
};

export const bulkLocations = async (req: Request, res: Response) => {
  const locationsData: Location[] = req.body.locations; // Assuming req.body.users contains an array of user objects

  locationsData.map((location) => LocationSchema.parse(location));

  const existingLocations = await prismaClient.location.findMany({
    where: {
      name: {
        in: locationsData.map((loc) => loc.name),
      },
      shortCode: {
        in: locationsData.map((loc) => loc.shortCode),
      },
    },
    select: {
      name: true,
      shortCode: true,
    },
  });

  const existingLocationsSet = new Set(
    existingLocations.map((location) => location.name)
  );
  const duplicateLocations = locationsData.filter((location) =>
    existingLocationsSet.has(location.name)
  );

  if (duplicateLocations.length > 0) {
    throw new BadRequestsException(
      "Some City with this name or shortcode already exist",
      ErrorCode.USER_ALREADY_EXISTS,
      duplicateLocations.map((location) => location.name)
    );
  }

  const createdLocations = locationsData.map(async (location) => {
    await prismaClient.location.createMany({
      data: {
        name: location.name,
        shortCode: location.shortCode,
        id: location.id,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt,
      },
      skipDuplicates: true,
    });
  });

  return res.json({
    success: true,
    message: "Bulk locations creation successful! Please verify your emails.",
    data: createdLocations,
  });
};
