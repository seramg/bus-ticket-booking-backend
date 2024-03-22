import { Request, Response } from "express";
import { ListUsersSchema } from "../schema/users";
import { prismaClient } from "..";

export const listUsers = async (req: Request, res: Response) => {
  const { page, pageSize } = ListUsersSchema.parse(req.query);
  const pageNumber = page ? parseInt(page.toString(), 10) : 1;
  const size = pageSize ? parseInt(pageSize.toString(), 10) : 5;

  const skip = (pageNumber - 1) * size;

  const users = await prismaClient.user.findMany({
    skip,
    take: size,
  });
  res.json({
    success: true,
    message: "Fetched all Users",
    data: { users, resultCount: users.length },
  });
};
