import { Request, Response } from "express";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";
import { LocationSchema } from "../schema/location";

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

  res.json({
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
  res.json({
    success: true,
    message: "Fetched all cities",
    data: { locations },
  });
};
